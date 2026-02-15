"use client";
import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, List } from "lucide-react";
import { useExpenses } from "@/contexts/ExpenseContext";
import { GlassFAB } from "@/components/glass-ui";
import { ExpenseItem } from "@/components/ExpenseItem";
import { formatShortDate, formatFullMonth } from "@/lib/date";

export default function Home() {
  const router = useRouter();
  const { homeExpenses, currentMonthTotal, allCategories } = useExpenses();

  const groupedExpenses = useMemo(() => {
    const groups: Record<string, typeof homeExpenses> = {};

    homeExpenses.forEach(expense => {
      const dateKey = expense.date;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(expense);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([dateKey, items]) => {
        const dateLabel = formatShortDate(dateKey);
        const dayTotal = items.reduce((s, e) => s + e.amount, 0);
        return { dateKey, dateLabel, items, dayTotal };
      });
  }, [homeExpenses]);

  const monthLabel = useMemo(() => formatFullMonth(new Date()), []);

  return (
    <main className="flex min-h-full flex-col bg-surface text-on-surface pb-40">
      <header
        className="px-6 py-6 sticky top-0 z-10 backdrop-blur-md"
        style={{ backgroundColor: 'rgba(var(--bg-page), 0.8)' }}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">{monthLabel}</p>
            <p className="text-4xl font-extrabold tracking-tight text-text-main">{currentMonthTotal}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="w-12 h-12 bg-surface rounded-2xl border border-border-color flex items-center justify-center shadow-sm text-2xl">
              💵
            </div>
            <p className="text-xs font-semibold tracking-wider text-green-700 mt-1 pr-1">Okane</p>
          </div>
        </div>
      </header>

      <div className="px-5 pt-4 space-y-6">
        {groupedExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant opacity-50">
            <List size={56} strokeWidth={1} className="mb-4" />
            <p className="text-lg font-medium">No expenses yet</p>
            <p className="text-sm mt-1">Tap + to add your first expense</p>
          </div>
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
                {items.map((item) => (
                  <ExpenseItem
                    key={item.id}
                    expense={item}
                    category={allCategories.find(c => c.id === item.categoryId)}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      <GlassFAB icon={<Plus size={24} />} onClick={() => router.push('/add')} />
    </main>
  );
}
