// register
const registerBody = {
    type: 'object',
    required: ['email', 'username', 'password', 'birthDate', 'rememberMe'],
    properties: {
        email: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
        birthDate: { type: 'string' },
        rememberMe: { type: 'boolean' },
    },
};
export const registerSchema = {
    body: registerBody,
};

// login
const loginBody = {
    type: 'object',
    required: ['email', 'password', 'rememberMe'],
    properties: {
        email: { type: 'string' },
        password: { type: 'string' },
        rememberMe: { type: 'boolean' },
    },
};
export const loginSchema = {
    body: loginBody,
};
