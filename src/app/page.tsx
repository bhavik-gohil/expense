"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { Plus, List, BarChart3, ChevronRight, Settings } from "lucide-react";
import { useExpenses } from "@/contexts/ExpenseContext";
import { M3Card, FAB } from "@/components/m3-ui";

export default function Home() {
  const { homeExpenses, currentMonthTotal, categories } = useExpenses();

  const groupedExpenses = useMemo(() => {
    const groups: Record<string, typeof homeExpenses> = {};
    homeExpenses.forEach(expense => {
      const dateKey = expense.date; // YYYY-MM-DD for sorting
      const dateLabel = new Date(expense.date).toLocaleDateString(undefined, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(expense);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([dateKey, items]) => {
        const dateLabel = new Date(dateKey).toLocaleDateString(undefined, {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        });
        const dayTotal = items.reduce((s, e) => s + e.amount, 0);
        return { dateKey, dateLabel, items, dayTotal };
      });
  }, [homeExpenses]);

  // Format the current month name
  const monthLabel = new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  return (
    <main className="flex min-h-screen flex-col bg-surface text-on-surface pb-24">
      {/* Header */}
      <header className="px-6 pt-14 pb-8 sticky top-0 bg-surface/80 backdrop-blur-md z-10">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">{monthLabel}</p>
            <p className="text-5xl font-extrabold tracking-tight">{currentMonthTotal.toFixed(2)}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/stats">
              <div className="p-3 rounded-full bg-secondary-container text-on-secondary-container hover:scale-110 active:scale-95 transition-transform">
                <BarChart3 size={22} />
              </div>
            </Link>
            <Link href="/settings">
              <div className="p-3 rounded-full bg-surface-container-high text-on-surface-variant hover:scale-110 active:scale-95 transition-transform">
                <Settings size={22} />
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Expense Timeline */}
      <div className="px-5 space-y-6">
        {groupedExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant opacity-50">
            <List size={56} strokeWidth={1} className="mb-4" />
            <p className="text-lg font-medium">No expenses yet</p>
            <p className="text-sm mt-1">Tap + to add your first expense</p>
          </div>
        ) : (
          groupedExpenses.map(({ dateKey, dateLabel, items, dayTotal }) => (
            <section key={dateKey}>
              {/* Date header with daily total */}
              <div className="flex justify-between items-center px-1 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  {dateLabel}
                </h3>
                <span className="text-xs font-bold tabular-nums text-on-surface-variant">
                  {dayTotal.toFixed(2)}
                </span>
              </div>
              {/* Expense items */}
              <div className="flex flex-col gap-3">
                {items.map((item) => {
                  const category = categories.find(c => c.id === item.categoryId);
                  return (
                    <Link href={`/add?edit=${item.id}`} key={item.id} className="block">
                      <M3Card className="flex items-center gap-4 px-4 py-4 hover:bg-surface-container-high active:scale-[0.98] transition-all">
                        {/* Icon — spans both rows */}
                        <div className="w-11 h-11 rounded-2xl bg-tertiary-container flex items-center justify-center text-[22px] shrink-0 self-center">
                          {category?.emoji || '💰'}
                        </div>
                        {/* Middle: name + time stacked */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[15px] leading-tight truncate">
                            {category?.name || 'Uncategorized'}{item.description ? ` — ${item.description}` : ''}
                          </p>
                          <p className="text-[11px] text-on-surface-variant mt-1">
                            {new Date(item.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {/* Amount — spans both rows */}
                        <span className="font-bold text-base tabular-nums shrink-0 self-center">{item.amount.toFixed(2)}</span>
                      </M3Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>

      {/* FAB */}
      <Link href="/add">
        <FAB icon={<Plus size={24} />} onClick={() => { }} />
      </Link>
    </main>
  );
}
