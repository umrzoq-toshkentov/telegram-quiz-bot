# telegram-quiz

A Telegram quiz bot built with [Telegraf](https://telegraf.js.org/) and [Bun](https://bun.sh).

## Setup

```bash
bun install
```

Create a `.env` file with your bot token:

```
BOT_TOKEN=your_telegram_bot_token
```

## Usage

```bash
# Development (with watch mode)
bun run dev

# Production
bun run start
```

## Scripts

| Command             | Description           |
| ------------------- | --------------------- |
| `bun run dev`       | Start with watch mode |
| `bun run start`     | Start the bot         |
| `bun run build`     | Build to `dist/`      |
| `bun run lint`      | Lint with oxlint      |
| `bun run format`    | Format with oxfmt     |
| `bun run typecheck` | Type-check with tsc   |
| `bun test`          | Run tests             |
