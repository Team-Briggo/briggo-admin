export const LIST_TRANSACTIONS = `
  query ListTransactions($filter: CheckoutTransactionFilterInput, $pagination: PaginationInput, $sort: SortInput) {
    listTransactions(filter: $filter, pagination: $pagination, sort: $sort) {
      statusCode
      success
      message
      data {
        id
        orderAmount
        orderCurrency
        status
        createdAt
        updatedAt
        completedAt
        failedAt
        razorpayOrderId
        merchantOrderId
        creatorId
        automationTokens
        source
      }
      pagination {
        page
        limit
        offset
        total
        totalPages
        hasNext
        hasPrevious
        nextPage
        previousPage
      }
    }
  }
`;
