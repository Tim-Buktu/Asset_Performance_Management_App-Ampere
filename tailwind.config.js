/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // SUN Energy Primary Palette - Electric Violet (dark mode brand)
                'sun-green': {
                    50: '#EEF2FF',
                    100: '#E0E7FF',
                    200: '#C7D2FE',
                    300: '#A5B4FC',
                    400: '#818CF8',
                    500: '#6366F1',  // Primary brand
                    600: '#4F46E5',
                    700: '#4338CA',
                    800: '#3730A3',
                    900: '#312E81',
                },
                // Surface Palette - Dark Mode (inverted: 50=darkest, 950=lightest)
                'surface': {
                    50: '#0B1120',   // Canvas / body background
                    100: '#0F172A',  // Deepest surface
                    200: '#1E293B',  // Card base
                    300: '#334155',  // Elevated / border
                    400: '#475569',  // Subtle border
                    500: '#64748B',  // Muted text
                    600: '#94A3B8',  // Secondary text
                    700: '#CBD5E1',  // Primary text light
                    800: '#E2E8F0',  // Headings
                    900: '#F1F5F9',  // Primary text
                    950: '#F8FAFC',  // Brightest text
                },
                // Legacy carbon mapping (dark mode)
                'carbon': {
                    50: '#0B1120',
                    100: '#0F172A',
                    200: '#1E293B',
                    300: '#334155',
                    400: '#475569',
                    500: '#64748B',
                    600: '#94A3B8',
                    700: '#CBD5E1',
                    800: '#E2E8F0',
                    850: '#E8EDF4',
                    900: '#F1F5F9',
                    925: '#F4F7FA',
                    950: '#F8FAFC',
                },
                // Status Colors - Brightened for dark backgrounds
                'status': {
                    healthy: '#34D399',
                    'healthy-glow': '#6EE7B7',
                    warning: '#FBBF24',
                    'warning-glow': '#FCD34D',
                    critical: '#F87171',
                    'critical-glow': '#FCA5A5',
                },
                // Data Visualization Palette - dark mode vivid
                'data': {
                    primary: '#818CF8',
                    secondary: '#22D3EE',
                    tertiary: '#F472B6',
                    quaternary: '#34D399',
                },
                // Legacy sun-amber mapping (now cyan accent)
                'sun-amber': {
                    50: '#ECFEFF',
                    100: '#CFFAFE',
                    200: '#A5F3FC',
                    300: '#67E8F9',
                    400: '#22D3EE',
                    500: '#06B6D4',
                    600: '#0891B2',
                    700: '#0E7490',
                    800: '#155E75',
                    900: '#164E63',
                },
                // Override built-in Tailwind palettes to match dark theme
                // emerald → violet (covers all bg-emerald-*, text-emerald-* usages)
                'emerald': {
                    50: '#EEF2FF',
                    100: '#E0E7FF',
                    200: '#C7D2FE',
                    300: '#A5B4FC',
                    400: '#818CF8',
                    500: '#6366F1',
                    600: '#4F46E5',
                    700: '#4338CA',
                    800: '#3730A3',
                    900: '#312E81',
                    950: '#1E1B4B',
                },
                // amber → cyan/gold accent
                'amber': {
                    50: '#ECFEFF',
                    100: '#CFFAFE',
                    200: '#A5F3FC',
                    300: '#67E8F9',
                    400: '#22D3EE',
                    500: '#06B6D4',
                    600: '#0891B2',
                    700: '#0E7490',
                    800: '#155E75',
                    900: '#164E63',
                    950: '#083344',
                },
                // blue → cyan
                'blue': {
                    50: '#ECFEFF',
                    100: '#CFFAFE',
                    200: '#A5F3FC',
                    300: '#67E8F9',
                    400: '#22D3EE',
                    500: '#06B6D4',
                    600: '#0891B2',
                    700: '#0E7490',
                    800: '#155E75',
                    900: '#164E63',
                    950: '#083344',
                },
                // gray/slate/zinc → dark mode surfaces
                'gray': {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A',
                    950: '#0B1120',
                },
                'slate': {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A',
                    950: '#0B1120',
                },
                'zinc': {
                    50: '#FAFAFA',
                    100: '#F4F4F5',
                    200: '#E4E4E7',
                    300: '#D4D4D8',
                    400: '#A1A1AA',
                    500: '#71717A',
                    600: '#52525B',
                    700: '#3F3F46',
                    800: '#27272A',
                    900: '#18181B',
                    950: '#09090B',
                },
            },
            fontFamily: {
                'display': ['Inter', 'system-ui', 'sans-serif'],
                'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            boxShadow: {
                'glow-green': '0 0 20px rgba(99, 102, 241, 0.3)',
                'glow-green-lg': '0 0 40px rgba(99, 102, 241, 0.4)',
                'glow-healthy': '0 0 20px rgba(52, 211, 153, 0.3)',
                'glow-warning': '0 0 20px rgba(251, 191, 36, 0.3)',
                'glow-critical': '0 0 20px rgba(248, 113, 113, 0.3)',
                'glow-amber': '0 0 20px rgba(6, 182, 212, 0.3)',
                'glow-amber-lg': '0 0 40px rgba(6, 182, 212, 0.4)',
                'card': '0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)',
                'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
                'card-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.35), 0 2px 4px -2px rgba(0, 0, 0, 0.25)',
                'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'grid-pattern': 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
                'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'pulse-medium': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'pulse-fast': 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                'data-flow': 'data-flow 1.5s ease-in-out infinite',
                'ring-expand': 'ring-expand 2s ease-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                'glow-pulse': {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)',
                        borderColor: 'rgba(99, 102, 241, 0.4)'
                    },
                    '50%': {
                        boxShadow: '0 0 40px rgba(99, 102, 241, 0.35)',
                        borderColor: 'rgba(99, 102, 241, 0.7)'
                    },
                },
                'data-flow': {
                    '0%': { opacity: '0.5', transform: 'translateY(0)' },
                    '50%': { opacity: '1', transform: 'translateY(-2px)' },
                    '100%': { opacity: '0.5', transform: 'translateY(0)' },
                },
                'ring-expand': {
                    '0%': {
                        transform: 'scale(1)',
                        opacity: '0.4'
                    },
                    '100%': {
                        transform: 'scale(2)',
                        opacity: '0'
                    },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
        },
    },
    plugins: [],
}
