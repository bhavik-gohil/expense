"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Upload, FileJson, FileSpreadsheet, Bell, BellOff, Clock, Sun, Moon, Monitor, Check } from "lucide-react";
import { useExpenses, ExportFrequency } from "@/contexts/ExpenseContext";
import { useTheme } from "@/contexts/ThemeContext";
import { M3Card } from "@/components/m3-ui";
import { cn } from "@/lib/utils";

type ThemeOption = { label: string; value: "system" | "light" | "dark"; icon: any };

export default function Settings() {
    const router = useRouter();
    const { exportData, importData, exportSettings, setExportSettings } = useExpenses();
    const { theme, setTheme } = useTheme();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importResult, setImportResult] = useState<string | null>(null);

    const themes: ThemeOption[] = [
        { label: "System", value: "system", icon: Monitor },
        { label: "Light", value: "light", icon: Sun },
        { label: "Dark", value: "dark", icon: Moon },
    ];

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
        // Reset the input so the same file can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <main className="flex min-h-screen flex-col bg-surface text-on-surface pb-12">
            <header className="px-6 pt-14 pb-6 flex items-center gap-4 sticky top-0 bg-surface/80 backdrop-blur-md z-10">
                <button onClick={() => router.back()} className="p-2 -mx-2 hover:bg-surface-variant rounded-full active:scale-90 transition-transform">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold">Settings</h1>
            </header>

            <div className="px-6 space-y-8">
                {/* Theme Section */}
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 px-1">
                        Appearance
                    </h2>
                    <div className="grid grid-cols-3 gap-3">
                        {themes.map((t) => (
                            <div
                                key={t.value}
                                onClick={() => setTheme(t.value)}
                                className={cn(
                                    "p-4 rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer border-2",
                                    theme === t.value
                                        ? "bg-primary-container border-primary text-on-primary-container scale-[1.02]"
                                        : "bg-surface-container border-transparent hover:bg-surface-container-high"
                                )}
                            >
                                <t.icon size={22} />
                                <span className="text-xs font-bold">{t.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Auto Export Section */}
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 px-1">
                        Auto Export
                    </h2>
                    <M3Card className="p-4 space-y-4">
                        <p className="text-xs text-on-surface-variant px-1 border-l-2 border-primary ml-1 leading-relaxed">
                            Automatically trigger a download based on your selected frequency.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {frequencies.map((f) => (
                                <div
                                    key={f.value}
                                    onClick={() => setExportSettings({ ...exportSettings, frequency: f.value })}
                                    className={cn(
                                        "p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer border-2",
                                        exportSettings.frequency === f.value
                                            ? "bg-secondary-container border-secondary text-on-secondary-container"
                                            : "bg-surface-container border-transparent hover:bg-surface-container-high"
                                    )}
                                >
                                    <f.icon size={18} />
                                    <span className="text-[11px] font-bold">{f.label}</span>
                                </div>
                            ))}
                        </div>
                        {exportSettings.lastExport > 0 && (
                            <p className="text-[10px] text-center text-on-surface-variant italic">
                                Last export: {new Date(exportSettings.lastExport).toLocaleDateString()}
                            </p>
                        )}
                    </M3Card>
                </section>

                {/* Manual Export Section */}
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 px-1">
                        Export
                    </h2>
                    <div className="space-y-3">
                        <M3Card
                            onClick={() => exportData('json')}
                            className="flex items-center gap-4 p-4 hover:bg-surface-container-high cursor-pointer active:scale-[0.98] transition-all"
                        >
                            <div className="w-11 h-11 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                                <FileJson size={22} />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-sm">Export as JSON</p>
                                <p className="text-[11px] text-on-surface-variant">Recommended for backups</p>
                            </div>
                            <Download size={18} className="text-on-surface-variant opacity-30 shrink-0" />
                        </M3Card>

                        <M3Card
                            onClick={() => exportData('csv')}
                            className="flex items-center gap-4 p-4 hover:bg-surface-container-high cursor-pointer active:scale-[0.98] transition-all"
                        >
                            <div className="w-11 h-11 rounded-2xl bg-tertiary-container flex items-center justify-center text-on-tertiary-container shrink-0">
                                <FileSpreadsheet size={22} />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-sm">Export as CSV</p>
                                <p className="text-[11px] text-on-surface-variant">View in Excel or Sheets</p>
                            </div>
                            <Download size={18} className="text-on-surface-variant opacity-30 shrink-0" />
                        </M3Card>
                    </div>
                </section>

                {/* Import Section */}
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 px-1">
                        Import
                    </h2>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                    />
                    <M3Card
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-4 p-4 hover:bg-surface-container-high cursor-pointer active:scale-[0.98] transition-all"
                    >
                        <div className="w-11 h-11 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary-container shrink-0">
                            <Upload size={22} />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm">Import from JSON</p>
                            <p className="text-[11px] text-on-surface-variant">Restore a previous backup</p>
                        </div>
                    </M3Card>
                    {importResult && (
                        <div className="mt-3 flex items-center gap-2 text-sm font-medium text-primary px-2 animate-in fade-in">
                            <Check size={16} />
                            <span>{importResult}</span>
                        </div>
                    )}
                </section>

                <div className="pt-6 opacity-30 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Expense Tracker · M3</p>
                </div>
            </div>
        </main>
    );
}
