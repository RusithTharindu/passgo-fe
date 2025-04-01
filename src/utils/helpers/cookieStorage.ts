import Cookies from 'js-cookie';

export const TOKEN_KEY = 'token';

export const tokenStorage = {
  // Store token in cookie
  setToken: (token: string) => {
    // Set cookie with appropriate expiry
    // If rememberMe is true, set expiry to 30 days, otherwise 1 day
    const expires = 1;
    Cookies.set(TOKEN_KEY, token, {
      expires,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  },

  // Get token from cookie
  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_KEY);
  },

  // Remove token cookie
  removeToken: () => {
    Cookies.remove(TOKEN_KEY, { path: '/' });
  },

  // Check if token exists
  hasToken: (): boolean => {
    return !!Cookies.get(TOKEN_KEY);
  },
};
