import { ProjectXClient } from './projectx-client.js';

const config = {
  userName: process.env.TOPSTEP_USERNAME,
  apiKey: process.env.TOPSTEP_API_KEY,
  mode: process.env.TOPSTEP_MODE || 'PRACTICE',
  autoTrading: process.env.AUTO_TRADING === 'true',
};

function safeAccount(account) {
  return {
    id: account?.id,
    name: account?.name,
    active: account?.active ?? account?.isActive,
    type: account?.type ?? account?.accountType,
  };
}

async function main() {
  if (config.mode !== 'PRACTICE') throw new Error('Safety lock: Local Agent currently permits PRACTICE mode only');
  if (config.autoTrading) throw new Error('Safety lock: AUTO_TRADING must remain false during connection validation');

  console.log('[Blue Range] Local Agent starting — PRACTICE / AUTO OFF');
  const client = new ProjectXClient(config);
  await client.loginWithApiKey();
  console.log('[Blue Range] AUTHENTICATED');

  try {
    await client.validateSession();
    console.log('[Blue Range] SESSION VALID');
  } catch (error) {
    console.warn('[Blue Range] Session validation endpoint unavailable or rejected; authentication token was still obtained.');
  }

  const practice = await client.discoverPracticeAccounts();
  if (!practice.length) throw new Error('No PRACTICE account detected. Execution remains disabled.');

  console.log('[Blue Range] PRACTICE ACCOUNT(S) FOUND');
  console.table(practice.map(safeAccount));
  console.log('[Blue Range] CONNECTION CHECK COMPLETE — NO ORDERS CAN BE SENT BY THIS BUILD');
}

main().catch(error => {
  console.error('[Blue Range] CONNECTION FAILED:', error.message);
  process.exitCode = 1;
});
