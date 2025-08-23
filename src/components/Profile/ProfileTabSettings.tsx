import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "../Auth/LogoutButton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ProfileTabSettingsProps {
  user: { email?: string | null };
}

export const ProfileTabSettings: React.FC<ProfileTabSettingsProps> = ({ user }) => {
  const { signOut } = useAuth();
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChangeEmail = async () => {
    const newEmail = prompt("Enter your new email:");
    if (!newEmail) return;

    setEmailLoading(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });

    if (error) {
      toast.error("Failed to update email");
    } else {
      toast.success("Email update initiated. Please verify via your inbox.");
    }
    setEmailLoading(false);
  };

  const handleChangePassword = async () => {
    const newPassword = prompt("Enter your new password (min 6 characters):");
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast.error("Failed to update password");
    } else {
      toast.success("Password updated successfully");
    }
    setPasswordLoading(false);
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account?");
    if (!confirmDelete || !user?.email) return;

    setDeleteLoading(true);
    const { error } = await supabase.functions.invoke("delete-user", {
      body: { email: user.email },
    });

    if (error) {
      toast.error("Failed to delete account.");
    } else {
      toast.success("Account deleted successfully");
      await signOut();
    }
    setDeleteLoading(false);
  };

  return (
    <Card className="bg-white/90 shadow-2xl border-0 rounded-3xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-800">Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <h4 className="font-semibold text-slate-800">Email</h4>
              <p className="text-slate-600">{user?.email}</p>
            </div>
            <Button
              variant="outline"
              className="border-2 border-slate-200 rounded-xl"
              onClick={handleChangeEmail}
              disabled={emailLoading}
            >
              {emailLoading ? "Updating..." : "Change Email"}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <h4 className="font-semibold text-slate-800">Password</h4>
              <p className="text-slate-600">••••••••</p>
            </div>
            <Button
              variant="outline"
              className="border-2 border-slate-200 rounded-xl"
              onClick={handleChangePassword}
              disabled={passwordLoading}
            >
              {passwordLoading ? "Updating..." : "Change Password"}
            </Button>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <div className="flex justify-center gap-4 mt-6 px-4">
              <LogoutButton />
              <Button
                variant="destructive"
                className="w-1/2 max-w-[200px] rounded-lg px-4 py-2 font-medium"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete Account"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
