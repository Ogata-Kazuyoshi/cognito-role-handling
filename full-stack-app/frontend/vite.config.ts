import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {InlineConfig} from "vitest";

const testConfig: InlineConfig = {
  environment: 'jsdom',
  setupFiles: ['./test-setup.js'],
  globals: true,
  include: ['./src/**/*.test.{tsx,ts}'],
}

// https://vitejs.dev/config/
export default defineConfig({
  test: testConfig,
  server:
      {
        hmr: {
          overlay: false
        },
        port: 5180,
        proxy: {
          '/api': 'http://localhost:8082',
        },
      },

  plugins: [react()],
})
