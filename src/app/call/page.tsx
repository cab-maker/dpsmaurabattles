import { Metadata } from 'next';
import CallArenaClient from '@/components/call/CallArenaClient';

export const metadata: Metadata = {
  title: 'Call Arena (/call) — DPSM Aura Battles',
  description: 'Live audio/video stage and group calls for DPSM Aura Battles. Real-time video conferencing, screen sharing, and battle debates.',
};

export default function CallPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#060709] via-[#090b12] to-[#060709]">
      <CallArenaClient />
    </div>
  );
}
