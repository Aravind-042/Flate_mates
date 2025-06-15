
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProfileTabListings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white/90 shadow-2xl border-0 rounded-3xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-slate-800">
            My Listings
          </CardTitle>
          <Button
            onClick={() => navigate('/create-listing')}
            className="bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Listing
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Home className="h-16 w-16 mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            No listings yet
          </h3>
          <p className="text-slate-600 mb-4">
            Create your first listing to start finding flatmates.
          </p>
          <Button
            onClick={() => navigate('/create-listing')}
            className="bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Listing
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

