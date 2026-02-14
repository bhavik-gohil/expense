export interface Expense {
    id: string;
    amount: number;
    category: string;
    note: string;
    date: string;
    timestamp: number;
}

const STORAGE_KEY = 'woof_expenses';

export const getExpenses = (): Expense[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const addExpense = (expense: Omit<Expense, 'id' | 'timestamp'>): Expense => {
    const newExpense: Expense = {
        ...expense,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
    };

    const expenses = getExpenses();
    expenses.unshift(newExpense); 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));

    return newExpense;
};

export const updateExpense = (id: string, updates: Partial<Expense>): void => {
    const expenses = getExpenses();
    const index = expenses.findIndex(e => e.id === id);

    if (index !== -1) {
        expenses[index] = { ...expenses[index], ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    }
};

export const deleteExpense = (id: string): void => {
    const expenses = getExpenses();
    const filtered = expenses.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getTotalExpenses = (): number => {
    const expenses = getExpenses();
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

export const getExpensesByCategory = (): Record<string, number> => {
    const expenses = getExpenses();
    return expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {} as Record<string, number>);
};
