# TipTap Setup

## Setup

1. Create a TipTap account at [cloud.tiptap.dev](https://cloud.tiptap.dev/pro-extensions).
2. Create a new app and click the option called 'Pro Extensions'.
3. Copy the token.
4. Open `~/.zshrc` or `~/.bashrc` and add the following line at the end:

```bash
export TIPTAP_PRO_TOKEN="YOUR_TOKEN"
```

5. Run the following command:

```bash
source ~/.zshrc
# OR
source ~/.bashrc
```

6. Create a new file in the current project directory called `.npmrc`.

7. The content of npmrc is provided on the same page as the TipTap Token. Just paste it in the file and save it.

6. You're all set! Now you can do `npm install` and use TipTap in your app.
