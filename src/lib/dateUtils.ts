/**
 * Date formatting and helper utilities for Aura Battles
 */

export function formatScheduledDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Date TBA';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Date TBA';

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();

  const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  if (isToday) return `Today • ${timeStr}`;
  if (isTomorrow) return `Tomorrow • ${timeStr}`;

  return `${date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} • ${timeStr}`;
}

export function toDatetimeLocal(isoString?: string | null): string {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function fromDatetimeLocal(localString?: string | null): string | null {
  if (!localString || !localString.trim()) return null;
  const d = new Date(localString);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}
