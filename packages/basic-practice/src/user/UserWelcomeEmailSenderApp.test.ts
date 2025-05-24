import { IEmailClient } from '@/user/EmailClient'
import { IUserService } from '@/user/UserService'
import { UserWelcomeEmailSender } from '@/user/UserWelcomeEmailSenderApp'
import { describe, it, expect, beforeEach, vi } from 'vitest'

// 의존 객체 UserWelcomeEmailSender 테스트
describe('UserWelcomeEmailSender', () => {
  describe('sendWelcomeEmail', () => {
    let mockUserService: IUserService
    let mockEmailClient: IEmailClient
    let emailSender: UserWelcomeEmailSender

    beforeEach(() => {
      // 각 테스트 전에 Mock 객체들을 초기화합니다.
      mockUserService = {
        // vi.fn()으로 getUserDetails를 모킹하고, 기본적으로 null을 반환하도록 스텁 처리합니다.
        getUserDetails: vi.fn(async (userId: string) => null),
      }
      mockEmailClient = {
        // vi.fn()으로 send 모킹하고, 기본적으로 성공 응답을 반환하도록 스텁 처리합니다.
        send: vi.fn(async (to: string, subject: string, body: string) => ({
          success: true,
        })), // 일단 기본 성공으로
      }
      // 아직 UserWelcomeEmailSender 클래스가 없으니 이 줄은 에러가 날 겁니다. 좋습니다!
      emailSender = new UserWelcomeEmailSender(mockUserService, mockEmailClient)
    })

    it('사용자를 찾을 수 없으면 false를 반환하고 이메일을 보내지 않아야 한다', async () => {
      // Arrange
      const nonExistentUserId = 'user_not_found_id'
      // mockUserService.getUserDetails는 이미 beforeEach에서 null을 반환하도록 설정됨

      // Act
      const result = await emailSender.sendWelcomeEmail(nonExistentUserId)

      // Assert
      expect(result).toBe(false) // 결과는 false여야 함
      expect(mockUserService.getUserDetails).toHaveBeenCalledWith(
        nonExistentUserId
      ) // UserService는 호출되어야 함
      expect(mockEmailClient.send).not.toHaveBeenCalled() // EmailClient.send는 호출되지 않아야 함
    })

    it('사용자를 찾으면 환영 이메일을 보내고 true를 반환해야 한다', async () => {
      // Arrange (Given): 테스트를 위한 상황 설정
      const testUserId = 'found_user_id_123'
      const mockUserDetails = {
        id: testUserId,
        name: '강현',
        email: 'kanghyun@example.com',
      }
      const expectedEmailSubject = '환영합니다!' // 우리가 기대하는 이메일 제목
      const expectedEmailBody = `안녕하세요, ${mockUserDetails.name}님! 저희 서비스에 오신 것을 환영합니다!` // 우리가 기대하는 이메일 본문

      // 1. UserService.getUserDetails가 특정 사용자 정보를 반환하도록 스텁(Stub) 설정
      // (beforeEach에서 설정한 기본 mock을 이번 테스트 케이스에 맞게 오버라이드합니다)
      mockUserService.getUserDetails = vi
        .fn()
        .mockResolvedValue(mockUserDetails)

      // 2. EmailClient.send가 성공 응답을 반환하도록 스텁(Stub) 설정
      mockEmailClient.send = vi.fn().mockResolvedValue({
        success: true,
        messageId: 'mock-email-id-123',
      })

      // Act (When): 실제 테스트 대상 메서드 실행
      const result = await emailSender.sendWelcomeEmail(testUserId)

      // Assert (Then): 결과 및 상호작용 검증
      // 2a. 최종 반환 값 검증
      expect(result).toBe(true)

      // 2b. UserService.getUserDetails가 올바른 인자로 호출되었는지 검증
      expect(mockUserService.getUserDetails).toHaveBeenCalledWith(testUserId)

      // 2c. EmailClient.send가 올바른 인자들로 정확히 한 번 호출되었는지 검증 (Mock Interaction Verification)
      expect(mockEmailClient.send).toHaveBeenCalledTimes(1)
      expect(mockEmailClient.send).toHaveBeenCalledWith(
        mockUserDetails.email, // 기대하는 수신자 이메일
        expectedEmailSubject, // 기대하는 이메일 제목
        expectedEmailBody // 기대하는 이메일 본문
      )
    })
    // 여기에 다음 테스트 케이스들이 추가될 예정입니다...
  })
})
