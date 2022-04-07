import { defineNuxtConfig } from "nuxt3";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  privateRuntimeConfig: {
    VIMEO_CLIENT_ID: process.env.VIMEO_CLIENT_ID!,
    VIMEO_CLIENT_SECRET: process.env.VIMEO_CLIENT_SECRET!,
    VIMEO_ACCESS_TOKEN: process.env.VIMEO_ACCESS_TOKEN!,
  },
  modules: ["@nuxtjs/tailwindcss"],
});
