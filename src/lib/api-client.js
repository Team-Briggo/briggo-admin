import { getTokens } from './cognito';

const APPSYNC_ENDPOINT = process.env.NEXT_PUBLIC_APPSYNC_ENDPOINT;

class ApiClient {
  async graphql({ query, variables }) {
    const tokens = await getTokens();

    if (!tokens) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(APPSYNC_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: tokens.idToken,
      },
      body: JSON.stringify({ query, variables }),
      next: {
        revalidate: 60, // Revalidate every 60 seconds
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0].message);
    }

    return result.data;
  }
}

export const apiClient = new ApiClient();
