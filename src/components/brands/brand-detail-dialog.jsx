"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL || "";

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${CLOUDFRONT_URL}/${path}`;
};

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getProfileStatusColor = (status) => {
  switch (status) {
    case "SIGNUP_COMPLETED":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "ONBOARDING_COMPLETED":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "PROFILE_COMPLETED":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getApprovalStatusColor = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "APPROVED":
      return "bg-green-100 text-green-800 border-green-200";
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getCategoryLabel = (category) => {
  const labels = {
    ECOMMERCE: "E-commerce",
    RESTAURANT: "Restaurant",
    SALON: "Salon",
    HOTEL: "Hotel",
    FITNESS: "Fitness",
    OTHER: "Other",
  };
  return labels[category] || category;
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const InfoRow = ({ label, value, className }) => (
  <div className="grid gap-2">
    <Label className="text-muted-foreground">{label}</Label>
    <div className={cn("text-sm", className)}>{value || "-"}</div>
  </div>
);

export function BrandDetailDialog({ brand, open, onOpenChange }) {
  if (!brand) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Brand Details</DialogTitle>
          <DialogDescription>
            View complete brand information
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Brand Header */}
          <div className="flex items-center gap-4 pb-4 border-b">
            <Avatar className="h-16 w-16">
              <AvatarImage src={getImageUrl(brand.logo)} alt={brand.name} />
              <AvatarFallback className="text-lg">
                {getInitials(brand.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{brand.name || "Unnamed Brand"}</h2>
              {brand.category && (
                <p className="text-sm text-muted-foreground mt-1">
                  {getCategoryLabel(brand.category)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {brand.profileStatus && (
                <Badge
                  variant="outline"
                  className={cn("border justify-center", getProfileStatusColor(brand.profileStatus))}
                >
                  {brand.profileStatus.replace(/_/g, " ")}
                </Badge>
              )}
              {brand.approvalStatus && (
                <Badge
                  variant="outline"
                  className={cn("border justify-center", getApprovalStatusColor(brand.approvalStatus))}
                >
                  {brand.approvalStatus}
                </Badge>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase">
              Basic Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow label="Email" value={brand.email} />
              <InfoRow label="Phone" value={brand.phone} />
              <InfoRow label="Website" value={
                brand.website ? (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {brand.website}
                  </a>
                ) : "-"
              } />
              <InfoRow
                label="Profile Completion"
                value={`${brand.profileCompletionPercentage || 0}%`}
              />
            </div>
            {brand.description && (
              <InfoRow label="Description" value={brand.description} />
            )}
          </div>

          {/* Tags */}
          {brand.tags && brand.tags.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {brand.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Social Handles */}
          {brand.socialHandles && brand.socialHandles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                Social Handles
              </h3>
              <div className="grid gap-2">
                {brand.socialHandles.map((handle, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline" className="w-24">
                      {handle.platform}
                    </Badge>
                    <a
                      href={handle.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline truncate"
                    >
                      {handle.link}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Address */}
          {brand.defaultAddress && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                Default Address
              </h3>
              <div className="text-sm">
                {brand.defaultAddress.addressLine1 && (
                  <div>{brand.defaultAddress.addressLine1}</div>
                )}
                {brand.defaultAddress.addressLine2 && (
                  <div>{brand.defaultAddress.addressLine2}</div>
                )}
                <div>
                  {[
                    brand.defaultAddress.city,
                    brand.defaultAddress.state,
                    brand.defaultAddress.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </div>
                {brand.defaultAddress.country && (
                  <div>{brand.defaultAddress.country}</div>
                )}
              </div>
            </div>
          )}

          {/* Shopify Integration */}
          {brand.shopifyDomain && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                Shopify Integration
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow label="Shopify Domain" value={brand.shopifyDomain} />
                <InfoRow label="Shopify Scope" value={brand.shopifyScope} />
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase">
              Additional Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {brand.rating !== undefined && brand.rating !== null && (
                <InfoRow
                  label="Rating"
                  value={`${brand.rating} (${brand.totalRatingCount || 0} reviews)`}
                />
              )}
              {brand.commisionPerOrder !== undefined && brand.commisionPerOrder !== null && (
                <InfoRow
                  label="Commission per Order"
                  value={`${brand.commisionPerOrder}%`}
                />
              )}
              <InfoRow label="Creator Active Listing" value={
                brand.creatorActiveListing ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100 text-gray-800">Inactive</Badge>
                )
              } />
              <InfoRow label="Marketplace Active Listing" value={
                brand.marketplaceActiveListing ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100 text-gray-800">Inactive</Badge>
                )
              } />
            </div>
          </div>

          {/* Commission Distribution */}
          {brand.commisionDistribution && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                Commission Distribution
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow
                  label="Customer Discount"
                  value={`${brand.commisionDistribution.customerDiscount || 0}%`}
                />
                <InfoRow
                  label="Creator Commission"
                  value={`${brand.commisionDistribution.creatorCommission || 0}%`}
                />
                <InfoRow
                  label="Briggo Commission"
                  value={`${brand.commisionDistribution.briggoCommission || 0}%`}
                />
                <InfoRow
                  label="Payment Gateway Commission"
                  value={`${brand.commisionDistribution.pgCommission || 0}%`}
                />
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="space-y-4 pt-4 border-t">
            <div className="grid gap-4 sm:grid-cols-2 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Created:</span>{" "}
                {formatDate(brand.createdAt)}
              </div>
              <div>
                <span className="font-medium">Updated:</span>{" "}
                {formatDate(brand.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
