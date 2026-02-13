"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";

export interface Category {
    id: string;
    name: string;
    emoji: string;
    isCustom: boolean;
}

export interface Expense {
    id: string;
    amount: number;
    categoryId: string;
    description: string;
    date: string; // ISO string YYYY-MM-DD
    timestamp: number;
}

export type FilterPeriod = '1' | '7' | '30' | 'monthly' | 'custom';

interface ExpenseContextType {
    expenses: Expense[];
    categories: Category[];
    filterPeriod: FilterPeriod;
    customRange: { start: string; end: string } | null;
    setFilterPeriod: (period: FilterPeriod) => void;
    setCustomRange: (range: { start: string; end: string } | null) => void;
    addExpense: (expense: Omit<Expense, 'id' | 'timestamp'>) => void;
    updateExpense: (id: string, updates: Partial<Expense>) => void;
    deleteExpense: (id: string) => void;
    addCategory: (category: Omit<Category, 'id' | 'isCustom'>) => void;
    deleteCategory: (id: string) => void;
    filteredExpenses: Expense[];
    totalForPeriod: number;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const EXPENSES_KEY = 'm3_expenses';
const CATEGORIES_KEY = 'm3_categories';

const DEFAULT_CATEGORIES: Category[] = [
    { id: '1', name: 'Food', emoji: '🍔', isCustom: false },
    { id: '2', name: 'Transport', emoji: '🚗', isCustom: false },
    { id: '3', name: 'Shopping', emoji: '🛍️', isCustom: false },
    { id: '4', name: 'Health', emoji: '💊', isCustom: false },
    { id: '5', name: 'Entertainment', emoji: '🎬', isCustom: false },
    { id: '6', name: 'Bills', emoji: '🧾', isCustom: false },
];

export function ExpenseProvider({ children }: { children: ReactNode }) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
    const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('7');
    const [customRange, setCustomRange] = useState<{ start: string; end: string } | null>(null);

    useEffect(() => {
        const storedExpenses = localStorage.getItem(EXPENSES_KEY);
        const storedCategories = localStorage.getItem(CATEGORIES_KEY);

        if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
        if (storedCategories) {
            const parsed = JSON.parse(storedCategories);
            setCategories([...DEFAULT_CATEGORIES, ...parsed]);
        }
    }, []);

    const saveExpenses = (newExpenses: Expense[]) => {
        setExpenses(newExpenses);
        localStorage.setItem(EXPENSES_KEY, JSON.stringify(newExpenses));
    };

    const saveCategories = (newCategories: Category[]) => {
        const customOnly = newCategories.filter(c => c.isCustom);
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(customOnly));
        setCategories(newCategories);
    };

    const addExpense = (expense: Omit<Expense, 'id' | 'timestamp'>) => {
        const newExpense: Expense = {
            ...expense,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
        };
        saveExpenses([newExpense, ...expenses]);
    };

    const updateExpense = (id: string, updates: Partial<Expense>) => {
        saveExpenses(expenses.map(e => e.id === id ? { ...e, ...updates } : e));
    };

    const deleteExpense = (id: string) => {
        saveExpenses(expenses.filter(e => e.id !== id));
    };

    const addCategory = (category: Omit<Category, 'id' | 'isCustom'>) => {
        const newCategory: Category = {
            ...category,
            id: crypto.randomUUID(),
            isCustom: true,
        };
        saveCategories([...categories, newCategory]);
    };

    const deleteCategory = (id: string) => {
        // Deleting category does not delete expenses (requirement)
        saveCategories(categories.filter(c => c.id !== id || !c.isCustom));
    };

    const filteredExpenses = useMemo(() => {
        const now = new Date();
        now.setHours(23, 59, 59, 999);

        return expenses.filter(expense => {
            const expDate = new Date(expense.date);

            if (filterPeriod === 'custom' && customRange) {
                return expDate >= new Date(customRange.start) && expDate <= new Date(customRange.end);
            }

            if (filterPeriod === 'monthly') {
                return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
            }

            const diffDays = (now.getTime() - expDate.getTime()) / (1000 * 60 * 60 * 24);
            return diffDays <= parseInt(filterPeriod);
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [expenses, filterPeriod, customRange]);

    const totalForPeriod = useMemo(() => {
        return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    }, [filteredExpenses]);

    return (
        <ExpenseContext.Provider value={{
            expenses, categories, filterPeriod, customRange,
            setFilterPeriod, setCustomRange, addExpense, updateExpense,
            deleteExpense, addCategory, deleteCategory, filteredExpenses, totalForPeriod
        }}>
            {children}
        </ExpenseContext.Provider>
    );
}

export function useExpenses() {
    const context = useContext(ExpenseContext);
    if (!context) throw new Error('useExpenses must be used within ExpenseProvider');
    return context;
}
