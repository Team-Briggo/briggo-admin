"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { useFilterStore } from "@/stores";
import { useInstagramAutomations } from "@/hooks/use-instagram-automations";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Bot,
  CheckCircle,
  PauseCircle,
  XCircle,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AUTOMATION_TYPE_OPTIONS = [
  { value: "DM_AUTOMATION", label: "DM Automation" },
  { value: "STORY_AUTOMATION", label: "Story Automation" },
  { value: "LIVE_COMMENT_AUTOMATION", label: "Live Comment" },
  { value: "COMMENT_AUTOMATION", label: "Comment Automation" },
];

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "PAUSED", label: "Paused" },
];

const getStatusColor = (status) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800 border-green-200";
    case "PAUSED":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "INACTIVE":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "ACTIVE":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "PAUSED":
      return <PauseCircle className="w-4 h-4 text-yellow-500" />;
    case "INACTIVE":
      return <XCircle className="w-4 h-4 text-gray-400" />;
    default:
      return null;
  }
};

const getTypeLabel = (type) => {
  const option = AUTOMATION_TYPE_OPTIONS.find((o) => o.value === type);
  return option?.label || type?.replace(/_/g, " ") || "-";
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

export default function InstagramAutomationsPage() {
  const { automationFilters, setAutomationFilters } = useFilterStore();
  const [page, setPage] = useState(1);

  const [creatorIdSearch, setCreatorIdSearch] = useState("");

  const filter = useMemo(() => {
    const f = {};
    if (automationFilters.searchQuery) {
      f.name = automationFilters.searchQuery;
    }
    if (creatorIdSearch) {
      f.creatorId = creatorIdSearch;
    }
    if (automationFilters.status) {
      f.status = automationFilters.status;
    }
    if (automationFilters.automationType) {
      f.automationType = automationFilters.automationType;
    }
    return Object.keys(f).length > 0 ? f : undefined;
  }, [automationFilters, creatorIdSearch]);

  const { data, isLoading, isError, error } = useInstagramAutomations({
    filter,
    pagination: { page, limit: 10 },
    sort: { sortBy: "createdAt", sortOrder: "DESC" },
  });

  const automations = data?.data || [];
  const pagination = data?.pagination;
  const total = pagination?.total || 0;

  // Calculate stats from current page data
  const activeCount = automations.filter((a) => a.status === "ACTIVE").length;
  const pausedCount = automations.filter((a) => a.status === "PAUSED").length;
  const totalDmSent = automations.reduce(
    (sum, a) => sum + (a.totalDmSent || 0),
    0
  );

  const handleStatusChange = (value) => {
    setAutomationFilters({ status: value === "all" ? null : value });
    setPage(1);
  };

  const handleTypeChange = (value) => {
    setAutomationFilters({ automationType: value === "all" ? null : value });
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setAutomationFilters({ searchQuery: e.target.value });
    setPage(1);
  };

  const handleCreatorIdChange = (e) => {
    setCreatorIdSearch(e.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setAutomationFilters({
      searchQuery: "",
      status: null,
      automationType: null,
    });
    setCreatorIdSearch("");
    setPage(1);
  };

  const hasActiveFilters =
    automationFilters.searchQuery ||
    creatorIdSearch ||
    automationFilters.status ||
    automationFilters.automationType;

  return (
    <div className="flex flex-col">
      <Header title="Instagram Automations" />

      <div className="flex-1 p-6 space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Automations
              </CardTitle>
              <Bot className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="w-16 h-8" /> : total}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="w-16 h-8" /> : activeCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Paused</CardTitle>
              <PauseCircle className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="w-16 h-8" /> : pausedCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total DMs Sent
              </CardTitle>
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="w-16 h-8" />
                ) : (
                  formatNumber(totalDmSent)
                )}
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
              value={automationFilters.searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Input
            placeholder="Search by Creator ID..."
            className="w-[220px]"
            value={creatorIdSearch}
            onChange={handleCreatorIdChange}
          />
          <Select
            value={automationFilters.status || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={automationFilters.automationType || "all"}
            onValueChange={handleTypeChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Automation Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {AUTOMATION_TYPE_OPTIONS.map((option) => (
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
              Error loading automations: {error?.message || "Unknown error"}
            </CardContent>
          </Card>
        )}

        {/* Automations Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Creator ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Keywords</TableHead>
                  <TableHead>DMs Sent</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="w-32 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-20 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-24 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-16 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-28 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-12 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-12 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-20 h-4" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : automations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No automations found
                    </TableCell>
                  </TableRow>
                ) : (
                  automations.map((automation) => (
                    <TableRow key={automation.id}>
                      <TableCell className="font-medium">
                        {automation.name || "-"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {automation.creatorId?.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(automation.automationType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            getStatusColor(automation.status)
                          )}
                        >
                          {automation.status || "-"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {automation.keywords?.slice(0, 3).join(", ") || "-"}
                        {automation.keywords?.length > 3 && "..."}
                      </TableCell>
                      <TableCell>
                        {formatNumber(automation.totalDmSent)}
                      </TableCell>
                      <TableCell>{formatNumber(automation.clicks)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(automation.createdAt)}
                      </TableCell>
                    </TableRow>
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
              of {pagination.total} automations
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
