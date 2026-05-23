# DevPulse


## Developer notes
- Plan: I carefully read the requirements and noted the folder structure, created the folders and files, pushed changes by feature branches, connected the database and started the server (which creates the tables), then deployed. I faced deployment issues on Vercel while iterating — had to recreate the repo and Vercel project multiple times (≈10) while debugging pushes — but continued by pushing per-feature and finally succeeded with the deployment.


## Tech stack
- Node.js + TypeScript
- Express.js
- PostgreSQL (`pg` native driver)
- `bcryptjs` (password hashing)
- `jsonwebtoken` (JWT)
- Vercel for deployment



## API endpoints (summary)
- POST /api/auth/signup — Register (public)
  - Body: `{ name, email, password, role? }`
- POST /api/auth/login — Login (public)
  - Body: `{ email, password }`
  - Response includes `{ token, user }` where `token` is a JWT containing `id`, `name`, `role`.

- POST /api/issues — Create issue (auth)
  - Header: `Authorization: Bearer <TOKEN>`
  - Body: `{ title, description, type }` (type: `bug` | `feature_request`)
- GET /api/issues — List issues (public)
  - Query: `?sort=newest|oldest&type=bug|feature_request&status=open|in_progress|resolved`
- GET /api/issues/:id — Get single issue (public)
- PATCH /api/issues/:id — Update issue (auth)
  - Maintainer: can update any issue
  - Contributor: can update own issue if issue `status` is `open`
  - Body: any of `{ title, description, type }`
- DELETE /api/issues/:id — Delete issue (auth, maintainer-only)
- GET /api/metrics — System metrics (auth, maintainer-only)



## Final submission checklist
- ✅ GitHub Repo (Public):  <https://github.com/Iam-Zarif/devpulse>
- ✅ Live Deployment (Public):  <https://dev-pulse-mostofafatin.vercel.app>
- ✅ Interview Video (Public):  <https://drive.google.com/file/d/1mpm0a3-Nhc3gt93shmB481vPGAWuziL-/view?usp=sharing.>

