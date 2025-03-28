'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ExpertForm } from '@/components/expert-form';
import { Expert } from '@/lib/types';

export default function ExpertEditPage({ params }: { params: { id: string } }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  
  const router = useRouter();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const response = await fetch(`/api/experts/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch expert');
        }
        const data = await response.json();
        setExpert(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExpert();
  }, [id]);

  const handleSubmit = async (updatedExpert: Expert) => {
    try {
      const response = await fetch(`/api/experts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedExpert),
      });

      if (!response.ok) {
        throw new Error('Failed to update expert');
      }

      router.push(`/experts/${id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!expert) {
    return <div>Expert not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Expert</h1>
      <ExpertForm 
        expert={expert}
        action={async (formData: FormData) => {
          const formObject = Object.fromEntries(formData.entries());
          const updatedExpert: Expert = {
            id: expert.id,
            name: formObject.name.toString(),
            title: formObject.title.toString(),
            company: formObject.company.toString(),
            expertise: formObject.expertise?.toString() || '',
            bio: formObject.bio?.toString() || '',
            imageUrl: formObject.imageUrl.toString(),
            email: formObject.email?.toString() || '',
            website: formObject.website?.toString() || '',
            linkedin: formObject.linkedin?.toString() || '',
            twitter: formObject.twitter?.toString() || ''
          };
          await handleSubmit(updatedExpert);
        }}
      />
    </div>
  );
}
