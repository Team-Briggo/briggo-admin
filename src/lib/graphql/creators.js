export const LIST_CREATORS = `
  query ListCreators($filter: CreatorFilterInput, $pagination: PaginationInput, $sort: SortInput) {
    listCreators(filter: $filter, pagination: $pagination, sort: $sort) {
      statusCode
      success
      message
      data {
        id
        name
        phone
        email
        username
        profilePicture
        bio
        profileStatus
        profileCompletionPercentage
        niche
        referralCode
        sourceReferralCode
        automationTokens
        instagramToken {
          accessToken
          userId
          expiresAt
        }
        analyzedData {
          instagramUserId
          bio
          category
          followerCount
          followingCount
          fullName
          isVerified
          mediaCount
          profilePicUrl
          username
        }
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
