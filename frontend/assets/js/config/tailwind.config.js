tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
            },
            fontSize: {
                'xxs': ['0.75rem', { lineHeight: '1.125rem' }],
                'micro': ['0.6875rem', { lineHeight: '1rem' }],
                'xs': ['0.875rem', { lineHeight: '1.25rem' }],
                'sm': ['0.9375rem', { lineHeight: '1.375rem' }],
            },
            colors: {
                bloomar: {
                    navy: '#0B1232',
                    violet: '#7B2FF7',
                    turquoise: '#12C7B7',
                    bg: '#F8FAFC',
                    text: '#111827',
                    card: '#FFFFFF',
                    border: '#E2E8F0',
                    gold: '#E1B12C',
                },
                premium: {
                    bg: '#050818',
                    surface: 'rgba(255,255,255,0.04)',
                    violet: '#8b5cf6',
                    muted: '#94a3b8',
                },
            },
            borderRadius: {
                'card': '1rem',
                'card-lg': '1.5rem',
            },
            boxShadow: {
                'card': '0 1px 3px 0 rgb(11 18 50 / 0.04), 0 4px 16px -2px rgb(11 18 50 / 0.06)',
                'card-hover': '0 8px 30px -8px rgb(11 18 50 / 0.12)',
                'glow-violet': '0 10px 40px -10px rgb(123 47 247 / 0.35)',
                'glow-violet-lg': '0 0 80px -20px rgb(123 47 247 / 0.5)',
                'glow-turquoise': '0 10px 40px -10px rgb(18 199 183 / 0.2)',
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '0.4' },
                    '50%': { opacity: '0.8' },
                },
            },
        }
    }
}
