import { supabase } from '@/lib/supabase';
import { verifyAdminAuth } from '@/lib/auth';
import { validateMutationRequest, createSecureResponse } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const originCheck = validateMutationRequest(request);
    if (!originCheck.valid) {
      return createSecureResponse(
        { error: originCheck.reason || 'Forbidden: DPSM SUCKS' },
        { status: 403 }
      );
    }

    const { message_id, admin_password } = await request.json();

    const isSessionAdmin = await verifyAdminAuth();
    const isPasswordAdmin =
      admin_password &&
      admin_password === (process.env.ADMIN_PASSWORD || 'auraadmin2026!');

    if (!isSessionAdmin && !isPasswordAdmin) {
      return createSecureResponse(
        { error: 'Unauthorized: Invalid admin credentials.' },
        { status: 401 }
      );
    }

    if (!message_id) {
      return createSecureResponse({ error: 'Message ID is required.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', message_id);

    if (error) {
      return createSecureResponse({ error: error.message }, { status: 500 });
    }

    return createSecureResponse({ success: true, message: 'Message deleted successfully.' });
  } catch {
    return createSecureResponse({ error: 'Failed to delete message.' }, { status: 500 });
  }
}
