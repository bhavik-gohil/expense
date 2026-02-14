"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, X, Smile } from "lucide-react";
import { useExpenses } from "@/contexts/ExpenseContext";
import { GlassCard, GlassButton } from "@/components/glass-ui";
import { cn } from "@/lib/utils";

const DEFAULT_QUICK_PICK = ["🍔", "🛒", "🚗", "🏠", "💡", "💊", "🎮", "🎁", "✈️"];
const QUICK_PICK_KEY = "m3_quick_pick_emojis";

export default function ManageTypes() {
    const router = useRouter();
    const { categories, addCategory, deleteCategory } = useExpenses();
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("💰");
    const [isAdding, setIsAdding] = useState(false);
    const [customEmoji, setCustomEmoji] = useState("");
    const [quickPickEmojis, setQuickPickEmojis] = useState<string[]>(DEFAULT_QUICK_PICK);

    useEffect(() => {
        const stored = localStorage.getItem(QUICK_PICK_KEY);
        if (stored) {
            try {
                setQuickPickEmojis(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse stored quick pick emojis", e);
            }
        }
    }, []);

    const saveQuickPick = (newList: string[]) => {
        setQuickPickEmojis(newList);
        localStorage.setItem(QUICK_PICK_KEY, JSON.stringify(newList));
    };

    const addToQuickPick = () => {
        if (!customEmoji || quickPickEmojis.includes(customEmoji)) return;
        const newList = [customEmoji, ...quickPickEmojis].slice(0, 20); 
        saveQuickPick(newList);
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        addCategory({ name: name.trim(), emoji });
        setName("");
        setEmoji("💰");
        setCustomEmoji("");
        setIsAdding(false);
    };

    const handleCustomEmojiInput = (value: string) => {
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

    return (
        <main className="flex min-h-screen flex-col bg-surface text-on-surface pb-40">
            <header
                className="px-6 pt-14 pb-6 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md"
                style={{ backgroundColor: 'rgba(var(--bg-page), 0.8)' }}
            >
                <button onClick={() => router.back()} className="p-2 -mx-2 hover:bg-surface-variant rounded-full active:scale-90 transition-transform">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold">Categories</h1>
                <div className="w-10" />
            </header>

            <div className="px-6 space-y-6">
                {!isAdding ? (
                    <GlassCard
                        onClick={() => setIsAdding(true)}
                        className="flex items-center justify-center gap-2 py-6 border-2 border-dashed border-border-color bg-transparent shadow-none cursor-pointer hover:bg-surface-container"
                    >
                        <Plus size={20} className="text-primary" />
                        <span className="font-semibold text-primary">New Category</span>
                    </GlassCard>
                ) : (
                    <GlassCard className="p-6 space-y-5">
                        <div className="flex justify-between items-center">
                            <h2 className="font-bold text-lg text-text-main">New Category</h2>
                            <button onClick={() => { setIsAdding(false); setCustomEmoji(""); }} className="p-1.5 hover:bg-surface-container rounded-full active:scale-90 transition-transform text-text-muted hover:text-text-main">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAdd} className="space-y-5">
                            <div className="flex flex-col items-center gap-3">
                                <div className="text-5xl p-4 bg-zinc-100 rounded-3xl w-24 h-24 flex items-center justify-center border border-border-color text-text-main transition-all">
                                    {emoji}
                                </div>
                            </div>

                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 block px-1">Quick Pick</span>
                                <div className="grid grid-cols-5 gap-2">
                                    {quickPickEmojis.map(e => (
                                        <button
                                            key={e}
                                            type="button"
                                            onClick={() => { setEmoji(e); setCustomEmoji(""); }}
                                            className={cn(
                                                "w-12 h-12 flex items-center justify-center rounded-2xl text-xl transition-all active:scale-90 border-2",
                                                emoji === e && !customEmoji
                                                    ? "bg-primary/5 border-primary scale-110 shadow-sm"
                                                    : "bg-zinc-100 border-transparent text-text-main hover:bg-zinc-200"
                                            )}
                                        >
                                            {e}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <Smile size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                        <input
                                            type="text"
                                            value={customEmoji}
                                            onChange={(e) => handleCustomEmojiInput(e.target.value)}
                                            placeholder="Add Emoji"
                                            className="w-full bg-surface border border-border-color rounded-2xl p-3 pl-9 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-main placeholder:text-text-muted/50"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addToQuickPick}
                                        disabled={!customEmoji || quickPickEmojis.includes(customEmoji)}
                                        className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center active:scale-90 transition-all disabled:opacity-20"
                                        title="Add to Quick Pick"
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Category name"
                                    className="w-full bg-surface border border-border-color rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-main placeholder:text-text-muted/50"
                                    required
                                />
                            </div>

                            <GlassButton className="w-full py-3">Create</GlassButton>
                        </form>
                    </GlassCard>
                )}

                <div className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">
                        Your Categories
                    </h2>
                    <div className="space-y-2">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex items-center gap-4 py-3 px-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-[24px] shrink-0 self-center text-text-main">
                                    {cat.emoji}
                                </div>
                                <span className="flex-1 font-semibold text-sm">{cat.name}</span>
                                <button
                                    onClick={() => deleteCategory(cat.id)}
                                    className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full active:scale-90 transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
