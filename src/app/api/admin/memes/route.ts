import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('memes')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ memes: data });
}

export async function POST(request: Request) {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, subtitle, image_url, caption, is_pinned } = await request.json();

    if (!title?.trim() || !image_url?.trim()) {
      return NextResponse.json({ error: 'Title and image or GIF URL are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('memes')
      .insert({
        title: title.trim(),
        subtitle: subtitle?.trim() || null,
        image_url: image_url.trim(),
        caption: caption?.trim() || null,
        is_pinned: Boolean(is_pinned),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, meme: data });
  } catch {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Meme ID is required' }, { status: 400 });
    }

    const { error } = await supabase.from('memes').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete meme' }, { status: 500 });
  }
}
