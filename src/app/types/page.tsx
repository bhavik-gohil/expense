"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Plus, Trash2, X } from "lucide-react";
import { useExpenses } from "@/contexts/ExpenseContext";
import { GlassCard, GlassButton } from "@/components/glass-ui";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/CategoryIcon";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableCategoryProps {
    category: any;
    selected: boolean;
    onSelect: (id: string) => void;
}

function SortableCategory({ category, selected, onSelect }: SortableCategoryProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: category.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "flex flex-col items-center justify-center rounded-3xl cursor-pointer border-2 border-transparent w-24 h-24",
                selected
                    ? "border-2 border-zinc-400 border-dotted"
                    : "hover:bg-text-main/5"
            )}
            onClick={() => onSelect(category.id)}
        >
            <CategoryIcon emoji={category.emoji} />
            <span className="mt-2 text-[10px] font-semibold truncate w-full text-center leading-tight">
                {category.name}
            </span>
        </div>
    );
}

export default function ManageTypes() {
    const router = useRouter();
    const { categories, addCategory, updateCategory, deleteCategory, reorderCategories } = useExpenses();
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("");
    const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 12,
            },
        }),

    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !emoji.trim()) return;

        const emojiRegex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;
        const matches = emoji.match(emojiRegex);
        const finalEmoji = (matches && matches.length > 0) ? matches[0] : emoji.charAt(0);

        if (formMode === 'edit' && selectedId) {
            updateCategory(selectedId, { name: name.trim(), emoji: finalEmoji });
        } else {
            addCategory({ name: name.trim(), emoji: finalEmoji });
        }
        setName("");
        setEmoji("");
        setFormMode(null);
        setSelectedId(null);
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (over && active.id !== over.id) {
            const oldIndex = categories.findIndex((cat) => cat.id === active.id);
            const newIndex = categories.findIndex((cat) => cat.id === over.id);
            const newOrder = arrayMove(categories, oldIndex, newIndex).map(c => c.id);
            reorderCategories(newOrder);
        }
    };

    const handleSelect = (id: string) => {
        setSelectedId(prev => prev === id ? null : id);
        setFormMode(null);
    };

    const handleDelete = () => {
        if (selectedId) {
            deleteCategory(selectedId);
            setSelectedId(null);
            setFormMode(null);
        }
    };

    const handleStartEdit = () => {
        if (!selectedId) return;
        const cat = categories.find(c => c.id === selectedId);
        if (!cat) return;
        setName(cat.name);
        setEmoji(cat.emoji);
        setFormMode('edit');
    };

    const handleCloseForm = () => {
        setFormMode(null);
        setName("");
        setEmoji("");
        if (formMode === 'edit') setSelectedId(null);
    };

    return (
        <main className="flex min-h-screen flex-col bg-surface text-on-surface pb-40">
            <header
                className="px-6 py-6 grid grid-cols-3 grid-flow-col items-center sticky top-0 z-10 bg-surface/80 backdrop-blur-sm"
            >
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="p-3 -mx-2 minimal-card rounded-full active:scale-90 transition-transform">
                        <ArrowLeft size={24} />
                    </button>
                </div>
                <div className="flex justify-center">
                    <h1 className="text-xl font-bold">Categories</h1>
                </div>
                <div className="-mx-2 flex justify-end gap-2">
                </div>
            </header>

            <div className="px-6 py-4 space-y-6">
                {formMode === null ? (
                    <GlassCard
                        onClick={() => {
                            setFormMode('create');
                            setSelectedId(null);
                        }}
                        className="flex items-center justify-center gap-2 py-3 rounded-3xl"
                    >
                        <Plus size={20} className="text-primary" />
                        <span className="font-semibold text-md tracking-widest text-primary">New Category</span>
                    </GlassCard>
                ) : (
                    <GlassCard className="p-6 pt-4 space-y-5 animate-in slide-in-from-top duration-300">
                        <div className="flex justify-between items-center">
                            <span className="text-md font-semibold">{formMode === 'edit' ? 'Edit Category' : 'New Category'}</span>
                            <button onClick={handleCloseForm} className="p-4 -mx-1 minimal-card rounded-full active:scale-90 transition-transform">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-4 gap-3">
                                <div className="col-span-1">
                                    <input
                                        type="text"
                                        value={emoji}
                                        onChange={(e) => setEmoji(e.target.value)}
                                        placeholder="💰"
                                        className="w-full bg-zinc-50 border rounded-3xl py-2 text-center outline-none transition-all"
                                        required
                                        maxLength={10}
                                    />
                                </div>
                                <div className="col-span-3">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Category name"
                                        className="w-full bg-zinc-50 border rounded-3xl py-2 text-center outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <GlassButton className="w-full py-3 rounded-[2rem] text-sm tracking-widest mt-2">
                                {formMode === 'edit' ? 'Save' : 'Create'}
                            </GlassButton>
                        </form>
                    </GlassCard>
                )}

                <div className="space-y-4">
                    <div className="flex justify-between items-center h-4 my-10 px-2">
                        <p className="text-[10px] font-medium text-text-muted opacity-70 uppercase tracking-widest">
                            Hold and drag to reorder
                        </p>

                        <div className="flex gap-2">
                            {selectedId && (
                                <>
                                    <button
                                        onClick={handleStartEdit}
                                        className="p-3 minimal-card text-primary rounded-full active:scale-90 transition-transform"
                                    >
                                        <Pencil size={24} />
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="p-3 minimal-card text-red-500 rounded-full active:scale-90 transition-transform"
                                    >
                                        <Trash2 size={24} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragCancel={() => setActiveId(null)}
                    >
                        <SortableContext
                            items={categories.map(c => c.id)}
                            strategy={rectSortingStrategy}
                        >
                            <div className="grid grid-cols-3 justify-items-center gap-1">
                                {categories.map(cat => (
                                    <SortableCategory
                                        key={cat.id}
                                        category={cat}
                                        selected={selectedId === cat.id}
                                        onSelect={handleSelect}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                        <DragOverlay adjustScale={true} dropAnimation={{
                            sideEffects: defaultDropAnimationSideEffects({
                                styles: {
                                    active: {
                                        opacity: '0.5',
                                    },
                                },
                            }),
                        }}>
                            {activeId ? (
                                <div className="flex flex-col items-center gap-1 p-3 rounded-3xl border border-dashed scale-110 transition-transform cursor-grabbing overflow-hidden w-24 bg-surface/90 backdrop-blur-sm">
                                    <CategoryIcon emoji={categories.find(c => c.id === activeId)?.emoji || '💰'} />
                                    <span className="text-[10px] truncate w-full text-center tracking-tighter">
                                        {categories.find(c => c.id === activeId)?.name}
                                    </span>
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </div>
            </div>


        </main>
    );
}
