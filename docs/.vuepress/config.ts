import { defineUserConfig } from '@vuepress/cli'
import type { DefaultThemeOptions } from '@vuepress/theme-default'

export default defineUserConfig<DefaultThemeOptions>({
  title: "feathers-authentication-management",
  description:
    "Sign up verification, forgotten password reset, and other capabilities for local authentication",
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    logo: '/logo.svg',
    repo: "feathersjs-ecosystem/feathers-authentication-management",
    docsBranch: "typescript",
    docsDir: "docs",
    contributors: false,
    editLink: true,
    editLinkText: "Edit this page on GitHub",
    sidebar: [
      "/overview.md",
      "/getting-started.md",
      "/process-flows.md",
      "/configuration.md",
      "/service-hooks.md",
      "/service-calls.md",
      "/best-practices.md"
    ],
  },
});