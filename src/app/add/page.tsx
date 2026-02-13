"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Trash2, ChevronRight, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useExpenses } from "@/contexts/ExpenseContext";
import { M3Card, M3Button } from "@/components/m3-ui";
import { cn } from "@/lib/utils";

export default function AddExpense() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const { expenses, categories, addExpense, updateExpense, deleteExpense } = useExpenses();

    const [amount, setAmount] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    useEffect(() => {
        if (editId) {
            const expense = expenses.find((e) => e.id === editId);
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
                    <button onClick={handleDelete} className="p-2 text-error hover:bg-error/10 rounded-full">
                        <Trash2 size={24} />
                    </button>
                ) : (
                    <div className="w-10" />
                )}
            </header>

            <form onSubmit={handleSubmit} className="px-6 space-y-8">
                {/* Amount Input */}
                <div className="text-center py-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Amount</span>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        autoFocus
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full text-center text-6xl font-bold bg-transparent outline-none placeholder:opacity-20"
                        required
                    />
                </div>

                {/* Category Selection */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Category</h2>
                        <Link href="/types" className="text-primary text-sm font-medium flex items-center gap-1">
                            <LayoutGrid size={16} />
                            <span>Manage</span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                onClick={() => setCategoryId(cat.id)}
                                className={cn(
                                    "p-4 rounded-3xl flex items-center gap-3 transition-all cursor-pointer border-2",
                                    categoryId === cat.id
                                        ? "bg-secondary-container border-secondary text-on-secondary-container scale-[1.02] shadow-md"
                                        : "bg-surface-container border-transparent hover:bg-surface-container-high text-on-surface"
                                )}
                            >
                                <span className="text-2xl">{cat.emoji}</span>
                                <span className="font-semibold text-sm truncate">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Other Details */}
                <M3Card className="p-4 space-y-4">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">Description</span>
                        <input
                            type="text"
                            placeholder="Lunch with friends..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-surface-container-high rounded-xl p-3 outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">Date</span>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-surface-container-high rounded-xl p-3 outline-none"
                        />
                    </div>
                </M3Card>

                <M3Button className="w-full py-4 text-lg mt-8 shadow-lg">
                    {editId ? "Update Transaction" : "Save Transaction"}
                </M3Button>
            </form>
        </main>
    );
}
