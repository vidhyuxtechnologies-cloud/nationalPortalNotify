# TODO - Make cron run when server is running

- [x] Move scheduling logic from `cronjob.js` into an exported function (e.g., `startCron()`) that can be called by `server.js`.
- [x] Update `cronjob.js` to call `startCron()` when executed directly (node cronjob.js) but not on import.
- [x] Update `server.js` to call `startCron()` once on successful Mongo connection (or immediately after start).
- [x] Add a log line confirming cron scheduler started from the server.
- [ ] Test: start server (`npm start`) and confirm `[cronjob]` logs appear and `script.js` is triggered at the next scheduled time.


