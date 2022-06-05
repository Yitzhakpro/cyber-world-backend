import { authService } from '@services';

export const verifySavedToken = async (currentToken: string, username: string): Promise<boolean> => {
    try {
        const savedToken = await authService.getSavedUserToken(username);

        if (currentToken === savedToken) {
            return true;
        }

        return false;
    } catch (err) {
        return false;
    }
};
