"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { useFilterStore } from "@/stores";
import { useBrands } from "@/hooks/use-brands";
import { useAllBrandTags } from "@/hooks/use-all-brand-tags";
import { BrandEditDialog } from "@/components/brands/brand-edit-dialog";
import { BrandDetailDialog } from "@/components/brands/brand-detail-dialog";
import { TagInput } from "@/components/ui/tag-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Building2,
  Pencil,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL || "";

const PROFILE_STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "SIGNUP_COMPLETED", label: "Signup" },
  { value: "ONBOARDING_COMPLETED", label: "Onboarding" },
  { value: "PROFILE_COMPLETED", label: "Complete" },
];

const APPROVAL_STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

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

export default function BrandsPage() {
  const { brandFilters, setBrandFilters, resetBrandFilters } = useFilterStore();
  const [page, setPage] = useState(1);
  const [editingBrand, setEditingBrand] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewingBrand, setViewingBrand] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { data: allTags = [] } = useAllBrandTags();

  const filter = useMemo(() => {
    const f = {};
    if (brandFilters.searchQuery) f.name = brandFilters.searchQuery;
    if (brandFilters.profileStatus)
      f.profileStatus = brandFilters.profileStatus;
    if (brandFilters.approvalStatus)
      f.approvalStatus = brandFilters.approvalStatus;
    if (brandFilters.tags && brandFilters.tags.length > 0)
      f.tags = brandFilters.tags;
    return f;
  }, [brandFilters]);

  const { data, isLoading, isError } = useBrands({
    filter,
    pagination: { page, limit: 25 },
    sort: { sortBy: "createdAt", sortOrder: "DESC" },
  });

  const handleProfileStatusChange = (value) => {
    setBrandFilters({ profileStatus: value === "all" ? null : value });
    setPage(1);
  };

  const handleApprovalStatusChange = (value) => {
    setBrandFilters({ approvalStatus: value === "all" ? null : value });
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setBrandFilters({ searchQuery: e.target.value });
    setPage(1);
  };

  const handleClearFilters = () => {
    resetBrandFilters();
    setPage(1);
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setIsEditDialogOpen(true);
  };

  const handleView = (brand) => {
    setViewingBrand(brand);
    setIsDetailDialogOpen(true);
  };

  const handlePreviousPage = () => {
    if (data?.pagination?.hasPrevious) {
      setPage(data.pagination.previousPage);
    }
  };

  const handleNextPage = () => {
    if (data?.pagination?.hasNext) {
      setPage(data.pagination.nextPage);
    }
  };

  const hasActiveFilters =
    brandFilters.searchQuery ||
    brandFilters.profileStatus ||
    brandFilters.approvalStatus ||
    (brandFilters.tags && brandFilters.tags.length > 0);

  return (
    <div className="flex flex-col">
      <Header title="Brands" />

      <div className="flex-1 p-6 space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Brands
              </CardTitle>
              <Building2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="w-16 h-8" />
                ) : (
                  data?.pagination?.total || 0
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Current Page
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="w-16 h-8" />
                ) : (
                  data?.pagination?.page || 1
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Showing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="w-32 h-8" />
                ) : data?.data?.length > 0 ? (
                  `${data.pagination.offset + 1}-${Math.min(
                    data.pagination.offset + data.pagination.limit,
                    data.pagination.total,
                  )} of ${data.pagination.total}`
                ) : (
                  "0"
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            {/* Search */}
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by brand name..."
                  value={brandFilters.searchQuery}
                  onChange={handleSearchChange}
                  className="pl-9"
                />
              </div>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Profile Status Tabs */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Profile Status
              </label>
              <Tabs
                value={brandFilters.profileStatus || "all"}
                onValueChange={handleProfileStatusChange}
              >
                <TabsList>
                  {PROFILE_STATUS_OPTIONS.map((option) => (
                    <TabsTrigger key={option.value} value={option.value}>
                      {option.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Approval Status Tabs */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Approval Status
              </label>
              <Tabs
                value={brandFilters.approvalStatus || "all"}
                onValueChange={handleApprovalStatusChange}
              >
                <TabsList>
                  {APPROVAL_STATUS_OPTIONS.map((option) => (
                    <TabsTrigger key={option.value} value={option.value}>
                      {option.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Tags Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Filter by Tags
              </label>
              <TagInput
                value={brandFilters.tags}
                onChange={(tags) => {
                  setBrandFilters({ tags });
                  setPage(1);
                }}
                suggestions={allTags}
                placeholder="Filter by tags..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-16" />
                ))}
              </div>
            ) : isError ? (
              <div className="py-8 text-center text-muted-foreground">
                Error loading brands. Please try again.
              </div>
            ) : data?.data?.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No brands found.
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Brand Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Website</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Profile Status</TableHead>
                      <TableHead>Approval Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((brand) => (
                      <TableRow key={brand.id}>
                        <TableCell>
                          <div className="flex gap-3 items-center">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={getImageUrl(brand.logo)}
                                alt={brand.name}
                              />
                              <AvatarFallback>
                                {getInitials(brand.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {brand.name || "-"}
                              </div>
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
                              className={cn(
                                "border",
                                getCategoryColor(brand.category),
                              )}
                            >
                              {formatCategoryLabel(brand.category)}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {brand.tags && brand.tags.length > 0 ? (
                              <>
                                {brand.tags.slice(0, 3).map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {brand.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{brand.tags.length - 3}
                                  </Badge>
                                )}
                              </>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                -
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {brand.profileStatus ? (
                            <Badge
                              variant="outline"
                              className={cn(
                                "border",
                                getProfileStatusColor(brand.profileStatus),
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
                                getApprovalStatusColor(brand.approvalStatus),
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
                          <div className="flex gap-1 justify-end items-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8"
                              onClick={() => handleView(brand)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8"
                              onClick={() => handleEdit(brand)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {data.pagination.page} of {data.pagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={!data.pagination.hasPrevious}
                    >
                      <ChevronLeft className="mr-1 w-4 h-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={!data.pagination.hasNext}
                    >
                      Next
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <BrandDetailDialog
        brand={viewingBrand}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />

      <BrandEditDialog
        brand={editingBrand}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        allTags={allTags}
      />
    </div>
  );
}
