import { defineConfig } from 'vite'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import glsl from 'vite-plugin-glsl';
import pkg from './package.json'

export default defineConfig((env) => ({
  plugins: [
    viteExternalsPlugin({
      'matter-js': 'Matter'
    }),
    glsl({
      compress: env.mode === 'production',
    }),
  ],
  define: {
    DEV: `${env.mode === 'development'}`,
    PKG_NAME: `"${pkg.name}"`,
    PKG_VERSION: `"${pkg.version}"`,
  },
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'MatterLiquid',
      fileName: 'matter-liquid',
      formats: ['es', 'umd'],
    },
    assetsDir: '',
  },
}))
