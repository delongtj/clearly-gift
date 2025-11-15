'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function UnsubscribePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const unsubscribe = async () => {
      const token = searchParams.get('token');

      if (!token) {
        router.push('/unsubscribe-error');
        return;
      }

      try {
        const response = await fetch(`/api/subscriptions/unsubscribe?token=${encodeURIComponent(token)}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          router.push('/unsubscribe-success');
        } else {
          router.push('/unsubscribe-error');
        }
      } catch (error) {
        console.error('Unsubscribe failed:', error);
        router.push('/unsubscribe-error');
      }
    };

    unsubscribe();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Unsubscribing...</p>
    </div>
  );
}
