'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifySubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');

      if (!token) {
        router.push('/verify-subscription-error');
        return;
      }

      try {
        const response = await fetch(`/api/subscriptions/verify?token=${encodeURIComponent(token)}`);
        
        if (response.ok) {
          router.push('/verify-subscription-success');
        } else {
          router.push('/verify-subscription-error');
        }
      } catch (error) {
        console.error('Verification failed:', error);
        router.push('/verify-subscription-error');
      }
    };

    verifyToken();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Verifying your subscription...</p>
    </div>
  );
}
