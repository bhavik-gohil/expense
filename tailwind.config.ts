import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class', // Enforce class strategy
    theme: {
        extend: {
            colors: {
                // Semantic Colors
                background: "rgb(var(--bg-page))",
                page: "rgb(var(--bg-page))", // Component background
                surface: "rgb(var(--card-bg))",
                "border-color": "rgb(var(--border-color))",
                primary: "rgb(var(--primary))",
                "on-primary": "rgb(var(--on-primary))",

                // Text
                "text-main": "rgb(var(--text-main))",
                "text-muted": "rgb(var(--text-muted))",

                // Accents (for data)
                "accent-blue": "rgb(var(--accent-blue))",
                "accent-purple": "rgb(var(--accent-purple))",
                "accent-pink": "rgb(var(--accent-pink))",

                // Legacy M3 Mappings (Backwards Compat)
                "m3-surface": "rgb(var(--m3-surface))",
                "m3-on-surface": "rgb(var(--m3-on-surface))",
                "m3-surface-variant": "rgb(var(--m3-surface-variant))",
                "m3-on-surface-variant": "rgb(var(--m3-on-surface-variant))",
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            },
        },
    },
    plugins: [],
};
export default config;
