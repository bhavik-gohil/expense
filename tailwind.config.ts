import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class', 
    theme: {
        extend: {
            colors: {
                background: "rgb(var(--bg-page))",
                page: "rgb(var(--bg-page))", 
                surface: "rgb(var(--card-bg))",
                "border-color": "rgb(var(--border-color))",
                primary: "rgb(var(--primary))",
                "on-primary": "rgb(var(--on-primary))",

                "text-main": "rgb(var(--text-main))",
                "text-muted": "rgb(var(--text-muted))",

                "accent-blue": "rgb(var(--accent-blue))",
                "accent-purple": "rgb(var(--accent-purple))",
                "accent-pink": "rgb(var(--accent-pink))",

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
