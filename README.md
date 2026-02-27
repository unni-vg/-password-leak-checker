# Password Leak Checker Dashboard

A lightweight single-page dashboard to check whether a password appears in known breach data using the **Have I Been Pwned (HIBP)** Pwned Passwords API and the **k-anonymity** model.

## Features

- Client-side SHA-1 hashing with `crypto.subtle`
- k-anonymity lookup via `https://api.pwnedpasswords.com/range/{prefix}`
- Simple dashboard stats:
  - Checks Run
  - Exposed Passwords
  - Safe Passwords
- Recent check history panel
- Show/Hide password toggle
- Enter key support for quick submit

## Privacy Model

This app never sends the raw password to HIBP.

1. The password is hashed in the browser (SHA-1).
2. Only the first 5 characters of the hash (the prefix) are sent to the API.
3. The remaining suffix is matched locally in the browser.

This is the standard HIBP Pwned Passwords k-anonymity approach.

## Getting Started

### Run locally

```bash
python3 -m http.server 4173
```

Then open:

- `http://127.0.0.1:4173`

### Project files

- `index.html` — page structure and dashboard sections
- `styles.css` — visual styling
- `app.js` — hashing, API lookup, and UI logic

## Notes

- This tool is intended for educational/demo usage and quick checks.
- If the HIBP endpoint is unavailable, the UI shows an error state and preserves app responsiveness.

