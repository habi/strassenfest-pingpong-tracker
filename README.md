# 🏓 Strassenfest Ping-Pong Rangliste

A mobile-friendly single-page web app for tracking a round-robin table tennis
tournament at a street festival. Players can register themselves, record match
results from their own phones, and watch the global live ranking update in
real time — powered by Firebase Realtime Database.

## Features

- **Add players** by name via a simple form
- **Record match results** — choose two players and pick the winner
- **Live ranking** — globally sorted by win percentage (all players, regardless
  of how many games they have played)
- **Match history** — last 20 games shown on the ranking screen
- Works great on **mobile phones** (large touch targets, responsive layout)
- Data is stored in **Firebase Realtime Database** and syncs instantly across
  all connected devices

## Setup

### 1. Create a Firebase project

1. Go to <https://console.firebase.google.com> and create a new project.
2. Add a **Web app** to the project (click the `</>` icon).
3. Copy the `firebaseConfig` object shown in the setup wizard.
4. Enable **Realtime Database** (Build → Realtime Database → Create database).
   Choose a region and start in **test mode** during the event (or set up
   proper security rules — see below).

### 2. Configure the app

```bash
cp firebase-config.example.js firebase-config.js
```

Open `firebase-config.js` and replace the placeholder values with your actual
Firebase credentials:

```js
const firebaseConfig = {
  apiKey:            "AIza...",
  authDomain:        "my-project.firebaseapp.com",
  databaseURL:       "https://my-project-default-rtdb.firebaseio.com",
  projectId:         "my-project",
  storageBucket:     "my-project.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123"
};
```

> **Note:** `firebase-config.js` is listed in `.gitignore` so your credentials
> are never accidentally committed.

### 3. Deploy to GitHub Pages (recommended)

This repository includes a GitHub Actions workflow that builds and deploys the
site automatically every time you push to `main`.

#### One-time setup

1. **Enable GitHub Pages**
   Repository → Settings → Pages → Source: **GitHub Actions**

2. **Set the Firebase config secret**
   Repository → Settings → Secrets and variables → Actions → New repository secret:
   - Name: `FIREBASE_CONFIG_JS`
   - Value: the complete content of your `firebase-config.js` file, e.g.:
     ```js
     const firebaseConfig = {
       apiKey:            "AIza...",
       authDomain:        "my-project.firebaseapp.com",
       databaseURL:       "https://my-project-default-rtdb.firebaseio.com",
       projectId:         "my-project",
       storageBucket:     "my-project.appspot.com",
       messagingSenderId: "123456789",
       appId:             "1:123456789:web:abc123"
     };
     ```

3. **Push to `main`** (or trigger the workflow manually via Actions → Deploy to
   GitHub Pages → Run workflow).

Your site will be live at:
`https://<your-github-username>.github.io/strassenfest-pingpong-tracker/`

> **Note:** `firebase-config.js` is injected from the secret at deploy time
> and is never stored in the repository. If the secret is missing the site
> still loads but shows a configuration warning.

### 3b. Other ways to open `index.html`

Because Firebase Realtime Database is accessed via HTTPS you need to serve the
file from a web server (or deploy it). The easiest options:

| Option | Command / Steps |
|--------|-----------------|
| **Firebase Hosting** | `npm install -g firebase-tools` → `firebase init hosting` → `firebase deploy` |
| **Python local server** | `python3 -m http.server 8080` then open <http://localhost:8080> |
| **VS Code Live Server** | Install the *Live Server* extension, right-click `index.html` → *Open with Live Server* |

### 4. (Optional) Firebase security rules

> **⚠️ Security warning:** Firebase *test mode* leaves your database **publicly
> readable and writable by anyone on the internet.** Only use it for the
> duration of the event and close it down immediately afterwards.

During the event you can leave the database in test mode. Once the event is
over, go to Firebase Console → Realtime Database → Rules and set **read-only**
rules (nobody can add fake results after the fact):

```json
{
  "rules": {
    ".read": true,
    ".write": false
  }
}
```

For a fully locked-down setup (no public access at all), use:

```json
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```

## Data structure in Firebase

```
/players/{id}  →  { name: "Max", addedAt: 1715000000000 }
/matches/{id}  →  { player1: "Max", player2: "Anna", winner: "Max", addedAt: 1715000001000 }
```

## Ranking algorithm

Players are sorted by **win percentage** (wins ÷ games played), with total
wins as the tiebreaker. Players with zero games appear at the bottom.

