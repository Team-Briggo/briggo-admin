'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { useFilterStore } from '@/stores';
import { useCredits } from '@/hooks/use-credits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CreditCard,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Coins,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS = [
  { value: 'SUCCESS', label: 'Success' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'created', label: 'Created' },
  { value: 'authorized', label: 'Authorized' },
  { value: 'captured', label: 'Captured' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'paid', label: 'Paid' },
  { value: 'attempted', label: 'Attempted' },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'SUCCESS':
    case 'captured':
    case 'paid':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'FAILED':
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'created':
    case 'attempted':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'authorized':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'refunded':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getSourceColor = (source) => {
  switch (source) {
    case 'SIGNUP_BONUS':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'REFERRAL_BONUS':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'AUTOMATION':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'BUCKS':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const truncateId = (id) => {
  if (!id) return '-';
  return id.length > 12 ? `${id.slice(0, 8)}...` : id;
};

export default function CreditsPage() {
  const { creditFilters, setCreditFilters } = useFilterStore();
  const [page, setPage] = useState(1);

  const filter = useMemo(() => {
    const f = {};
    if (creditFilters.status) {
      f.status = creditFilters.status;
    }
    return Object.keys(f).length > 0 ? f : undefined;
  }, [creditFilters]);

  const { data, isLoading, isError, error } = useCredits({
    filter,
    pagination: { page, limit: 10 },
    sort: { sortBy: 'createdAt', sortOrder: 'DESC' },
  });

  const transactions = data?.data || [];
  const pagination = data?.pagination;
  const total = pagination?.total || 0;

  const totalAmount = transactions.reduce(
    (sum, t) => sum + (t.orderAmount || 0),
    0
  );
  const totalTokens = transactions.reduce(
    (sum, t) => sum + (t.automationTokens || 0),
    0
  );
  const successCount = transactions.filter(
    (t) => t.status === 'SUCCESS' || t.status === 'captured' || t.status === 'paid'
  ).length;

  const handleStatusChange = (value) => {
    setCreditFilters({ status: value === 'all' ? null : value });
    setPage(1);
  };

  const clearFilters = () => {
    setCreditFilters({ status: 'SUCCESS' });
    setPage(1);
  };

  const hasActiveFilters = creditFilters.status && creditFilters.status !== 'SUCCESS';

  return (
    <div className="flex flex-col">
      <Header title="Credits / Transactions" />

      <div className="flex-1 p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <CreditCard className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="w-16 h-8" /> : total}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Page Revenue</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="w-16 h-8" />
                ) : (
                  formatCurrency(totalAmount)
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Tokens Issued</CardTitle>
              <Coins className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="w-16 h-8" /> : totalTokens}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Successful</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="w-16 h-8" /> : successCount}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Select
            value={creditFilters.status || 'all'}
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
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-1 w-4 h-4" />
              Clear
            </Button>
          )}
        </div>

        {isError && (
          <Card className="border-destructive">
            <CardContent className="p-4 text-destructive">
              Error loading transactions: {error?.message || 'Unknown error'}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Creator ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Tokens</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Razorpay Order</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="w-20 h-4" /></TableCell>
                      <TableCell><Skeleton className="w-20 h-4" /></TableCell>
                      <TableCell><Skeleton className="w-16 h-4" /></TableCell>
                      <TableCell><Skeleton className="w-12 h-4" /></TableCell>
                      <TableCell><Skeleton className="w-16 h-4" /></TableCell>
                      <TableCell><Skeleton className="w-20 h-4" /></TableCell>
                      <TableCell><Skeleton className="w-20 h-4" /></TableCell>
                      <TableCell><Skeleton className="w-24 h-4" /></TableCell>
                    </TableRow>
                  ))
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-xs">
                        {truncateId(transaction.id)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {truncateId(transaction.creatorId)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(
                          transaction.orderAmount,
                          transaction.orderCurrency
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {transaction.automationTokens ?? '-'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn('text-xs', getStatusColor(transaction.status))}
                        >
                          {transaction.status || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn('text-xs', getSourceColor(transaction.source))}
                        >
                          {transaction.source?.replace(/_/g, ' ') || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {truncateId(transaction.razorpayOrderId)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(transaction.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} transactions
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
