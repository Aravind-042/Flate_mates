
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AuthPage } from "@/components/AuthPage";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  signupRoleIntent?: "flat_owner" | "flat_seeker";
}

export function AuthDialog({ open, onOpenChange, signupRoleIntent }: AuthDialogProps) {
  const handleAuthSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 bg-transparent border-none shadow-none flex items-center justify-center fixed inset-0 m-0 z-[9999] max-w-none w-full h-full"
        style={{
          overflow: "hidden"
        }}
      >
        <div className="w-full max-w-[95vw] sm:max-w-md max-h-[95vh] flex flex-col items-center overflow-hidden mx-4">
          <div className="w-full flex-1 flex flex-col overflow-y-auto scrollbar-none"
            style={{
              maxHeight: '95vh',
              minHeight: "400px",
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
