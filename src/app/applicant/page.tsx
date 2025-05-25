'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Applicant = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/applicant/home');
  }, [router]);
  return (
    <div>
      <p>Applicant</p>
    </div>
  );
};

export default Applicant;
