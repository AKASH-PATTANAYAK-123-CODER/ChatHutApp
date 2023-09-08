/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        'primary': "#1476ff",
        'bar':"#fecdd3",
        'secondary':"#bfdbfe",
        'text': "#bbf7d0",
        'rcvtext':'#e2e8f0',
        'light': "#e7e5e4",
      },
      screens:{
        'sm':'682px',
        'md':'768px',
        'lg':'1024px',
        'x1':'1280px',
        '2x1':'1536px'

      },
    },
  },
  plugins: [],
}

