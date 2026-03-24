"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL || "";

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

const getCategoryColor = (category) => {
  const colors = {
    ECOMMERCE: "bg-purple-100 text-purple-800 border-purple-200",
    RESTAURANT: "bg-orange-100 text-orange-800 border-orange-200",
    SALON: "bg-pink-100 text-pink-800 border-pink-200",
    HOTEL: "bg-blue-100 text-blue-800 border-blue-200",
    FITNESS: "bg-green-100 text-green-800 border-green-200",
    OTHER: "bg-gray-100 text-gray-800 border-gray-200",
  };
  return colors[category] || colors.OTHER;
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

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

const formatCategoryLabel = (category) => {
  if (!category) return "-";
  return category.charAt(0) + category.slice(1).toLowerCase();
};

export function BrandTableRow({ brand, onEdit }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={getImageUrl(brand.logo)} alt={brand.name} />
            <AvatarFallback>{getInitials(brand.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{brand.name || "-"}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>{brand.email || "-"}</TableCell>
      <TableCell>{brand.phone || "-"}</TableCell>
      <TableCell>
        {brand.website ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate block max-w-[150px]"
                >
                  {brand.website}
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>{brand.website}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell>
        {brand.category ? (
          <Badge
            variant="outline"
            className={cn("border", getCategoryColor(brand.category))}
          >
            {formatCategoryLabel(brand.category)}
          </Badge>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell>
        {brand.profileStatus ? (
          <Badge
            variant="outline"
            className={cn(
              "border",
              getProfileStatusColor(brand.profileStatus)
            )}
          >
            {brand.profileStatus.replace(/_/g, " ")}
          </Badge>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell>
        {brand.approvalStatus ? (
          <Badge
            variant="outline"
            className={cn(
              "border",
              getApprovalStatusColor(brand.approvalStatus)
            )}
          >
            {brand.approvalStatus}
          </Badge>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell>{formatDate(brand.createdAt)}</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm" onClick={() => onEdit(brand)}>
          <Pencil className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
