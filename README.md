Frontend – Website HTML Fetcher
This is the frontend for the Website HTML Fetcher app, built with Next.js and TypeScript.
It allows users to enter any website URL, fetch its HTML content via the backend API, preview it, and extract assets (images, CSS, JS files).

🚀 Features
Fetch website HTML via backend API

Live preview in an iframe

Editable HTML code editor

Extract and display assets:

Images

CSS files

JS files

Copy HTML to clipboard

Download HTML file

Persistent fetched data across pages (clears on refresh)

🛠 Tech Stack
Next.js 13+ (App Router)

TypeScript

Axios for API requests

React Hooks (useState, useEffect)

CSS-in-JS styling

📦 Installation
bash
Copy
Edit
# Clone the repo
git clone https://github.com/Abu388/Fetch-Website-frontend

# Go into the project folder
cd frontend-repo

# Install dependencies
npm install

# Start the development server
npm run dev
⚙️ Environment Variables
Create a .env.local file in the root directory:

ini
Copy
Edit
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
▶️ Usage
Start the backend server (see backend README).

Run npm run dev to start the frontend.

Open http://localhost:3000 in your browser.

Enter a URL and click Fetch to see the preview and extracted assets.

📂 Project Structure
bash
Copy
Edit
/app
  /page.tsx        # Home page
  /about           # Example extra page
/components        # Reusable components
/styles            # Styles (if applicable)
📌 Deployment
Deploy the frontend to Vercel

Set NEXT_PUBLIC_BACKEND_URL in Vercel's environment variables to point to your Render backend
