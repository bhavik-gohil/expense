"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, X, Smile } from "lucide-react";
import { useExpenses } from "@/contexts/ExpenseContext";
import { M3Card, M3Button } from "@/components/m3-ui";
import { cn } from "@/lib/utils";

export default function ManageTypes() {
    const router = useRouter();
    const { categories, addCategory, deleteCategory } = useExpenses();
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("💰");
    const [isAdding, setIsAdding] = useState(false);
    const [customEmoji, setCustomEmoji] = useState("");

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        addCategory({ name, emoji });
        setName("");
        setEmoji("💰");
        setCustomEmoji("");
        setIsAdding(false);
    };

    const handleCustomEmojiInput = (value: string) => {
        // Take only the last entered emoji character(s)
        const emojiRegex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;
        const matches = value.match(emojiRegex);
        if (matches && matches.length > 0) {
            const lastEmoji = matches[matches.length - 1];
            setCustomEmoji(lastEmoji);
            setEmoji(lastEmoji);
        } else {
            setCustomEmoji(value);
        }
    };

    const commonEmojis = [
        "🍔", "🚗", "🛍️", "💊", "🎬", "🧾",
        "🏠", "🎁", "✈️", "☕", "🎮", "💪",
        "🐱", "📱", "👕", "🍕", "🎵", "📚",
        "💇", "🏋️", "🚿", "🎂", "🍷", "⛽",
    ];

    return (
        <main className="flex min-h-screen flex-col bg-surface text-on-surface pb-12">
            <header className="px-6 pt-14 pb-6 flex items-center justify-between sticky top-0 bg-surface/80 backdrop-blur-md z-10">
                <button onClick={() => router.back()} className="p-2 -mx-2 hover:bg-surface-variant rounded-full active:scale-90 transition-transform">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold">Expense Types</h1>
                <div className="w-10" />
            </header>

            <div className="px-6 space-y-6">
                {!isAdding ? (
                    <M3Card
                        onClick={() => setIsAdding(true)}
                        className="flex items-center justify-center gap-2 py-6 border-2 border-dashed border-outline/20 bg-transparent shadow-none"
                    >
                        <Plus size={20} className="text-primary" />
                        <span className="font-semibold text-primary">Create New Type</span>
                    </M3Card>
                ) : (
                    <M3Card className="p-6 space-y-5">
                        <div className="flex justify-between items-center">
                            <h2 className="font-bold text-lg">New Category</h2>
                            <button onClick={() => { setIsAdding(false); setCustomEmoji(""); }} className="p-1.5 hover:bg-surface-variant rounded-full active:scale-90 transition-transform">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAdd} className="space-y-5">
                            {/* Emoji preview */}
                            <div className="flex flex-col items-center gap-3">
                                <div className="text-5xl p-4 bg-tertiary-container rounded-3xl w-24 h-24 flex items-center justify-center">
                                    {emoji}
                                </div>
                            </div>

                            {/* Quick pick emojis */}
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block px-1">Quick Pick</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {commonEmojis.map(e => (
                                        <button
                                            key={e}
                                            type="button"
                                            onClick={() => { setEmoji(e); setCustomEmoji(""); }}
                                            className={cn(
                                                "w-10 h-10 flex items-center justify-center rounded-xl text-xl transition-all active:scale-90",
                                                emoji === e && !customEmoji
                                                    ? "bg-secondary-container ring-2 ring-secondary scale-105"
                                                    : "hover:bg-surface-container-high"
                                            )}
                                        >
                                            {e}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom emoji input */}
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block px-1">Or Type Any Emoji</span>
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <Smile size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" />
                                        <input
                                            type="text"
                                            value={customEmoji}
                                            onChange={(e) => handleCustomEmojiInput(e.target.value)}
                                            placeholder="Paste or type emoji…"
                                            className="w-full bg-surface-container rounded-2xl p-3 pl-9 outline-none focus:ring-2 focus:ring-primary text-lg transition-all"
                                        />
                                    </div>
                                    {customEmoji && (
                                        <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-xl shrink-0">
                                            {emoji}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Category name */}
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block px-1">Name</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Groceries"
                                    className="w-full bg-surface-container rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                                    required
                                />
                            </div>

                            <M3Button className="w-full py-3">Create Category</M3Button>
                        </form>
                    </M3Card>
                )}

                <div className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">
                        Your Categories
                    </h2>
                    <div className="space-y-2">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex items-center gap-4 p-4 bg-surface-container rounded-2xl">
                                <span className="text-2xl">{cat.emoji}</span>
                                <span className="flex-1 font-semibold text-sm">{cat.name}</span>
                                {cat.isCustom && (
                                    <button
                                        onClick={() => deleteCategory(cat.id)}
                                        className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full active:scale-90 transition-all"
                                    >
                                        <Trash2 size={18} />
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
