export const authEndpoints = {
  login: `${process.env.NEXT_PUBLIC_API_URL}auth/login`,
  signup: `${process.env.NEXT_PUBLIC_API_URL}auth/signup`,
};

export const profileEndpoints = {
  getProfile: `${process.env.NEXT_PUBLIC_API_URL}user/find`,
};

export const applicationEndpoints = {
  application: `${process.env.NEXT_PUBLIC_API_URL}application`,
};
