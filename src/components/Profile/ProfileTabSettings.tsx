
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileTabSettingsProps {
  user: { email?: string | null };
}

export const ProfileTabSettings: React.FC<ProfileTabSettingsProps> = ({ user }) => {
  return (
    <Card className="bg-white/90 shadow-2xl border-0 rounded-3xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-800">
          Account Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <h4 className="font-semibold text-slate-800">Email</h4>
              <p className="text-slate-600">{user?.email}</p>
            </div>
            <Button variant="outline" className="border-2 border-slate-200 rounded-xl">
              Change Email
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <h4 className="font-semibold text-slate-800">Password</h4>
              <p className="text-slate-600">••••••••</p>
            </div>
            <Button variant="outline" className="border-2 border-slate-200 rounded-xl">
              Change Password
            </Button>
          </div>
          <div className="pt-6 border-t border-slate-200">
            <Button variant="destructive" className="w-full rounded-xl">
              Delete Account
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

