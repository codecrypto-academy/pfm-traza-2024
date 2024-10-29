"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [userRole, setUserRole] = useState<string>("user"); // Default role

  useEffect(() => {
    // Here you would fetch the user role from your auth system
    // For now using a mock role
    const mockRole = "admin"; // This should come from your auth system
    setUserRole(mockRole);
  }, []);

  const adminNavItems = [
    { href: "/dashboard/admin/users", label: "Users Management" },
    { href: "/dashboard/tokenizar", label: "Tokenizar" },
    { href: "/dashboard/listatoken", label: "Lista Token" },
    { href: "/dashboard/transfer", label: "Transferir Token" },
    { href: "/dashboard/receivedTransfers", label: "Transferencias Recibidas" },
  ];

  const userNavItems = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/profile", label: "Profile" },
  ];

  const navItems = userRole === "admin" ? adminNavItems : userNavItems;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border">
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
