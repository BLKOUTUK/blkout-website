import { defineConfig } from 'checkly'

const config = defineConfig({
  projectName: 'IVOR Monitoring',
  logicalId: 'ivor-monitoring',
  repoUrl: 'https://github.com/BLKOUTUK/ivor-platform',
  checks: {
    locations: ['eu-west-1'],
    tags: ['ivor', 'production'],
    runtimeId: '2024.09',
    environmentVariables: [],
    checkMatch: '**/*.check.js',
    ignoreDirectoriesMatch: []
  },
  cli: {
    runLocation: 'eu-west-1',
  }
})

export default config