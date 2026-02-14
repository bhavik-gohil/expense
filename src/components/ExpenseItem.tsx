"use client";
import React from "react";
import Link from "next/link";
import { GlassCard } from "./glass-ui";
import { formatTime } from "@/lib/date";
import { Category, Expense } from "@/contexts/ExpenseContext";

interface ExpenseItemProps {
    expense: Expense;
    category?: Category;
}

export const ExpenseItem = React.memo(({ expense, category }: ExpenseItemProps) => {
    return (
        <Link href={`/add?edit=${expense.id}`} className="block group">
            <GlassCard className="flex items-center gap-4 px-5 py-4 group-hover:bg-white/20 dark:group-hover:bg-white/10 transition-colors">
                {/* Icon — spans both rows */}
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-[24px] shrink-0 self-center text-text-main">
                    {category?.emoji || '💰'}
                </div>
                {/* Middle: name + time stacked */}
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-[15px] leading-tight truncate text-text-main">
                        {category?.name || 'Uncategorized'}
                        {expense.description && <span className="opacity-70 font-normal"> - {expense.description}</span>}
                    </p>
                    <p className="text-[11px] font-bold text-on-surface-variant opacity-60 mt-1 uppercase tracking-wide">
                        {formatTime(expense.date)}
                    </p>
                </div>
                {/* Amount — spans both rows */}
                <span className="font-black text-lg tabular-nums shrink-0 self-center tracking-tight text-text-main">
                    {expense.amount.toFixed(2)}
                </span>
            </GlassCard>
        </Link>
    );
});

ExpenseItem.displayName = "ExpenseItem";
