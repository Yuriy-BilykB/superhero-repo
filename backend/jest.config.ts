import type { JestConfigWithTsJest } from 'ts-jest';
import 'ts-node/register';
const config: JestConfigWithTsJest = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/?(*.)+(test).ts'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};

export default config;
