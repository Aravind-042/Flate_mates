
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AuthPage } from "@/components/AuthPage";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  // Handles switching between sign in and sign up inside the modal using AuthPage’s internal state
  // Closes the dialog when user cancels or clicks outside (handled by Dialog)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 bg-transparent border-none shadow-none">
        <div className="rounded-2xl bg-white/95 shadow-xl overflow-hidden">
          {/* AuthPage handles both signin and signup flows */}
          <AuthPage />
        </div>
      </DialogContent>
    </Dialog>
  );
}
