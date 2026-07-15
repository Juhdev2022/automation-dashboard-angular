/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        corporate: '#1B4F8A',
        status: {
          sucesso: '#10B981',
          falha: '#EF4444',
          parcial: '#F59E0B',
          'em-execucao': '#3B82F6',
        },
      },
    },
  },
  plugins: [],
}

