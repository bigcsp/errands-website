// ═══════════════════════════════════════════════════════════════
// MAG-CITY ERRANDS — ALERT NOTIFICATION ENGINE
// Handles: Sound alarm + Visual flash banner + Browser push
// Usage: included in admin-orders.html and rider-dashboard.html
// ═══════════════════════════════════════════════════════════════

window.MagCityAlerts = (function() {

  let audioCtx = null;
  let notifyPermission = false;
  let alertQueue = [];
  let isPlaying = false;

  // ── INIT ──────────────────────────────────────────────────────
  async function init() {
    // Request browser notification permission
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      notifyPermission = perm === 'granted';
    }
    injectStyles();
    injectBanner();
    console.log('[MagCityAlerts] Notification engine ready. Push:', notifyPermission);
  }

  // ── SOUND ENGINE (Web Audio API) ─────────────────────────────
  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function playBeep(freq, duration, volume, delay) {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration + 0.05);
    } catch(e) { console.warn('Audio error:', e); }
  }

  function playAlarm(type) {
    // Resume audio context (required after user gesture on some browsers)
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();

    if (type === 'new-order') {
      // Urgent triple beep — HIGH pitch
      playBeep(1200, 0.15, 1.0, 0.0);
      playBeep(1200, 0.15, 1.0, 0.2);
      playBeep(1200, 0.15, 1.0, 0.4);
      playBeep(1400, 0.4,  1.0, 0.7);
    } else if (type === 'new-assignment') {
      // Rising alarm — rider notification
      playBeep(600,  0.15, 1.0, 0.0);
      playBeep(800,  0.15, 1.0, 0.2);
      playBeep(1000, 0.15, 1.0, 0.4);
      playBeep(1200, 0.5,  1.0, 0.65);
      playBeep(1200, 0.5,  1.0, 1.2);
    }
  }

  function playRepeatAlarm(type, times) {
    let count = 0;
    const interval = setInterval(() => {
      playAlarm(type);
      count++;
      if (count >= times) clearInterval(interval);
    }, type === 'new-order' ? 1400 : 2000);
  }

  // ── VISUAL FLASH BANNER ───────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('mag-alert-styles')) return;
    const style = document.createElement('style');
    style.id = 'mag-alert-styles';
    style.textContent = `
      #mag-alert-banner {
        position: fixed; top: 0; left: 0; right: 0; z-index: 99999;
        transform: translateY(-100%); transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
        font-family: 'Syne', 'DM Sans', sans-serif;
      }
      #mag-alert-banner.show { transform: translateY(0); }
      .mag-alert-inner {
        padding: 16px 24px; display: flex; align-items: center; gap: 16px;
        flex-wrap: wrap;
      }
      .mag-alert-inner.type-order { background: linear-gradient(135deg, #FF6B2B, #e05a20); }
      .mag-alert-inner.type-assignment { background: linear-gradient(135deg, #22c55e, #16a34a); }
      .mag-alert-icon { font-size: 28px; flex-shrink: 0; animation: alertBounce 0.5s ease infinite alternate; }
      @keyframes alertBounce { from{transform:scale(1)} to{transform:scale(1.2)} }
      .mag-alert-content { flex: 1; }
      .mag-alert-title { font-weight: 800; font-size: 16px; color: #fff; letter-spacing: 0.5px; }
      .mag-alert-sub { font-size: 13px; color: rgba(255,255,255,0.85); margin-top: 2px; }
      .mag-alert-actions { display: flex; gap: 10px; align-items: center; }
      .mag-alert-btn { background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4); color: #fff; padding: 8px 18px; border-radius: 20px; font-family: inherit; font-weight: 700; font-size: 13px; cursor: pointer; transition: background 0.2s; }
      .mag-alert-btn:hover { background: rgba(255,255,255,0.35); }
      .mag-alert-close { background: rgba(0,0,0,0.2); border: none; color: #fff; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      #mag-alert-flash { position: fixed; inset: 0; z-index: 99998; pointer-events: none; opacity: 0; }
      #mag-alert-flash.flash-order { animation: flashOrange 0.8s ease 3; }
      #mag-alert-flash.flash-assignment { animation: flashGreen 0.8s ease 3; }
      @keyframes flashOrange { 0%,100%{opacity:0;background:transparent} 50%{opacity:0.15;background:#FF6B2B} }
      @keyframes flashGreen { 0%,100%{opacity:0;background:transparent} 50%{opacity:0.15;background:#22c55e} }
      .mag-badge { display: inline-flex; align-items: center; justify-content: center; background: #ef4444; color: #fff; font-size: 11px; font-weight: 800; width: 20px; height: 20px; border-radius: 50%; position: absolute; top: -6px; right: -6px; animation: badgePop 0.3s ease; }
      @keyframes badgePop { from{transform:scale(0)} to{transform:scale(1)} }
    `;
    document.head.appendChild(style);
  }

  function injectBanner() {
    if (document.getElementById('mag-alert-banner')) return;
    const flash = document.createElement('div');
    flash.id = 'mag-alert-flash';
    document.body.appendChild(flash);

    const banner = document.createElement('div');
    banner.id = 'mag-alert-banner';
    banner.innerHTML = `<div class="mag-alert-inner" id="mag-alert-inner">
      <div class="mag-alert-icon" id="mag-alert-icon">📦</div>
      <div class="mag-alert-content">
        <div class="mag-alert-title" id="mag-alert-title">New Alert</div>
        <div class="mag-alert-sub" id="mag-alert-sub"></div>
      </div>
      <div class="mag-alert-actions">
        <button class="mag-alert-btn" id="mag-alert-view-btn" onclick="MagCityAlerts.viewAlert()">View Now</button>
        <button class="mag-alert-close" onclick="MagCityAlerts.dismiss()">✕</button>
      </div>
    </div>`;
    document.body.appendChild(banner);
  }

  let currentAlertUrl = null;

  function showBanner(type, title, subtitle, viewUrl) {
    currentAlertUrl = viewUrl || null;
    const banner = document.getElementById('mag-alert-banner');
    const inner = document.getElementById('mag-alert-inner');
    const icon = document.getElementById('mag-alert-icon');
    const titleEl = document.getElementById('mag-alert-title');
    const subEl = document.getElementById('mag-alert-sub');
    const viewBtn = document.getElementById('mag-alert-view-btn');

    if (!banner) return;

    inner.className = 'mag-alert-inner ' + (type === 'new-order' ? 'type-order' : 'type-assignment');
    icon.textContent = type === 'new-order' ? '🛍️' : '🛵';
    titleEl.textContent = title;
    subEl.textContent = subtitle;
    viewBtn.style.display = viewUrl ? 'block' : 'none';

    banner.classList.add('show');

    // Flash the screen
    const flash = document.getElementById('mag-alert-flash');
    if (flash) {
      flash.className = '';
      void flash.offsetWidth; // reflow
      flash.className = type === 'new-order' ? 'flash-order' : 'flash-assignment';
    }

    // Blink tab title
    blinkTitle(title);

    // Auto dismiss after 12 seconds
    setTimeout(() => dismiss(), 12000);
  }

  let titleInterval = null;
  let originalTitle = document.title;

  function blinkTitle(alertText) {
    if (titleInterval) clearInterval(titleInterval);
    originalTitle = document.title;
    let toggle = true;
    titleInterval = setInterval(() => {
      document.title = toggle ? '🔔 ' + alertText : originalTitle;
      toggle = !toggle;
    }, 800);
    setTimeout(() => { clearInterval(titleInterval); document.title = originalTitle; }, 12000);
  }

  // ── BROWSER PUSH NOTIFICATION ─────────────────────────────────
  function pushNotification(title, body, icon) {
    if (!notifyPermission) return;
    try {
      const n = new Notification(title, {
        body,
        icon: icon || '/errands-website/icon-192.png',
        badge: '/errands-website/icon-192.png',
        vibrate: [200, 100, 200, 100, 400],
        requireInteraction: true,
        tag: 'mag-city-alert'
      });
      n.onclick = function() { window.focus(); this.close(); };
    } catch(e) { console.warn('Push notification error:', e); }
  }

  // ── PUBLIC TRIGGER ────────────────────────────────────────────
  function trigger(type, data) {
    // type: 'new-order' | 'new-assignment'
    // data: { trackingId, senderName, pickupAddress, price, viewUrl }

    let title, subtitle, pushTitle, pushBody;

    if (type === 'new-order') {
      title = '🛍️ NEW ORDER — ' + (data.trackingId || '');
      subtitle = (data.senderName || 'Customer') + ' · ' + (data.pickupAddress || '') + (data.price ? ' · ₦' + data.price.toLocaleString() : '');
      pushTitle = '🛍️ New Order Received!';
      pushBody = (data.trackingId || '') + ' from ' + (data.senderName || 'a customer');
    } else {
      title = '🛵 NEW DELIVERY ASSIGNED!';
      subtitle = (data.trackingId || '') + ' · Pickup: ' + (data.pickupAddress || '');
      pushTitle = '🛵 You have a new delivery!';
      pushBody = 'Order ' + (data.trackingId || '') + ' has been assigned to you. Open the app to start.';
    }

    playRepeatAlarm(type, 3);
    showBanner(type, title, subtitle, data.viewUrl);
    pushNotification(pushTitle, pushBody);
  }

  function dismiss() {
    const banner = document.getElementById('mag-alert-banner');
    if (banner) banner.classList.remove('show');
    if (titleInterval) { clearInterval(titleInterval); document.title = originalTitle; }
  }

  function viewAlert() {
    dismiss();
    if (currentAlertUrl) window.location.href = currentAlertUrl;
  }

  return { init, trigger, dismiss, viewAlert };

})();

// ═══════════════════════════════════════════════════════════════
// FIRESTORE LISTENERS — Auto-detect new orders and assignments
// Call these from your admin/rider pages after Firebase init
// ═══════════════════════════════════════════════════════════════

window.MagCityListeners = (function() {

  // ── ADMIN LISTENER — fires when a NEW order lands ────────────
  function listenForNewOrders(db, firestoreModule) {
    const { collection, onSnapshot, query, orderBy, limit } = firestoreModule;
    const startTime = Date.now();
    let initialized = false;

    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(20));

    onSnapshot(q, (snapshot) => {
      if (!initialized) { initialized = true; return; } // skip first load

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const order = change.doc.data();
          const orderTime = order.createdAt?.seconds
            ? order.createdAt.seconds * 1000
            : Date.now();

          // Only alert for orders placed after this page loaded
          if (orderTime < startTime - 5000) return;

          MagCityAlerts.trigger('new-order', {
            trackingId: order.id || change.doc.id,
            senderName: order.senderName || 'Customer',
            pickupAddress: order.pickupAddress || '',
            price: order.price || 0,
            viewUrl: null // already on admin-orders page
          });
        }
      });
    });
  }

  // ── RIDER LISTENER — fires when an order is assigned to rider ─
  function listenForNewAssignments(db, firestoreModule, riderUid) {
    const { collection, onSnapshot, query, where } = firestoreModule;
    let initialized = false;
    const knownOrders = new Set();

    const q = query(collection(db, 'orders'), where('assignedRider', '==', riderUid));

    onSnapshot(q, (snapshot) => {
      if (!initialized) {
        // On first load, just record existing orders — don't alert
        snapshot.docs.forEach(d => knownOrders.add(d.id));
        initialized = true;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const docId = change.doc.id;
          const order = change.doc.data();

          // Only alert for newly assigned orders not seen before
          if (!knownOrders.has(docId) && order.assignedRider === riderUid) {
            knownOrders.add(docId);
            MagCityAlerts.trigger('new-assignment', {
              trackingId: order.id || docId,
              pickupAddress: order.pickupAddress || '',
              dropoffAddress: order.dropoffAddress || '',
              viewUrl: null
            });
          }
        }
      });
    });
  }

  return { listenForNewOrders, listenForNewAssignments };

})();
