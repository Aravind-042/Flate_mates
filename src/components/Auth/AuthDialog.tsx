
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AuthPage } from "@/components/AuthPage";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  signupRoleIntent?: "flat_owner" | "flat_seeker";
}

/**
 * AuthDialog: Improved to eliminate window scrollbars.
 * - The outer DialogContent is now fixed and overflow-hidden.
 * - Only the inner content (the white card) can scroll if needed.
 * - Maximum width/height enforced, always centered, never stretches too large.
 * - min-w removed for better responsiveness on small screens.
 */
export function AuthDialog({ open, onOpenChange, signupRoleIntent }: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-w-full sm:max-w-xl md:max-w-2xl w-[90vw] 
          max-h-[98vh] flex items-center justify-center bg-transparent border-none shadow-none p-0
          fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        "
        style={{ minWidth: 0, overflow: "hidden" }}
      >
        <div
          className="
            rounded-2xl bg-white/95 shadow-2xl 
            overflow-y-auto
            flex flex-col
            max-h-[90vh]
            w-full
            min-w-0
          "
          style={{ /* no min-width for full mobile support */ }}
        >
          <AuthPage signupRoleIntent={signupRoleIntent} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
