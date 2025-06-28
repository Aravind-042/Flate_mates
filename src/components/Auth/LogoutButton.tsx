import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

export const LogoutButton = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Button
      onClick={handleLogout}
      className="btn-outline border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 w-1/2 max-w-[200px]"
      variant="outline"
    >
      <LogOut className="h-4 w-4 mr-2" />
      <span>Logout</span>
    </Button>
  );
};