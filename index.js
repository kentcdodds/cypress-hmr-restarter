const DELAY = 1500;
const LOG_TAG = '[cypress-hmr-restarter]';

Cypress.on('window:load', win => {
  if (!Cypress.config('isInteractive')) {
    return;
  }

  const baseUrl = Cypress.config('baseUrl').replace(/https?/, 'wss');
  const socket = new WebSocket(`${baseUrl}/sockjs-node`);
  let timeout;

  socket.onopen = () => console.debug(LOG_TAG, 'Connected to HMR socket');
  socket.onclose = () => console.debug(LOG_TAG, 'Disconnected from HMR socket');
  socket.onmessage = e => {
    const { type } = JSON.parse(e.data);
    switch (type) {
      case 'invalid':
        console.debug(LOG_TAG, `Restarting due to HMR in ${DELAY}ms...`);
        clearTimeout(timeout);
        timeout = setTimeout(() => clickRestart(win), DELAY);
        break;
    }
  };
});

const clickRestart = win => {
  const btn = win.top.document.querySelector('.reporter .restart');
  btn && btn.click();
  console.debug(LOG_TAG, `Restarted.`);
};
