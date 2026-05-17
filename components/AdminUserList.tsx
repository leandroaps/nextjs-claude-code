"use client";

import Link from "next/link";

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

export function AdminUserList({ users }: { users: User[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Classes/wk</th>
            <th className="px-4 py-3 font-medium">Plan</th>
            <th className="px-4 py-3 font-medium">Joined</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
              <td className="px-4 py-3 font-medium">{user.name}</td>
              <td className="px-4 py-3 text-zinc-500">{user.email}</td>
              <td className="px-4 py-3">
                <span
                  className={
                    user.role === "admin"
                      ? "rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                      : "rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }
                >
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3 capitalize text-zinc-500">
                {user.role === "admin" ? "—" : user.category || "—"}
              </td>
              <td className="px-4 py-3 text-zinc-500">
                {user.role === "admin" ? "—" : `${user.weekly_appointments ?? 1}x`}
              </td>
              <td className="px-4 py-3 capitalize text-zinc-500">
                {user.role === "admin" ? "—" : user.plan_type || "—"}
              </td>
              <td className="px-4 py-3 text-zinc-500">
                {new Date(user.createdAt.replace(" ", "T") + "Z").toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/users/${user.id}`}
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
