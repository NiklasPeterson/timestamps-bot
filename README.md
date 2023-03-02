# NP Gatekeeper

Discord Bot that guards the Discord and only let in people who complete the captcha.

But also has some other useful commands

## Features and technologies used

- [Slash commands](https://discord.com/developers/docs/interactions/application-commands)
- [Interactive buttons](https://discord.com/developers/docs/interactions/message-components#buttons)
- [Discord.JS v14](https://discord.js.org/#/)

---

## Project structure

```
├── commands
│   ├── addVerifyLink.js
│   ├── beep.js
│   ├── captcha.js
│   ├── roles.js
├── events
│   ├── interactionCreate.js
│   ├── ready.js
├── .env.sample
.gitignore
├── deploy-commands.js
├── index.js
├── package.json
├── Procfile
├── README.md
└── verify.js
```
