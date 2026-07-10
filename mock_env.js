const fs = require('fs');

fs.writeFileSync('.env.local', `
GEMINI_API_KEY=mock-key
CRON_SECRET=mock-cron-secret
CF_ACCOUNT_ID=mock-cf-account
CF_API_TOKEN=mock-cf-token
`);
