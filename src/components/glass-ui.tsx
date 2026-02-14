"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const GlassCard = ({ children, className, onClick, gradient }: { children: React.ReactNode, className?: string, onClick?: () => void, gradient?: boolean }) => (
    <div
        onClick={onClick}
        className={cn(
            "relative overflow-hidden rounded-2xl transition-all duration-200 group minimal-card", // Fast duration, solid bg
            onClick && "cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.99]",
            className
        )}
    >
        {children}
    </div>
);

export const GlassButton = ({ children, className, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) => {
    const variants = {
        // Primary: Solid High Contrast (Black/White)
        primary: "bg-primary text-on-primary shadow-sm hover:opacity-90 active:scale-95",
        // Ghost: Subtle Hover
        ghost: "bg-transparent text-text-main hover:bg-black/5 dark:hover:bg-white/5",
        // Danger: Red Text
        danger: "bg-red-50 to-red-600 text-red-600 hover:bg-red-50 dark:bg-red-900/10 dark:hover:bg-red-900/20"
    };

    return (
        <button
            className={cn(
                "relative flex items-center justify-center px-6 py-3.5 rounded-full font-semibold transition-transform duration-200 text-sm tracking-tight",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export const GlassInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        className={cn(
            "w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium placeholder:text-black/30 dark:placeholder:text-white/30 text-lg",
            className
        )}
        {...props}
    />
);

export const GlassMetric = ({ label, value, icon: Icon, trend }: { label: string, value: string, icon?: any, trend?: string }) => (
    <GlassCard className="p-5 flex items-center justify-between">
        <div>
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">{label}</p>
            <p className="text-2xl font-black tracking-tight text-text-main">{value}</p>
            {trend && <p className="text-xs font-bold text-accent-blue mt-1">{trend}</p>}
        </div>
        {Icon && (
            <div className="w-12 h-12 rounded-2xl bg-text-main/5 flex items-center justify-center text-text-main shadow-inner">
                <Icon size={24} />
            </div>
        )}
    </GlassCard>
);

export const GlassFAB = ({ onClick, icon }: { onClick: () => void, icon: React.ReactNode }) => (
    <div className="fixed bottom-24 right-5 z-40 pointer-events-auto">
        <button
            onClick={onClick}
            className="w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200"
        >
            {icon}
        </button>
    </div>
);
