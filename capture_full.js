const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function captureFullPage() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  const targets = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
  let id = 1;
  const send = (m, p = {}) => new Promise(res => {
    const curId = id++;
    const h = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === curId) { ws.removeEventListener('message', h); res(msg.result); }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: curId, method: m, params: p }));
  });

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390, height: 844, deviceScaleFactor: 2, mobile: true
  });
  await send('Page.navigate', { url: 'http://localhost:3456/index.html?to=Bpk.%20Stefanus%20%26%20Keluarga' });
  await new Promise(r => setTimeout(r, 2000));

  // Dismiss loading and open cover, show all animations
  await send('Runtime.evaluate', {
    expression: `
      document.getElementById("loadingScreen").style.display = "none";
      document.getElementById("coverSection").style.display = "none";
      document.body.classList.remove("scroll-locked");
      document.querySelectorAll(".animate-fade-up").forEach(el => el.classList.add("is-visible"));
      document.querySelectorAll(".rundown-item").forEach(el => el.classList.add("revealed"));
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  // Get full document height
  const metrics = await send('Page.getLayoutMetrics');
  const height = Math.ceil(metrics.contentSize.height);
  console.log('Full content height:', height);

  // Set device metrics to full height
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390, height: height, deviceScaleFactor: 2, mobile: true
  });
  await new Promise(r => setTimeout(r, 800));

  const ss = await send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 390, height: height, scale: 2 },
    captureBeyondViewport: true
  });

  fs.writeFileSync('screen_mobile_full_page.png', Buffer.from(ss.data, 'base64'));
  console.log('Saved screen_mobile_full_page.png');

  ws.close();
  chrome.kill();
}

captureFullPage().catch(console.error);

