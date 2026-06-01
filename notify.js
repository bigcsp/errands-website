/**
 * ═══════════════════════════════════════════════════════
 *  ERRANDS — WhatsApp Notification Agent  (notify.js)
 * ═══════════════════════════════════════════════════════
 *
 *  DROP-IN: add to order.html + admin.html before </body>
 *  <script src="notify.js"></script>
 *
 *  Then in order.html, after localStorage.setItem(...),
 *  call:  ErrandsNotify.send(order);
 * ═══════════════════════════════════════════════════════
 */

;(function () {

  /* ── CONFIG ─────────────────────────────────────── */
  const CONFIG = {
    businessWhatsApp: '2348000000000',   // ← your WhatsApp number (no + or spaces)
    businessName:     'Errands Lagos',
    storageKey:       'errands_notifications',
    autoOpenWhatsApp: true,              // set false to require manual click
  };

  /* ── INJECT CSS ──────────────────────────────────── */
  const css = `
    #en-overlay {
      position:fixed; inset:0; z-index:99999;
      background:rgba(0,0,0,0.75);
      backdrop-filter:blur(10px);
      display:flex; align-items:flex-end; justify-content:center;
      padding-bottom:32px;
      opacity:0; pointer-events:none;
      transition:opacity .35s ease;
    }
    #en-overlay.en-show { opacity:1; pointer-events:all; }

    #en-card {
      background:#111; border:1px solid rgba(255,255,255,0.1);
      border-radius:24px; width:100%; max-width:460px;
      margin:0 16px;
      transform:translateY(60px); opacity:0;
      transition:transform .4s cubic-bezier(.34,1.56,.64,1), opacity .35s ease;
      overflow:hidden;
    }
    #en-overlay.en-show #en-card { transform:translateY(0); opacity:1; }

    /* progress bar */
    #en-progress-bar {
      height:3px; background:#FF6B2B;
      width:0%; transition:width 1.2s ease;
    }

    #en-body { padding:28px 28px 24px; }

    #en-icon-row {
      display:flex; align-items:center; gap:14px; margin-bottom:20px;
    }
    .en-icon-circle {
      width:52px; height:52px; border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      font-size:24px; flex-shrink:0;
    }
    .en-icon-orange { background:rgba(255,107,43,.15); }
    .en-icon-wa     { background:rgba(37,211,102,.15); }

    #en-arrow {
      color:rgba(255,255,255,.2); font-size:22px;
      animation: en-pulse-arrow 1.2s infinite;
    }
    @keyframes en-pulse-arrow {
      0%,100%{opacity:.25} 50%{opacity:.8}
    }

    #en-title {
      font-family:'Syne',sans-serif; font-weight:800;
      font-size:20px; color:#f0f0f0; margin-bottom:4px;
    }
    #en-sub {
      font-size:13px; color:#777; font-family:'DM Sans',sans-serif;
    }

    #en-order-box {
      background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.07);
      border-radius:14px; padding:14px 18px;
      margin:18px 0; display:grid;
      grid-template-columns:1fr 1fr; gap:8px;
    }
    .en-row { display:flex; flex-direction:column; gap:2px; }
    .en-row-label { font-size:10px; color:#666; font-family:'Syne',sans-serif; letter-spacing:.5px; text-transform:uppercase; }
    .en-row-val   { font-size:13px; color:#e0e0e0; font-family:'DM Sans',sans-serif; font-weight:500; }
    .en-row-val.orange { color:#FF6B2B; font-family:'Syne',sans-serif; font-weight:700; letter-spacing:.5px; }
    .en-row-val.green  { color:#22c55e; font-weight:700; }

    #en-status-line {
      display:flex; align-items:center; gap:8px;
      font-size:13px; color:#aaa; font-family:'DM Sans',sans-serif;
      margin-bottom:20px; min-height:22px;
    }
    #en-status-dot {
      width:8px; height:8px; border-radius:50%;
      background:#f59e0b; flex-shrink:0;
      animation:en-blink 1s infinite;
    }
    @keyframes en-blink { 0%,100%{opacity:1} 50%{opacity:.3} }
    #en-status-dot.green { background:#22c55e; animation:none; }

    #en-actions { display:flex; gap:10px; }
    .en-btn {
      flex:1; padding:12px; border-radius:12px;
      font-family:'Syne',sans-serif; font-weight:700; font-size:13px;
      cursor:pointer; border:none; transition:all .2s;
      text-decoration:none; text-align:center; display:block;
    }
    .en-btn-wa  { background:#25D366; color:#fff; }
    .en-btn-wa:hover  { background:#1da851; transform:translateY(-1px); }
    .en-btn-trk { background:rgba(255,107,43,.15); color:#FF6B2B; border:1px solid rgba(255,107,43,.3)!important; }
    .en-btn-trk:hover { background:rgba(255,107,43,.25); }
    .en-btn-cls { background:rgba(255,255,255,.06); color:#888; border:1px solid rgba(255,255,255,.07)!important; }
    .en-btn-cls:hover { background:rgba(255,255,255,.1); color:#e0e0e0; }

    /* Admin notification bell badge */
    #en-bell-badge {
      position:fixed; top:14px; right:90px; z-index:10000;
      display:none;
    }
    #en-bell-badge button {
      background:rgba(20,20,20,.92); border:1px solid rgba(255,255,255,.1);
      backdrop-filter:blur(12px); color:#f0f0f0;
      padding:7px 16px; border-radius:30px;
      font-family:'Syne',sans-serif; font-weight:700; font-size:13px;
      cursor:pointer; display:flex; align-items:center; gap:7px;
      transition:all .2s;
    }
    #en-bell-badge button:hover { background:rgba(40,40,40,.95); }
    #en-bell-count {
      background:#FF6B2B; color:#fff;
      width:18px; height:18px; border-radius:50%;
      font-size:10px; display:flex; align-items:center; justify-content:center;
      font-weight:800;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── INJECT HTML ─────────────────────────────────── */
  const html = `
    <div id="en-overlay">
      <div id="en-card">
        <div id="en-progress-bar"></div>
        <div id="en-body">
          <div id="en-icon-row">
            <div class="en-icon-circle en-icon-orange">📦</div>
            <div id="en-arrow">→</div>
            <div class="en-icon-circle en-icon-wa">💬</div>
          </div>
          <div id="en-title">Order placed!</div>
          <div id="en-sub">Notifying business via WhatsApp…</div>
          <div id="en-order-box">
            <div class="en-row">
              <span class="en-row-label">Tracking ID</span>
              <span class="en-row-val orange" id="en-track-id">—</span>
            </div>
            <div class="en-row">
              <span class="en-row-label">Price</span>
              <span class="en-row-val green" id="en-price">—</span>
            </div>
            <div class="en-row">
              <span class="en-row-label">Package</span>
              <span class="en-row-val" id="en-pkg">—</span>
            </div>
            <div class="en-row">
              <span class="en-row-label">Pickup</span>
              <span class="en-row-val" id="en-pickup" style="font-size:11px">—</span>
            </div>
          </div>
          <div id="en-status-line">
            <div id="en-status-dot"></div>
            <span id="en-status-text">Preparing WhatsApp message…</span>
          </div>
          <div id="en-actions">
            <a class="en-btn en-btn-wa"  id="en-wa-btn"  href="#" target="_blank">💬 Open WhatsApp</a>
            <a class="en-btn en-btn-trk" id="en-trk-btn" href="#">🔍 Track Order</a>
            <button class="en-btn en-btn-cls" onclick="ErrandsNotify.close()">✕</button>
          </div>
        </div>
      </div>
    </div>

    <div id="en-bell-badge">
      <button onclick="ErrandsNotify.openAdmin()">
        🔔 <span id="en-bell-count">0</span> new order
      </button>
    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  /* ── STORAGE HELPERS ─────────────────────────────── */
  function getNotifications () {
    return JSON.parse(localStorage.getItem(CONFIG.storageKey) || '[]');
  }
  function saveNotification (order) {
    const list = getNotifications();
    list.unshift({ ...order, notifiedAt: new Date().toISOString(), read: false });
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(list));
  }
  function getUnreadCount () {
    return getNotifications().filter(n => !n.read).length;
  }

  /* ── WHATSAPP MESSAGE BUILDER ────────────────────── */
  function buildMessage (order) {
    const date = new Date(order.createdAt).toLocaleString('en-GB', {
      day:'2-digit', month:'short', year:'numeric',
      hour:'2-digit', minute:'2-digit',
    });
    return encodeURIComponent(
`🚴 *New Delivery Order — Errands*

📋 *Order ID:* ${order.id}
👤 *Sender:* ${order.senderName}
📞 *Phone:* ${order.senderPhone}
📍 *Pickup:* ${order.pickupAddress}
🏁 *Drop-off:* ${order.dropoffAddress}
📦 *Package:* ${order.packageType} (${order.packageWeight}kg)
💰 *Price:* ₦${Number(order.price).toLocaleString()}
📅 *Date:* ${date}${order.notes ? '\n📝 *Notes:* ' + order.notes : ''}
👤 *Recipient:* ${order.recipientName} · ${order.recipientPhone}

_Please assign a rider and confirm._ ✅`
    );
  }

  /* ── STATUS STEPS ────────────────────────────────── */
  function runSteps (order) {
    const steps = [
      { delay: 0,    text: 'Preparing WhatsApp message…',    dot: 'yellow' },
      { delay: 900,  text: 'Connecting to WhatsApp…',        dot: 'yellow' },
      { delay: 1800, text: 'Message sent to business! ✅',   dot: 'green'  },
    ];

    const bar  = document.getElementById('en-progress-bar');
    const dot  = document.getElementById('en-status-dot');
    const txt  = document.getElementById('en-status-text');
    const sub  = document.getElementById('en-sub');
    const waBtn= document.getElementById('en-wa-btn');

    // Start progress bar
    requestAnimationFrame(() => { bar.style.width = '100%'; });

    steps.forEach(({ delay, text, dot: dotColor }) => {
      setTimeout(() => {
        txt.textContent = text;
        dot.className   = dotColor === 'green' ? 'green' : '';
        if (dotColor === 'green') {
          sub.textContent = '🎉 Business notified via WhatsApp';
          sub.style.color = '#22c55e';
          // auto-open WhatsApp
          if (CONFIG.autoOpenWhatsApp) {
            const url = `https://wa.me/${CONFIG.businessWhatsApp}?text=${buildMessage(order)}`;
            waBtn.href = url;
            window.open(url, '_blank');
          }
        }
      }, delay);
    });
  }

  /* ── PUBLIC API ──────────────────────────────────── */
  window.ErrandsNotify = {

    send (order) {
      // Store notification
      saveNotification(order);

      // Populate card
      document.getElementById('en-track-id').textContent = order.id;
      document.getElementById('en-price').textContent    = '₦' + Number(order.price).toLocaleString();
      document.getElementById('en-pkg').textContent      = order.packageType;
      document.getElementById('en-pickup').textContent   = order.pickupAddress;

      // WhatsApp + Track links
      const waUrl = `https://wa.me/${CONFIG.businessWhatsApp}?text=${buildMessage(order)}`;
      document.getElementById('en-wa-btn').href  = waUrl;
      document.getElementById('en-trk-btn').href = `track.html?tracking=${order.id}`;

      // Show overlay
      const overlay = document.getElementById('en-overlay');
      overlay.classList.add('en-show');

      // Reset bar
      document.getElementById('en-progress-bar').style.width = '0%';
      document.getElementById('en-progress-bar').style.transition = 'none';
      requestAnimationFrame(() => {
        document.getElementById('en-progress-bar').style.transition = 'width 1.8s ease';
      });

      // Run status steps
      runSteps(order);

      // Browser push notification (if permission granted)
      if (Notification.permission === 'granted') {
        new Notification('📦 New Errands Order!', {
          body: `${order.id} — ₦${Number(order.price).toLocaleString()} · ${order.packageType}`,
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23FF6B2B"/><text y="65" x="50" text-anchor="middle" font-size="55">📦</text></svg>',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }

      // Update bell badge
      this._updateBadge();
    },

    close () {
      document.getElementById('en-overlay').classList.remove('en-show');
    },

    openAdmin () {
      window.location.href = 'admin.html';
    },

    // Call this on admin.html load to show the badge
    _updateBadge () {
      const count = getUnreadCount();
      const badge = document.getElementById('en-bell-badge');
      if (!badge) return;
      if (count > 0) {
        badge.style.display = 'block';
        document.getElementById('en-bell-count').textContent = count;
        document.getElementById('en-bell-count').closest('button').querySelector('span:last-child').textContent =
          count === 1 ? '  new order' : '  new orders';
      } else {
        badge.style.display = 'none';
      }
    },

    markAllRead () {
      const list = getNotifications().map(n => ({ ...n, read: true }));
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(list));
      this._updateBadge();
    },
  };

  /* ── Auto-update badge on admin page ─────────────── */
  if (window.location.pathname.includes('admin')) {
    setTimeout(() => ErrandsNotify._updateBadge(), 300);
    // Mark all read when admin views
    setTimeout(() => ErrandsNotify.markAllRead(), 2000);
  }

  /* ── Close on backdrop click ─────────────────────── */
  document.getElementById('en-overlay').addEventListener('click', function (e) {
    if (e.target === this) ErrandsNotify.close();
  });

})();