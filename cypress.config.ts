import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000',
    setupNodeEvents(on, config) {
      // Здесь могут быть плагины и кастомные события
      return config;
    }
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack'
    }
  }
});
