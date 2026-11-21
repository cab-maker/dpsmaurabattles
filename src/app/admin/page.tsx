import React from 'react';
import { verifyAdminAuth } from '@/lib/auth';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';
import AdminLoginForm from '@/components/admin/AdminLoginForm';


export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function AdminPage() {
  const isAuth = await verifyAdminAuth();

  if (!isAuth) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <AdminLoginForm />
      </div>
    );
  }

  return <AdminDashboardClient />;
}
