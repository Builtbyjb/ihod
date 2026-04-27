# IHOD

#### Getting Started
```sh
npm install

# Run web application
npm run dev-web

# Set up local database
cd apps/server && npx drizzle-kit generate
cd apps/server &&  npx wrangler d1 migrations apply "ihod-dev" --env=dev --local

# Run server
npm run dev-server

# Run web application and server
npm run dev
```
