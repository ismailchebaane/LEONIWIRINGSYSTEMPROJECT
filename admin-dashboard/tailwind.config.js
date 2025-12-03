/** @type {import('tailwindcss').Config} */
const defaultTheme=require('tailwindcss/defaultTheme')
module.exports = {
  content: ["./src/**/*.{html,js,jsx}",
   './src/components/**/*.{html,js,jsx}',
   './src/pages/**/*.{html,js,jsx}',
   './public/index.html',
  ],
  
  theme: {
    extend: {
  fontFamily:{
    sans:['ClashDisplay-Regular',...defaultTheme.fontFamily.sans]
  },colors:{tomato:"#E50914",marigold:"#ffbe0b",blackly:"#141414",grayly:"#8f9090",grenly:"#46d369"}

    },
  },

  

}