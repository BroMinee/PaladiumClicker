import dotenv from 'dotenv';

dotenv.config();

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockReturnValue({
    getAll: jest.fn().mockReturnValue([
      { name: 'cookie1', value: 'value1' },
    ]),
  }),
}));