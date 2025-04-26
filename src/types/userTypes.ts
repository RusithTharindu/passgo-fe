export interface UserDetails {
  email: string;
}

export interface UserState {
  userDetails: UserDetails | null;
  isLoading: boolean;
  error: string | null;
  setUserDetails: (email: string) => void;
  updateUserDetails: (details: Partial<UserDetails>) => void;
  clearUserDetails: () => void;
}
