/**
 * 일반적인 유효성 검사 오류를 나타내는 기본 클래스입니다.
 */
export class ValidationError extends Error {
  public readonly details: string[]
  constructor(message: string, details: string[] = []) {
    super(message)
    this.name = 'ValidationError'
    this.details = details
  }
}

/**
 * 프로젝트 생성 시 입력값이 유효하지 않을 때 발생하는 오류입니다.
 */
export class InvalidProjectDataError extends ValidationError {
  constructor(details: string[]) {
    super('Invalid project data provided.', details)
    this.name = 'InvalidProjectDataError'
  }
}

// 필요에 따라 더 구체적인 도메인 오류를 추가할 수 있습니다.
// 예: export class ProjectNameConflictError extends Error { ... }
