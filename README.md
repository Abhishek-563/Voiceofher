# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## MongoDB Atlas Setup

This project uses Mongoose to connect to MongoDB. You do not need to manually create collections in Atlas — MongoDB will create them automatically when the first document is inserted.

Important: the backend uses `backend/.env`, not the root `/.env` file.

To use Atlas:

1. Create a MongoDB Atlas cluster and database user.
2. Copy `backend/.env.example` to `backend/.env`.
3. Update `MONGO_URI` with your actual Atlas string.
   Example:
   `mongodb+srv://<username>:<password>@cluster0.f6mk8nx.mongodb.net/voiceofher?retryWrites=true&w=majority`
4. If your password contains special characters such as `$`, `@`, or `%`, URL-encode them.
   Example password `Abhi$2005` becomes `Abhi%242005`.
5. Start the backend from the `backend` folder:
   - `cd backend`
   - `npm install`
   - `npm run dev`
6. Verify backend health by opening:
   `http://localhost:5000/api/health`

If the backend starts but crashes with a MongoDB Atlas connection error, your Atlas cluster likely needs network access allowed for your IP.

- Open Atlas > Network Access > Add IP Address.
- For testing, use `0.0.0.0/0` to allow all IPs temporarily.
- Then restart the backend.

The backend already reads the `MONGO_URI` environment variable in `backend/config/db.js`, falling back to `mongodb://localhost:27017/voiceofher` if not set.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
