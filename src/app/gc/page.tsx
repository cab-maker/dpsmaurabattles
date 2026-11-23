import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { ChatMessage } from '@/types/database';
import InstagramGroupChatClient from '@/components/chat/InstagramGroupChatClient';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Group Chat (/gc) — DPSM Aura Battles',
  description: 'The official live student group chat for DPSM Aura Battles. Real-time banter, battle predictions, and mog discussions.',
};

async function getInitialMessages(): Promise<ChatMessage[]> {
  try {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(100);

    return data || [];
  } catch {
    return [];
  }
}

export default async function GroupChatPage() {
  const initialMessages = await getInitialMessages();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#000000]">
      <InstagramGroupChatClient initialMessages={initialMessages} />
    </div>
  );
}
