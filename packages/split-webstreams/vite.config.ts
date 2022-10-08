import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  //   root: path.resolve(__dirname),
  //   define: {
  //     'process.env.NODE_ENV': '"production"',
  //   },

  // due to https://github.com/evanw/esbuild/issues/1124
  resolve: {
    alias: {
      './node': './browser',
    },
  },
  build: {
    emptyOutDir: true,
    outDir: 'dist/packages/split-webstreams/dist',
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, './src/index.ts'),
      name: 'split-webstreams',
      // the proper extensions will be added
      fileName: 'split-webstreams',
      formats: ['es', 'umd'],
    },
    // rollupOptions: {
    //   // make sure to externalize deps that shouldn't be bundled
    //   // into your library
    //   external: ['vue'],
    //   output: {
    //     // Provide global variables to use in the UMD build
    //     // for externalized deps
    //     globals: {
    //       vue: 'Vue',
    //     },
    //   },
    // },
  },
});
