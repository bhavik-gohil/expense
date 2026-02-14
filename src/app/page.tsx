"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, List, BarChart3, ChevronRight, Settings } from "lucide-react";
import { useExpenses } from "@/contexts/ExpenseContext";
import { GlassCard, GlassFAB } from "@/components/glass-ui";

export default function Home() {
  const router = useRouter();
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
    <main className="flex min-h-screen flex-col bg-surface text-on-surface pb-40">
      {/* Header */}
      <header className="px-6 pt-14 pb-8 sticky top-0 bg-page/90 backdrop-blur-sm z-10  transition-all">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">{monthLabel}</p>
            <p className="text-5xl font-extrabold tracking-tight text-text-main">{currentMonthTotal.toFixed(2)}</p>
          </div>
          <div className="w-12 h-12 bg-surface rounded-2xl border border-border-color flex items-center justify-center">
            <img src="/favicon.ico" alt="Logo" className="w-8 h-8 opacity-100" />
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
                    <Link href={`/add?edit=${item.id}`} key={item.id} className="block group">
                      <GlassCard className="flex items-center gap-4 px-5 py-4 group-hover:bg-white/20 dark:group-hover:bg-white/10 transition-colors">
                        {/* Icon — spans both rows */}
                        <div className="w-12 h-12 rounded-2xl bg-text-main/5 flex items-center justify-center text-[24px] shrink-0 self-center shadow-inner text-text-main">
                          {category?.emoji || '💰'}
                        </div>
                        {/* Middle: name + time stacked */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[15px] leading-tight truncate text-text-main">
                            {category?.name || 'Uncategorized'}
                            {item.description && <span className="opacity-70 font-normal"> - {item.description}</span>}
                          </p>
                          <p className="text-[11px] font-bold text-on-surface-variant opacity-60 mt-1 uppercase tracking-wide">
                            {new Date(item.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {/* Amount — spans both rows */}
                        <span className="font-black text-lg tabular-nums shrink-0 self-center tracking-tight text-text-main">{item.amount.toFixed(2)}</span>
                      </GlassCard>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>

      {/* FAB */}
      <GlassFAB icon={<Plus size={24} />} onClick={() => router.push('/add')} />
    </main>
  );
}
