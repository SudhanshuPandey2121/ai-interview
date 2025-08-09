"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Use precise scoring (not just multiples of 5) - for example, scores like 67, 73, 84 are encouraged when appropriate. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        
        Calculate the total score as the average of all category scores, rounded to the nearest whole number.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .where("finalized", "==", true)
    .limit(limit * 2) // Get more documents to account for filtering
    .get();

  // Filter and sort on the client side
  const filteredInterviews = interviews.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Interview))
    .filter((interview) => interview.userId !== userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  return filteredInterviews;
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .get();

  // Sort on the client side
  const sortedInterviews = interviews.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Interview))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return sortedInterviews;
}

export async function deleteInterview(interviewId: string, userId: string) {
  try {
    // Get interview document to verify ownership
    const interviewDoc = await db.collection("interviews").doc(interviewId).get();
    
    if (!interviewDoc.exists) {
      return { success: false, message: "Interview not found" };
    }
    
    const interviewData = interviewDoc.data();
    if (interviewData?.userId !== userId) {
      return { success: false, message: "Unauthorized to delete this interview" };
    }
    
    // Delete the interview
    await db.collection("interviews").doc(interviewId).delete();
    
    // Also delete associated feedback if it exists
    const feedbackQuery = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .where("userId", "==", userId)
      .get();
    
    const deletePromises = feedbackQuery.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    
    return { success: true, message: "Interview deleted successfully" };
  } catch (error) {
    console.error("Error deleting interview:", error);
    return { success: false, message: "Failed to delete interview" };
  }
}

export async function getLeaderboardByInterview(interviewId: string): Promise<LeaderboardEntry[] | null> {
  try {
    // Get all feedback for this specific interview
    const feedbackQuery = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .get();

    if (feedbackQuery.empty) return [];

    // Get user details for each feedback
    const leaderboardPromises = feedbackQuery.docs.map(async (feedbackDoc) => {
      const feedbackData = feedbackDoc.data();
      const userDoc = await db.collection("users").doc(feedbackData.userId).get();
      const userData = userDoc.data();

      return {
        userId: feedbackData.userId,
        userName: userData?.name || "Anonymous",
        totalScore: feedbackData.totalScore,
        createdAt: feedbackData.createdAt,
      } as LeaderboardEntry;
    });

    const leaderboard = await Promise.all(leaderboardPromises);
    
    // Sort by score (descending), then by date (ascending for tie-breaking)
    return leaderboard.sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    return null;
  }
}

export async function getUserRankingForInterview(interviewId: string, userId: string): Promise<UserRanking | null> {
  try {
    const leaderboard = await getLeaderboardByInterview(interviewId);
    
    if (!leaderboard || leaderboard.length === 0) {
      return null;
    }

    const userIndex = leaderboard.findIndex(entry => entry.userId === userId);
    
    if (userIndex === -1) {
      return null;
    }

    const userEntry = leaderboard[userIndex];
    const totalParticipants = leaderboard.length;
    const rank = userIndex + 1;
    const outperformed = totalParticipants - rank;

    return {
      rank,
      totalParticipants,
      outperformed,
      score: userEntry.totalScore,
      percentile: Math.round(((totalParticipants - rank) / totalParticipants) * 100),
    };
  } catch (error) {
    console.error("Error getting user ranking:", error);
    return null;
  }
}
