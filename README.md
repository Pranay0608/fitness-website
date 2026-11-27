# FORGE — AI Personal Trainer Website

## Run it locally
1. Install Node.js (LTS) from https://nodejs.org if you don't have it.
2. Open a terminal in this folder.
3. Run: `npm install`
4. Run: `npm run dev`
5. Open the link shown (usually http://localhost:5173) in your browser.

## Publish it live (free, you own it)
1. Create a free GitHub account at https://github.com
2. Create a new empty repository (e.g. "forge-app")
3. In this folder's terminal, run:
   ```
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/forge-app.git
   git push -u origin main
   ```
4. Create a free account at https://vercel.com using "Continue with GitHub"
5. Click "Add New Project", select your "forge-app" repo, click "Deploy"
6. In a minute you'll get a live public link like `forge-app.vercel.app`

## Connect your own domain (optional)
In your Vercel project → Settings → Domains → add your domain, then update
the DNS records at your domain provider (GoDaddy, Namecheap, etc.) as shown.

## About the AI Coach tab
It calls the Anthropic API directly from the browser for local testing.
For a real public deployment, move that fetch call into a Vercel serverless
function (an `api/coach.js` file) and store your Anthropic API key as an
environment variable in Vercel — never ship an API key in frontend code.
