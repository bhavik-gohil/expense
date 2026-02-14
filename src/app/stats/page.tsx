"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, TrendingUp, PieChart as PieIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { useExpenses } from "@/contexts/ExpenseContext";
import { GlassCard } from "@/components/glass-ui";
import { cn } from "@/lib/utils";

const CHART_COLORS = [
    "#7C4DFF", "#FF6D00", "#00BFA5", "#F50057",
    "#6200EA", "#FFD600", "#00B0FF", "#C51162",
    "#AA00FF", "#64DD17", "#DD2C00", "#304FFE",
];

export default function Stats() {
    const router = useRouter();
    const { expenses, categories } = useExpenses();

    // Month navigator state
    const [monthOffset, setMonthOffset] = useState(0);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const dateStripRef = useRef<HTMLDivElement>(null);

    const selectedMonth = useMemo(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - monthOffset);
        return d;
    }, [monthOffset]);

    // Reset selected day when month changes
    useEffect(() => { setSelectedDay(null); }, [monthOffset]);

    const monthLabel = selectedMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

    // Days in the selected month with padding for grid alignment
    const calendarData = useMemo(() => {
        const y = selectedMonth.getFullYear();
        const m = selectedMonth.getMonth();
        const firstDay = new Date(y, m, 1).getDay(); // 0 = Sun, 1 = Mon...
        const daysInMonth = new Date(y, m + 1, 0).getDate();
        const today = new Date();

        const days = [];
        // Add empty slots for days before the 1st
        for (let i = 0; i < firstDay; i++) {
            days.push({ day: null, fullDate: null, isToday: false });
        }
        // Add actual days
        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(y, m, i);
            days.push({
                day: i,
                fullDate: d,
                isToday: d.toDateString() === today.toDateString()
            });
        }
        return days;
    }, [selectedMonth]);

    // Filter expenses for the selected month (and optionally day)
    const monthExpenses = useMemo(() => {
        const m = selectedMonth.getMonth();
        const y = selectedMonth.getFullYear();
        return expenses.filter(e => {
            const d = new Date(e.date);
            if (d.getMonth() !== m || d.getFullYear() !== y) return false;
            if (selectedDay !== null && d.getDate() !== selectedDay) return false;
            return true;
        });
    }, [expenses, selectedMonth, selectedDay]);

    const monthTotal = useMemo(() => monthExpenses.reduce((s, e) => s + e.amount, 0), [monthExpenses]);

    // Category breakdown
    const chartData = useMemo(() => {
        const map: Record<string, { name: string; emoji: string; value: number }> = {};
        monthExpenses.forEach(exp => {
            const cat = categories.find(c => c.id === exp.categoryId);
            const name = cat?.name || 'Other';
            const emoji = cat?.emoji || '💰';
            if (!map[name]) map[name] = { name, emoji, value: 0 };
            map[name].value += exp.amount;
        });
        return Object.values(map).sort((a, b) => b.value - a.value);
    }, [monthExpenses, categories]);

    // Month-on-month trend (last 6 months from selected)
    const momData = useMemo(() => {
        const months: { month: string; amount: number; sortKey: string }[] = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(selectedMonth);
            d.setMonth(d.getMonth() - i);
            const m = d.getMonth();
            const y = d.getFullYear();
            const total = expenses
                .filter(e => {
                    const ed = new Date(e.date);
                    return ed.getMonth() === m && ed.getFullYear() === y;
                })
                .reduce((s, e) => s + e.amount, 0);
            months.push({
                month: d.toLocaleDateString(undefined, { month: 'short' }),
                amount: total,
                sortKey: `${y}-${String(m + 1).padStart(2, '0')}`,
            });
        }
        return months;
    }, [expenses, selectedMonth]);



    return (
        <main className="flex min-h-screen flex-col bg-surface text-on-surface pb-40 max-w-[100vw] overflow-x-hidden">
            {/* Header */}
            <header className="px-6 pt-14 pb-2 flex items-center gap-4 sticky top-0 bg-transparent backdrop-blur-md z-10">
                <button onClick={() => router.back()} className="p-2 -mx-2 hover:bg-surface-variant rounded-full active:scale-90 transition-transform">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold">Statistics</h1>
            </header>

            {/* Month Navigator — Meow style */}
            <div className="flex items-center justify-between px-6 py-4">
                <button
                    onClick={() => setMonthOffset(p => p + 1)}
                    className="p-2 rounded-full hover:bg-surface-container-high active:scale-90 transition-all"
                >
                    <ChevronLeft size={22} />
                </button>
                <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-wider">{monthLabel}</p>
                    <p className="text-3xl font-extrabold mt-1 tabular-nums">{monthTotal.toFixed(2)}</p>
                </div>
                <button
                    onClick={() => setMonthOffset(p => Math.max(0, p - 1))}
                    className="p-2 rounded-full hover:bg-surface-container-high active:scale-90 transition-all"
                    disabled={monthOffset === 0}
                >
                    <ChevronRight size={22} className={monthOffset === 0 ? 'opacity-20' : ''} />
                </button>
            </div>

            {/* Calendar Grid — Meow style */}
            <div className="px-6 pb-6 w-full">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-2 text-center">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                        <span key={d} className="text-[10px] font-bold text-on-surface-variant opacity-50">
                            {d}
                        </span>
                    ))}
                </div>
                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-y-2 gap-x-1">
                    {calendarData.map((item, index) => {
                        if (!item.day) return <div key={`empty-${index}`} />;

                        const isSelected = selectedDay === item.day;

                        return (
                            <button
                                key={item.day}
                                onClick={() => setSelectedDay(prev => prev === item.day ? null : item.day)}
                                className={cn(
                                    "flex items-center justify-center h-10 rounded-xl transition-all relative text-sm font-medium",
                                    isSelected
                                        ? "bg-primary text-on-primary font-bold shadow-md scale-105 z-10"
                                        : item.isToday
                                            ? "bg-secondary-container text-on-secondary-container font-bold"
                                            : "hover:bg-surface-container-high text-on-surface"
                                )}
                            >
                                {item.day}
                                {isSelected && (
                                    <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-on-primary" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="px-6 space-y-6">
                {chartData.length === 0 ? (
                    <GlassCard className="py-20 flex flex-col items-center justify-center opacity-40">
                        <PieIcon size={48} strokeWidth={1} className="mb-4" />
                        <p className="font-medium">No expenses this month</p>
                    </GlassCard>
                ) : (
                    <>
                        {/* Donut Chart with total in center */}
                        <GlassCard className="p-6">
                            <div className="relative h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            innerRadius="60%"
                                            outerRadius="85%"
                                            paddingAngle={3}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {chartData.map((_, i) => (
                                                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgb(var(--card-bg))',
                                                border: '1px solid rgb(var(--border-color))',
                                                borderRadius: '12px',
                                                color: 'rgb(var(--text-main))',
                                                fontSize: '13px',
                                            }}
                                            formatter={(value: number) => [value.toFixed(2), '']}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center label */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Total</span>
                                    <span className="text-xl font-extrabold tabular-nums">{monthTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </GlassCard>

                        {/* Category Breakdown List */}
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3 px-1">Breakdown</h2>
                            <div className="flex flex-col gap-2">
                                {chartData.map((item, i) => {
                                    const pct = monthTotal > 0 ? (item.value / monthTotal) * 100 : 0;
                                    return (
                                        <GlassCard key={item.name} className="p-4 flex flex-col gap-3">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-inner"
                                                    style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] + '40' }}
                                                >
                                                    {item.emoji}
                                                </div>
                                                <span className="font-bold text-sm flex-1 truncate">{item.name}</span>
                                                <span className="text-xs font-bold text-text-muted">{pct.toFixed(0)}%</span>
                                                <span className="font-black text-sm tabular-nums">{item.value.toFixed(2)}</span>
                                            </div>
                                            {/* Percentage bar */}
                                            <div className="h-2 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden shadow-inner">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500 shadow-sm"
                                                    style={{
                                                        width: `${pct}%`,
                                                        backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                                                    }}
                                                />
                                            </div>
                                        </GlassCard>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Month-on-Month Trend */}
                        <GlassCard className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted">6-Month Trend</h2>
                                <TrendingUp size={16} className="text-primary" />
                            </div>
                            <div className="h-44">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={momData} barCategoryGap="25%">
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 11, fontWeight: 700, fill: 'rgb(var(--text-muted))' }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(var(--primary), 0.06)' }}
                                            contentStyle={{
                                                backgroundColor: 'rgb(var(--card-bg))',
                                                border: '1px solid rgb(var(--border-color))',
                                                borderRadius: '12px',
                                                color: 'rgb(var(--text-main))',
                                                fontSize: '13px',
                                            }}
                                            formatter={(value: number) => [value.toFixed(2), 'Spent']}
                                        />
                                        <Bar dataKey="amount" fill="rgb(var(--primary))" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </GlassCard>
                    </>
                )}
            </div>
        </main>
    );
}
