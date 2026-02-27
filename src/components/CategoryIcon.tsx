"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface CategoryIconProps {
    emoji: string;
    className?: string;
    size?: "sm" | "md" | "lg";
}

export function CategoryIcon({ emoji, className, size = "md" }: CategoryIconProps) {
    const sizeClasses = {
        sm: "w-10 h-10 rounded-xl text-[20px]",
        md: "w-12 h-12 rounded-2xl text-[24px]",
        lg: "w-16 h-16 rounded-[2rem] text-[32px]",
    };

    return (
        <div
            className={cn(
                "bg-zinc-100 flex items-center justify-center shrink-0 self-center text-text-main transition-transform",
                sizeClasses[size],
                className
            )}
        >
            {emoji}
        </div>
    );
}
