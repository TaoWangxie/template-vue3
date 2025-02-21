import { defineConfig,loadEnv} from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { visualizer } from 'rollup-plugin-visualizer'
import vitePluginCleaner from 'vite-plugin-clean'
import vue from "@vitejs/plugin-vue";
import path from "path";

export default ({ mode })=>defineConfig({
  plugins: [
    vue(), 
    visualizer(), 
    vitePluginCleaner({targetFiles: ['dist']}) as any,
    createHtmlPlugin({
      minify: true,
      /**
       * 在这里写entry后，你将不需要在`index.html`内添加 script 标签，原有标签需要删除
       * @default src/main.ts
       */
      entry: '/src/main.ts',
      /**
       * 需要注入 index.html ejs 模版的数据
       */
      inject: {
        data: {
          // 查找.env文件里面的VITE_APP_TITLE，请以VITE_标识开头
          title: loadEnv(mode, process.cwd()).VITE_APP_TITLE, 
          injectScript: `<script src="/inject.js"></script>`,
        },
      },
    })
  ],
  server: {
    open: true,
    host: "0.0.0.0",
    port: 5002,
  },
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
