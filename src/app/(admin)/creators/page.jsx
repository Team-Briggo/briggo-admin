"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { useFilterStore } from "@/stores";
import { useCreators } from "@/hooks/use-creators";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Users,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Instagram,
  BadgeCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL || "";

const PROFILE_STATUS_OPTIONS = [
  { value: "SIGNUP_COMPLETED", label: "Signup Completed" },
  { value: "ONBOARDING_COMPLETED", label: "Onboarding Completed" },
  { value: "PROFILE_COMPLETED", label: "Profile Completed" },
];

const getStatusColor = (status) => {
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

const formatNumber = (num) => {
  if (num === null || num === undefined) return "-";
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
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

function CreatorExpandedDetails({ creator }) {
  const { analyzedData } = creator;

  if (!analyzedData) {
    return (
      <div className="p-4 text-sm bg-muted/50 text-muted-foreground">
        No Instagram analysis data available
      </div>
    );
  }

  return (
    <div className="p-4 border-t bg-muted/50">
      <div className="flex gap-6">
        <Avatar className="w-16 h-16">
          <AvatarImage
            src={analyzedData.profilePicUrl}
            alt={analyzedData.fullName}
          />
          <AvatarFallback>{getInitials(analyzedData.fullName)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <div className="flex gap-2 items-center">
            <span className="font-semibold">
              {analyzedData.fullName || "-"}
            </span>
            {analyzedData.isVerified && (
              <BadgeCheck className="w-4 h-4 text-blue-500" />
            )}
            <span className="text-muted-foreground">
              @{analyzedData.username || "-"}
            </span>
            {analyzedData.category && (
              <Badge variant="outline" className="text-xs">
                {analyzedData.category}
              </Badge>
            )}
          </div>

          <div className="flex gap-6 text-sm">
            <div>
              <span className="font-semibold">
                {formatNumber(analyzedData.followerCount)}
              </span>
              <span className="ml-1 text-muted-foreground">followers</span>
            </div>
            <div>
              <span className="font-semibold">
                {formatNumber(analyzedData.followingCount)}
              </span>
              <span className="ml-1 text-muted-foreground">following</span>
            </div>
            <div>
              <span className="font-semibold">
                {formatNumber(analyzedData.mediaCount)}
              </span>
              <span className="ml-1 text-muted-foreground">posts</span>
            </div>
          </div>

          {analyzedData.bio && (
            <p className="max-w-2xl text-sm text-muted-foreground">
              {analyzedData.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CreatorRow({ creator, isExpanded, onToggle }) {
  const isInstagramConnected = !!creator.instagramToken?.accessToken;

  return (
    <>
      <TableRow className="group">
        <TableCell>
          <Button
            variant="ghost"
            size="sm"
            className="p-0 w-6 h-6"
            onClick={onToggle}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </TableCell>
        <TableCell>
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={getImageUrl(creator.profilePicture)}
              alt={creator.name}
            />
            <AvatarFallback>{getInitials(creator.name)}</AvatarFallback>
          </Avatar>
        </TableCell>
        <TableCell className="font-medium">{creator.name || "-"}</TableCell>
        <TableCell className="text-muted-foreground">
          {creator.username ? `@${creator.username}` : "-"}
        </TableCell>
        <TableCell>{creator.email || "-"}</TableCell>
        <TableCell>{creator.phone || "-"}</TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className={cn("text-xs", getStatusColor(creator.profileStatus))}
          >
            {creator.profileStatus?.replace(/_/g, " ") || "-"}
          </Badge>
        </TableCell>
        <TableCell>
          {isInstagramConnected ? (
            <Instagram className="w-4 h-4 text-pink-500" />
          ) : (
            <Instagram className="w-4 h-4 text-muted-foreground/30" />
          )}
        </TableCell>
        <TableCell className="text-xs text-muted-foreground">
          {creator.analyzedData?.followerCount || "-"}
        </TableCell>
        <TableCell className="text-xs text-muted-foreground">
          {creator.referralCode || "-"}
        </TableCell>
        <TableCell className="text-xs text-muted-foreground">
          {creator.sourceReferralCode || "-"}
        </TableCell>
        <TableCell>{creator.automationTokens ?? "-"}</TableCell>
        <TableCell className="text-muted-foreground">
          {formatDate(creator.createdAt)}
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={13} className="p-0">
            <CreatorExpandedDetails creator={creator} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function CreatorsPage() {
  const { creatorFilters, setCreatorFilters } = useFilterStore();
  const [page, setPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const filter = useMemo(() => {
    const f = {};
    if (creatorFilters.searchQuery) {
      f.name = creatorFilters.searchQuery;
    }
    if (creatorFilters.profileStatus) {
      f.profileStatus = creatorFilters.profileStatus;
    }
    return Object.keys(f).length > 0 ? f : undefined;
  }, [creatorFilters]);

  const { data, isLoading, isError, error } = useCreators({
    filter,
    pagination: { page, limit: 10 },
    sort: { sortBy: "createdAt", sortOrder: "DESC" },
  });

  const creators = data?.data || [];
  const pagination = data?.pagination;
  const total = pagination?.total || 0;

  const toggleRow = (id) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleStatusChange = (value) => {
    setCreatorFilters({ profileStatus: value === "all" ? null : value });
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setCreatorFilters({ searchQuery: e.target.value });
    setPage(1);
  };

  const clearFilters = () => {
    setCreatorFilters({ searchQuery: "", profileStatus: null });
    setPage(1);
  };

  const hasActiveFilters =
    creatorFilters.searchQuery || creatorFilters.profileStatus;

  return (
    <div className="flex flex-col">
      <Header title="Creators" />

      <div className="flex-1 p-6 space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Creators
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="w-16 h-8" /> : total}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Page</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pagination
                  ? `${pagination.page} / ${pagination.totalPages}`
                  : "-"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Showing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {creators.length} of {total}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              className="pl-10"
              value={creatorFilters.searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Select
            value={creatorFilters.profileStatus || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Profile Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {PROFILE_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-1 w-4 h-4" />
              Clear
            </Button>
          )}
        </div>

        {/* Error State */}
        {isError && (
          <Card className="border-destructive">
            <CardContent className="p-4 text-destructive">
              Error loading creators: {error?.message || "Unknown error"}
            </CardContent>
          </Card>
        )}

        {/* Creators Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead className="w-12">Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12">IG</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Referral</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Tokens</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="w-4 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-8 h-8 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-24 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-20 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-32 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-24 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-20 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-4 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-16 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-16 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-16 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-12 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-20 h-4" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : creators.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={13}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No creators found
                    </TableCell>
                  </TableRow>
                ) : (
                  creators.map((creator) => (
                    <CreatorRow
                      key={creator.id}
                      creator={creator}
                      isExpanded={expandedRows.has(creator.id)}
                      onToggle={() => toggleRow(creator.id)}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} creators
            </p>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p - 1)}
                disabled={!pagination.hasPrevious}
              >
                <ChevronLeft className="mr-1 w-4 h-4" />
                Previous
              </Button>
              <span className="px-2 text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNext}
              >
                Next
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
