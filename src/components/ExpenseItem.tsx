"use client";
import React from "react";
import Link from "next/link";
import { GlassCard } from "./glass-ui";
import { formatTime } from "@/lib/date";
import { Category, Expense } from "@/contexts/ExpenseContext";
import { CategoryIcon } from "./CategoryIcon";

interface ExpenseItemProps {
    expense: Expense;
    category?: Category;
}

export const ExpenseItem = React.memo(({ expense, category }: ExpenseItemProps) => {
    return (
        <Link href={`/add?edit=${expense.id}`} className="block group">
            <GlassCard className="flex items-center content-between gap-4 p-3 group-hover:bg-white/20 transition-colors">
                <CategoryIcon emoji={category?.emoji || '💰'} />
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-[15px] leading-tight truncate text-text-main">
                        {category?.name || 'Deleted category'}
                    </p>
                    <p className="text-sm text-on-surface-variant opacity-60 mt-1 tracking-wide">
                        {expense.description}
                    </p>
                </div>
                <div className="flex flex-col items-end shrink-0">
                    <p className="font-black text-lg tabular-nums text-text-main">
                        {expense.amount}
                    </p>
                    <p className="text-[11px] font-bold text-on-surface-variant opacity-60 mt-1 uppercase">
                        {formatTime(expense.timestamp || expense.date)}
                    </p>
                </div>
            </GlassCard>
        </Link>
    );
});

ExpenseItem.displayName = "ExpenseItem";
