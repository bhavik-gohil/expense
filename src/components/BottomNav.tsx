"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = useMemo(() => [
        { label: "Home", icon: Home, href: "/" },
        { label: "Stats", icon: BarChart3, href: "/stats" },
        { label: "Settings", icon: Settings, href: "/settings" },
    ], []);

    return (
        <div className="fixed bottom-3 left-3 right-3 z-[100] pt-0 pointer-events-none flex justify-center ">
            <nav className="w-full max-w-2xl rounded-full bg-surface/80 backdrop-blur-md border border-border-color pointer-events-auto flex items-center justify-around pb-3 pt-3 px-2 shadow-[0_-1px_3px_rgba(0,0,0,0.02)]">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-16 transition-colors duration-200",
                                isActive ? "text-primary" : "text-text-muted hover:text-text-main"
                            )}
                        >
                            <item.icon
                                size={26}
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
        </div>
    );
}
