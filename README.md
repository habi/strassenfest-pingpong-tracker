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

### 3. Deploy via GitHub Pages (recommended)

The repository includes a GitHub Actions workflow
(`.github/workflows/deploy.yml`) that automatically builds and publishes the
app to **GitHub Pages** on every push to `main`. Firebase credentials are
stored as **repository secrets** — they never appear in source code.

#### One-time setup

1. **Enable GitHub Pages** in your repository:
   *Settings → Pages → Source → GitHub Actions*

2. **Add the following repository secrets**
   (*Settings → Secrets and variables → Actions → New repository secret*):

   | Secret name | Where to find it |
   |---|---|
   | `FIREBASE_API_KEY` | Firebase Console → Project settings → Your apps → SDK setup |
   | `FIREBASE_AUTH_DOMAIN` | same (e.g. `my-project.firebaseapp.com`) |
   | `FIREBASE_DATABASE_URL` | same (e.g. `https://my-project-default-rtdb.firebaseio.com`) |
   | `FIREBASE_PROJECT_ID` | same |
   | `FIREBASE_STORAGE_BUCKET` | same (e.g. `my-project.appspot.com`) |
   | `FIREBASE_MESSAGING_SENDER_ID` | same |
   | `FIREBASE_APP_ID` | same |

3. Push (or re-push) to `main`. The workflow will generate `firebase-config.js`
   at deploy time and publish the site. The generated file is never committed to
   the repository.

After the first successful run, GitHub will show the public URL under
*Settings → Pages* (usually `https://<your-username>.github.io/<repo-name>/`).

#### Local development

For local testing you still need a `firebase-config.js` file:

```bash
cp firebase-config.example.js firebase-config.js
# fill in your credentials, then serve locally:
python3 -m http.server 8080
```

Other local options:

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

