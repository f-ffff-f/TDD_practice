import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()], // tsconfig.json 파일에 정의돼있는 path alias 설정을 사용할 수 있게 해줌. 따라서 여러 패키지를 넘나들며 테스트 가능.
  test: {
    globals: true, // describe, it, expect 등을 TypeScript 파일에서 바로 사용
    environment: 'node', // 또는 'jsdom' 등
    // Vitest는 esbuild를 사용하여 TypeScript를 매우 빠르게 처리합니다.
    // 별도의 TypeScript 컴파일 설정이 거의 필요 없어요!
  },
})
