# ForkLore (Vite + React + TypeScript + Rust + Actix)

[![CI](https://img.shields.io/github/actions/workflow/status/NithinV404/forklore/docker.yml?label=CI)](https://github.com/NithinV404/forklore/actions/workflows/docker.yml)
![License](https://img.shields.io/github/license/NithinV404/forklore)
![Forks](https://img.shields.io/github/forks/NithinV404/forklore)
![Stars](https://img.shields.io/github/stars/NithinV404/forklore)
![Issues](https://img.shields.io/github/issues/NithinV404/forklore)

A full-stack recipe management app built with React (frontend) and Rust/Actix (backend). Save, search, and manage recipes locally or from TheMealDB API.

![Example Image 1](./images/screenshots/photo_1.png)

![Example Image 2](./images/screenshots/photo_2.png)

![Example Image 3](./images/screenshots/photo_3.png)

![Example Image 4](./images/screenshots/photo_4.png)

## Quick Start with Docker (Recommended)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/NithinV404/forklore.git
   cd forklore
   ```

2. **Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

3. **Open in browser**:
   - Frontend: http://localhost:8000
   - API: http://localhost:5000

## Local Development

### Prerequisites
- Node.js 20+
- Rust 1.75+
- npm or yarn

### Setup
1. **Clone and navigate**:
   ```bash
   git clone https://github.com/NithinV404/forklore.git
   cd forklore
   ```

2. **Backend (Rust)**:
   ```bash
   cd server
   cargo run
   ```
   Server runs on http://localhost:5000

3. **Frontend (React)**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   App runs on http://localhost:5173

### Environment Variables
- Copy `server/.env` and adjust as needed (e.g., `HOST=0.0.0.0` for Docker).
- For frontend, set `VITE_API_BASE` if needed (defaults to `http://127.0.0.1:5000`).

## Features

- **Recipe Management**: Add, edit, delete, and search recipes.
- **Image Uploads**: Upload and serve recipe images.
- **API Integration**: Fetch recipes from TheMealDB.
- **Import/Export**: JSON-based recipe import/export.
- **Responsive UI**: Built with React, TypeScript, and Tailwind CSS.

## API Endpoints

- `GET /` - Fetch all recipes
- `POST /addrecipe` - Add a new recipe (multipart)
- `POST /editrecipe` - Edit a recipe (multipart)
- `DELETE /delete/{id}` - Delete a recipe
- `POST /search` - Search remote recipes
- `GET /export` - Export recipes as JSON
- `POST /import` - Import recipes from JSON
- `GET /saved` - Get saved recipes
- `GET /recipes/images/*` - Serve uploaded images

## Contributing

- Fork the repository and submit pull requests.
- Ensure CI passes (linting, building, and tests).
- Follow the code style (Prettier for JS/TS, rustfmt for Rust).

## License

This project is licensed under the MIT License. Please do not claim it as your own.
