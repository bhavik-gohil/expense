"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Trash2, Calendar } from "lucide-react";
import { useExpenses } from "@/contexts/ExpenseContext";
import { M3Card, M3Button } from "@/components/m3-ui";

export default function AddExpense() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const { expenses, categories, addExpense, updateExpense, deleteExpense } = useExpenses();

    const [amount, setAmount] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (editId) {
            const expense = expenses.find(e => e.id === editId);
            if (expense) {
                setAmount(expense.amount.toString());
                setCategoryId(expense.categoryId);
                setDescription(expense.description);
                setDate(expense.date);
            }
        }
    }, [editId, expenses]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryId || !amount) return;

        const data = {
            amount: parseFloat(amount),
            categoryId,
            description,
            date,
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
        <main className="flex min-h-screen flex-col bg-surface text-on-surface pb-12">
            <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-surface/80 backdrop-blur-md z-10">
                <button onClick={() => router.back()} className="p-2 -mx-2 hover:bg-surface-variant rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-medium">{editId ? "Edit Expense" : "New Expense"}</h1>
                {editId ? (
                    <button onClick={handleDelete} className="p-2 -mx-2 hover:bg-error-container text-error rounded-full">
                        <Trash2 size={24} />
                    </button>
                ) : <div className="w-10" />}
            </header>

            <form onSubmit={handleSubmit} className="px-6 space-y-6">
                {/* Amount field */}
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="text-sm font-medium text-on-surface-variant mb-2">Amount</div>
                    <div className="flex items-baseline text-6xl font-bold tracking-tight">
                        <span className="text-on-surface-variant mr-1 text-4xl">$</span>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-transparent border-none outline-none w-48 text-center no-spinner"
                            placeholder="0.00"
                            autoFocus
                            required
                        />
                    </div>
                </div>

                {/* Details Card */}
                <M3Card className="space-y-4 p-4">
                    <div className="flex items-center gap-4">
                        <Calendar size={20} className="text-on-surface-variant" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-transparent border-none outline-none flex-1 text-on-surface"
                            required
                        />
                    </div>
                    <div className="h-px bg-outline opacity-20" />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add a description (optional)"
                        className="bg-transparent border-none outline-none w-full resize-none py-2"
                        rows={2}
                    />
                </M3Card>

                {/* Categories */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant px-2">
                            Category
                        </h2>
                        <button
                            type="button"
                            onClick={() => router.push("/types")}
                            className="text-xs font-medium text-primary px-2"
                        >
                            Manage
                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setCategoryId(cat.id)}
                                className={`flex flex-col items-center gap-2 p-2 rounded-2xl transition-all ${categoryId === cat.id
                                        ? "bg-secondary-container text-on-secondary-container scale-105"
                                        : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                                    }`}
                            >
                                <div className="text-2xl">{cat.emoji}</div>
                                <span className="text-[10px] font-medium truncate w-full text-center">
                                    {cat.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-6">
                    <M3Button className="w-full flex items-center justify-center gap-2" variant="filled">
                        <Save size={20} />
                        Save Expense
                    </M3Button>
                </div>
            </form>
        </main>
    );
}
