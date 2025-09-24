import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'  //  import fs

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    },
    proxy: {
  '/api': {
    target: 'https://localhost:3000',
    secure: false, // because it's self-signed
  }
}

  },
  plugins: [react()],
})
