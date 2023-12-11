# tg-expenses

Telegram bot for tracking expenses

## How to run
- `cp .env.example .env` and add your values
- `npm ci`
- `npm run start:dev` - for development. `npm run start` - for production. `npm run start:pm2` - for production with pm2

## Acceptance criteria

- The bot should allow users to add expenses with a description, amount and currency. - Done
- The bot should allow users to view their total expenses. - Done
- The bot should allow users to view their expenses for a specific time period. - Done.
- The bot should allow users to delete a specific expense. - Done
- The bot should provide error handling for invalid inputs. - Done

## Road to deploy
- Set up server and deploy instance
- Set up ci/cd by github actions 
