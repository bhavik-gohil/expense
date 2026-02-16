"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Trash2, LayoutGrid, Check, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useExpenses } from "@/contexts/ExpenseContext";
import { GlassButton } from "@/components/glass-ui";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/CategoryIcon";

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
            <form onSubmit={handleSubmit} className="px-6 space-y-8">
                <header
                    className="py-6 grid grid-cols-3 grid-flow-col items-center sticky top-0 z-10 bg-surface/80 backdrop-blur-sm"
                >
                    <div>
                        <button onClick={() => router.back()} className="p-3 -mx-2 shadow rounded-full active:scale-90 transition-transform ">
                            <ArrowLeft size={24} />
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <h1 className="text-xl font-bold">{editId ? "Edit" : "New"}</h1>
                    </div>
                    <div className="-mx-2 flex justify-end gap-2">
                        {editId && (
                            <button className="p-3 shadow text-red-500 rounded-full active:scale-90 transition-transform" onClick={handleDelete}>
                                <Trash2 size={24} />
                            </button>
                        )}
                        <button type="submit" className="p-3 shadow rounded-full active:scale-90 transition-transform">
                            {isEditing ? <CheckCheck size={24} /> : <Check size={24} />}
                        </button>
                    </div>

                </header>

                <div className="text-center py-4">
                    <input
                        type="number"
                        placeholder="0"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full text-center text-5xl font-bold bg-transparent outline-none placeholder:opacity-20 text-text-main"
                        required
                    />
                </div>

                <div className="">
                    <div className="my-3">
                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            // placeholder={formData.date === String(new Date().toISOString().split("T")[0]) ? "Today" : formData.date}
                            className="w-full bg-zinc-50 border border-border-color rounded-3xl py-3 px-4 font-medium outline-none text-text-main"
                        />
                    </div>
                    <div className="my-3">
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Add a note..."
                            className="w-full bg-zinc-50 border border-border-color rounded-3xl py-3 px-4 font-medium outline-none text-text-main"
                        />
                    </div>
                </div>

                <section>
                    <div className="grid grid-cols-3 justify-items-center gap-1">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                                className={cn(
                                    "flex flex-col items-center justify-center rounded-3xl cursor-pointer border-2 border-transparent w-24 h-24",
                                    formData.categoryId === cat.id
                                        ? "border-2 border-zinc-400 border-dotted"
                                        : "hover:bg-text-main/5"
                                )}
                            >
                                <CategoryIcon emoji={cat.emoji} />
                                <span className="mt-2 text-[10px] font-semibold truncate w-full text-center leading-tight">{cat.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center items-end my-4">
                        <Link href="/types" className="text-primary text-sm font-medium flex items-center gap-1 px-1">
                            <LayoutGrid size={16} />
                            <span>Manage Categories</span>
                        </Link>
                    </div>
                </section>
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
