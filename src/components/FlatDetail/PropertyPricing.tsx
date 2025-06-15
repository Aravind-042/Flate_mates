
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageCircle, Shield } from "lucide-react";

interface PropertyPricingProps {
  monthlyRent: number;
  securityDeposit: number | null;
}

export const PropertyPricing = ({ monthlyRent, securityDeposit }: PropertyPricingProps) => {
  return (
    <Card className="bg-white/90 backdrop-blur-md border-0 rounded-2xl shadow-xl">
      <CardContent className="p-4 sm:p-6">
        {/* Price Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-4">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
              ₹{monthlyRent.toLocaleString()}
            </div>
            <div className="text-sm sm:text-base text-slate-600 mb-3">/month</div>
            {securityDeposit && (
              <div className="text-xs sm:text-sm text-slate-600 bg-white/70 rounded-lg p-2">
                <Shield className="h-3 w-3 inline mr-1" />
                Security Deposit: ₹{securityDeposit.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Contact Actions - Mobile Stack */}
        <div className="space-y-3">
          <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl py-3 text-sm font-semibold shadow-lg">
            <Phone className="h-4 w-4 mr-2" />
            Call Owner
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="rounded-xl py-2 border-2 border-green-200 hover:bg-green-50 text-xs">
              <MessageCircle className="h-3 w-3 mr-1" />
              WhatsApp
            </Button>
            <Button variant="outline" className="rounded-xl py-2 border-2 border-blue-200 hover:bg-blue-50 text-xs">
              <Mail className="h-3 w-3 mr-1" />
              Email
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
