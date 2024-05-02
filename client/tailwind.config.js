/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],

    theme: {
        extend: {
            colors: {
                primary: colors.orange,
                secondary: colors.gray,
                light: colors.white,
            },
            fontFamily: {
                nunito: ['Nunito', 'sans-serif'],
            },
            container: {
                padding: '0.5rem',
            },
            flexBasis: {
                '1/3-gap-4': 'calc(33.3% - (2/3 * 1rem))',
                '2/3-gap-4': 'calc(66.6% - (1/3 * 1rem))',
                '1/3-gap-6': 'calc(33.3% - (2/3 * 3rem))',
            },
        },
    },
    plugins: [],
};
