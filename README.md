# BEAST FORCE UNISEX GYM Website

Premium responsive gym website with public landing pages, membership subscription flow, EmailJS confirmation hooks, and a Firebase-ready admin dashboard.

## Run Locally

Because the project uses ES modules, serve it through a local server instead of opening files directly.

```bash
python -m http.server 8080
```

Open:

- Public website: `http://localhost:8080/index.html`
- Admin login: `http://localhost:8080/admin-login.html`
- Admin dashboard: `http://localhost:8080/admin-dashboard.html`

## Configure Firebase

Edit `js/firebase-config.js` and replace the placeholder values:

```js
export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

Update the admin allowlist:

```js
export const adminAllowlist = [
  "owner@example.com"
];
```

Expected Firestore collections:

- `members`
- `membershipPlans`
- `contactMessages`
- `trainers`
- `amenities`
- `gallery`
- `settings`
- `promotions`

Until Firebase is configured, the app uses browser localStorage demo data.

## Configure EmailJS

Edit `js/firebase-config.js`:

```js
export const emailJsConfig = {
  publicKey: "...",
  serviceId: "...",
  subscriptionTemplateId: "...",
  promotionTemplateId: "..."
};
```

Suggested subscription template variables:

- `to_name`
- `to_email`
- `selected_plan`
- `confirmation_id`
- `gym_name`

Until EmailJS is configured, subscription requests are stored but emails are skipped with a console message.

## Replace Placeholders

The public search pass did not find reliable official details for BEAST FORCE UNISEX GYM. Replace these placeholders before production:

- Phone and WhatsApp number
- Email address
- Full address
- Google Maps embed URL
- Trainer names/photos
- Membership pricing
- Gallery images
- Social media links
- Privacy Policy and Terms links

## Files

- `index.html` - public website
- `success.html` - subscription confirmation page
- `admin-login.html` - admin sign-in page
- `admin-dashboard.html` - protected management dashboard
- `css/` - public and admin styling
- `js/` - app behavior, Firebase service, subscriptions, admin dashboard, animations, BMI calculator
