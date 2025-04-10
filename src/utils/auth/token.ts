type TokenData = {
  token: string;
  expiresIn?: number;
};

export const TOKEN_KEY = 'passgo_token';

export const tokenStorage = {
  // Store token
  setToken: (data: TokenData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(data));
    }
  },

  // Get token
  getToken: (): TokenData | null => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEY);
      return token ? JSON.parse(token) : null;
    }
    return null;
  },

  // Remove token
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  // Check if token exists
  hasToken: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(TOKEN_KEY);
    }
    return false;
  },
};
