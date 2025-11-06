# Forklore Client

Minimal React + TypeScript + Tailwind UI for the Forklore server.

How to run

1. cd client
2. npm install
3. npm run dev

Notes

- The client expects the API server to run at http://127.0.0.1:5000 (this is the default in `src/api.ts`).
- The server serves images at `/recipes/images` and the API endpoints are:
  - `GET /` - list recipes
  - `POST /addrecipe` - add recipe (JSON)
  - `DELETE /delete/{id}` - delete recipe
