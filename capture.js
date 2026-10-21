const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function capture(url, outPath, width = 375, height = 812, actions = null) {
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
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const curId = id++;
      const handler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: 2, mobile: width < 600
  });
  await send('Page.navigate', { url });
  await new Promise(r => setTimeout(r, 2000));

  if (actions) {
    await actions(send);
  }

  const ss = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(outPath, Buffer.from(ss.data, 'base64'));
  console.log('Saved', outPath);

  ws.close();
  chrome.kill();
  await new Promise(r => setTimeout(r, 600));
}

async function main() {
  const url = 'http://localhost:3456/index.html?to=Bpk.%20Stefanus%20%26%20Keluarga';

  console.log('1. Mobile Cover...');
  await capture(url, 'screen_mobile_cover.png', 375, 812, async (send) => {
    await send('Runtime.evaluate', {
      expression: 'document.getElementById("loadingScreen").style.display = "none";'
    });
    await new Promise(r => setTimeout(r, 400));
  });

  console.log('2. Mobile Verse & Photo...');
  await capture(url, 'screen_mobile_verse.png', 375, 812, async (send) => {
    await send('Runtime.evaluate', {
      expression: `
        document.getElementById("loadingScreen").style.display = "none";
        document.getElementById("coverSection").style.display = "none";
        document.body.classList.remove("scroll-locked");
        document.querySelectorAll(".animate-fade-up").forEach(el => el.classList.add("is-visible"));
        document.getElementById("sectionVerse").scrollIntoView();
      `
    });
    await new Promise(r => setTimeout(r, 500));
  });

  console.log('3. Mobile Letter...');
  await capture(url, 'screen_mobile_letter.png', 375, 812, async (send) => {
    await send('Runtime.evaluate', {
      expression: `
        document.getElementById("loadingScreen").style.display = "none";
        document.getElementById("coverSection").style.display = "none";
        document.body.classList.remove("scroll-locked");
        document.querySelectorAll(".animate-fade-up").forEach(el => el.classList.add("is-visible"));
        document.getElementById("sectionLetter").scrollIntoView();
      `
    });
    await new Promise(r => setTimeout(r, 500));
  });

  console.log('4. Mobile Signatures...');
  await capture(url, 'screen_mobile_signatories.png', 375, 812, async (send) => {
    await send('Runtime.evaluate', {
      expression: `
        document.getElementById("loadingScreen").style.display = "none";
        document.getElementById("coverSection").style.display = "none";
        document.body.classList.remove("scroll-locked");
        document.querySelectorAll(".animate-fade-up").forEach(el => el.classList.add("is-visible"));
        document.getElementById("sectionSignatories").scrollIntoView();
      `
    });
    await new Promise(r => setTimeout(r, 500));
  });

  console.log('5. Mobile Rundown...');
  await capture(url, 'screen_mobile_rundown.png', 375, 812, async (send) => {
    await send('Runtime.evaluate', {
      expression: `
        document.getElementById("loadingScreen").style.display = "none";
        document.getElementById("coverSection").style.display = "none";
        document.body.classList.remove("scroll-locked");
        document.querySelectorAll(".animate-fade-up").forEach(el => el.classList.add("is-visible"));
        document.querySelectorAll(".rundown-item").forEach(el => el.classList.add("revealed"));
        document.getElementById("sectionRundown").scrollIntoView();
      `
    });
    await new Promise(r => setTimeout(r, 500));
  });

  console.log('6. Desktop View (1280x800)...');
  await capture(url, 'screen_desktop.png', 1280, 800, async (send) => {
    await send('Runtime.evaluate', {
      expression: 'document.getElementById("loadingScreen").style.display = "none";'
    });
    await new Promise(r => setTimeout(r, 500));
  });

  console.log('All screenshots captured successfully!');
}

main().catch(console.error);

