import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'jsdom',
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            useESM: true,
            tsconfig: './tsconfig.jest.json'
        }]
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js'],
};

export default config;
