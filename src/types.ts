export interface Auth {
  accessToken: string;
}

export enum UserActionTypes {
  LOADING = 'loading',
  UNLOADING = 'unloading',
  SUCCESS = 'success',
}

export interface User {
  id: number;
  nonce: number;
  Address: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  telegram?: string;
  country?: string;
  city?: string;
  ip?: string;
  os?: string;
  browser?: string;
  geolocation?: string;
  gender?: string;
  age?: string;
  isAdmin?: boolean;
  myReferralCode?: string;
  referredByCode?: string;
}
