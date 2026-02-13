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
    <button
        onClick={onClick}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-primary-container text-on-primary-container shadow-lg flex items-center justify-center hover:shadow-xl active:scale-95 transition-all"
    >
        {icon}
    </button>
);
