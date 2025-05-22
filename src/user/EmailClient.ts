export interface IEmailClient {
  send(
    to: string,
    subject: string,
    body: string
  ): Promise<{ success: boolean; messageId?: string }>
}
