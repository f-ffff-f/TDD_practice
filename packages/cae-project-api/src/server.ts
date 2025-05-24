// src/todo-api/server.ts
import { createCAEProjectServer } from '@/server.factory'

// 프로덕션용 서버 인스턴스 생성 (싱글턴 DB 사용)
export const app = createCAEProjectServer()

// 서버 시작 로직 (직접 실행 시)
if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`)
  })
}
