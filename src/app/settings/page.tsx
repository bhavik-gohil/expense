"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, FileJson, FileSpreadsheet, Bell, BellOff, Clock } from "lucide-react";
import { useExpenses, ExportFrequency } from "@/contexts/ExpenseContext";
import { M3Card, M3Button } from "@/components/m3-ui";
import { cn } from "@/lib/utils";

export default function Settings() {
    const router = useRouter();
    const { exportData, exportSettings, setExportSettings } = useExpenses();

    const frequencies: { label: string; value: ExportFrequency; icon: any }[] = [
        { label: "Off", value: "off", icon: BellOff },
        { label: "Daily", value: "daily", icon: Bell },
        { label: "Weekly", value: "weekly", icon: Clock },
        { label: "Monthly", value: "monthly", icon: Clock },
    ];

    return (
        <main className="flex min-h-screen flex-col bg-surface text-on-surface pb-12">
            <header className="px-6 pt-12 pb-6 flex items-center gap-4 sticky top-0 bg-surface/80 backdrop-blur-md z-10">
                <button onClick={() => router.back()} className="p-2 -mx-2 hover:bg-surface-variant rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-medium">Settings</h1>
            </header>

            <div className="px-6 space-y-8">
                {/* Auto Export Section */}
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 px-2">
                        Auto Export
                    </h2>
                    <M3Card className="p-4 space-y-4">
                        <p className="text-sm text-on-surface-variant px-1 border-l-2 border-primary ml-1">
                            The app will automatically trigger a download based on your selected frequency.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {frequencies.map((f) => (
                                <div
                                    key={f.value}
                                    onClick={() => setExportSettings({ ...exportSettings, frequency: f.value })}
                                    className={cn(
                                        "p-4 rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer border-2 text-center",
                                        exportSettings.frequency === f.value
                                            ? "bg-primary-container border-primary text-on-primary-container"
                                            : "bg-surface-container border-transparent hover:bg-surface-container-high"
                                    )}
                                >
                                    <f.icon size={20} />
                                    <span className="text-xs font-bold">{f.label}</span>
                                </div>
                            ))}
                        </div>
                        {exportSettings.lastExport > 0 && (
                            <p className="text-[10px] text-center text-on-surface-variant mt-2 italic">
                                Last Export: {new Date(exportSettings.lastExport).toLocaleString()}
                            </p>
                        )}
                    </M3Card>
                </section>

                {/* Manual Export Section */}
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 px-2">
                        Manual Export
                    </h2>
                    <div className="space-y-3">
                        <M3Card
                            onClick={() => exportData('json')}
                            className="flex items-center gap-4 p-5 hover:bg-primary/5 cursor-pointer active:scale-95 transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
                                <FileJson size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold">Export as JSON</p>
                                <p className="text-xs text-on-surface-variant">Recommended for backups</p>
                            </div>
                            <Download size={20} className="text-on-surface-variant opacity-40" />
                        </M3Card>

                        <M3Card
                            onClick={() => exportData('csv')}
                            className="flex items-center gap-4 p-5 hover:bg-tertiary/5 cursor-pointer active:scale-95 transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
                                <FileSpreadsheet size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold">Export as CSV</p>
                                <p className="text-xs text-on-surface-variant">View in Excel or Sheets</p>
                            </div>
                            <Download size={20} className="text-on-surface-variant opacity-40" />
                        </M3Card>
                    </div>
                </section>

                <div className="pt-8 opacity-40 text-center space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest">Expense Tracker v2.0</p>
                    <p className="text-[10px]">Material 3 Design System</p>
                </div>
            </div>
        </main>
    );
}
