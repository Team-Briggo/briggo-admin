import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';

const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

// Check if Cognito is configured
const isCognitoConfigured = userPoolId &&
  clientId &&
  !userPoolId.includes('<') &&
  !clientId.includes('<');

const poolData = {
  UserPoolId: userPoolId || 'not-configured',
  ClientId: clientId || 'not-configured',
};

export const userPool = isCognitoConfigured
  ? new CognitoUserPool(poolData)
  : null;

export async function signIn({ email, password }) {
  if (!userPool) {
    throw new Error('Cognito is not configured. Please set NEXT_PUBLIC_COGNITO_USER_POOL_ID and NEXT_PUBLIC_COGNITO_CLIENT_ID in .env.local');
  }

  const authenticationDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {
        resolve(session);
      },
      onFailure: (err) => {
        reject(err);
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        resolve({
          challengeName: 'NEW_PASSWORD_REQUIRED',
          cognitoUser,
          userAttributes,
          requiredAttributes,
        });
      },
    });
  });
}

export function completeNewPasswordChallenge(cognitoUser, newPassword, userAttributes = {}) {
  return new Promise((resolve, reject) => {
    cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, {
      onSuccess: (session) => resolve(session),
      onFailure: (err) => reject(err),
    });
  });
}

export async function signOut() {
  if (!userPool) return;

  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
}

export async function getCurrentSession() {
  if (!userPool) return null;

  return new Promise((resolve) => {
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      resolve(null);
      return;
    }

    cognitoUser.getSession((err, session) => {
      if (err || !session || !session.isValid()) {
        resolve(null);
        return;
      }
      resolve(session);
    });
  });
}

export async function getTokens() {
  const session = await getCurrentSession();
  if (!session) return null;

  return {
    accessToken: session.getAccessToken().getJwtToken(),
    idToken: session.getIdToken().getJwtToken(),
    refreshToken: session.getRefreshToken().getToken(),
  };
}

export function syncTokensToCookies() {
  if (typeof window === 'undefined') return;

  const prefix = `CognitoIdentityServiceProvider.${clientId}`;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(prefix)) {
      document.cookie = `${key}=${localStorage.getItem(key)}; path=/; max-age=3600; SameSite=Lax`;
    }
  }
}

export function clearAuthCookies() {
  if (typeof window === 'undefined') return;

  document.cookie.split(';').forEach(cookie => {
    const name = cookie.split('=')[0].trim();
    if (name.includes('CognitoIdentityServiceProvider')) {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  });
}

export async function refreshSession() {
  if (!userPool) return null;

  const cognitoUser = userPool.getCurrentUser();
  if (!cognitoUser) return null;

  const session = await getCurrentSession();
  if (!session) return null;

  const refreshToken = session.getRefreshToken();

  return new Promise((resolve) => {
    cognitoUser.refreshSession(refreshToken, (err, newSession) => {
      if (err) {
        resolve(null);
        return;
      }
      resolve(newSession);
    });
  });
}
