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
    date: string;
    timestamp: number;
}

export type FilterPeriod = '1' | '7' | '30' | 'monthly' | 'custom';
export type ExportFrequency = 'off' | 'daily' | 'weekly' | 'monthly';

interface ExportSettings {
    frequency: ExportFrequency;
    lastExport: number;
    exportPath?: string;
    exportPathLabel?: string;
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
    updateCategory: (id: string, updates: Partial<Pick<Category, 'name' | 'emoji'>>) => void;
    deleteCategory: (id: string) => void;
    reorderCategories: (newOrder: string[]) => void;
    allCategories: Category[];
    filteredExpenses: Expense[];
    homeExpenses: Expense[];
    totalForPeriod: number;
    homeTotal: number;
    currentMonthTotal: number;
    exportData: (format: 'json' | 'csv') => void;
    importData: (file: File) => Promise<{ expenses: number; categories: number }>;
    exportSettings: ExportSettings;
    setExportSettings: (settings: ExportSettings) => void;
    updateExportPath: () => Promise<boolean>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const EXPENSES_KEY = 'm3_expenses';
const CATEGORIES_KEY = 'm3_categories';
const CATEGORY_ORDER_KEY = 'm3_category_order';
const HIDDEN_CATEGORIES_KEY = 'm3_hidden_categories';
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
    const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
    const [hiddenCategoryIds, setHiddenCategoryIds] = useState<string[]>([]);
    const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('monthly');
    const [customRange, setCustomRange] = useState<{ start: string; end: string } | null>(null);
    const [exportSettings, setExportSettingsState] = useState<ExportSettings>({ frequency: 'off', lastExport: 0 });

    useEffect(() => {
        const storedExpenses = localStorage.getItem(EXPENSES_KEY);
        const storedCategories = localStorage.getItem(CATEGORIES_KEY);
        const storedOrder = localStorage.getItem(CATEGORY_ORDER_KEY);
        const storedHiddenCategories = localStorage.getItem(HIDDEN_CATEGORIES_KEY);
        const storedExport = localStorage.getItem(EXPORT_SETTINGS_KEY);

        if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
        if (storedCategories) {
            const parsed = JSON.parse(storedCategories);
            setCategories([...DEFAULT_CATEGORIES, ...parsed]);
        }
        if (storedOrder) setCategoryOrder(JSON.parse(storedOrder));
        if (storedHiddenCategories) {
            setHiddenCategoryIds(JSON.parse(storedHiddenCategories));
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

    const updateExportPath = async () => {
        if (typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform()) {
            try {
                const { FilePicker } = await import('@capawesome/capacitor-file-picker');
                const result = await FilePicker.pickDirectory();
                if (result.path) {
                    setExportSettings({
                        ...exportSettings,
                        exportPath: result.path,
                        exportPathLabel: 'Selected Folder'
                    });
                    return true;
                }
            } catch (err) {
                console.error('Failed to pick directory', err);
            }
        }
        return false;
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

    const updateCategory = (id: string, updates: Partial<Pick<Category, 'name' | 'emoji'>>) => {
        saveCategories(categories.map(c => c.id === id ? { ...c, ...updates, isCustom: true } : c));
    };

    const reorderCategories = (newOrder: string[]) => {
        setCategoryOrder(newOrder);
        localStorage.setItem(CATEGORY_ORDER_KEY, JSON.stringify(newOrder));
    };

    const deleteCategory = (id: string) => {
        const categoryToDelete = categories.find(c => c.id === id);
        if (!categoryToDelete) return;

        const newHidden = [...hiddenCategoryIds, id];
        setHiddenCategoryIds(newHidden);
        localStorage.setItem(HIDDEN_CATEGORIES_KEY, JSON.stringify(newHidden));
    };

    const exportData = async (format: 'json' | 'csv') => {
        let content = '';
        const dateStr = new Date().toISOString().split('T')[0];
        const filename = `okane-export-${dateStr}.${format}`;

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

        // Handle Native Platform (Android/iOS)
        if (typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform()) {
            try {
                const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
                const { Share } = await import('@capacitor/share');

                let success = false;

                // 1. Try saved custom path if exists
                if (exportSettings.exportPath) {
                    try {
                        await Filesystem.writeFile({
                            path: `${exportSettings.exportPath}/${filename}`,
                            data: content,
                            encoding: Encoding.UTF8,
                        });
                        success = true;
                        alert(`Exported to: ${exportSettings.exportPathLabel}`);
                    } catch (err) {
                        console.error('Failed to write to custom path', err);
                    }
                }

                // 2. Fallback to default Download folder if no custom path or custom path failed
                if (!success) {
                    try {
                        await Filesystem.writeFile({
                            path: `Download/${filename}`,
                            data: content,
                            directory: Directory.ExternalStorage,
                            encoding: Encoding.UTF8,
                        });
                        success = true;
                        alert(`Saved to Downloads folder: ${filename}`);
                    } catch (saveErr) {
                        console.log('Direct download failed, falling back to Share sheet', saveErr);

                        // 3. Last fallback: Write file to Cache and Share
                        const result = await Filesystem.writeFile({
                            path: filename,
                            data: content,
                            directory: Directory.Cache,
                            encoding: Encoding.UTF8,
                        });

                        await Share.share({
                            title: `Export ${format.toUpperCase()}`,
                            url: result.uri,
                            dialogTitle: 'Save or Share Export',
                        });
                    }
                }
            } catch (err) {
                console.error('Failed to export natively', err);
            }
        } else {
            // Handle Web Platform
            const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }

        setExportSettings({ ...exportSettings, lastExport: Date.now() });
    };

    const importData = async (file: File): Promise<{ expenses: number; categories: number }> => {
        try {
            const text = await file.text();
            let data: any;
            try {
                data = JSON.parse(text);
            } catch (pErr) {
                console.error('Invalid JSON file', pErr);
                throw new Error('The selected file is not a valid JSON backup.');
            }

            let importedExpenses = 0;
            let importedCategories = 0;

            if (data.expenses && Array.isArray(data.expenses)) {
                const existingIds = new Set(expenses.map(e => e.id));
                const newExpenses = data.expenses.filter((e: Expense) => !existingIds.has(e.id));
                if (newExpenses.length > 0) {
                    saveExpenses([...newExpenses, ...expenses]);
                    importedExpenses = newExpenses.length;
                }
            }

            if (data.categories && Array.isArray(data.categories)) {
                const existingIds = new Set(categories.map(c => c.id));
                const newCats = data.categories
                    .filter((c: Category) => c.isCustom && !existingIds.has(c.id));
                if (newCats.length > 0) {
                    saveCategories([...categories, ...newCats]);
                    importedCategories = newCats.length;
                }
            }

            return { expenses: importedExpenses, categories: importedCategories };
        } catch (err: any) {
            console.error('Failed to import data', err);
            throw err;
        }
    };

    const filteredExpenses = useMemo(() => {
        const now = new Date();

        return expenses.filter(expense => {
            const expDate = new Date(expense.date);

            if (filterPeriod === 'custom' && customRange) {
                const customEndDate = new Date(customRange.end);
                customEndDate.setHours(23, 59, 59, 999);
                return expDate >= new Date(customRange.start) && expDate <= customEndDate;
            }

            if (filterPeriod === 'monthly') {
                return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
            }

            const diffDays = (now.getTime() - expDate.getTime()) / (1000 * 60 * 60 * 24);
            const filterDate = new Date(now);
            filterDate.setDate(now.getDate() - parseInt(filterPeriod) + 1);
            filterDate.setHours(0, 0, 0, 0);

            return expDate >= filterDate;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [expenses, filterPeriod, customRange]);

    const homeExpenses = useMemo(() => {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        const threshold = threeMonthsAgo.toISOString().split('T')[0];

        return expenses
            .filter(e => e.date >= threshold)
            .sort((a, b) => b.date.localeCompare(a.date));
    }, [expenses]);

    const totalForPeriod = useMemo(() => filteredExpenses.reduce((sum, e) => sum + e.amount, 0), [filteredExpenses]);
    const homeTotal = useMemo(() => homeExpenses.reduce((sum, e) => sum + e.amount, 0), [homeExpenses]);

    const { currentMonthTotal, currentMonthExpenses } = useMemo(() => {
        const now = new Date();
        const curM = now.getMonth();
        const curY = now.getFullYear();
        let total = 0;
        const filtered = expenses.filter(e => {
            const date = new Date(e.date);
            const isMatch = date.getMonth() === curM && date.getFullYear() === curY;
            if (isMatch) total += e.amount;
            return isMatch;
        });
        return { currentMonthTotal: total, currentMonthExpenses: filtered };
    }, [expenses]);

    const visibleCategories = useMemo(() => {
        const visible = categories.filter(c => !hiddenCategoryIds.includes(c.id));
        if (categoryOrder.length === 0) return visible;

        return [...visible].sort((a, b) => {
            const indexA = categoryOrder.indexOf(a.id);
            const indexB = categoryOrder.indexOf(b.id);
            if (indexA === -1 && indexB === -1) return 0;
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
    }, [categories, hiddenCategoryIds, categoryOrder]);

    const allCategories = useMemo(() => categories, [categories]);

    return (
        <ExpenseContext.Provider value={{
            expenses, categories: visibleCategories, filterPeriod, customRange,
            setFilterPeriod, setCustomRange, addExpense, updateExpense,
            deleteExpense, addCategory, updateCategory, deleteCategory, reorderCategories, allCategories,
            filteredExpenses, homeExpenses, totalForPeriod, homeTotal, currentMonthTotal, exportData,
            importData, exportSettings, setExportSettings, updateExportPath
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
