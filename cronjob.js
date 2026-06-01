const { spawn } = require('child_process');

// This module schedules running script.js around 5:30 PM daily.
//
// Exported `startCron()` so the scheduler can run when the main server is running.
// Run directly (`node cronjob.js`) to start standalone scheduling.

const TARGET_HOUR = 17; // 5 PM
const TARGET_MINUTE = 30; // 30

let isRunning = false;

function msUntilNextRun() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(TARGET_HOUR, TARGET_MINUTE, 0, 0);

  // If we already passed 5:30 PM today, schedule for tomorrow.
  if (next <= now) next.setDate(next.getDate() + 1);

  return next.getTime() - now.getTime();
}

function runJob() {
  console.log(`[cronjob] Triggered at ${new Date().toISOString()}`);

  const child = spawn('node', ['script.js'], {
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => {
    console.log(`[cronjob] script.js finished with exit code ${code}`);
  });
}

function scheduleNext() {
  const delay = msUntilNextRun();
  const now = new Date();
  const next = new Date(now.getTime() + delay);

  console.log(
    `[cronjob] Next run scheduled for ${next.toLocaleString()} (in ${Math.round(
      delay / 1000
    )}s)`
  );

  setTimeout(() => {
    runJob();
    scheduleNext();
  }, delay);
}

function startCron() {
  if (isRunning) return;
  isRunning = true;

  console.log('[cronjob] Scheduler started');
  scheduleNext();
}

module.exports = { startCron };

if (require.main === module) {
  startCron();
}


