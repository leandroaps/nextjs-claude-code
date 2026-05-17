"use client";

import { useState } from "react";
import { AdminUserList } from "./AdminUserList";
import { AdminCreateUserForm } from "./AdminCreateUserForm";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  category: string | null;
  weekly_appointments: number | null;
  plan_type: string | null;
  createdAt: string;
};

export function AdminDashboard({ users }: { users: User[] }) {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Users ({users.length})</h2>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="rounded bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Create user
        </button>
      </div>
      <div className="mt-4">
        <AdminUserList users={users} />
      </div>
      {showCreate && (
        <AdminCreateUserForm onClose={() => setShowCreate(false)} />
      )}
    </>
  );
}
