# IHOD

#### Getting Started
```sh
npm install

# Run web application
npm run dev-web

# Run server
npm run dev-server

# Run web application and server
npm run dev

# Create database migrations
cd apps/server && npx drizzle-kit generate

# Apply database migrations
cd apps/server && npx npx wrangler d1 migrations apply 'ihod-dev' --env=dev --local
```
