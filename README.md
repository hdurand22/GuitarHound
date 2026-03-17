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
   - Components:
     - ResultCard
     - ScrapeButton
   - Pages:
     - ScrapePage
   - types:
     - product.ts (standardizes scrape result into a Product (image, URL, name, price))
     - api.ts (enforces results as array of Products)

# LIBRARIES AND PACKAGES
 - Playwright: for running the scrapers and extracting DOM information
 - Bootstrap: for styling