<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/a2d7d2ff-cc9b-40ef-929b-70815cacaaf5

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` and a private `ADMIN_PASSWORD`.
3. Run the app:
   `npm run dev`

## Administration

The administration link is hidden from the public site. Open the site URL with `#admin` at the end to reach the sign-in screen. On Vercel, add `ADMIN_PASSWORD` in the project's Environment Variables and redeploy. The password is checked by a server-side function and is not included in the public JavaScript bundle.
