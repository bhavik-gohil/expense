import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#3B82F6", // Bold Blue
                    dark: "#2563EB",
                },
                secondary: {
                    DEFAULT: "#6B7280", // Cool Gray
                    dark: "#4B5563",
                },
                background: {
                    light: "#F3F4F6", // Light Gray
                    dark: "#1F2937", // Dark Slate
                },
                surface: {
                    light: "#FFFFFF",
                    dark: "#374151",
                },
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
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
