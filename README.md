# Goa Job Fest 2026 Landing Page

## Setup

1.  **Google Apps Script (Backend)**
    *   Create a new Google Sheet.
    *   Open `Extensions > Apps Script`.
    *   Copy the content of `google-apps-script.js` into the script editor.
    *   Run the `setup()` function once to create headers.
    *   Click **Deploy > New Deployment**.
    *   Select **Type: Web App**.
    *   Set **Execute as: Me**.
    *   Set **Who has access: Anyone** (Important for the fetch to work).
    *   Copy the generated **Web App URL**.

2.  **Frontend Configuration**
    *   Open `constants.ts`.
    *   Replace `YOUR_WEB_APP_URL_HERE` with the URL copied in step 1.

3.  **Analytics**
    *   Open `index.html` and uncomment the GA4 and Meta Pixel sections, replacing placeholders with your actual IDs.

## Development

*   `npm install`
*   `npm start`

## Branding

*   Color: TJC Orange (`#ff6100`) is defined in `index.html` (Tailwind config).
*   Logo: Edit `components/Header.tsx` to add an image logo if needed.
