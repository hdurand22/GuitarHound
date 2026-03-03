# GuitarHound

Run "npm run dev" in terminal to start dev environment (runs node server and frontend with concurrently)

# FILE STRUCTURE
server/ contains all backend files
  - Jest tests (src/tests/)
  - handler.ts (all API routes with Express)
  - index.ts (server creation and entrypoint)
  - server.ts (server config for server object used in index.ts and list of all routes from handler.ts)
  - utils.ts (test-related definitions)

web/ contains all frontend files
 - Vite application (React w/ TypeScript)
 - src/ contains all frontend view files