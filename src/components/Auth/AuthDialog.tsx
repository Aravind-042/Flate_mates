
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AuthPage } from "@/components/AuthPage";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  signupRoleIntent?: "flat_owner" | "flat_seeker";
}

/**
 * AuthDialog: updated to guarantee no window scrollbar,
 * fixed, elegant modal/card (AuthPage), 
 * scroll only inside the card if content overflows.
 */
export function AuthDialog({ open, onOpenChange, signupRoleIntent }: AuthDialogProps) {
  const handleAuthSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`
          p-0 bg-transparent border-none shadow-none 
          flex items-center justify-center 
          fixed top-0 left-0 right-0 bottom-0 
          m-0 z-[9999]
        `}
        style={{
          overflow: "hidden" // No scroll on dialog container
        }}
      >
        <div
          className="
            w-full max-w-[420px] min-w-[300px] 
            max-h-[90vh] rounded-2xl bg-white/95 shadow-2xl
            flex flex-col
            items-center
            overflow-hidden
          "
        >
          <div
            className="
              w-full flex-1 p-8 flex flex-col
              overflow-y-auto
              scrollbar-none
              "
            style={{
              maxHeight: '90vh',
              minHeight: "360px",
              // Avoid extra scrollbars, and always plenty of padding around
            }}
          >
            <AuthPage 
              signupRoleIntent={signupRoleIntent} 
              onAuthSuccess={handleAuthSuccess}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
