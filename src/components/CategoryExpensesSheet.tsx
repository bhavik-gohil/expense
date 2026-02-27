"use client";
import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Expense, Category } from "@/contexts/ExpenseContext";
import { ExpenseItem } from "./ExpenseItem";
import { CategoryIcon } from "./CategoryIcon";
import { formatShortDate } from "@/lib/date";

interface CategoryExpensesSheetProps {
    category: { name: string; emoji: string; total: number } | null;
    expenses: Expense[];
    allCategories: Category[];
    onClose: () => void;
}

export function CategoryExpensesSheet({ category, expenses, allCategories, onClose }: CategoryExpensesSheetProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (category) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setVisible(true));
            });
        } else {
            setVisible(false);
        }
    }, [category]);

    const groupedExpenses = useMemo(() => {
        const groups: Record<string, Expense[]> = {};
        expenses.forEach(expense => {
            const dateKey = expense.date;
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(expense);
        });

        return Object.entries(groups)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([dateKey, items]) => ({
                dateKey,
                dateLabel: formatShortDate(dateKey),
                items,
                dayTotal: items.reduce((s, e) => s + e.amount, 0),
            }));
    }, [expenses]);

    if (!category) return null;

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div className="fixed inset-0 flex items-end justify-center">
            <div
                className="absolute inset-0 transition-colors duration-300"
                style={{ backgroundColor: visible ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)" }}
                onClick={handleClose}
            />

            <div
                className="relative w-full max-w-lg bg-surface rounded-t-[32px] transition-transform duration-300 ease-out flex flex-col"
                style={{
                    maxHeight: "80vh",
                    transform: visible ? "translateY(0)" : "translateY(100%)",
                }}
            >
                <div className="flex justify-between items-center px-6 py-4">
                    <div className="text-3xl font-extrabold tabular-nums ">{category.total}</div>
                    <button
                        onClick={handleClose}
                        className="p-4 -mx-2 minimal-card rounded-full active:scale-90 transition-transform"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 pb-24 space-y-6 overscroll-contain">
                    {groupedExpenses.length === 0 ? (
                        <p className="text-center text-text-muted py-10 text-sm font-medium">No expenses found</p>
                    ) : (
                        groupedExpenses.map(({ dateKey, dateLabel, items, dayTotal }) => (
                            <section key={dateKey}>
                                <div className="flex justify-between items-center px-1 mb-3">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                                        {dateLabel}
                                    </h3>
                                    <span className="text-xs font-bold tabular-nums text-on-surface-variant">
                                        {dayTotal}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {items.map(expense => {
                                        const cat = allCategories.find(c => c.id === expense.categoryId);
                                        return <ExpenseItem key={expense.id} expense={expense} category={cat} />;
                                    })}
                                </div>
                            </section>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
