"use client";

import Link from "next/link";
import { t } from "@/lib/i18n";

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
    <div className="-mx-4 overflow-x-auto sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded-none border-y border-zinc-200 sm:rounded-lg sm:border dark:border-zinc-800">
          <table className="min-w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
          <tr>
            <th className="px-3 py-3 font-medium sm:px-4">{t.name}</th>
            <th className="px-3 py-3 font-medium sm:px-4">{t.email}</th>
            <th className="px-3 py-3 font-medium sm:px-4">{t.role}</th>
            <th className="hidden px-3 py-3 font-medium sm:table-cell sm:px-4">{t.classCategory}</th>
            <th className="hidden px-3 py-3 font-medium md:table-cell md:px-4">{t.classesWk}</th>
            <th className="hidden px-3 py-3 font-medium md:table-cell md:px-4">{t.plan}</th>
            <th className="hidden px-3 py-3 font-medium sm:table-cell sm:px-4">{t.joined}</th>
            <th className="px-3 py-3 sm:px-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
              <td className="px-3 py-3 font-medium sm:px-4">{user.name}</td>
              <td className="px-3 py-3 text-zinc-500 sm:px-4">{user.email}</td>
              <td className="px-3 py-3 sm:px-4">
                <span
                  className={
                    user.role === "admin"
                      ? "rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                      : "rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }
                >
                  {user.role === "admin" ? t.roleAdmin : t.roleUser}
                </span>
              </td>
              <td className="hidden px-3 py-3 capitalize text-zinc-500 sm:table-cell sm:px-4">
                {user.role === "admin" ? "—" : user.category === "group" ? t.group : user.category === "individual" ? t.individual : "—"}
              </td>
              <td className="hidden px-3 py-3 text-zinc-500 md:table-cell md:px-4">
                {user.role === "admin" ? "—" : `${user.weekly_appointments ?? 1}x`}
              </td>
              <td className="hidden px-3 py-3 capitalize text-zinc-500 md:table-cell md:px-4">
                {user.role === "admin" ? "—" : user.plan_type === "monthly" ? t.monthly : user.plan_type === "semester" ? t.semester : user.plan_type === "yearly" ? t.yearly : "—"}
              </td>
              <td className="hidden px-3 py-3 text-zinc-500 sm:table-cell sm:px-4">
                {new Date(user.createdAt.replace(" ", "T") + "Z").toLocaleDateString("pt-BR")}
              </td>
              <td className="px-3 py-3 text-right sm:px-4">
                <Link
                  href={`/admin/users/${user.id}`}
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {t.edit}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      </div>
    </div>
  );
}
