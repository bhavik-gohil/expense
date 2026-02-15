"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const M3Card = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
    <div
        onClick={onClick}
        className={cn("m3-card", onClick && "cursor-pointer active:scale-[0.98]", className)}
    >
        {children}
    </div>
);

export const M3Button = ({ children, className, onClick, variant = 'filled' }: { children: React.ReactNode, className?: string, onClick?: () => void, variant?: 'filled' | 'text' }) => (
    <button
        onClick={onClick}
        className={cn(
            variant === 'filled' ? "m3-button-filled" : "text-primary font-medium px-4 py-2 hover:bg-primary/5 rounded-full",
            className
        )}
    >
        {children}
    </button>
);

export const M3Chip = ({ label, active, onClick }: { label: string, active?: boolean, onClick?: () => void }) => (
    <div
        onClick={onClick}
        className={cn("m3-chip", active && "active", "whitespace-nowrap")}
    >
        {label}
    </div>
);

export const FAB = ({ onClick, icon }: { onClick: () => void, icon: React.ReactNode }) => (
    <div className="fixed bottom-28 right-6 pointer-events-none z-50">
        <button
            onClick={onClick}
            className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary-container shadow-2xl shadow-primary/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all pointer-events-auto"
        >
            {icon}
        </button>
    </div>
);
