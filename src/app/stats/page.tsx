"use client";
import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PieChart as PieIcon, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useExpenses } from "@/contexts/ExpenseContext";
import { M3Card, M3Chip } from "@/components/m3-ui";

export default function Stats() {
    const router = useRouter();
    const { filteredExpenses, categories, filterPeriod, setFilterPeriod } = useExpenses();

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

        filteredExpenses.forEach((exp, i) => {
            const cat = categories.find(c => c.id === exp.categoryId);
            const name = cat?.name || 'Other';
            if (!data[name]) {
                data[name] = { name, value: 0, color: colors[Object.keys(data).length % colors.length] };
            }
            data[name].value += exp.amount;
        });

        return Object.values(data);
    }, [filteredExpenses, categories]);

    const trendData = useMemo(() => {
        // Simple trend by date
        const data: Record<string, { date: string; amount: number }> = {};
        filteredExpenses.forEach(exp => {
            const date = new Date(exp.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            if (!data[date]) data[date] = { date, amount: 0 };
            data[date].amount += exp.amount;
        });
        return Object.values(data).reverse();
    }, [filteredExpenses]);

    return (
        <main className="flex min-h-screen flex-col bg-surface text-on-surface pb-12">
            <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-surface/80 backdrop-blur-md z-10">
                <button onClick={() => router.back()} className="p-2 -mx-2 hover:bg-surface-variant rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-medium">Statistics</h1>
                <div className="w-10" />
            </header>

            <div className="px-6 space-y-6">
                {/* Period Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {['1', '7', '30', 'monthly'].map((p) => (
                        <M3Chip
                            key={p}
                            label={p === 'monthly' ? 'Monthly' : `${p} Days`}
                            active={filterPeriod === p}
                            onClick={() => setFilterPeriod(p as any)}
                        />
                    ))}
                </div>

                {chartData.length === 0 ? (
                    <M3Card className="py-20 flex flex-col items-center justify-center opacity-40">
                        <PieIcon size={48} strokeWidth={1} className="mb-4" />
                        <p>No data to visualize</p>
                    </M3Card>
                ) : (
                    <>
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
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-3 mt-6">
                                {chartData.map((item) => (
                                    <div key={item.name} className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-sm font-medium flex-1">{item.name}</span>
                                        <span className="text-sm font-bold">${item.value.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </M3Card>

                        <M3Card className="p-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-6">
                                Spending Trend
                            </h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={trendData}>
                                        <XAxis dataKey="date" hide />
                                        <YAxis hide />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{
                                                backgroundColor: 'rgb(var(--m3-surface-container-high))',
                                                border: 'none',
                                                borderRadius: '12px'
                                            }}
                                        />
                                        <Bar dataKey="amount" fill="rgb(var(--m3-primary))" radius={[12, 12, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex items-center gap-2 mt-4 text-xs text-on-surface-variant italic">
                                <TrendingUp size={14} />
                                <span>Recent spending patterns</span>
                            </div>
                        </M3Card>
                    </>
                )}
            </div>
        </main>
    );
}
