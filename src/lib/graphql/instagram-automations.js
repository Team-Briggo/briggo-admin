export const LIST_INSTAGRAM_AUTOMATIONS = `
  query ListInstagramAutomations($filter: InstagramAutomationFilterInput, $pagination: PaginationInput, $sort: SortInput) {
    listInstagramAutomations(filter: $filter, pagination: $pagination, sort: $sort) {
      statusCode
      success
      message
      data {
        id
        creatorId
        igAccountId
        automationType
        keywordType
        keywords
        name
        status
        isActive
        clicks
        totalDmSent
        totalCommentsSent
        totalAskForFollowSent
        totalFollowersGained
        mediaUrl
        thumbnailUrl
        mediaType
        createdAt
        updatedAt
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
