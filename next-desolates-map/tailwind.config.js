module.exports = {
    mode: "jit",
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                cool: 'Share Tech Mono, monospace',
                serif: ['Nasalization Rg', 'serif'],
            },
            textColor: {
                primary: '#1BFFF1E6',
            },
            outline: {
                cool: "1px solid rgba(27, 255, 241, 0.75)",
            },
            placeholderColor: {
                primary: '#1BFFF161',
            },
            backgroundColor: {
                primary: '#1BFFF1E6',
                faded: '#1BFFF11F'
            },
            animation: {
                fadeIn: "fadeIn .25s ease-in-out",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
                slideToRight: {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(0%)" },
                },
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
