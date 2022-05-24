export interface LoginResponse {
    success: boolean;
    userInfo?: { username: string; createdAt: Date };
}
