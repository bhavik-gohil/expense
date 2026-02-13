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
export type ExportFrequency = 'off' | 'daily' | 'weekly' | 'monthly';

interface ExportSettings {
    frequency: ExportFrequency;
    lastExport: number;
}

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
    filteredExpenses: Expense[]; // For Stats Page
    homeExpenses: Expense[]; // Last 3 months for Home Page
    totalForPeriod: number;
    homeTotal: number;
    exportData: (format: 'json' | 'csv') => void;
    exportSettings: ExportSettings;
    setExportSettings: (settings: ExportSettings) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const EXPENSES_KEY = 'm3_expenses';
const CATEGORIES_KEY = 'm3_categories';
const EXPORT_SETTINGS_KEY = 'm3_export_settings';

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
    const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('monthly');
    const [customRange, setCustomRange] = useState<{ start: string; end: string } | null>(null);
    const [exportSettings, setExportSettingsState] = useState<ExportSettings>({ frequency: 'off', lastExport: 0 });

    useEffect(() => {
        const storedExpenses = localStorage.getItem(EXPENSES_KEY);
        const storedCategories = localStorage.getItem(CATEGORIES_KEY);
        const storedExport = localStorage.getItem(EXPORT_SETTINGS_KEY);

        if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
        if (storedCategories) {
            const parsed = JSON.parse(storedCategories);
            setCategories([...DEFAULT_CATEGORIES, ...parsed]);
        }
        if (storedExport) setExportSettingsState(JSON.parse(storedExport));
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

    const setExportSettings = (settings: ExportSettings) => {
        setExportSettingsState(settings);
        localStorage.setItem(EXPORT_SETTINGS_KEY, JSON.stringify(settings));
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

    const exportData = (format: 'json' | 'csv') => {
        let content = '';
        const filename = `expense-tracker-export-${new Date().toISOString().split('T')[0]}`;

        if (format === 'json') {
            content = JSON.stringify({ expenses, categories }, null, 2);
        } else {
            const headers = ['Date', 'Amount', 'Category', 'Description'];
            const rows = expenses.map(e => {
                const cat = categories.find(c => c.id === e.categoryId);
                return [e.date, e.amount, cat?.name || 'Unknown', e.description].join(',');
            });
            content = [headers.join(','), ...rows].join('\n');
        }

        const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.${format}`;
        a.click();
        URL.revokeObjectURL(url);

        setExportSettings({ ...exportSettings, lastExport: Date.now() });
    };

    const filteredExpenses = useMemo(() => {
        const now = new Date();
        // now.setHours(23, 59, 59, 999); // Removed as it's not needed for general filter logic

        return expenses.filter(expense => {
            const expDate = new Date(expense.date);

            if (filterPeriod === 'custom' && customRange) {
                // Ensure custom range end date includes the entire day
                const customEndDate = new Date(customRange.end);
                customEndDate.setHours(23, 59, 59, 999);
                return expDate >= new Date(customRange.start) && expDate <= customEndDate;
            }

            if (filterPeriod === 'monthly') {
                return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
            }

            const diffDays = (now.getTime() - expDate.getTime()) / (1000 * 60 * 60 * 24);
            // For '1', '7', '30' days, we want to include today.
            // expDate should be greater than or equal to (now - filterPeriod days)
            const filterDate = new Date(now);
            filterDate.setDate(now.getDate() - parseInt(filterPeriod) + 1); // +1 to include today
            filterDate.setHours(0, 0, 0, 0);

            return expDate >= filterDate;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [expenses, filterPeriod, customRange]);

    const homeExpenses = useMemo(() => {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        threeMonthsAgo.setHours(0, 0, 0, 0);

        return expenses.filter(e => new Date(e.date) >= threeMonthsAgo)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [expenses]);

    const totalForPeriod = useMemo(() => filteredExpenses.reduce((sum, e) => sum + e.amount, 0), [filteredExpenses]);
    const homeTotal = useMemo(() => homeExpenses.reduce((sum, e) => sum + e.amount, 0), [homeExpenses]);

    return (
        <ExpenseContext.Provider value={{
            expenses, categories, filterPeriod, customRange,
            setFilterPeriod, setCustomRange, addExpense, updateExpense,
            deleteExpense, addCategory, deleteCategory, filteredExpenses,
            homeExpenses, totalForPeriod, homeTotal, exportData,
            exportSettings, setExportSettings
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
