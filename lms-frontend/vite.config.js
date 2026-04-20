// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import { fileURLToPath, URL } from 'node:url'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [vue()],
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url)),
//     },
//   },
// })

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, '../cert/192.168.1.19+1-key.pem')
      ),
      cert: fs.readFileSync(
        path.resolve(__dirname, '../cert/192.168.1.19+1.pem')
      ),
    }
  }
})