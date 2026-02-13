"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PieChart as PieIcon, TrendingUp, Calendar, ChevronDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useExpenses } from "@/contexts/ExpenseContext";
import { M3Card, M3Chip } from "@/components/m3-ui";

export default function Stats() {
    const router = useRouter();
    const { filteredExpenses, expenses, categories, filterPeriod, setFilterPeriod, customRange, setCustomRange } = useExpenses();
    const [showRangePicker, setShowRangePicker] = useState(false);

    const chartData = useMemo(() => {
        const data: Record<string, { name: string; value: number; color: string }> = {};
        const colors = [
            'rgb(var(--m3-primary))',
            'rgb(var(--m3-secondary))',
            'rgb(var(--m3-tertiary))',
            'rgb(var(--m3-on-primary-container))',
            'rgb(var(--m3-on-secondary-container))',
            'rgb(var(--m3-on-tertiary-container))'
        ];

        filteredExpenses.forEach((exp) => {
            const cat = categories.find(c => c.id === exp.categoryId);
            const name = cat?.name || 'Other';
            if (!data[name]) {
                data[name] = { name, value: 0, color: colors[Object.keys(data).length % colors.length] };
            }
            data[name].value += exp.amount;
        });

        return Object.values(data).sort((a, b) => b.value - a.value);
    }, [filteredExpenses, categories]);

    const momData = useMemo(() => {
        const data: Record<string, { month: string; amount: number; sortKey: string }> = {};
        expenses.forEach(exp => {
            const date = new Date(exp.date);
            const monthLabel = date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
            const sortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!data[sortKey]) data[sortKey] = { month: monthLabel, amount: 0, sortKey };
            data[sortKey].amount += exp.amount;
        });

        return Object.values(data)
            .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
            .slice(-6); // Last 6 months
    }, [expenses]);

    return (
        <main className="flex min-h-screen flex-col bg-surface text-on-surface pb-12">
            <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-surface/80 backdrop-blur-md z-10">
                <button onClick={() => router.back()} className="p-2 -mx-2 hover:bg-surface-variant rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-medium">Analytics</h1>
                <div className="w-10" />
            </header>

            <div className="px-6 space-y-6">
                {/* Period Selectors */}
                <div className="space-y-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {['monthly', '7', '30', 'custom'].map((p) => (
                            <M3Chip
                                key={p}
                                label={p === 'monthly' ? 'Current Month' : p === 'custom' ? 'Custom Range' : `${p} Days`}
                                active={filterPeriod === p}
                                onClick={() => {
                                    setFilterPeriod(p as any);
                                    if (p === 'custom') setShowRangePicker(true);
                                    else setShowRangePicker(false);
                                }}
                            />
                        ))}
                    </div>

                    {(showRangePicker || filterPeriod === 'custom') && (
                        <M3Card className="p-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Select Range</h3>
                                <Calendar size={18} className="text-primary" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-1">
                                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">From</span>
                                    <input
                                        type="date"
                                        value={customRange?.start || ''}
                                        onChange={(e) => setCustomRange({ start: e.target.value, end: customRange?.end || e.target.value })}
                                        className="w-full bg-surface-container-high rounded-xl p-3 text-sm outline-none"
                                    />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">To</span>
                                    <input
                                        type="date"
                                        value={customRange?.end || ''}
                                        onChange={(e) => setCustomRange({ start: customRange?.start || e.target.value, end: e.target.value })}
                                        className="w-full bg-surface-container-high rounded-xl p-3 text-sm outline-none"
                                    />
                                </div>
                            </div>
                        </M3Card>
                    )}
                </div>

                {chartData.length === 0 ? (
                    <M3Card className="py-20 flex flex-col items-center justify-center opacity-40">
                        <PieIcon size={48} strokeWidth={1} className="mb-4" />
                        <p>No data for this period</p>
                    </M3Card>
                ) : (
                    <>
                        {/* Breakdown Chart */}
                        <M3Card className="p-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-6">
                                Category Breakdown
                            </h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgb(var(--m3-surface-container-high))',
                                                border: 'none',
                                                borderRadius: '16px',
                                                color: 'rgb(var(--m3-on-surface))'
                                            }}
                                            formatter={(value: number) => [value.toFixed(2), '']}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-4 mt-8">
                                {chartData.map((item) => (
                                    <div key={item.name} className="flex items-center gap-4 py-1">
                                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-sm font-medium flex-1">{item.name}</span>
                                        <span className="text-sm font-bold tracking-tight">{item.value.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </M3Card>

                        {/* Month on Month Trend */}
                        <M3Card className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                                    Month on Month
                                </h2>
                                <TrendingUp size={18} className="text-primary" />
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={momData}>
                                        <XAxis dataKey="month" hide />
                                        <YAxis hide />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(var(--m3-primary), 0.05)' }}
                                            contentStyle={{
                                                backgroundColor: 'rgb(var(--m3-surface-container-high))',
                                                border: 'none',
                                                borderRadius: '12px'
                                            }}
                                            formatter={(value: number) => [value.toFixed(2), 'Spending']}
                                        />
                                        <Bar dataKey="amount" fill="rgb(var(--m3-primary))" radius={[12, 12, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-between mt-4 px-2">
                                {momData.map(d => (
                                    <span key={d.sortKey} className="text-[10px] font-bold text-on-surface-variant">
                                        {d.month}
                                    </span>
                                ))}
                            </div>
                        </M3Card>
                    </>
                )}
            </div>
        </main>
    );
}
