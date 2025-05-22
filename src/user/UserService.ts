export interface IUserService {
  getUserDetails(
    userId: string
  ): Promise<{ id: string; name: string; email: string } | null>
}
