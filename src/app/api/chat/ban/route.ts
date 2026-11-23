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

    const { target_ip, reason, action, admin_password } = await request.json();

    // Verify admin access
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

    if (!target_ip) {
      return createSecureResponse({ error: 'Target IP is required.' }, { status: 400 });
    }

    const shouldBan = action !== 'unban';

    const { data, error } = await supabase
      .from('chat_users')
      .update({
        is_banned: shouldBan,
        ban_reason: shouldBan ? reason || 'Banned by Admin for Aura infractions' : null,
      })
      .eq('ip', target_ip)
      .select()
      .maybeSingle();

    if (error) {
      return createSecureResponse({ error: error.message }, { status: 500 });
    }

    return createSecureResponse({
      success: true,
      message: shouldBan ? `IP ${target_ip} has been banned.` : `IP ${target_ip} has been unbanned.`,
      user: data,
    });
  } catch {
    return createSecureResponse({ error: 'Failed to execute ban action.' }, { status: 500 });
  }
}
