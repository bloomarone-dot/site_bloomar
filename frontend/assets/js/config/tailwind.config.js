tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
            },
            fontSize: {
                'xxs': ['0.625rem', { lineHeight: '0.875rem' }],
                'micro': ['0.5625rem', { lineHeight: '0.75rem' }],
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
                }
            },
            borderRadius: {
                'card': '1rem',
                'card-lg': '1.5rem',
            },
            boxShadow: {
                'card': '0 1px 3px 0 rgb(11 18 50 / 0.04), 0 4px 16px -2px rgb(11 18 50 / 0.06)',
                'card-hover': '0 8px 30px -8px rgb(11 18 50 / 0.12)',
                'glow-violet': '0 10px 40px -10px rgb(123 47 247 / 0.25)',
                'glow-turquoise': '0 10px 40px -10px rgb(18 199 183 / 0.2)',
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        }
    }
}
