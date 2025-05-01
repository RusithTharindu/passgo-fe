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

export const renewalEndpoints = {
  createRenewal: `${process.env.NEXT_PUBLIC_API_URL}renew-passport`,
  uploadDocument: (id: string, documentType: string) =>
    `${process.env.NEXT_PUBLIC_API_URL}renew-passport/${id}/documents?type=${documentType}`,
  getDocument: (id: string, documentType: string) =>
    `${process.env.NEXT_PUBLIC_API_URL}renew-passport/${id}/documents?type=${documentType}`,
  getUserRequests: `${process.env.NEXT_PUBLIC_API_URL}renew-passport/my-requests`,
  getSingleRequest: (id: string) => `${process.env.NEXT_PUBLIC_API_URL}renew-passport/${id}`,
};
