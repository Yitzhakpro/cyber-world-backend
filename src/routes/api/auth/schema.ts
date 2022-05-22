// register
const registerBody = {
    type: 'object',
    required: ['email', 'username', 'password'],
    properties: {
        email: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
    },
};
export const registerSchema = {
    body: registerBody,
};

// login
const loginBody = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: { type: 'string' },
        password: { type: 'string' },
    },
};
export const loginSchema = {
    body: loginBody,
};
