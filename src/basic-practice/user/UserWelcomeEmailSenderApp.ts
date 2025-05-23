import { IEmailClient } from '@/basic-practice/user/EmailClient'
import { IUserService } from '@/basic-practice/user/UserService'

export class UserWelcomeEmailSender {
  private userService: IUserService
  private emailClient: IEmailClient

  constructor(userService: IUserService, emailClient: IEmailClient) {
    this.userService = userService
    this.emailClient = emailClient
  }

  async sendWelcomeEmail(userId: string): Promise<boolean> {
    // 1. UserService를 통해 사용자 정보를 가져옵니다.
    const userDetails = await this.userService.getUserDetails(userId)

    // 2. 사용자를 찾을 수 없는 경우 (userDetails가 null 또는 undefined일 때)
    if (!userDetails) {
      return false // 바로 false를 반환합니다. 이것이 현재 테스트를 통과시키는 핵심!
    }

    const subject = '환영합니다!'
    const body = `안녕하세요, ${userDetails.name}님! 저희 서비스에 오신 것을 환영합니다!`

    try {
      // 2. EmailClient를 사용하여 이메일 발송 요청
      const emailResult = await this.emailClient.send(
        userDetails.email, // 사용자의 실제 이메일 주소
        subject, // 위에서 구성한 제목
        body // 위에서 구성한 본문
      )

      // 3. EmailClient의 발송 결과(success 프로퍼티)를 반환
      return emailResult.success
    } catch (error) {
      // 네트워크 오류 등으로 emailClient.send() 자체가 예외를 던질 경우에 대한 방어 코드
      // (실제 운영 환경에서는 더 정교한 오류 로깅 및 처리가 필요할 수 있습니다)
      console.error(
        `[UserWelcomeEmailSender] 이메일 발송 중 오류 발생 (userId: ${userId}):`,
        error
      )
      return false // 예외 발생 시 실패로 간주
    }
  }
}
