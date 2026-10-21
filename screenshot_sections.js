const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function captureSections() {
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

  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);

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
  await new Promise(r => setTimeout(r, 800));

  const sections = [
    { id: 'sectionLetter', name: 'section_letter.png' },
    { id: 'sectionCountdown', name: 'section_countdown.png' },
    { id: 'sectionSignatories', name: 'section_signatories.png' },
    { id: 'sectionRundown', name: 'section_rundown.png' },
    { id: 'sectionLocation', name: 'section_location.png' },
    { id: 'sectionRsvp', name: 'section_rsvp.png' }
  ];

  for (const sec of sections) {
    const pos = await send('Runtime.evaluate', {
      expression: `
        (function() {
          const el = document.getElementById("${sec.id}");
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          window.scrollTo(0, rect.top + window.pageYOffset - 20);
          return { top: rect.top + window.pageYOffset };
        })()
      `,
      returnByValue: true
    });
    console.log(sec.id, 'pos:', pos.result.value);
    await new Promise(r => setTimeout(r, 600));

    const ss = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(sec.name, Buffer.from(ss.data, 'base64'));
    console.log('Saved', sec.name);
  }

  ws.close();
  chrome.kill();
  console.log('All sections captured!');
}

captureSections().catch(console.error);

