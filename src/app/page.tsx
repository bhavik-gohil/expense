"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { Plus, List, BarChart3, ChevronRight } from "lucide-react";
import { useExpenses, FilterPeriod } from "@/contexts/ExpenseContext";
import { M3Card, M3Chip, FAB } from "@/components/m3-ui";

export default function Home() {
  const { filteredExpenses, totalForPeriod, filterPeriod, setFilterPeriod, categories } = useExpenses();

  const groupedExpenses = useMemo(() => {
    const groups: Record<string, typeof filteredExpenses> = {};
    filteredExpenses.forEach(expense => {
      const date = new Date(expense.date).toLocaleDateString(undefined, {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(expense);
    });
    return Object.entries(groups);
  }, [filteredExpenses]);

  const periods: { label: string; value: FilterPeriod }[] = [
    { label: "1 Day", value: "1" },
    { label: "7 Days", value: "7" },
    { label: "30 Days", value: "30" },
    { label: "Monthly", value: "monthly" },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-surface text-on-surface pb-24">
      {/* Top App Bar / Header */}
      <header className="px-6 pt-12 pb-6 sticky top-0 bg-surface/80 backdrop-blur-md z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-sm font-medium text-on-surface-variant">Total Spending</h1>
            <p className="text-4xl font-bold tracking-tight">${totalForPeriod.toFixed(2)}</p>
          </div>
          <Link href="/stats">
            <div className="p-3 rounded-full bg-secondary-container text-on-secondary-container hover:scale-110 transition-transform">
              <BarChart3 size={24} />
            </div>
          </Link>
        </div>

        {/* Period Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
          {periods.map((p) => (
            <M3Chip
              key={p.value}
              label={p.label}
              active={filterPeriod === p.value}
              onClick={() => setFilterPeriod(p.value)}
            />
          ))}
        </div>
      </header>

      {/* Timeline List */}
      <div className="px-4 space-y-8">
        {groupedExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant opacity-60">
            <List size={48} strokeWidth={1} className="mb-4" />
            <p>No expenses for this period</p>
          </div>
        ) : (
          groupedExpenses.map(([date, items]) => (
            <section key={date}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-2 mb-4">
                {date}
              </h3>
              <div className="space-y-2">
                {items.map((item) => {
                  const category = categories.find(c => c.id === item.categoryId);
                  return (
                    <Link href={`/add?edit=${item.id}`} key={item.id}>
                      <M3Card className="flex items-center gap-4 py-4 hover:bg-surface-container-high transition-colors">
                        <div className="w-12 h-12 rounded-2xl bg-tertiary-container flex items-center justify-center text-2xl">
                          {category?.emoji || '💰'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{category?.name || 'Uncategorized'}</p>
                          {item.description && (
                            <p className="text-sm text-on-surface-variant truncate">{item.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">${item.amount.toFixed(2)}</p>
                        </div>
                        <ChevronRight size={16} className="text-on-surface-variant opacity-40" />
                      </M3Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <Link href="/add">
        <FAB icon={<Plus size={24} />} onClick={() => { }} />
      </Link>
    </main>
  );
}
