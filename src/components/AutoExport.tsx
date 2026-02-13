"use client";
import { useEffect } from "react";
import { useExpenses } from "@/contexts/ExpenseContext";

export function AutoExport() {
    const { exportSettings, exportData } = useExpenses();

    useEffect(() => {
        if (exportSettings.frequency === 'off') return;

        const now = Date.now();
        const lastExport = exportSettings.lastExport;
        const diff = now - lastExport;

        let shouldExport = false;
        const DAY = 24 * 60 * 60 * 1000;

        if (exportSettings.frequency === 'daily' && diff >= DAY) {
            shouldExport = true;
        } else if (exportSettings.frequency === 'weekly' && diff >= 7 * DAY) {
            shouldExport = true;
        } else if (exportSettings.frequency === 'monthly' && diff >= 30 * DAY) {
            shouldExport = true;
        }

        if (shouldExport) {
            console.log("Triggering auto-export...");
            // Small delay to ensure UI is ready
            const timer = setTimeout(() => {
                exportData('json');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [exportSettings, exportData]);

    return null;
}
