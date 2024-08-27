// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
      config.experiments = {
        asyncWebAssembly: true,
        syncWebAssembly: true,
      };
      return config;
    },
  };
  
  export default nextConfig;