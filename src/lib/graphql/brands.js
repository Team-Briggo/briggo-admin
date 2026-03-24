export const LIST_BRANDS = `
  query ListBrands($filter: BrandFilterInput, $pagination: PaginationInput, $sort: SortInput) {
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
        profileStatus
        approvalStatus
        profileCompletionPercentage
        socialHandles {
          platform
          link
        }
        tags
        defaultAddress {
          addressLine1
          addressLine2
          city
          state
          country
          pincode
        }
        rating
        totalRatingCount
        commisionPerOrder
        shopifyDomain
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
        profileStatus
        approvalStatus
        profileCompletionPercentage
        tags
        createdAt
        updatedAt
      }
    }
  }
`;
