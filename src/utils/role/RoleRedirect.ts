'use client';

import Cookies from 'js-cookie';
import { decode, JwtPayload } from 'jsonwebtoken';
import { useRouter } from 'next/navigation';

export const RoleRedirect = () => {
  const router = useRouter();

  const accessToken = Cookies.get('token');
  if (accessToken) {
    const decodedToken = decode(accessToken) as JwtPayload;
    const role = decodedToken.role;
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else if (role === 'applicant') {
      router.push('/applicant/dashboard');
    } else {
      router.push('/');
    }
  }
};
