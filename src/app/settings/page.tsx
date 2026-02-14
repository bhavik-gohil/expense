"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Upload, FileJson, FileSpreadsheet, Bell, BellOff, Clock, Sun, Moon, Monitor, Check } from "lucide-react";
import { useExpenses, ExportFrequency } from "@/contexts/ExpenseContext";
import { useTheme } from "@/contexts/ThemeContext";
import { GlassCard } from "@/components/glass-ui";
import { cn } from "@/lib/utils";

type ThemeOption = { label: string; value: "system" | "light" | "dark"; icon: any };

import { formatDate } from "@/lib/date";

export default function Settings() {
    const router = useRouter();
    const { exportData, importData, exportSettings, setExportSettings } = useExpenses();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importResult, setImportResult] = useState<string | null>(null);

    const frequencies: { label: string; value: ExportFrequency; icon: any }[] = [
        { label: "Off", value: "off", icon: BellOff },
        { label: "Daily", value: "daily", icon: Bell },
        { label: "Weekly", value: "weekly", icon: Clock },
        { label: "Monthly", value: "monthly", icon: Clock },
    ];

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const result = await importData(file);
            setImportResult(`Imported ${result.expenses} expenses, ${result.categories} categories`);
            setTimeout(() => setImportResult(null), 4000);
        } catch {
            setImportResult("Import failed — invalid file format");
            setTimeout(() => setImportResult(null), 4000);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <main className="flex min-h-screen flex-col bg-surface text-on-surface pb-40">
            <header
                className="px-6 pt-14 pb-6 flex items-center gap-4 sticky top-0 z-10 backdrop-blur-md"
                style={{ backgroundColor: 'rgba(var(--bg-page), 0.8)' }}
            >
                <button onClick={() => router.back()} className="p-2 -mx-2 hover:bg-surface-variant rounded-full active:scale-90 transition-transform">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold">Settings</h1>
            </header>

            <div className="px-6 space-y-8">
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4 px-1">
                        Auto Export
                    </h2>
                    <GlassCard className="p-4 space-y-4">
                        <p className="text-xs text-text-muted px-1 border-l-2 border-primary ml-1 leading-relaxed opacity-70">
                            Automatically trigger a download based on your selected frequency.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {frequencies.map((f) => (
                                <div
                                    key={f.value}
                                    onClick={() => setExportSettings({ ...exportSettings, frequency: f.value })}
                                    className={cn(
                                        "p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer border backdrop-blur-sm",
                                        exportSettings.frequency === f.value
                                            ? "bg-primary/20 border-primary text-primary font-bold"
                                            : "bg-surface border-transparent hover:bg-black/5"
                                    )}
                                >
                                    <f.icon size={18} />
                                    <span className="text-[11px] font-medium">{f.label}</span>
                                </div>
                            ))}
                        </div>
                        {exportSettings.lastExport > 0 && (
                            <p className="text-[10px] text-center text-text-muted italic opacity-50">
                                Last export: {formatDate(new Date(exportSettings.lastExport), { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        )}
                    </GlassCard>
                </section>

                <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4 px-1">
                        Export
                    </h2>
                    <div className="space-y-3">
                        <GlassCard
                            onClick={() => exportData('json')}
                            className="flex items-center gap-4 p-4 hover:bg-black/5 cursor-pointer active:scale-[0.98] transition-all"
                        >
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-600/10 flex items-center justify-center text-green-600 shrink-0">
                                <FileJson size={22} />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-sm">Export as JSON</p>
                                <p className="text-[11px] text-text-muted opacity-70">Recommended for backups</p>
                            </div>
                            <Download size={18} className="text-text-muted opacity-30 shrink-0" />
                        </GlassCard>

                        <GlassCard
                            onClick={() => exportData('csv')}
                            className="flex items-center gap-4 p-4 hover:bg-black/5 cursor-pointer active:scale-[0.98] transition-all"
                        >
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-600/10 flex items-center justify-center text-blue-600 shrink-0">
                                <FileSpreadsheet size={22} />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-sm">Export as CSV</p>
                                <p className="text-[11px] text-text-muted opacity-70">View in Excel or Sheets</p>
                            </div>
                            <Download size={18} className="text-text-muted opacity-30 shrink-0" />
                        </GlassCard>
                    </div>
                </section>

                <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4 px-1">
                        Import
                    </h2>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                    />
                    <GlassCard
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-4 p-4 hover:bg-black/5 cursor-pointer active:scale-[0.98] transition-all"
                    >
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-600/10 flex items-center justify-center text-indigo-600 shrink-0">
                            <Upload size={22} />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm">Import from JSON</p>
                            <p className="text-[11px] text-text-muted opacity-70">Restore a previous backup</p>
                        </div>
                    </GlassCard>
                    {importResult && (
                        <div className="mt-3 flex items-center gap-2 text-sm font-medium text-primary px-2 animate-in fade-in">
                            <Check size={16} />
                            <span>{importResult}</span>
                        </div>
                    )}
                </section>

                <div className="pt-6 opacity-30 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Expense Tracker · v2.0</p>
                </div>
            </div>
        </main>
    );
}
