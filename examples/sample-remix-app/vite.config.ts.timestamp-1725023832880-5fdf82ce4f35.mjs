// vite.config.ts
import { vitePlugin as remix } from "file:///Users/federicoluigialfeo/developer-workdir/dapp/vechain-dapp-kit/examples/sample-remix-app/node_modules/@remix-run/dev/dist/index.js";
import { defineConfig } from "file:///Users/federicoluigialfeo/developer-workdir/dapp/vechain-dapp-kit/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///Users/federicoluigialfeo/developer-workdir/dapp/vechain-dapp-kit/node_modules/vite-tsconfig-paths/dist/index.mjs";
import { installGlobals } from "file:///Users/federicoluigialfeo/developer-workdir/dapp/vechain-dapp-kit/examples/sample-remix-app/node_modules/@remix-run/node/dist/index.js";
installGlobals();
var vite_config_default = defineConfig(({ mode }) => ({
  plugins: [remix(), tsconfigPaths()],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for segment analytics lib to work
    global: {},
    process: {
      env: { DEBUG: void 0 },
      version: ""
      // to avoid undefined.slice error
    }
  },
  resolve: {
    alias: {
      process: "process/browser",
      buffer: "buffer",
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      assert: "assert",
      http: "stream-http",
      https: "https-browserify",
      os: "os-browserify",
      url: "url",
      util: "util"
    }
  },
  base: mode === "production" ? "/vechain-dapp-kit/react/" : "/"
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZmVkZXJpY29sdWlnaWFsZmVvL2RldmVsb3Blci13b3JrZGlyL2RhcHAvdmVjaGFpbi1kYXBwLWtpdC9leGFtcGxlcy9zYW1wbGUtcmVtaXgtYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZmVkZXJpY29sdWlnaWFsZmVvL2RldmVsb3Blci13b3JrZGlyL2RhcHAvdmVjaGFpbi1kYXBwLWtpdC9leGFtcGxlcy9zYW1wbGUtcmVtaXgtYXBwL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9mZWRlcmljb2x1aWdpYWxmZW8vZGV2ZWxvcGVyLXdvcmtkaXIvZGFwcC92ZWNoYWluLWRhcHAta2l0L2V4YW1wbGVzL3NhbXBsZS1yZW1peC1hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyB2aXRlUGx1Z2luIGFzIHJlbWl4IH0gZnJvbSAnQHJlbWl4LXJ1bi9kZXYnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcbmltcG9ydCB7IGluc3RhbGxHbG9iYWxzIH0gZnJvbSAnQHJlbWl4LXJ1bi9ub2RlJztcblxuaW5zdGFsbEdsb2JhbHMoKTtcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gICAgcGx1Z2luczogW3JlbWl4KCksIHRzY29uZmlnUGF0aHMoKV0sXG4gICAgYnVpbGQ6IHtcbiAgICAgICAgY29tbW9uanNPcHRpb25zOiB7XG4gICAgICAgICAgICB0cmFuc2Zvcm1NaXhlZEVzTW9kdWxlczogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIGRlZmluZToge1xuICAgICAgICAvLyBCeSBkZWZhdWx0LCBWaXRlIGRvZXNuJ3QgaW5jbHVkZSBzaGltcyBmb3IgTm9kZUpTL1xuICAgICAgICAvLyBuZWNlc3NhcnkgZm9yIHNlZ21lbnQgYW5hbHl0aWNzIGxpYiB0byB3b3JrXG4gICAgICAgIGdsb2JhbDoge30sXG4gICAgICAgIHByb2Nlc3M6IHtcbiAgICAgICAgICAgIGVudjogeyBERUJVRzogdW5kZWZpbmVkIH0sXG4gICAgICAgICAgICB2ZXJzaW9uOiAnJywgLy8gdG8gYXZvaWQgdW5kZWZpbmVkLnNsaWNlIGVycm9yXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICAgIGFsaWFzOiB7XG4gICAgICAgICAgICBwcm9jZXNzOiAncHJvY2Vzcy9icm93c2VyJyxcbiAgICAgICAgICAgIGJ1ZmZlcjogJ2J1ZmZlcicsXG4gICAgICAgICAgICBjcnlwdG86ICdjcnlwdG8tYnJvd3NlcmlmeScsXG4gICAgICAgICAgICBzdHJlYW06ICdzdHJlYW0tYnJvd3NlcmlmeScsXG4gICAgICAgICAgICBhc3NlcnQ6ICdhc3NlcnQnLFxuICAgICAgICAgICAgaHR0cDogJ3N0cmVhbS1odHRwJyxcbiAgICAgICAgICAgIGh0dHBzOiAnaHR0cHMtYnJvd3NlcmlmeScsXG4gICAgICAgICAgICBvczogJ29zLWJyb3dzZXJpZnknLFxuICAgICAgICAgICAgdXJsOiAndXJsJyxcbiAgICAgICAgICAgIHV0aWw6ICd1dGlsJyxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIGJhc2U6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyA/ICcvdmVjaGFpbi1kYXBwLWtpdC9yZWFjdC8nIDogJy8nLFxufSkpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtYyxTQUFTLGNBQWMsYUFBYTtBQUN2ZSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLG1CQUFtQjtBQUMxQixTQUFTLHNCQUFzQjtBQUUvQixlQUFlO0FBQ2YsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN2QyxTQUFTLENBQUMsTUFBTSxHQUFHLGNBQWMsQ0FBQztBQUFBLEVBQ2xDLE9BQU87QUFBQSxJQUNILGlCQUFpQjtBQUFBLE1BQ2IseUJBQXlCO0FBQUEsSUFDN0I7QUFBQSxFQUNKO0FBQUEsRUFDQSxRQUFRO0FBQUE7QUFBQTtBQUFBLElBR0osUUFBUSxDQUFDO0FBQUEsSUFDVCxTQUFTO0FBQUEsTUFDTCxLQUFLLEVBQUUsT0FBTyxPQUFVO0FBQUEsTUFDeEIsU0FBUztBQUFBO0FBQUEsSUFDYjtBQUFBLEVBQ0o7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILFNBQVM7QUFBQSxNQUNULFFBQVE7QUFBQSxNQUNSLFFBQVE7QUFBQSxNQUNSLFFBQVE7QUFBQSxNQUNSLFFBQVE7QUFBQSxNQUNSLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxNQUNQLElBQUk7QUFBQSxNQUNKLEtBQUs7QUFBQSxNQUNMLE1BQU07QUFBQSxJQUNWO0FBQUEsRUFDSjtBQUFBLEVBQ0EsTUFBTSxTQUFTLGVBQWUsNkJBQTZCO0FBQy9ELEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
