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

3. Initialize the Firebase project

```bash
firebase init
```

Select Firestore and Emulators. Press enter to select default options.
Then select authentication and firestore with spacebar and press enter.

4. Select the following options

```bash
? Which Firebase CLI features do you want to set up for this folder? Press Space to select features, then Enter to confirm your choices. Functions: Configure and deploy Cloud Functions
? What language would you like to use to write Cloud Functions? JavaScript
? Do you want to use ESLint to catch probable bugs and enforce style? No
? Do you want to install dependencies with npm now? Yes
```

5. Install the Firebase Emulator

```bash
firebase setup:emulators:firestore
```

6. Start the Firebase Emulator

```bash
npm run firebase
```
