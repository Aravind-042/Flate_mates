import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageCarousel } from "@/components/ui/ImageCarousel";
import { MapPin, Bed, Bath, Car, Users, Phone, Mail } from "lucide-react";
import type { FlatListing } from "@/types/flat";

interface FlatPreviewProps {
  data: FlatListing;
}

export const FlatPreview = ({ data }: FlatPreviewProps) => {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="relative">
          <ImageCarousel
            images={data.images.length > 0 ? data.images : null}
            title={data.title || "Property Preview"}
            height="h-64"
            showIndicator={true}
            showArrows={true}
          />
        </div>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {data.title || "Your Flat Title"}
              </h1>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {data.location.area && data.location.city 
                    ? `${data.location.area}, ${data.location.city}`
                    : "Location not specified"
                  }
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{data.property.bedrooms} Bed</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{data.property.bathrooms} Bath</span>
              </div>
              {data.property.parking && (
                <div className="flex items-center">
                  <Car className="h-4 w-4 mr-1" />
                  <span>Parking</span>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-blue-700">
                    {data.rent.amount ? formatPrice(data.rent.amount) : "₹0"}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
                {data.rent.deposit > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Security Deposit</p>
                    <p className="font-semibold">{formatPrice(data.rent.deposit)}</p>
                  </div>
                )}
              </div>
              {data.rent.includes.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Includes:</p>
                  <div className="flex flex-wrap gap-1">
                    {data.rent.includes.map((item) => (
                      <Badge key={item} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {data.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {data.description}
                </p>
              </div>
            )}

            {data.amenities.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {data.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {(data.preferences.gender || data.preferences.profession.length > 0) && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Flatmate Preferences
                </h3>
                <div className="space-y-2 text-sm">
                  {data.preferences.gender && (
                    <p><span className="font-medium">Gender:</span> {data.preferences.gender}</p>
                  )}
                  {data.preferences.profession.length > 0 && (
                    <div>
                      <span className="font-medium">Profession:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {data.preferences.profession.map((prof) => (
                          <Badge key={prof} variant="secondary" className="text-xs">
                            {prof}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {data.preferences.additionalRequirements && (
                    <p className="text-gray-600">
                      {data.preferences.additionalRequirements}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Contact Preferences</h3>
              <div className="flex space-x-4 text-sm">
                {data.contactPreferences.whatsapp && (
                  <div className="flex items-center text-green-600">
                    <Phone className="h-4 w-4 mr-1" />
                    <span>WhatsApp</span>
                  </div>
                )}
                {data.contactPreferences.call && (
                  <div className="flex items-center text-blue-600">
                    <Phone className="h-4 w-4 mr-1" />
                    <span>Phone</span>
                  </div>
                )}
                {data.contactPreferences.email && (
                  <div className="flex items-center text-purple-600">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>Email</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
