import http from 'node:http'

/**
 * 404 Not Found 응답을 처리하는 핸들러입니다.
 * @param req - HTTP 요청 객체
 * @param res - HTTP 응답 객체
 */
export function handleNotFound(
  req: http.IncomingMessage,
  res: http.ServerResponse
): void {
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('Not Found')
}
