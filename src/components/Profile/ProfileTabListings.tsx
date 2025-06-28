import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const ProfileTabListings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from("flat_listings")
        .select("*")
        .eq("owner_id", user?.id);

      if (error) {
        console.error("Error fetching listings:", error);
      } else {
        setListings(data || []);
      }
      setLoading(false);
    };

    if (user?.id) {
      fetchListings();
    }
  }, [user?.id]);

  const markAsRented = async (listingId: string) => {
    const { error } = await supabase
      .from("flat_listings")
      .update({ status: "rented" })
      .eq("id", listingId);

    if (!error) {
      toast.success("Listing marked as rented!");
      setListings(prev =>
        prev.map(l => (l.id === listingId ? { ...l, status: "rented" } : l))
      );
    } else {
      toast.error("Failed to update listing.");
    }
  };

  const deleteListing = async (listingId: string) => {
    const confirmed = confirm("Are you sure you want to delete this listing?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("flat_listings")
      .delete()
      .eq("id", listingId);

    if (!error) {
      toast.success("Listing deleted.");
      setListings(prev => prev.filter(l => l.id !== listingId));
    } else {
      toast.error("Failed to delete listing.");
    }
  };

  return (
    <Card className="bg-white/90 shadow-2xl border-0 rounded-3xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-slate-800">
            My Listings
          </CardTitle>
          <Button
            onClick={() => navigate("/create-listing")}
            className="bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Listing
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-slate-500 py-12">Loading listings...</p>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <Home className="h-16 w-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No listings yet
            </h3>
            <p className="text-slate-600 mb-4">
              Create your first listing to start finding flatmates.
            </p>
            <Button
              onClick={() => navigate("/create-listing")}
              className="bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Listing
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map(listing => (
              <div
                key={listing.id}
                className="p-4 bg-slate-50 rounded-xl shadow flex justify-between items-start"
              >
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {listing.title}
                  </h3>
                  <p className="text-slate-600">{listing.address_line1}</p>
                  <p className="text-sm text-slate-500">
                    Status:{" "}
                    <span
                      className={
                        listing.status === "rented"
                          ? "text-red-500 font-semibold"
                          : "text-green-600"
                      }
                    >
                      {listing.status}
                    </span>
                  </p>
                </div>
                <div className="space-x-2 flex-shrink-0">
                  {listing.status !== "rented" && (
                    <Button
                      size="sm"
                      className="bg-green-100 text-green-800 hover:bg-green-200"
                      onClick={() => markAsRented(listing.id)}
                    >
                      Mark as Rented
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteListing(listing.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
