// vite.config.ts
import { defineConfig } from "file:///Users/davidecarpini/apps/vechain-dapp-kit/node_modules/vite/dist/node/index.js";
import react from "file:///Users/davidecarpini/apps/vechain-dapp-kit/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { nodePolyfills } from "file:///Users/davidecarpini/apps/vechain-dapp-kit/node_modules/vite-plugin-node-polyfills/dist/index.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "/Users/davidecarpini/apps/vechain-dapp-kit/examples/sample-react-app";
var vite_config_default = defineConfig(({ mode }) => {
  return {
    plugins: [nodePolyfills(), react()],
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    preview: {
      port: 5001,
      strictPort: true
    },
    server: {
      port: 5001,
      strictPort: true,
      host: true,
      origin: "http://0.0.0.0:5001"
    },
    //vitest
    test: {
      globals: true,
      environment: "happy-dom",
      setupFiles: [
        resolve(__vite_injected_original_dirname, "test/setup/setup.ts"),
        resolve(__vite_injected_original_dirname, "test/setup/resizeObserverMock.ts")
      ]
    },
    base: mode === "production" ? "/vechain-dapp-kit/react/" : "/"
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZGF2aWRlY2FycGluaS9hcHBzL3ZlY2hhaW4tZGFwcC1raXQvZXhhbXBsZXMvc2FtcGxlLXJlYWN0LWFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RhdmlkZWNhcnBpbmkvYXBwcy92ZWNoYWluLWRhcHAta2l0L2V4YW1wbGVzL3NhbXBsZS1yZWFjdC1hcHAvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RhdmlkZWNhcnBpbmkvYXBwcy92ZWNoYWluLWRhcHAta2l0L2V4YW1wbGVzL3NhbXBsZS1yZWFjdC1hcHAvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB7IG5vZGVQb2x5ZmlsbHMgfSBmcm9tICd2aXRlLXBsdWdpbi1ub2RlLXBvbHlmaWxscyc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBwbHVnaW5zOiBbbm9kZVBvbHlmaWxscygpLCByZWFjdCgpXSxcbiAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIGNvbW1vbmpzT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgcHJldmlldzoge1xuICAgICAgICAgICAgcG9ydDogNTAwMSxcbiAgICAgICAgICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIHNlcnZlcjoge1xuICAgICAgICAgICAgcG9ydDogNTAwMSxcbiAgICAgICAgICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgICAgICAgICBob3N0OiB0cnVlLFxuICAgICAgICAgICAgb3JpZ2luOiAnaHR0cDovLzAuMC4wLjA6NTAwMScsXG4gICAgICAgIH0sXG4gICAgICAgIC8vdml0ZXN0XG4gICAgICAgIHRlc3Q6IHtcbiAgICAgICAgICAgIGdsb2JhbHM6IHRydWUsXG4gICAgICAgICAgICBlbnZpcm9ubWVudDogJ2hhcHB5LWRvbScsXG4gICAgICAgICAgICBzZXR1cEZpbGVzOiBbXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShfX2Rpcm5hbWUsICd0ZXN0L3NldHVwL3NldHVwLnRzJyksXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShfX2Rpcm5hbWUsICd0ZXN0L3NldHVwL3Jlc2l6ZU9ic2VydmVyTW9jay50cycpLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgYmFzZTogbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nID8gJy92ZWNoYWluLWRhcHAta2l0L3JlYWN0LycgOiAnLycsXG4gICAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUVBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixTQUFTLHFCQUFxQjtBQUM5QixTQUFTLGVBQWU7QUFMeEIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDdEMsU0FBTztBQUFBLElBQ0gsU0FBUyxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUM7QUFBQSxJQUNsQyxPQUFPO0FBQUEsTUFDSCxpQkFBaUI7QUFBQSxRQUNiLHlCQUF5QjtBQUFBLE1BQzdCO0FBQUEsSUFDSjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ0wsTUFBTTtBQUFBLE1BQ04sWUFBWTtBQUFBLElBQ2hCO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDSixNQUFNO0FBQUEsTUFDTixZQUFZO0FBQUEsTUFDWixNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsSUFDWjtBQUFBO0FBQUEsSUFFQSxNQUFNO0FBQUEsTUFDRixTQUFTO0FBQUEsTUFDVCxhQUFhO0FBQUEsTUFDYixZQUFZO0FBQUEsUUFDUixRQUFRLGtDQUFXLHFCQUFxQjtBQUFBLFFBQ3hDLFFBQVEsa0NBQVcsa0NBQWtDO0FBQUEsTUFDekQ7QUFBQSxJQUNKO0FBQUEsSUFDQSxNQUFNLFNBQVMsZUFBZSw2QkFBNkI7QUFBQSxFQUMvRDtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
