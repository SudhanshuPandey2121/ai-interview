"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { deleteInterview } from "@/lib/actions/general.action";

interface DeleteInterviewButtonProps {
  interviewId: string;
  userId: string;
}

const DeleteInterviewButton = ({ interviewId, userId }: DeleteInterviewButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteInterview(interviewId, userId);
      
      if (result.success) {
        // Refresh the page to update the list
        router.refresh();
      } else {
        alert(result.message || "Failed to delete interview");
      }
    } catch (error) {
      console.error("Error deleting interview:", error);
      alert("An error occurred while deleting the interview");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-xs px-2 py-1 h-6"
        >
          {isDeleting ? "..." : "Yes"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          className="text-xs px-2 py-1 h-6"
        >
          No
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={() => setShowConfirm(true)}
      className="p-1 h-6 w-6"
      title="Delete interview"
    >
      <Trash2 className="h-3 w-3" />
    </Button>
  );
};

export default DeleteInterviewButton;