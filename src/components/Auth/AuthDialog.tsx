
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AuthPage } from "@/components/AuthPage";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  signupRoleIntent?: "flat_owner" | "flat_seeker";
}

export function AuthDialog({ open, onOpenChange, signupRoleIntent }: AuthDialogProps) {
  // DialogContent with custom max-w, max-h and responsive centered card.
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full max-w-lg max-h-[95vh] bg-transparent border-none shadow-none flex items-center justify-center p-0"
        style={{ minWidth: 0 }}
      >
        <div className="rounded-2xl bg-white/95 shadow-2xl overflow-auto max-h-[90vh] max-w-lg w-full min-w-[320px]">
          {/* AuthPage handles both signin and signup flows */}
          <AuthPage signupRoleIntent={signupRoleIntent} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
