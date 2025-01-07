import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.e2e.spec.ts'],
    setupFiles: ['./test/setups/setup.ts'],
    globals: true,
  },
})
