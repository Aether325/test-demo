/**
 * calldataStore.js
 * Patches EVM providers and Tron sign methods to intercept & log calldata.
 */

const store = [];

function logEntry(chain, method, params) {
  const entry = {
    chain,
    method,
    params,
    ts: Date.now(),
  };
  store.push(entry);
  console.log(`[calldataStore][${chain}] ${method}`, params);
}

// ── EVM ──────────────────────────────────────────────────────────────────────

/**
 * Patch an EVM provider so every request/sendAsync/send call is logged.
 * @param {object} provider  - window.ethereum / okxwallet / etc.
 * @param {string} label     - human-readable tag shown in console
 */
export function patchProvider(provider, label = 'EVM') {
  if (!provider || provider.calldataPatched) return;
  // eslint-disable-next-line no-param-reassign
  provider.calldataPatched = true;

  // request (EIP-1193)
  if (typeof provider.request === 'function') {
    const origRequest = provider.request.bind(provider);
    // eslint-disable-next-line no-param-reassign
    provider.request = function (args) {
      logEntry(label, args.method, args.params);
      return origRequest(args);
    };
  }

  // sendAsync (legacy)
  if (typeof provider.sendAsync === 'function') {
    const origSendAsync = provider.sendAsync.bind(provider);
    // eslint-disable-next-line no-param-reassign
    provider.sendAsync = function (payload, cb) {
      logEntry(label, payload.method, payload.params);
      return origSendAsync(payload, cb);
    };
  }

  // send (legacy)
  if (typeof provider.send === 'function') {
    const origSend = provider.send.bind(provider);
    // eslint-disable-next-line no-param-reassign
    provider.send = function (payloadOrMethod, callbackOrParams) {
      if (typeof payloadOrMethod === 'string') {
        logEntry(label, payloadOrMethod, callbackOrParams);
      } else {
        logEntry(label, payloadOrMethod.method, payloadOrMethod.params);
      }
      return origSend(payloadOrMethod, callbackOrParams);
    };
  }
}

// ── Tron ─────────────────────────────────────────────────────────────────────

/**
 * Patch TronWeb sign methods to intercept & log calldata.
 */
export function patchTronSign() {
  const tron = window.tronWeb || window.tronweb;
  if (!tron || tron.calldataPatched) return;
  // eslint-disable-next-line no-param-reassign
  tron.calldataPatched = true;

  const methods = ['sign', 'signTransaction', 'signMessage'];
  methods.forEach((name) => {
    if (typeof tron[name] !== 'function') return;
    const origFn = tron[name].bind(tron);
    tron[name] = function (...args) {
      logEntry('TRON', name, args);
      return origFn(...args);
    };
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Return a copy of all recorded entries. */
export function getCalldataStore() {
  return [...store];
}

/** Clear all recorded entries. */
export function clearCalldataStore() {
  store.length = 0;
}
