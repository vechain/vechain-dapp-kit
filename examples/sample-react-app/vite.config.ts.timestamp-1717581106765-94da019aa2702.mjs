// vite.config.ts
import { defineConfig } from "file:///Users/darren/workspace/vechain/vechain-dapp-kit/node_modules/vite/dist/node/index.js";
import react from "file:///Users/darren/workspace/vechain/vechain-dapp-kit/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { nodePolyfills } from "file:///Users/darren/workspace/vechain/vechain-dapp-kit/node_modules/vite-plugin-node-polyfills/dist/index.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "/Users/darren/workspace/vechain/vechain-dapp-kit/examples/sample-react-app";
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
      environment: "jsdom",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZGFycmVuL3dvcmtzcGFjZS92ZWNoYWluL3ZlY2hhaW4tZGFwcC1raXQvZXhhbXBsZXMvc2FtcGxlLXJlYWN0LWFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RhcnJlbi93b3Jrc3BhY2UvdmVjaGFpbi92ZWNoYWluLWRhcHAta2l0L2V4YW1wbGVzL3NhbXBsZS1yZWFjdC1hcHAvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RhcnJlbi93b3Jrc3BhY2UvdmVjaGFpbi92ZWNoYWluLWRhcHAta2l0L2V4YW1wbGVzL3NhbXBsZS1yZWFjdC1hcHAvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB7IG5vZGVQb2x5ZmlsbHMgfSBmcm9tICd2aXRlLXBsdWdpbi1ub2RlLXBvbHlmaWxscyc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBwbHVnaW5zOiBbbm9kZVBvbHlmaWxscygpLCByZWFjdCgpXSxcbiAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIGNvbW1vbmpzT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgcHJldmlldzoge1xuICAgICAgICAgICAgcG9ydDogNTAwMSxcbiAgICAgICAgICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIHNlcnZlcjoge1xuICAgICAgICAgICAgcG9ydDogNTAwMSxcbiAgICAgICAgICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgICAgICAgICBob3N0OiB0cnVlLFxuICAgICAgICAgICAgb3JpZ2luOiAnaHR0cDovLzAuMC4wLjA6NTAwMScsXG4gICAgICAgIH0sXG4gICAgICAgIC8vdml0ZXN0XG4gICAgICAgIHRlc3Q6IHtcbiAgICAgICAgICAgIGdsb2JhbHM6IHRydWUsXG4gICAgICAgICAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICAgICAgICAgIHNldHVwRmlsZXM6IFtcbiAgICAgICAgICAgICAgICByZXNvbHZlKF9fZGlybmFtZSwgJ3Rlc3Qvc2V0dXAvc2V0dXAudHMnKSxcbiAgICAgICAgICAgICAgICByZXNvbHZlKF9fZGlybmFtZSwgJ3Rlc3Qvc2V0dXAvcmVzaXplT2JzZXJ2ZXJNb2NrLnRzJyksXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBiYXNlOiBtb2RlID09PSAncHJvZHVjdGlvbicgPyAnL3ZlY2hhaW4tZGFwcC1raXQvcmVhY3QvJyA6ICcvJyxcbiAgICB9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBRUEsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLFNBQVMscUJBQXFCO0FBQzlCLFNBQVMsZUFBZTtBQUx4QixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN0QyxTQUFPO0FBQUEsSUFDSCxTQUFTLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQztBQUFBLElBQ2xDLE9BQU87QUFBQSxNQUNILGlCQUFpQjtBQUFBLFFBQ2IseUJBQXlCO0FBQUEsTUFDN0I7QUFBQSxJQUNKO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDTCxNQUFNO0FBQUEsTUFDTixZQUFZO0FBQUEsSUFDaEI7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNKLE1BQU07QUFBQSxNQUNOLFlBQVk7QUFBQSxNQUNaLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxJQUNaO0FBQUE7QUFBQSxJQUVBLE1BQU07QUFBQSxNQUNGLFNBQVM7QUFBQSxNQUNULGFBQWE7QUFBQSxNQUNiLFlBQVk7QUFBQSxRQUNSLFFBQVEsa0NBQVcscUJBQXFCO0FBQUEsUUFDeEMsUUFBUSxrQ0FBVyxrQ0FBa0M7QUFBQSxNQUN6RDtBQUFBLElBQ0o7QUFBQSxJQUNBLE1BQU0sU0FBUyxlQUFlLDZCQUE2QjtBQUFBLEVBQy9EO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
