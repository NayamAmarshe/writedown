# Firebase Emulator Setup

## Setup

0. Don't use Windows and install Java 12+.

1. Install the Firebase CLI

```bash
curl -sL firebase.tools | bash
```

2. Login to Firebase

```bash
firebase login
```

It'll ask you:
`? Allow Firebase to collect CLI and Emulator Suite usage and error reporting information?`

**Just say, "NO!"**

3. Start the Firebase Emulator

```bash
npm run firebase
```
