export const LIST_BRANDS = `
  query ListBrands(
    $filter: BrandFilterInput
    $pagination: PaginationInput
    $sort: SortInput
  ) {
    listBrands(filter: $filter, pagination: $pagination, sort: $sort) {
      statusCode
      success
      message
      data {
        id
        name
        email
        description
        website
        phone
        logo
        category
        socialHandles {
          platform
          link
          __typename
        }
        tags
        profileStatus
        approvalStatus
        profileCompletionPercentage
        defaultAddress {
          id
          placeId
          addressLine1
          addressLine2
          city
          state
          country
          pincode
          latitude
          longitude
          creatorId
          brandId
          createdAt
          updatedAt
          __typename
        }
        cognitoId
        shopifyAccessToken
        shopifyDomain
        shopifyScope
        rating
        totalRatingCount
        commisionPerOrder
        createdAt
        updatedAt
        commisionDistribution {
          customerDiscount
          creatorCommission
          briggoCommission
          pgCommission
          __typename
        }
        creatorActiveListing
        marketplaceActiveListing
        __typename
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
        __typename
      }
      __typename
    }
  }
`;

export const UPDATE_BRAND = `
  mutation UpdateBrand($id: String!, $input: UpdateBrandInput!) {
    updateBrand(id: $id, input: $input) {
      statusCode
      success
      message
      data {
        id
        name
        email
        description
        website
        phone
        logo
        category
        socialHandles {
          platform
          link
          __typename
        }
        tags
        profileStatus
        approvalStatus
        profileCompletionPercentage
        defaultAddress {
          id
          placeId
          addressLine1
          addressLine2
          city
          state
          country
          pincode
          latitude
          longitude
          creatorId
          brandId
          createdAt
          updatedAt
          __typename
        }
        cognitoId
        shopifyAccessToken
        shopifyDomain
        shopifyScope
        rating
        totalRatingCount
        commisionPerOrder
        createdAt
        updatedAt
        commisionDistribution {
          customerDiscount
          creatorCommission
          briggoCommission
          pgCommission
          __typename
        }
        creatorActiveListing
        marketplaceActiveListing
        __typename
      }
      __typename
    }
  }
`;
