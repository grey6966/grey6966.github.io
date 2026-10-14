import {defineConfig} from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
    site: 'https://grey6966.github.io',
    integrations: [mdx(), sitemap(), tailwind()],
    // 旧文标题变更后 slug 随之改变，保留原地址的 301 跳转，避免外部链接失效
    redirects: {
        '/blog/windows': '/blog/windows-terminal--oh-my-posh',
    },
    server: {port: 8080}
});
