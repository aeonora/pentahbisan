/**
 * MAIN JAVASCRIPT
 * Undangan Digital Pentahbisan & Peresmian Gedung GKST Jemaat Karmel Winowanga
 */

(function () {
  'use strict';

  // Pastikan konfigurasi tersedia
  const config = window.INVITATION_CONFIG || {};

  // DOM Elements
  const loadingScreen = document.getElementById('loadingScreen');
  const coverSection = document.getElementById('coverSection');
  const btnOpenInvitation = document.getElementById('btnOpenInvitation');
  const recipientNameEl = document.getElementById('recipientName');
  
  // Audio Elements
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const bgAudio = document.getElementById('bgAudio');
  const audioIcon = document.getElementById('audioIcon');

  // Modal Elements
  const modalOriginalLetter = document.getElementById('modalOriginalLetter');
  const btnOpenOriginalModal = document.getElementById('btnOpenOriginalModal');
  const btnCloseModal = document.getElementById('btnCloseModal');

  // Calendar Elements
  const btnGoogleCalendar = document.getElementById('btnGoogleCalendar');
  const btnDownloadIcs = document.getElementById('btnDownloadIcs');

  // Countdown Elements
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');

  // Containers
  const signatoriesContainer = document.getElementById('signatoriesContainer');
  const rundownTimeline = document.getElementById('rundownTimeline');
  const rsvpForm = document.getElementById('rsvpForm');
  const greetingsList = document.getElementById('greetingsList');
  const greetingsCount = document.getElementById('greetingsCount');

  // Navigation & Share
  const btnShareWa = document.getElementById('btnShareWa');
  const btnScrollTop = document.getElementById('btnScrollTop');

  /* ==========================================================================
     1. PARSING NAMA TAMU DARI URL (?to=Nama%20Tamu)
     ========================================================================== */
  function getRecipientName() {
    const urlParams = new URLSearchParams(window.location.search);
    const rawTo = urlParams.get('to') || urlParams.get('u') || urlParams.get('guest');
    if (rawTo && rawTo.trim() !== '') {
      return rawTo.trim();
    }
    return 'Bapak/Ibu/Saudara(i)';
  }

  function initRecipient() {
    const guestName = getRecipientName();
    if (recipientNameEl) {
      recipientNameEl.textContent = guestName;
    }
  }

  /* ==========================================================================
     2. LOADING SCREEN
     ========================================================================== */
  function dismissLoadingScreen() {
    if (loadingScreen && !loadingScreen.classList.contains('fade-out')) {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }
  }

  function initLoadingScreen() {
    // Tampilkan transisi loading screen singkat yang mulus
    setTimeout(dismissLoadingScreen, 500);
    window.addEventListener('load', dismissLoadingScreen);
  }

  /* ==========================================================================
     3. AUDIO CONTROLLER & BACKGROUND MUSIC
     ========================================================================== */
  let isAudioPlaying = false;
  let webAudioFallbackActive = false;
  let audioCtx = null;

  function initAudio() {
    if (!config.audio || !config.audio.enabled) {
      if (audioToggleBtn) audioToggleBtn.style.display = 'none';
      return;
    }

    if (bgAudio) {
      bgAudio.volume = 0.65;
      bgAudio.addEventListener('play', () => {
        isAudioPlaying = true;
        updateAudioButtonState();
      });
      bgAudio.addEventListener('pause', () => {
        isAudioPlaying = false;
        updateAudioButtonState();
      });
      bgAudio.addEventListener('error', () => {
        console.warn('Audio element error, will use ambient synth fallback if played.');
      });
    }

    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', toggleAudio);
    }
  }

  function updateAudioButtonState() {
    if (!audioToggleBtn) return;
    if (isAudioPlaying) {
      audioToggleBtn.classList.add('is-playing');
      audioToggleBtn.setAttribute('aria-label', 'Jeda musik');
      audioToggleBtn.title = 'Jeda Musik';
      if (audioIcon) audioIcon.textContent = '🎶';
    } else {
      audioToggleBtn.classList.remove('is-playing');
      audioToggleBtn.setAttribute('aria-label', 'Putar musik');
      audioToggleBtn.title = 'Putar Musik';
      if (audioIcon) audioIcon.textContent = '🔈';
    }
  }

  function toggleAudio() {
    if (isAudioPlaying) {
      if (bgAudio && !bgAudio.paused) {
        bgAudio.pause();
      }
      isAudioPlaying = false;
      updateAudioButtonState();
    } else {
      playAudio();
    }
  }

  function playAudio() {
    if (bgAudio) {
      const playPromise = bgAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isAudioPlaying = true;
            updateAudioButtonState();
          })
          .catch((err) => {
            console.log('Autoplay audio blocked or error:', err);
            // Tetap update UI agar pengguna bisa klik manual
            isAudioPlaying = false;
            updateAudioButtonState();
          });
      }
    }
  }

  /* ==========================================================================
     4. BUKA UNDANGAN (Cover Transition)
     ========================================================================== */
  function initCoverButton() {
    if (btnOpenInvitation) {
      btnOpenInvitation.addEventListener('click', () => {
        // Buka cover
        if (coverSection) {
          coverSection.classList.add('opened');
          setTimeout(() => {
            coverSection.style.display = 'none';
          }, 850);
        }

        // Lepas scroll lock
        document.body.classList.remove('scroll-locked');

        // Tampilkan floating audio button
        if (audioToggleBtn) {
          audioToggleBtn.classList.add('active');
        }

        // Putar audio jika dikonfigurasi
        if (config.audio && config.audio.enabled && config.audio.autoplayOnOpen) {
          playAudio();
        }

        // Scroll halus ke ayat
        const verseSec = document.getElementById('sectionVerse');
        if (verseSec) {
          setTimeout(() => {
            verseSec.scrollIntoView({ behavior: 'smooth' });
          }, 400);
        }
      });
    }
  }

  /* ==========================================================================
     5. POPULATE KONTEN DARI CONFIG.JS
     ========================================================================== */
  function populateContent() {
    if (!config.event) return;

    // Ayat
    const verseText = document.getElementById('verseText');
    const verseRef = document.getElementById('verseRef');
    if (verseText && config.verse) verseText.textContent = config.verse.text;
    if (verseRef && config.verse) verseRef.textContent = config.verse.reference;

    // Surat Undangan
    const letterGreeting = document.getElementById('letterGreeting');
    const letterOpening = document.getElementById('letterOpening');
    const letterClosing = document.getElementById('letterClosing');
    const letterDateVal = document.getElementById('letterDateVal');
    const letterTimeVal = document.getElementById('letterTimeVal');
    const letterPlaceVal = document.getElementById('letterPlaceVal');
    const letterSignDate = document.getElementById('letterSignDate');

    if (letterGreeting && config.letter) letterGreeting.textContent = config.letter.greeting;
    if (letterOpening && config.letter) letterOpening.textContent = config.letter.opening;
    if (letterClosing && config.letter) letterClosing.textContent = config.letter.closing;

    if (letterDateVal) letterDateVal.textContent = `${config.event.day}, ${config.event.dateFormatted}`;
    if (letterTimeVal) letterTimeVal.textContent = config.event.timeFormatted;
    if (letterPlaceVal) letterPlaceVal.textContent = config.event.churchName;
    if (letterSignDate) letterSignDate.textContent = config.event.letterDate;

    // Lokasi
    const locName = document.getElementById('locName');
    const locAddress = document.getElementById('locAddress');
    const mapsIframe = document.getElementById('mapsIframe');
    const btnMapsLink = document.getElementById('btnMapsLink');

    if (locName) locName.textContent = config.event.locationName;
    if (locAddress) locAddress.textContent = config.event.address;
    if (mapsIframe) mapsIframe.src = config.event.mapsEmbedUrl;
    if (btnMapsLink) btnMapsLink.href = config.event.mapsUrl;

    // Render Tanda Tangan
    renderSignatories();

    // Render Susunan Acara
    renderRundown();
  }

  /* Render Tanda Tangan & Stempel */
  function renderSignatories() {
    if (!signatoriesContainer || !Array.isArray(config.signatories)) return;

    let html = '';
    config.signatories.forEach((item, idx) => {
      const isKlasis = idx === 2; // Card klasis di bawah dibuat lebih istimewa
      html += `
        <div class="signatory-card ${isKlasis ? 'signatory-card--klasis' : ''}">
          <div class="signatory-role">${item.role}</div>
          <div class="signatory-pos">${item.position}</div>
          <div class="signatory-img-wrap">
            <picture>
              <source srcset="${item.signatureImg}" type="image/webp">
              <img src="${item.signatureFallback}" alt="Tanda Tangan dan Stempel ${item.name}" class="signatory-img" loading="lazy">
            </picture>
          </div>
          <div class="signatory-name">${item.name}</div>
        </div>
      `;
    });
    signatoriesContainer.innerHTML = html;
  }

  /* Render Susunan Acara (Rundown) */
  function renderRundown() {
    if (!rundownTimeline || !Array.isArray(config.rundown)) return;

    let html = '';
    config.rundown.forEach((item) => {
      html += `
        <div class="rundown-item">
          <div class="rundown-number-badge" aria-hidden="true">${item.number}</div>
          <div class="rundown-item-card">
            <h3 class="rundown-item-title">${item.title}</h3>
            ${item.desc ? `<p class="rundown-item-desc">${item.desc}</p>` : ''}
          </div>
        </div>
      `;
    });
    rundownTimeline.innerHTML = html;
  }

  /* ==========================================================================
     6. COUNTDOWN KE 29 OKTOBER 2026 10.00 WITA
     ========================================================================== */
  function initCountdown() {
    // 29 Oktober 2026, 10:00:00 WITA = UTC+8 = 2026-10-29T02:00:00Z
    const targetDate = new Date(config.event ? config.event.isoDateTime : "2026-10-29T10:00:00+08:00").getTime();

    function updateTimer() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        if (cdDays) cdDays.textContent = '00';
        if (cdHours) cdHours.textContent = '00';
        if (cdMinutes) cdMinutes.textContent = '00';
        if (cdSeconds) cdSeconds.textContent = '00';
        const countdownGrid = document.getElementById('countdownGrid');
        if (countdownGrid) {
          countdownGrid.innerHTML = `
            <div style="grid-column: 1 / -1; padding: 1.5rem; background: rgba(201, 162, 75, 0.2); border-radius: var(--radius-md); border: 1px solid var(--gold-primary);">
              <h3 style="color: var(--gold-light); font-size: 1.2rem; font-weight: 700;">Acara Telah Berlangsung</h3>
              <p style="color: #FFFFFF; font-size: 0.9rem; margin-top: 0.35rem;">Puji Tuhan, seluruh rangkaian Pentahbisan Gedung Gereja telah terselenggara.</p>
            </div>
          `;
        }
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
      if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
      if (cdMinutes) cdMinutes.textContent = String(minutes).padStart(2, '0');
      if (cdSeconds) cdSeconds.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  /* ==========================================================================
     7. SIMPAN KE KALENDER (Google Calendar & .ics)
     ========================================================================== */
  function initCalendarActions() {
    const title = encodeURIComponent("Pentahbisan & Peresmian Gedung GKST Jemaat Karmel Winowanga");
    const details = encodeURIComponent("Pentahbisan dan Peresmian Gedung Gereja Kristen Sulawesi Tengah (GKST) Jemaat Karmel Winowanga, Klasis Napu, Anggota PGI.");
    const location = encodeURIComponent("GKST Jemaat Karmel Winowanga, Desa Winowanga, Kec. Lore Timur, Kab. Poso, Sulawesi Tengah");

    // 29 Oktober 2026, 10.00 - 14.00 WITA (UTC+8) -> UTC: 20261029T020000Z to 20261029T060000Z
    const startUtc = "20261029T020000Z";
    const endUtc = "20261029T060000Z";

    // Google Calendar URL
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUtc}/${endUtc}&details=${details}&location=${location}&sf=true&output=xml`;

    if (btnGoogleCalendar) {
      btnGoogleCalendar.href = gCalUrl;
    }

    // Unduh berkas iCalendar (.ics)
    if (btnDownloadIcs) {
      btnDownloadIcs.addEventListener('click', () => {
        const icsContent = [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "PRODID:-//GKST Karmel Winowanga//Undangan Pentahbisan//ID",
          "CALSCALE:GREGORIAN",
          "METHOD:PUBLISH",
          "BEGIN:VEVENT",
          "UID:gkst-karmel-winowanga-20261029@gkst.or.id",
          `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
          `DTSTART:${startUtc}`,
          `DTEND:${endUtc}`,
          `SUMMARY:Pentahbisan dan Peresmian Gedung Gereja GKST Jemaat Karmel Winowanga`,
          `DESCRIPTION:Pentahbisan dan Peresmian Gedung Gedung Gereja Kristen Sulawesi Tengah Jemaat Karmel Winowanga\\nKlasis Napu\\, Anggota PGI.`,
          `LOCATION:GKST Jemaat Karmel Winowanga\\, Lore Timur\\, Poso\\, Sulawesi Tengah`,
          "STATUS:CONFIRMED",
          "END:VEVENT",
          "END:VCALENDAR"
        ].join("\r\n");

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", "Jadwal_Pentahbisan_GKST_Karmel_Winowanga.ics");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  }

  /* ==========================================================================
     8. INTERSECTION OBSERVER ANIMASI SCROLL
     ========================================================================== */
  function initScrollAnimations() {
    // Cek prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const fadeElements = document.querySelectorAll('.animate-fade-up');
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach((el) => fadeObserver.observe(el));

    // Staggered reveal untuk Rundown items
    const rundownObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.rundown-item');
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('revealed');
            }, index * 110);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const rundownSec = document.getElementById('sectionRundown');
    if (rundownSec) rundownObserver.observe(rundownSec);
  }

  /* ==========================================================================
     9. KONFIRMASI KEHADIRAN (RSVP & Buku Tamu Storage Adapter)
     ========================================================================== */
  const STORAGE_KEY = 'gkst_karmel_rsvp_greetings';

  function getStoredGreetings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    // Jika belum ada data lokal, kembalikan dari config
    return (config.rsvp && config.rsvp.initialGreetings) ? [...config.rsvp.initialGreetings] : [];
  }

  function saveGreetingsToStorage(greetings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(greetings));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  function renderGreetingsFeed() {
    if (!greetingsList) return;
    const greetings = getStoredGreetings();

    if (greetingsCount) {
      greetingsCount.textContent = `${greetings.length} Ucapan`;
    }

    if (greetings.length === 0) {
      greetingsList.innerHTML = `<div style="text-align: center; font-size: 0.85rem; color: var(--text-muted); padding: 1rem;">Belum ada ucapan. Jadilah yang pertama mengirimkan doa &amp; ucapan syukur!</div>`;
      return;
    }

    let html = '';
    greetings.forEach((item) => {
      const isHadir = item.attendance === 'Hadir';
      html += `
        <div class="greeting-card">
          <div class="greeting-card-header">
            <span class="greeting-author">${item.name}</span>
            <span class="greeting-status-badge ${isHadir ? 'hadir' : 'tidak'}">${isHadir ? '✅ Hadir' : '❌ Berhalangan'} (${item.guests || 1} orang)</span>
          </div>
          <p class="greeting-message">${item.message}</p>
          <div class="greeting-date">${item.date || 'Baru saja'}</div>
        </div>
      `;
    });
    greetingsList.innerHTML = html;
  }

  function initRsvpForm() {
    if (!rsvpForm) return;

    // Prefill nama jika ada query param
    const guestParam = getRecipientName();
    const rsvpNameInput = document.getElementById('rsvpName');
    if (rsvpNameInput && guestParam !== 'Bapak/Ibu/Saudara(i)') {
      rsvpNameInput.value = guestParam;
    }

    renderGreetingsFeed();

    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = sanitizeHtml(document.getElementById('rsvpName').value.trim());
      const attendanceRadio = document.querySelector('input[name="attendance"]:checked');
      const attendanceVal = attendanceRadio ? attendanceRadio.value : 'Hadir';
      const guestsVal = parseInt(document.getElementById('rsvpGuests').value, 10) || 1;
      const messageVal = sanitizeHtml(document.getElementById('rsvpMessage').value.trim());

      if (!nameVal || !messageVal) {
        alert('Mohon lengkapi nama dan ucapan Anda.');
        return;
      }

      // Format tanggal lokal
      const now = new Date();
      const dateStr = now.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + ' ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      const newEntry = {
        name: nameVal,
        attendance: attendanceVal,
        guests: guestsVal,
        message: messageVal,
        date: dateStr
      };

      // Simpan lewat Adapter
      const currentList = getStoredGreetings();
      currentList.unshift(newEntry);
      saveGreetingsToStorage(currentList);

      // Jika webhook di config diisi, kirim via fetch background
      if (config.rsvp && config.rsvp.webhookUrl) {
        try {
          fetch(config.rsvp.webhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEntry)
          }).catch((err) => console.log('Webhook optional push:', err));
        } catch (err) {
          // Abaikan error webhook agar UX tetap lancar
        }
      }

      // Perbarui tampilan
      renderGreetingsFeed();
      rsvpForm.reset();

      // Feedback notifikasi ramah
      alert(`Terima kasih banyak, ${nameVal}! Konfirmasi kehadiran & doa syukur Anda telah tersimpan.`);
    });
  }

  /* ==========================================================================
     10. MODAL LIHAT SURAT CETAK ASLI
     ========================================================================== */
  function initOriginalModal() {
    if (!modalOriginalLetter) return;

    if (btnOpenOriginalModal) {
      btnOpenOriginalModal.addEventListener('click', () => {
        modalOriginalLetter.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', closeModal);
    }

    modalOriginalLetter.addEventListener('click', (e) => {
      if (e.target === modalOriginalLetter) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOriginalLetter.classList.contains('active')) {
        closeModal();
      }
    });

    function closeModal() {
      modalOriginalLetter.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /* ==========================================================================
     11. TOMBOL BAGIKAN VIA WHATSAPP & KEMBALI KE ATAS
     ========================================================================== */
  function initShareAndNav() {
    if (btnShareWa) {
      const shareUrl = window.location.href;
      const shareText = encodeURIComponent(
        `Syalom! Kami mengundang Bapak/Ibu/Saudara(i) dalam Ibadah Pentahbisan & Peresmian Gedung GKST Jemaat Karmel Winowanga (Klasis Napu), Kamis, 29 Oktober 2026 pukul 10.00 WITA.\n\nBuka Undangan Digital:\n${shareUrl}`
      );
      btnShareWa.href = `https://api.whatsapp.com/send?text=${shareText}`;
    }

    if (btnScrollTop) {
      btnScrollTop.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  /* Helper Sanitasi String Input untuk Mencegah XSS */
  function sanitizeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ==========================================================================
     INISIALISASI SEMUA FITUR
     ========================================================================== */
  function init() {
    initRecipient();
    initLoadingScreen();
    populateContent();
    initCoverButton();
    initAudio();
    initCountdown();
    initCalendarActions();
    initScrollAnimations();
    initRsvpForm();
    initOriginalModal();
    initShareAndNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
