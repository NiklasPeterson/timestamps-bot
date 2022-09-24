# Niklas Discord Bot

Discord Bot that guards the Discord and only let in people who complete a captcha.

## Features and technologies used

- [Slash commands](https://discord.com/developers/docs/interactions/application-commands)
- [Interactive buttons](https://discord.com/developers/docs/interactions/message-components#buttons)
- [Discord.JS v13](https://discord.js.org/#/)
- [Heroku](https://www.heroku.com/)

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
