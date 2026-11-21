import React from 'react';
import SubmitBattleForm from '@/components/SubmitBattleForm';

export const metadata = {
  title: 'Submit Battle — Aura Battles Arena',
  description: 'Nominate two students for an official Aura or Mog Battle.',
};

export default function SubmitPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <SubmitBattleForm />
    </div>
  );
}
