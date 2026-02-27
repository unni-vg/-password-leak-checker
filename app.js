const passwordInput = document.getElementById('password');
const checkBtn = document.getElementById('checkBtn');
const toggleVisibilityBtn = document.getElementById('toggleVisibility');
const statusEl = document.getElementById('status');
const resultDetail = document.getElementById('resultDetail');
const historyEl = document.getElementById('history');

const checksRunEl = document.getElementById('checksRun');
const exposedCountEl = document.getElementById('exposedCount');
const safeCountEl = document.getElementById('safeCount');

const dashboardStats = {
  checksRun: 0,
  exposedCount: 0,
  safeCount: 0,
};

function updateStats() {
  checksRunEl.textContent = String(dashboardStats.checksRun);
  exposedCountEl.textContent = String(dashboardStats.exposedCount);
  safeCountEl.textContent = String(dashboardStats.safeCount);
}

function updateStatus(kind, message) {
  statusEl.className = `status ${kind}`;
  statusEl.textContent = message;
}

function toSha1Hex(input) {
  const encoder = new TextEncoder();
  return crypto.subtle.digest('SHA-1', encoder.encode(input)).then((buffer) => {
    const bytes = Array.from(new Uint8Array(buffer));
    return bytes.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  });
}

async function queryPwnedPassword(password) {
  const sha1 = await toSha1Hex(password);
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);

  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const body = await response.text();
  const match = body.split('\n').find((line) => line.startsWith(`${suffix}:`));

  if (!match) {
    return { leaked: false, count: 0 };
  }

  const count = Number.parseInt(match.split(':')[1], 10);
  return { leaked: true, count: Number.isNaN(count) ? 0 : count };
}

function addHistoryEntry(passwordLength, leaked, count) {
  const li = document.createElement('li');
  const timestamp = new Date().toLocaleTimeString();
  li.textContent = leaked
    ? `[${timestamp}] Length ${passwordLength}: exposed ${count.toLocaleString()} time(s)`
    : `[${timestamp}] Length ${passwordLength}: not found in breach corpus`;

  historyEl.prepend(li);

  while (historyEl.children.length > 7) {
    historyEl.removeChild(historyEl.lastChild);
  }
}

async function runCheck() {
  const password = passwordInput.value;

  if (!password) {
    updateStatus('idle', 'Please provide a password first.');
    resultDetail.textContent = '';
    return;
  }

  checkBtn.disabled = true;
  updateStatus('loading', 'Checking secure hash range...');
  resultDetail.textContent = 'Contacting Have I Been Pwned API.';

  try {
    const result = await queryPwnedPassword(password);
    dashboardStats.checksRun += 1;

    if (result.leaked) {
      dashboardStats.exposedCount += 1;
      updateStatus('exposed', 'This password is exposed. Do not use it.');
      resultDetail.textContent = `Seen ${result.count.toLocaleString()} times in known breach data.`;
    } else {
      dashboardStats.safeCount += 1;
      updateStatus('safe', 'No exposure found for this password hash suffix.');
      resultDetail.textContent = 'No match in current Have I Been Pwned dataset.';
    }

    updateStats();
    addHistoryEntry(password.length, result.leaked, result.count);
  } catch (error) {
    updateStatus('idle', 'Unable to complete check right now.');
    resultDetail.textContent = error instanceof Error ? error.message : 'Unexpected error.';
  } finally {
    checkBtn.disabled = false;
    passwordInput.value = '';
  }
}

checkBtn.addEventListener('click', runCheck);
passwordInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    runCheck();
  }
});

toggleVisibilityBtn.addEventListener('click', () => {
  const showing = passwordInput.type === 'text';
  passwordInput.type = showing ? 'password' : 'text';
  toggleVisibilityBtn.textContent = showing ? 'Show' : 'Hide';
});

updateStats();
