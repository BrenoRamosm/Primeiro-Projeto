# Bridges Portfolio

## 🌐 UCA Network Connection (GitHub)

To link this local project to your GitHub repository using your bash terminal, follow these steps:

1. **Initialize Local Node:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Reconnecting America"
   ```

2. **Establish Remote Link:**
   If you have the `gh` CLI installed:
   ```bash
   gh repo create
   ```
   *Follow the prompts to push your existing local repository.*

   Otherwise, create a repo on GitHub.com and run:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

---

## 🧞 Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

