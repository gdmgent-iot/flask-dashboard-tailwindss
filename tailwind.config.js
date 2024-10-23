/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./templates/**/*.html"],
    theme: {
        extend: {}
    },
    plugins: []
}

// in terminal, commando: 
// sudo apt install nodejs
// sudo apt install npm
// npm i tailwindcss mqtt
// npx tailwindcss -i static/css/input.css -o static/css/output.css --watch