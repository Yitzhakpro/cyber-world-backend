// USER - GET
const getUserByIdParams = {
    type: 'object',
    required: ['userId'],
    properties: {
        userId: { type: 'string' },
    },
};
export const getUserByIdSchema = {
    params: getUserByIdParams,
};
