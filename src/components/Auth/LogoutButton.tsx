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
      className="w-1/2 max-w-[200px] flex items-center justify-center space-x-2 border border-red-500 text-red-600 hover:bg-red-600 hover:text-white rounded-lg px-4 py-2 font-medium transition-all"
      variant="outline"
    >
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </Button>
  );
};
