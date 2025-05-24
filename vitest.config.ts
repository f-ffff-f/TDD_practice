import { defineConfig } from 'vitest/config'
import path from 'path' // Node.js 내장 'path' 모듈을 가져옵니다.
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true, // describe, it, expect 등을 TypeScript 파일에서 바로 사용
    environment: 'node', // 또는 'jsdom' 등
    // Vitest는 esbuild를 사용하여 TypeScript를 매우 빠르게 처리합니다.
    // 별도의 TypeScript 컴파일 설정이 거의 필요 없어요!
  },
})
