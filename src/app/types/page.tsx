"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import { useExpenses } from "@/contexts/ExpenseContext";
import { M3Card, M3Button } from "@/components/m3-ui";

export default function ManageTypes() {
    const router = useRouter();
    const { categories, addCategory, deleteCategory } = useExpenses();
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("💰");
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        addCategory({ name, emoji });
        setName("");
        setEmoji("💰");
        setIsAdding(false);
    };

    const commonEmojis = ["🍔", "🚗", "🛍️", "💊", "🎬", "🧾", "🏠", "🎁", "✈️", "☕", "🎮", "💪"];

    return (
        <main className="flex min-h-screen flex-col bg-surface text-on-surface">
            <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-surface/80 backdrop-blur-md z-10">
                <button onClick={() => router.back()} className="p-2 -mx-2 hover:bg-surface-variant rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-medium">Expense Types</h1>
                <div className="w-10" />
            </header>

            <div className="px-6 space-y-6">
                {!isAdding ? (
                    <M3Card
                        onClick={() => setIsAdding(true)}
                        className="flex items-center justify-center gap-2 py-6 border-2 border-dashed border-outline/20 bg-transparent shadow-none"
                    >
                        <Plus size={20} className="text-primary" />
                        <span className="font-medium text-primary">Create New Type</span>
                    </M3Card>
                ) : (
                    <M3Card className="p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="font-bold">New Category</h2>
                            <button onClick={() => setIsAdding(false)} className="p-1 hover:bg-surface-variant rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAdd} className="space-y-6">
                            <div className="space-y-4 text-center">
                                <div className="text-5xl p-4 bg-tertiary-container rounded-3xl w-24 h-24 flex items-center justify-center mx-auto">
                                    {emoji}
                                </div>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {commonEmojis.map(e => (
                                        <button
                                            key={e}
                                            type="button"
                                            onClick={() => setEmoji(e)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-variant ${emoji === e ? 'bg-secondary-container' : ''}`}
                                        >
                                            {e}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Category Name"
                                className="w-full bg-surface-container-high border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary"
                                required
                            />

                            <M3Button className="w-full">Create Category</M3Button>
                        </form>
                    </M3Card>
                )}

                <div className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-2">
                        Your Categories
                    </h2>
                    <div className="space-y-2">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex items-center gap-4 p-4 bg-surface-container rounded-2xl">
                                <span className="text-3xl">{cat.emoji}</span>
                                <span className="flex-1 font-medium">{cat.name}</span>
                                {cat.isCustom && (
                                    <button
                                        onClick={() => deleteCategory(cat.id)}
                                        className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
