/**
 * ═══════════════════════════════════════════════════════
 *  ERRANDS — Smart Guide Agent FREE VERSION (guide.js)
 *  Updated with Magodo Phase 2 zones & routes
 *  No API key needed. No cost. Works forever.
 * ═══════════════════════════════════════════════════════
 */

;(function () {

  const CONFIG = {
    agentName:  'Ade',
    businessWA: '2348139220395',
  };

  /* ── ALL ANSWERS ─────────────────────────────────── */
  const KNOWLEDGE = [
    {
      patterns: ['place order','book','how do i order','make order','send package','book a delivery','book delivery','i want to send','how to order','create order'],
      answer: `Sure! Here is how to place an order 😊\n\n1. Click the big orange **Place Order** button at the top of the page\n2. Type your **name** and **phone number**\n3. Type the **address** where the rider should pick up your package\n4. Choose the **date and time** you want\n5. Type the **address** where it should be delivered\n6. Type the **name and phone** of the person receiving it\n7. Choose your **package type**\n8. Click **Place Order** — you will get a tracking number immediately! 📦\n\nWrite down your tracking number — it starts with **MAG-**`
    },
    {
      patterns: ['track','where is my package','find my order','check my order','tracking number','where is my order','how do i track','find package','check delivery'],
      answer: `Here is how to track your package 🔍\n\n1. Find your **tracking number** — it starts with MAG- (example: MAG-ABC12345)\n2. Look at the top of this page and click **Track** in the menu\n3. Type your tracking number in the box\n4. Press **Track now**\n\nYou will see exactly where your package is! 📍\n\nIf you lost your tracking number, call us on **+234 813 922 0395** and we will help you.`
    },
    {
      patterns: ['how much','cost','price','fee','charge','expensive','cheap','pricing','rate','pay'],
      answer: `Here are our delivery prices 💰\n\n- 📄 **Documents** — ₦800\n- 📦 **Small parcel** — ₦1,200\n- 🗃️ **Medium parcel** — ₦1,800\n- 📫 **Large parcel** — ₦2,500\n- 🍱 **Food / Perishables** — ₦1,500\n- 🏺 **Fragile items** — ₦2,000\n- 💻 **Electronics** — ₦2,200\n\nHeavier packages (over 2kg) may have a small extra charge of ₦200 per kg.\n\nAll prices are estimates — the final price is confirmed when your order is picked up.`
    },
    {
      patterns: ['how long','time','fast','quick','minutes','hours','when will','delivery time','how fast','speed'],
      answer: `We deliver really fast! 🚴\n\n- **Average delivery time** — about **30 minutes**\n- **Express same-day delivery** — within a few hours\n- Our riders are on bicycles so they move quickly through traffic!\n\nYou can watch your rider move on the **live map** so you always know exactly when to expect your package.`
    },
    {
      patterns: ['what is errands','what does','what is this','explain','tell me about','about this','what do you do','what is this website','this app','this website'],
      answer: `Welcome to **Errands** 🚴\n\nErrands is a fast bicycle delivery service based in **Magodo Phase 2, Lagos**.\n\nHere is what we do in simple words:\n\n- You have a **package** you want to send\n- You tell us the **pickup address** and the **delivery address**\n- One of our **riders on a bicycle** comes to pick it up\n- They deliver it **fast — usually in 30 minutes**\n- You can **watch the rider on a map** the whole time!\n\nWe cover all streets and zones inside **Magodo Phase 2** and nearby areas 📦`
    },
    {
      patterns: ['rider','courier','who delivers','who brings','dispatch','biker'],
      answer: `Our riders are trained bicycle couriers based in **Magodo Phase 2** 🚴\n\nHere is how it works:\n\n1. You place your order\n2. The **nearest available rider** gets assigned automatically\n3. They come to your pickup address\n4. They deliver your package safely\n\nYou can see your rider's name and rating when they are assigned. Our riders know every street in Magodo Phase 2 very well!`
    },
    {
      patterns: ['live map','map','watch','see rider','real time','live tracking','live route','view map'],
      answer: `Yes! You can watch your rider on a **live map** in real time 🗺️\n\nHere is how:\n\n1. Place your order and get your tracking number\n2. Go to the **Track** page\n3. Enter your tracking number\n4. Click **View Live Route**\n\nYou will see the rider moving through **Magodo Phase 2** streets — from pickup all the way to your door! The map also shows the **ETA** (how many minutes until delivery).`
    },
    {
      patterns: ['cancel','cancell','stop order','change order','modify','wrong address'],
      answer: `To cancel or change an order, please contact us **immediately** 📞\n\nCall or WhatsApp: **+234 813 922 0395**\n\nWe can cancel or change your order **before the rider picks up** the package. Once the rider is on the way it may not be possible to cancel.\n\nPlease have your **tracking number** ready when you call.`
    },
    {
      patterns: ['contact','phone','call','whatsapp','email','reach','speak','talk to','customer care','support','human'],
      answer: `Here is how to reach us 📞\n\n- 📱 **Call / WhatsApp:** +234 813 922 0395\n- ✉️ **Email:** hello@errands.com\n- 🕐 **Hours:** Monday to Saturday, 7am – 9pm\n\nYou can also click the **green WhatsApp button** on the right side of this page to chat with us directly right now!`
    },
    {
      patterns: ['safe','secure','insured','damage','lost','broken','fragile','careful'],
      answer: `Your package is in safe hands! 🛡️\n\n- All deliveries are **handled with care**\n- **Fragile items** get extra careful handling — just select "Fragile item" when placing your order\n- Our riders are trained to handle packages safely\n- If you have concerns about a specific item, add a note in the **"Notes for rider"** box when ordering\n\nFor very valuable items, please mention this when you contact us.`
    },
    {
      // ── UPDATED ZONES ──
      patterns: ['area','zone','location','cover','deliver to','where do you','which areas','which places','magodo','tokunbo','malculy','secretariat','west zone','bashiru','shittu','emmanuel','keshi','shagisha','phase 2','phase ii','street','gate','road'],
      answer: `We cover all zones inside **Magodo Phase 2** 🗺️\n\nOur delivery zones include:\n\n- 📍 **Tokunbo Malculy** street & surroundings\n- 📍 **Secretariat Gate** zone\n- 📍 **West Zone** — all streets\n- 📍 **Bashiru Shittu** avenue & nearby roads\n- 📍 **Emmanuel Keshi** street & estate\n- 📍 **Shagisha Gate** zone\n- 📍 **Magodo Phase 2 Gateway** (main entrance)\n- 📍 **All internal streets** within Magodo Phase 2\n\nNot sure if we reach your exact street? Just **call or WhatsApp us** on **+234 813 922 0395** and we will confirm right away! 😊`
    },
    {
      patterns: ['tokunbo','malculy','tokunmbo'],
      answer: `Yes! We deliver to and from **Tokunbo Malculy** street in Magodo Phase 2 📍\n\nJust enter the full address when placing your order — for example:\n*"5 Tokunbo Malculy Street, Magodo Phase 2, Lagos"*\n\nOur riders know this street very well. Click **Place Order** to book now! 📦`
    },
    {
      patterns: ['secretariat','secretariat gate'],
      answer: `Yes! We cover the **Secretariat Gate** zone in Magodo Phase 2 📍\n\nJust enter your full address at the Secretariat Gate area when placing your order.\n\nOur riders are familiar with all the streets around that gate. Click **Place Order** to get started! 📦`
    },
    {
      patterns: ['west zone','westzone','west'],
      answer: `Yes! We deliver across the **West Zone** of Magodo Phase 2 📍\n\nAll streets in the West Zone are covered by our riders.\n\nJust enter your full street address when placing your order and your rider will find you! 🚴`
    },
    {
      patterns: ['bashiru','shittu','bashiru shittu'],
      answer: `Yes! We deliver to **Bashiru Shittu Avenue** and surrounding roads in Magodo Phase 2 📍\n\nEnter your full address — for example:\n*"12 Bashiru Shittu Avenue, Magodo Phase 2, Lagos"*\n\nClick **Place Order** to book your delivery now! 📦`
    },
    {
      patterns: ['emmanuel','keshi','emmanuel keshi'],
      answer: `Yes! We cover **Emmanuel Keshi Street** in Magodo Phase 2 📍\n\nThis is one of our regular delivery routes. Just enter your full address when placing an order.\n\nFor example: *"Emmanuel Keshi Street, Magodo Phase 2, Lagos"*\n\nClick **Place Order** to get started! 🚴`
    },
    {
      patterns: ['shagisha','shagisha gate'],
      answer: `Yes! We deliver to the **Shagisha Gate** zone in Magodo Phase 2 📍\n\nOur riders know the Shagisha Gate area very well.\n\nJust enter your exact address when placing your order and your rider will be there fast! 🚴📦`
    },
    {
      patterns: ['business','bulk','many orders','multiple','shop','store','company','corporate','volume','wholesale'],
      answer: `Yes! We have special plans for businesses 🏪\n\n- **Volume discounts** for regular deliveries\n- **Priority rider assignment** for business accounts\n- **Monthly invoicing** available\n- Perfect for shops, restaurants, pharmacies in Magodo Phase 2\n\nTo set up a business account, contact us:\n📱 **+234 813 922 0395**\n✉️ **hello@errands.com**\n\nWe will create a custom plan that fits your needs!`
    },
    {
      patterns: ['payment','pay','cash','transfer','pos','card','online payment','how to pay'],
      answer: `Payment is simple 💳\n\nCurrently we accept:\n- **Cash on pickup** — pay the rider when they collect your package\n- **Bank transfer** — details provided when you confirm your order\n\nThe delivery fee is shown to you **before** you confirm, so there are no surprises.\n\nFor business accounts we also offer monthly invoicing.`
    },
    {
      patterns: ['hello','hi','hey','good morning','good afternoon','good evening','howdy','sup','hiya'],
      answer: `Hello! Welcome to Errands 👋😊\n\nI am **Ade**, your Errands helper. I am here to make things easy for you!\n\nI can help you with:\n- 📦 How to **place a delivery order**\n- 🔍 How to **track your package**\n- 💰 **Delivery prices**\n- 🗺️ **Zones we cover in Magodo Phase 2**\n- 📞 **Contact information**\n\nWhat would you like to know?`
    },
    {
      patterns: ['thank','thanks','thank you','appreciate','helpful','great','wonderful','perfect','nice'],
      answer: `You are very welcome! 😊\n\nI am always here if you need more help. Have a wonderful day and happy delivering with Errands! 🚴📦`
    },
    {
      patterns: ['bye','goodbye','see you','later','done','finished','that is all','ok thanks','okay thanks'],
      answer: `Goodbye! 👋 Have a wonderful day!\n\nRemember, if you ever need help placing an order or tracking a package, just click the **Need Help?** button and I will be right here 😊\n\nHappy delivering with Errands! 🚴`
    },
  ];

  /* ── MATCH ENGINE ────────────────────────────────── */
  function getAnswer(input) {
    const text = input.toLowerCase().trim();
    for (const item of KNOWLEDGE) {
      for (const pattern of item.patterns) {
        if (text.includes(pattern)) return item.answer;
      }
    }
    const words = text.split(/\s+/);
    for (const item of KNOWLEDGE) {
      for (const pattern of item.patterns) {
        const pw = pattern.split(/\s+/);
        if (pw.some(p => p.length > 3 && words.some(w => w.includes(p) || p.includes(w)))) {
          return item.answer;
        }
      }
    }
    return `I am not sure about that, but I can help you with these 😊\n\n- 📦 **Place an order** — click the orange button at the top\n- 🔍 **Track your package** — click "Track" in the menu\n- 🗺️ **Delivery zones** — ask me "which areas do you cover"\n- 📞 **Speak to someone** — call **+234 813 922 0395**\n\nOr click the green **WhatsApp button** on the right to chat with our team directly!`;
  }

  /* ── CSS ─────────────────────────────────────────── */
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap');

    #eg-fab {
      position:fixed; bottom:100px; right:24px; left:auto; z-index:89999;
      display:flex; align-items:center; gap:10px;
      background:#FF6B2B; color:#fff;
      padding:0 20px 0 16px; height:52px;
      border-radius:26px; border:none; cursor:pointer;
      font-family:'Syne',sans-serif; font-weight:700; font-size:14px;
      box-shadow:0 4px 20px rgba(255,107,43,.45);
      transition:all .25s; white-space:nowrap;
    }
    #eg-fab:hover { transform:scale(1.06); box-shadow:0 6px 28px rgba(255,107,43,.6); }
    #eg-fab .eg-fab-icon { font-size:22px; }
    #eg-notif {
      position:absolute; top:-4px; right:-4px;
      background:#ef4444; color:#fff;
      width:16px; height:16px; border-radius:50%;
      font-size:9px; display:none; align-items:center; justify-content:center;
      font-weight:800;
    }
    #eg-panel {
      position:fixed; bottom:0; right:0; left:auto;
      width:360px; max-width:100vw; height:100dvh;
      background:#0e0e0e; border-left:1px solid rgba(255,255,255,.08);
      z-index:90000; display:flex; flex-direction:column;
      transform:translateX(110%); transition:transform .35s cubic-bezier(.4,0,.2,1);
      font-family:'DM Sans',sans-serif;
    }
    #eg-panel.eg-open { transform:translateX(0); }
    #eg-backdrop {
      position:fixed; inset:0; z-index:89998;
      background:rgba(0,0,0,.5); backdrop-filter:blur(4px); display:none;
    }
    #eg-backdrop.eg-show { display:block; }
    #eg-header {
      padding:18px 18px 14px;
      background:linear-gradient(135deg,#1a0f00,#0e0e0e);
      border-bottom:1px solid rgba(255,255,255,.06); flex-shrink:0;
    }
    #eg-header-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
    #eg-agent-row { display:flex; align-items:center; gap:12px; }
    #eg-avatar {
      width:44px; height:44px; border-radius:50%;
      background:linear-gradient(135deg,#FF6B2B,#ff9f6b);
      display:flex; align-items:center; justify-content:center; font-size:22px;
    }
    #eg-agent-name { font-family:'Syne',sans-serif; font-weight:800; font-size:15px; color:#f0f0f0; }
    .eg-online { display:flex; align-items:center; gap:5px; font-size:11px; color:#22c55e; margin-top:2px; }
    .eg-online-dot { width:6px; height:6px; border-radius:50%; background:#22c55e; animation:egPulse 1.4s infinite; }
    @keyframes egPulse{0%,100%{opacity:1}50%{opacity:.4}}
    #eg-close-btn {
      background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.08);
      color:#888; width:32px; height:32px; border-radius:8px;
      cursor:pointer; font-size:16px; display:flex; align-items:center;
      justify-content:center; transition:all .2s;
    }
    #eg-close-btn:hover { background:rgba(255,255,255,.12); color:#f0f0f0; }
    #eg-font-controls {
      display:flex; align-items:center; gap:6px;
      background:rgba(255,255,255,.04); border-radius:8px;
      padding:4px 8px; width:fit-content;
    }
    #eg-font-controls span { font-size:11px; color:#666; }
    .eg-font-btn {
      background:rgba(255,255,255,.07); border:none; color:#aaa;
      width:26px; height:26px; border-radius:6px; cursor:pointer;
      font-size:13px; font-weight:700; display:flex; align-items:center;
      justify-content:center; transition:all .15s;
    }
    .eg-font-btn:hover { background:rgba(255,255,255,.14); color:#fff; }
    #eg-messages {
      flex:1; overflow-y:auto; padding:16px;
      display:flex; flex-direction:column; gap:12px; scroll-behavior:smooth;
    }
    #eg-messages::-webkit-scrollbar{width:4px}
    #eg-messages::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
    .eg-msg { display:flex; flex-direction:column; max-width:90%; gap:4px; }
    .eg-msg.eg-user { align-self:flex-end; align-items:flex-end; }
    .eg-msg.eg-bot  { align-self:flex-start; align-items:flex-start; }
    .eg-bubble { padding:11px 14px; border-radius:18px; line-height:1.6; word-break:break-word; }
    .eg-user .eg-bubble { background:#FF6B2B; color:#fff; border-bottom-right-radius:4px; }
    .eg-bot  .eg-bubble { background:#1a1a1a; color:#e8e8e8; border:1px solid rgba(255,255,255,.07); border-bottom-left-radius:4px; }
    .eg-bubble strong { color:#fff; }
    .eg-msg-time { font-size:10px; color:#555; padding:0 4px; }
    .eg-typing .eg-bubble { padding:14px 18px; }
    .eg-typing-dots { display:flex; gap:5px; }
    .eg-typing-dots span { width:7px; height:7px; border-radius:50%; background:#555; animation:egDot .8s infinite; }
    .eg-typing-dots span:nth-child(2){animation-delay:.15s}
    .eg-typing-dots span:nth-child(3){animation-delay:.3s}
    @keyframes egDot{0%,80%,100%{transform:scale(1);opacity:.5}40%{transform:scale(1.3);opacity:1}}
    #eg-chips { padding:0 16px 12px; display:flex; flex-wrap:wrap; gap:7px; flex-shrink:0; }
    .eg-chip {
      background:rgba(255,107,43,.09); border:1px solid rgba(255,107,43,.2);
      color:#e0e0e0; padding:6px 12px; border-radius:20px;
      font-size:12px; cursor:pointer; white-space:nowrap; transition:all .2s;
    }
    .eg-chip:hover { background:rgba(255,107,43,.22); color:#fff; }
    #eg-input-bar {
      padding:12px 14px; border-top:1px solid rgba(255,255,255,.06);
      display:flex; gap:8px; align-items:flex-end; flex-shrink:0;
    }
    #eg-input {
      flex:1; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1);
      border-radius:12px; color:#f0f0f0; font-family:'DM Sans',sans-serif;
      padding:10px 14px; resize:none; outline:none; max-height:100px;
      line-height:1.45; transition:border-color .2s; font-size:14px;
    }
    #eg-input:focus { border-color:rgba(255,107,43,.5); }
    #eg-input::placeholder { color:#444; }
    #eg-send-btn, #eg-voice-btn {
      width:40px; height:40px; border-radius:10px; border:none;
      cursor:pointer; font-size:17px; display:flex; align-items:center;
      justify-content:center; transition:all .2s; flex-shrink:0;
    }
    #eg-send-btn { background:#FF6B2B; color:#fff; }
    #eg-send-btn:hover { background:#e05a20; transform:scale(1.05); }
    #eg-voice-btn { background:rgba(255,255,255,.06); color:#888; }
    #eg-voice-btn:hover { background:rgba(255,255,255,.12); color:#fff; }
    #eg-voice-btn.eg-speaking { background:rgba(34,197,94,.15); color:#22c55e; }
    #eg-welcome {
      position:absolute; inset:0; z-index:10; background:#0e0e0e;
      display:flex; flex-direction:column; align-items:center;
      justify-content:center; padding:32px 28px; text-align:center;
    }
    #eg-welcome-icon { font-size:56px; margin-bottom:20px; }
    #eg-welcome h2 { font-family:'Syne',sans-serif; font-weight:800; font-size:22px; color:#f0f0f0; margin-bottom:10px; }
    #eg-welcome p { color:#888; font-size:14px; line-height:1.7; margin-bottom:28px; }
    #eg-welcome-start {
      background:#FF6B2B; color:#fff; border:none; padding:14px 36px;
      border-radius:30px; font-family:'Syne',sans-serif; font-weight:700;
      font-size:16px; cursor:pointer; transition:all .2s; margin-bottom:12px; width:100%;
    }
    #eg-welcome-start:hover { background:#e05a20; transform:translateY(-1px); }
    #eg-welcome-skip { background:transparent; border:none; color:#555; font-size:13px; cursor:pointer; text-decoration:underline; }
    #eg-wa-cta {
      margin:0 16px 12px; background:rgba(37,211,102,.1);
      border:1px solid rgba(37,211,102,.25); border-radius:12px;
      padding:12px 16px; display:flex; align-items:center; gap:10px;
      text-decoration:none; transition:background .2s; flex-shrink:0;
    }
    #eg-wa-cta:hover { background:rgba(37,211,102,.18); }
    #eg-wa-cta span { font-size:20px; }
    #eg-wa-cta-title { font-size:12px; color:#22c55e; font-family:'Syne',sans-serif; font-weight:700; }
    #eg-wa-cta-sub { font-size:11px; color:#666; margin:0; }

    /* Zones quick-list pill */
    .eg-zone-pill {
      display:inline-block; background:rgba(255,107,43,.1);
      border:1px solid rgba(255,107,43,.2); color:#FF6B2B;
      padding:3px 10px; border-radius:20px; font-size:11px;
      font-family:'Syne',sans-serif; font-weight:700; margin:2px;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── HTML ────────────────────────────────────────── */
  const html = `
    <div id="eg-backdrop"></div>
    <button id="eg-fab" onclick="ErrandsGuide.open()">
      <span class="eg-fab-icon">🙋</span>
      Need Help?
      <span id="eg-notif"></span>
    </button>
    <div id="eg-panel">
      <div id="eg-welcome">
        <div id="eg-welcome-icon">👋</div>
        <h2>Hi! I'm Ade.</h2>
        <p>I'm your personal helper for <strong style="color:#FF6B2B">Errands</strong> — Magodo Phase 2's fast bicycle delivery service.<br><br>
        I know every zone and street in Magodo Phase 2. Ask me anything!</p>
        <button id="eg-welcome-start" onclick="ErrandsGuide.startChat()">Let's get started 🚀</button>
        <button id="eg-welcome-skip"  onclick="ErrandsGuide.skipWelcome()">Skip intro</button>
      </div>
      <div id="eg-header">
        <div id="eg-header-top">
          <div id="eg-agent-row">
            <div id="eg-avatar">🙋</div>
            <div>
              <div id="eg-agent-name">Ade — Errands Guide</div>
              <div class="eg-online"><span class="eg-online-dot"></span> Always here to help</div>
            </div>
          </div>
          <button id="eg-close-btn" onclick="ErrandsGuide.close()">✕</button>
        </div>
        <div id="eg-font-controls">
          <span>Text size:</span>
          <button class="eg-font-btn" onclick="ErrandsGuide.fontSize(-2)">A−</button>
          <button class="eg-font-btn" onclick="ErrandsGuide.fontSize(2)">A+</button>
        </div>
      </div>
      <div id="eg-messages"></div>
      <a id="eg-wa-cta" href="https://wa.me/2348139220395?text=Hello!%20I%20need%20help%20with%20my%20order" target="_blank">
        <span>💬</span>
        <div>
          <div id="eg-wa-cta-title">Chat with a real person</div>
          <p id="eg-wa-cta-sub">Open WhatsApp — we reply fast!</p>
        </div>
      </a>
      <div id="eg-chips"></div>
      <div id="eg-input-bar">
        <textarea id="eg-input" rows="1" placeholder="Ask me about zones, prices, orders… 😊"
          onkeydown="ErrandsGuide.handleKey(event)"
          oninput="ErrandsGuide.autoResize(this)"></textarea>
        <button id="eg-voice-btn" onclick="ErrandsGuide.toggleSpeak()" title="Read last reply aloud">🔊</button>
        <button id="eg-send-btn" onclick="ErrandsGuide.send()">➤</button>
      </div>
    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  /* ── QUICK CHIPS ─────────────────────────────────── */
  const CHIPS = [
    { label:'📦 How do I place an order?',       msg:'How do I place an order?' },
    { label:'🔍 How do I track my package?',     msg:'How do I track my package?' },
    { label:'🗺️ Which zones do you cover?',      msg:'Which areas do you deliver to?' },
    { label:'📍 Do you cover Shagisha Gate?',    msg:'Do you deliver to Shagisha Gate?' },
    { label:'📍 Emmanuel Keshi delivery?',       msg:'Do you deliver to Emmanuel Keshi?' },
    { label:'💰 How much does delivery cost?',   msg:'How much does delivery cost?' },
    { label:'⏱ How long does delivery take?',    msg:'How long does delivery take?' },
    { label:'📞 Contact information',            msg:'How do I contact you?' },
  ];

  function renderChips() {
    document.getElementById('eg-chips').innerHTML = CHIPS.map(c =>
      `<button class="eg-chip" onclick="ErrandsGuide.sendQuick('${c.msg.replace(/'/g,"\\'")}')">${c.label}</button>`
    ).join('');
  }
  renderChips();

  /* ── STATE ───────────────────────────────────────── */
  let fontSize = 14;
  let lastBot  = '';
  let speaking = false;

  /* ── PUBLIC ──────────────────────────────────────── */
  window.ErrandsGuide = {
    open() {
      document.getElementById('eg-panel').classList.add('eg-open');
      document.getElementById('eg-backdrop').classList.add('eg-show');
      if (!localStorage.getItem('eg_visited')) {
        document.getElementById('eg-welcome').style.display = 'flex';
      } else {
        document.getElementById('eg-welcome').style.display = 'none';
      }
    },
    close() {
      document.getElementById('eg-panel').classList.remove('eg-open');
      document.getElementById('eg-backdrop').classList.remove('eg-show');
    },
    startChat() {
      localStorage.setItem('eg_visited','1');
      document.getElementById('eg-welcome').style.display = 'none';
      this._bot(`Hello! 😊 I am **Ade**, your Errands helper.\n\nI know every zone in **Magodo Phase 2**! I can help with:\n\n- 📦 **Place a delivery order**\n- 🔍 **Track your package**\n- 🗺️ **Zones covered** — Tokunbo Malculy, Secretariat Gate, West Zone, Bashiru Shittu, Emmanuel Keshi, Shagisha Gate\n- 💰 **Check prices**\n- 📞 **Contact the team**\n\nWhat would you like to know today?`);
    },
    skipWelcome() {
      localStorage.setItem('eg_visited','1');
      document.getElementById('eg-welcome').style.display = 'none';
    },
    handleKey(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send(); }
    },
    autoResize(el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 100) + 'px';
    },
    fontSize(d) {
      fontSize = Math.max(12, Math.min(22, fontSize + d));
      document.getElementById('eg-messages').style.fontSize = fontSize + 'px';
    },
    sendQuick(msg) {
      document.getElementById('eg-input').value = msg;
      this.send();
    },
    send() {
      const input = document.getElementById('eg-input');
      const text  = input.value.trim();
      if (!text) return;
      input.value = '';
      input.style.height = 'auto';
      this._user(text);
      const tid = this._typing();
      setTimeout(() => {
        this._removeTyping(tid);
        const answer = getAnswer(text);
        lastBot = answer;
        this._bot(answer);
      }, 500 + Math.random() * 400);
    },
    toggleSpeak() {
      if (!('speechSynthesis' in window)) return;
      if (speaking) {
        speechSynthesis.cancel(); speaking = false;
        document.getElementById('eg-voice-btn').classList.remove('eg-speaking');
        return;
      }
      if (!lastBot) return;
      const plain = lastBot.replace(/\*\*(.*?)\*\*/g,'$1').replace(/\n+/g,'. ');
      const u = new SpeechSynthesisUtterance(plain);
      u.rate = 0.88; u.lang = 'en-NG';
      u.onend = u.onerror = () => {
        speaking = false;
        document.getElementById('eg-voice-btn').classList.remove('eg-speaking');
      };
      speaking = true;
      document.getElementById('eg-voice-btn').classList.add('eg-speaking');
      speechSynthesis.speak(u);
    },
    _user(t)  { this._msg('eg-user', this._esc(t)); },
    _bot(t)   { this._msg('eg-bot',  this._md(t));  },
    _msg(cls, html) {
      const el   = document.getElementById('eg-messages');
      const time = new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
      const div  = document.createElement('div');
      div.className = `eg-msg ${cls}`;
      div.innerHTML = `<div class="eg-bubble">${html}</div><span class="eg-msg-time">${time}</span>`;
      el.appendChild(div);
      el.scrollTop = el.scrollHeight;
    },
    _typing() {
      const el  = document.getElementById('eg-messages');
      const id  = 'egt' + Date.now();
      const div = document.createElement('div');
      div.className = 'eg-msg eg-bot eg-typing'; div.id = id;
      div.innerHTML = `<div class="eg-bubble"><div class="eg-typing-dots"><span></span><span></span><span></span></div></div>`;
      el.appendChild(div); el.scrollTop = el.scrollHeight;
      return id;
    },
    _removeTyping(id) { document.getElementById(id)?.remove(); },
    _esc(t) { return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); },
    _md(t) {
      return t
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
        .replace(/\n/g,'<br>');
    },
  };

  document.getElementById('eg-backdrop').addEventListener('click', () => ErrandsGuide.close());

  setTimeout(() => {
    if (!localStorage.getItem('eg_visited')) {
      const n = document.getElementById('eg-notif');
      if (n) { n.style.display = 'flex'; n.textContent = '!'; }
    }
  }, 4000);

})();
