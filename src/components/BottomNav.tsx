"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = useMemo(() => [
        { label: "Home", icon: Home, href: "/" },
        { label: "Stats", icon: BarChart3, href: "/stats" },
        { label: "Settings", icon: Settings, href: "/settings" },
    ], []);

    return (
        <div className="fixed bottom-3 left-3 right-3 z-[100] pointer-events-none flex justify-center items-center gap-3">
            <nav className="h-14 rounded-full bg-surface/80 backdrop-blur-sm border border-border-color pointer-events-auto flex items-center justify-around px-4 min-w-[260px]">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-16 transition-all duration-200",
                                isActive ? "text-primary" : "text-text-muted hover:text-text-main"
                            )}
                        >
                            <item.icon
                                size={24}
                                strokeWidth={isActive ? 2.5 : 2}
                                className="mb-0.5"
                            />
                            <span className={cn("text-[10px] font-medium", isActive ? "font-bold" : "")}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <Link
                href="/add"
                className="w-14 h-14 rounded-full bg-surface/80 backdrop-blur-sm border border-border-color pointer-events-auto flex items-center justify-center text-text-main active:scale-90 transition-all shadow-sm"
            >
                <Plus size={30} strokeWidth={2.5} />
            </Link>
        </div>
    );
}
