import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  currentUserId?: string;
}

const Leaderboard = ({ leaderboard, currentUserId }: LeaderboardProps) => {
  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Leaderboard</h3>
        <p className="text-gray-500">No participants yet for this interview.</p>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBgColor = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return "bg-blue-50 border-blue-200";
    }
    switch (rank) {
      case 1:
        return "bg-yellow-50 border-yellow-200";
      case 2:
        return "bg-gray-50 border-gray-200";
      case 3:
        return "bg-amber-50 border-amber-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        Leaderboard ({leaderboard.length} participants)
      </h3>
      
      <div className="space-y-2">
        {leaderboard.slice(0, 10).map((entry, index) => {
          const rank = index + 1;
          const isCurrentUser = entry.userId === currentUserId;
          
          return (
            <div
              key={entry.userId}
              className={`flex items-center justify-between p-3 rounded-lg border ${getRankBgColor(rank, isCurrentUser)}`}
            >
              <div className="flex items-center gap-3">
                {getRankIcon(rank)}
                <div>
                  <p className={`font-medium ${isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
                    {entry.userName} {isCurrentUser && "(You)"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`text-lg font-bold ${isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
                  {entry.totalScore}
                </p>
                <p className="text-sm text-gray-500">points</p>
              </div>
            </div>
          );
        })}
        
        {leaderboard.length > 10 && (
          <div className="text-center py-2">
            <p className="text-sm text-gray-500">
              ... and {leaderboard.length - 10} more participants
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;