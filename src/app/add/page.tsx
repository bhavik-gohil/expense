"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Trash2, ChevronRight, LayoutGrid, TrendingDown, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";
import { useExpenses } from "@/contexts/ExpenseContext";
import { GlassButton } from "@/components/glass-ui";
import { cn } from "@/lib/utils";

function AddExpenseContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const { expenses, categories, addExpense, updateExpense, deleteExpense } = useExpenses();

    const [formData, setFormData] = useState({
        amount: "",
        categoryId: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        type: 'expense'
    });

    // Derived state for back-compat
    const isEditing = !!editId;

    useEffect(() => {
        if (editId) {
            const expense = expenses.find((e) => e.id === editId);
            if (expense) {
                setFormData({
                    amount: expense.amount.toString(),
                    categoryId: expense.categoryId,
                    description: expense.description,
                    date: expense.date,
                    type: 'expense'
                });
            }
        }
    }, [editId, expenses]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.categoryId || !formData.amount) return;

        const data = {
            amount: parseFloat(formData.amount),
            categoryId: formData.categoryId,
            description: formData.description,
            date: formData.date,
        };

        if (editId) {
            updateExpense(editId, data);
        } else {
            addExpense(data);
        }
        router.push("/");
    };

    const handleDelete = () => {
        if (editId && confirm("Delete this expense?")) {
            deleteExpense(editId);
            router.push("/");
        }
    };

    return (
        <main className="flex min-h-screen flex-col bg-surface text-on-surface pb-40">
            <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-surface/80 backdrop-blur-md z-10">
                <button onClick={() => router.back()} className="p-2 -mx-2 hover:bg-surface-variant rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-medium">{editId ? "Edit Expense" : "New Expense"}</h1>
                {editId ? (
                    <button onClick={handleDelete} className="p-2 text-error hover:bg-error/10 rounded-full">
                        <Trash2 size={24} />
                    </button>
                ) : (
                    <div className="w-10" />
                )}
            </header>

            <form onSubmit={handleSubmit} className="px-6 space-y-8">
                <div className="text-center py-8">
                    <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        autoFocus
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full text-center text-5xl font-bold bg-transparent outline-none placeholder:opacity-20 text-text-main"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full bg-surface border border-border-color rounded-2xl py-3 pl-12 pr-4 font-medium outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 text-text-main dark:[color-scheme:dark]"
                        />
                    </div>
                    <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Add a note..."
                        className="w-full bg-surface border border-border-color rounded-2xl py-3 px-4 font-medium outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 placeholder:text-text-muted/50 text-text-main"
                    />
                </div>

                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant px-1">Category</h2>
                        <Link href="/types" className="text-primary text-sm font-medium flex items-center gap-1 px-1">
                            <LayoutGrid size={16} />
                            <span>Manage</span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                                className={cn(
                                    "flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl transition-all cursor-pointer",
                                    formData.categoryId === cat.id
                                        ? "bg-secondary-container text-on-secondary-container scale-105 shadow-md ring-2 ring-secondary"
                                        : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                                )}
                            >
                                <span className="text-3xl">{cat.emoji}</span>
                                <span className="text-[10px] font-semibold truncate w-full text-center leading-tight">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </section>



                <div className="flex gap-3">
                    <GlassButton type="submit" className="flex-1 text-base">
                        {isEditing ? 'Update' : 'Add'}
                    </GlassButton>
                </div>
            </form>
        </main>
    );
}

export default function AddExpense() {
    return (
        <Suspense>
            <AddExpenseContent />
        </Suspense>
    );
}
