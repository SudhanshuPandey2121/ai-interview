"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormField from "./FormField";

const interviewFormSchema = z.object({
  role: z.string().min(1, "Role is required"),
  level: z.string().min(1, "Level is required"),
  type: z.string().min(1, "Type is required"),
  techstack: z.string().min(1, "Tech stack is required"),
  amount: z.number().min(1).max(20),
});

type InterviewFormData = z.infer<typeof interviewFormSchema>;

const InterviewForm = ({ userId }: { userId: string }) => {
  const router = useRouter();

  const form = useForm<InterviewFormData>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      role: "",
      level: "Junior",
      type: "Mixed",
      techstack: "",
      amount: 10,
    },
  });

  const onSubmit = async (data: InterviewFormData) => {
    try {
      const response = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          userid: userId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Interview created successfully!");
        router.push(`/interview/${result.interviewId}`);
      } else {
        toast.error("Failed to create interview");
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      toast.error("An error occurred while creating the interview");
    }
  };

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <h3>Create New Interview</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            <FormField
              control={form.control}
              name="role"
              label="Job Role"
              placeholder="e.g., Frontend Developer"
              type="text"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Experience Level</label>
                <select
                  {...form.register("level")}
                  className="input"
                >
                  <option value="Junior">Junior</option>
                  <option value="Mid-level">Mid-level</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>

              <div>
                <label className="label">Interview Type</label>
                <select
                  {...form.register("type")}
                  className="input"
                >
                  <option value="Mixed">Mixed</option>
                  <option value="Technical">Technical</option>
                  <option value="Behavioral">Behavioral</option>
                </select>
              </div>
            </div>

            <FormField
              control={form.control}
              name="techstack"
              label="Tech Stack"
              placeholder="e.g., React, TypeScript, Node.js"
              type="text"
            />

            <div>
              <label className="label">Number of Questions</label>
              <input
                type="number"
                min="1"
                max="20"
                {...form.register("amount", { valueAsNumber: true })}
                className="input"
              />
            </div>

            <Button className="btn" type="submit">
              Create Interview
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default InterviewForm; 