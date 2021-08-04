import type { Config } from '@jest/types'
const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  rootDir: __dirname,
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  testRegex: '\\.e2e-spec\\.ts',
}
export default config
