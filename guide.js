/**
 * ═══════════════════════════════════════════════════════
 *  ERRANDS — Smart Guide Agent  (guide.js)
 * ═══════════════════════════════════════════════════════
 *
 *  DROP-IN: add to EVERY page before </body>
 *  <script src="guide.js"></script>
 *
 *  Powered by Claude AI. Add your Anthropic API key below.
 *  ⚠ For production, proxy this through a backend server
 *    so your API key is not exposed in the browser.
 * ═══════════════════════════════════════════════════════
 */

;(function () {

  /* ── CONFIG ──────────────────────────────────────── */
  const CONFIG = {
    apiKey:     'YOUR_ANTHROPIC_API_KEY',   // ← paste your key here
    model:      'claude-sonnet-4-20250514',
    agentName:  'Ade',
    fontSize:   16,                          // base font size for chat (px)
    businessWA: '2348000000000',
  };

  /* ── SYSTEM PROMPT ────────────────────────────────── */
  const SYSTEM_PROMPT = `You are Ade, a warm, patient, and friendly helper for Errands — a fast bicycle delivery service based in Lagos, Nigeria.

Your MAIN job is to help people use this website, especially elderly people or those who have never used a delivery app before. Many users may be confused or nervous about technology.

TONE RULES (very important):
- Use simple, everyday words. No tech jargon.
- Keep sentences short and clear.
- Be warm and encouraging — like a helpful neighbour.
- Use emojis to make things friendly 😊 📦 🚴 ✅
- Always speak as if talking to someone who has never used a smartphone app before.
- Be patient. Never make anyone feel silly for not knowing.
- Use Nigerian context naturally (Lagos streets, Naira ₦, etc.)

WHAT THE APP DOES:
Errands is a bicycle delivery service in Lagos. Riders on bicycles pick up packages from one place and deliver them fast — usually in about 30 minutes.

THE WEBSITE HAS THESE PAGES:
1. 🏠 Home page — shows what the service does and live rider tracking
2. 📦 Place Order (order.html) — fill a simple form to book a delivery
3. 🔍 Track Order (track.html) — type your tracking number to see where your package is
4. 🗺 Live Route (live-route.html) — watch your rider moving on a map in real time
5. 🔧 Admin (admin.html) — for the business owner to manage all orders

HOW TO PLACE AN ORDER (step by step):
1. Click the big orange "Place Order" button
2. Type your full name and phone number
3. Type the address where the rider should pick up your package
4. Choose the date and time you want the pickup
5. Type the address where the package should be delivered
6. Type the name and phone of the person receiving it
7. Choose what type of package it is (documents, parcel, food, etc.)
8. Click "Place Order" — you'll get a tracking number immediately
9. Write down or screenshot your tracking number (starts with MAG-)

HOW TO TRACK AN ORDER:
1. Find your tracking number — it starts with MAG- (example: MAG-ABC12345)
2. Go to the Track page (click "Track" in the menu)
3. Type your tracking number in the box
4. Press "Track now" — you'll see where your package is

RESPONSE FORMAT:
- Max 3-4 sentences for simple answers
- Use numbered lists for step-by-step instructions
- Always end with: "Need more help? Just ask 😊" unless saying goodbye
- If someone seems confused, offer to repeat in simpler words`;

  /* ── QUICK ACTION CHIPS ───────────────────────────── */
  const QUICK_ACTIONS = [
    { label: '📦 How do I place an order?',   msg: 'How do I place an order? Please explain simply.' },
    { label: '🔍 How do I track my package?', msg: 'How do I track my package?' },
    { label: '❓ What does this app do?',      msg: 'What does this website do? Explain simply.' },
    { label: '💰 How much does delivery cost?',msg: 'How much does delivery cost?' },
    { label: '⏱ How long does delivery take?', msg: 'How long does delivery take?' },
    { label: '📞 I need to speak to someone',  msg: 'I need to speak to a real person at Errands.' },
  ];

  /* ── INJECT CSS ───────────────────────────────────── */
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap');

    /* ─ FAB button ─ */
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
    #eg-fab .eg-notif {
      position:absolute; top:-4px; right:-4px;
      background:#ef4444; color:#fff;
      width:16px; height:16px; border-radius:50%;
      font-size:9px; display:none; align-items:center; justify-content:center;
      font-weight:800;
    }

    /* ─ Panel ─ */
    #eg-panel {
      position:fixed; bottom:0; left:0;
      width:360px; max-width:calc(100vw - 0px); height:100dvh;
      background:#0e0e0e; border-right:1px solid rgba(255,255,255,.08);
      z-index:90000; display:flex; flex-direction:column;
      transform:translateX(-110%); transition:transform .35s cubic-bezier(.4,0,.2,1);
      font-family:'DM Sans',sans-serif;
    }
    #eg-panel.eg-open { transform:translateX(0); }
    @media (max-width:400px) { #eg-panel { width:100vw; } }

    /* ─ Header ─ */
    #eg-header {
      padding:18px 18px 14px;
      background:linear-gradient(135deg, #1a0f00, #0e0e0e);
      border-bottom:1px solid rgba(255,255,255,.06);
      flex-shrink:0;
    }
    #eg-header-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
    #eg-agent-row { display:flex; align-items:center; gap:12px; }
    #eg-avatar {
      width:44px; height:44px; border-radius:50%;
      background:linear-gradient(135deg,#FF6B2B,#ff9f6b);
      display:flex; align-items:center; justify-content:center; font-size:22px;
    }
    #eg-agent-name { font-family:'Syne',sans-serif; font-weight:800; font-size:16px; color:#f0f0f0; }
    #eg-agent-sub  { font-size:11px; color:#888; margin-top:2px; }
    .eg-online { display:flex; align-items:center; gap:5px; font-size:11px; color:#22c55e; }
    .eg-online-dot { width:6px; height:6px; border-radius:50%; background:#22c55e; animation:egPulse 1.4s infinite; }
    @keyframes egPulse { 0%,100%{opacity:1} 50%{opacity:.4} }
    #eg-close-btn {
      background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.08);
      color:#888; width:32px; height:32px; border-radius:8px;
      cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center;
      transition:all .2s;
    }
    #eg-close-btn:hover { background:rgba(255,255,255,.12); color:#f0f0f0; }

    /* ─ Font size controls ─ */
    #eg-font-controls {
      display:flex; align-items:center; gap:6px;
      background:rgba(255,255,255,.04); border-radius:8px;
      padding:4px 8px; width:fit-content;
    }
    #eg-font-controls span { font-size:11px; color:#666; }
    .eg-font-btn {
      background:rgba(255,255,255,.07); border:none; color:#aaa;
      width:26px; height:26px; border-radius:6px; cursor:pointer;
      font-size:14px; font-weight:700; display:flex; align-items:center; justify-content:center;
      transition:all .15s;
    }
    .eg-font-btn:hover { background:rgba(255,255,255,.14); color:#fff; }

    /* ─ Messages ─ */
    #eg-messages {
      flex:1; overflow-y:auto; padding:16px;
      display:flex; flex-direction:column; gap:12px;
      scroll-behavior:smooth;
    }
    #eg-messages::-webkit-scrollbar { width:4px; }
    #eg-messages::-webkit-scrollbar-track { background:transparent; }
    #eg-messages::-webkit-scrollbar-thumb { background:rgba(255,255,255,.1); border-radius:2px; }

    .eg-msg { display:flex; flex-direction:column; max-width:90%; gap:4px; }
    .eg-msg.eg-user { align-self:flex-end; align-items:flex-end; }
    .eg-msg.eg-bot  { align-self:flex-start; align-items:flex-start; }

    .eg-bubble {
      padding:11px 14px; border-radius:18px;
      line-height:1.55; word-break:break-word;
    }
    .eg-user .eg-bubble {
      background:#FF6B2B; color:#fff; border-bottom-right-radius:4px;
    }
    .eg-bot .eg-bubble {
      background:#1a1a1a; color:#e8e8e8;
      border:1px solid rgba(255,255,255,.07); border-bottom-left-radius:4px;
    }
    .eg-bubble strong { color:#fff; }
    .eg-bubble ol, .eg-bubble ul { padding-left:18px; margin:6px 0; }
    .eg-bubble li { margin-bottom:4px; }

    .eg-msg-time { font-size:10px; color:#555; padding:0 4px; }

    /* typing indicator */
    .eg-typing .eg-bubble { padding:14px 18px; }
    .eg-typing-dots { display:flex; gap:5px; }
    .eg-typing-dots span {
      width:7px; height:7px; border-radius:50%; background:#555;
      animation:egDot .8s infinite;
    }
    .eg-typing-dots span:nth-child(2) { animation-delay:.15s; }
    .eg-typing-dots span:nth-child(3) { animation-delay:.3s; }
    @keyframes egDot { 0%,80%,100%{transform:scale(1);opacity:.5} 40%{transform:scale(1.3);opacity:1} }

    /* ─ Quick actions ─ */
    #eg-chips {
      padding:0 16px 12px; display:flex; flex-wrap:wrap; gap:7px; flex-shrink:0;
    }
    .eg-chip {
      background:rgba(255,107,43,.09); border:1px solid rgba(255,107,43,.2);
      color:#e0e0e0; padding:6px 12px; border-radius:20px;
      font-size:12px; cursor:pointer; white-space:nowrap;
      font-family:'DM Sans',sans-serif; transition:all .2s;
    }
    .eg-chip:hover { background:rgba(255,107,43,.2); color:#fff; }

    /* ─ Input bar ─ */
    #eg-input-bar {
      padding:12px 14px; border-top:1px solid rgba(255,255,255,.06);
      display:flex; gap:8px; align-items:flex-end; flex-shrink:0;
      background:#0e0e0e;
    }
    #eg-input {
      flex:1; background:rgba(255,255,255,.05);
      border:1px solid rgba(255,255,255,.1); border-radius:12px;
      color:#f0f0f0; font-family:'DM Sans',sans-serif;
      padding:10px 14px; resize:none; outline:none;
      max-height:100px; overflow-y:auto; line-height:1.45;
      transition:border-color .2s;
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
    #eg-send-btn:disabled { background:#333; cursor:not-allowed; transform:none; }
    #eg-voice-btn { background:rgba(255,255,255,.06); color:#888; }
    #eg-voice-btn:hover { background:rgba(255,255,255,.12); color:#fff; }
    #eg-voice-btn.eg-speaking { background:rgba(34,197,94,.15); color:#22c55e; animation:egPulse .8s infinite; }

    /* ─ Welcome overlay ─ */
    #eg-welcome {
      position:absolute; inset:0; z-index:10;
      background:#0e0e0e;
      display:flex; flex-direction:column; align-items:center;
      justify-content:center; padding:32px 28px;
      text-align:center;
      opacity:0; pointer-events:none; transition:opacity .3s;
    }
    #eg-welcome.eg-show { opacity:1; pointer-events:all; }
    #eg-welcome-icon { font-size:56px; margin-bottom:20px; }
    #eg-welcome h2 {
      font-family:'Syne',sans-serif; font-weight:800; font-size:22px;
      color:#f0f0f0; margin-bottom:10px;
    }
    #eg-welcome p { color:#888; font-size:14px; line-height:1.6; margin-bottom:28px; }
    #eg-welcome-start {
      background:#FF6B2B; color:#fff; border:none;
      padding:14px 36px; border-radius:30px;
      font-family:'Syne',sans-serif; font-weight:700; font-size:16px;
      cursor:pointer; transition:all .2s; margin-bottom:12px; width:100%;
    }
    #eg-welcome-start:hover { background:#e05a20; transform:translateY(-1px); }
    #eg-welcome-skip {
      background:transparent; border:none; color:#555;
      font-size:13px; cursor:pointer; text-decoration:underline;
    }

    /* ─ Setup screen (no API key) ─ */
    #eg-setup {
      padding:24px; display:none; flex-direction:column; gap:14px;
      border-bottom:1px solid rgba(255,255,255,.06);
    }
    #eg-setup p { font-size:13px; color:#888; line-height:1.5; }
    #eg-setup input {
      background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1);
      border-radius:10px; padding:10px 14px; color:#f0f0f0;
      font-family:'DM Sans',sans-serif; font-size:13px; outline:none; width:100%;
    }
    #eg-setup input:focus { border-color:rgba(255,107,43,.5); }
    #eg-setup-btn {
      background:#FF6B2B; color:#fff; border:none; border-radius:10px;
      padding:10px; font-family:'Syne',sans-serif; font-weight:700; font-size:14px;
      cursor:pointer; transition:background .2s;
    }
    #eg-setup-btn:hover { background:#e05a20; }

    /* ─ Backdrop ─ */
    #eg-backdrop {
      position:fixed; inset:0; z-index:89998;
      background:rgba(0,0,0,.5); backdrop-filter:blur(4px);
      display:none;
    }
    #eg-backdrop.eg-show { display:block; }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── INJECT HTML ─────────────────────────────────── */
  const markup = `
    <div id="eg-backdrop"></div>

    <button id="eg-fab" onclick="ErrandsGuide.open()">
      <span class="eg-fab-icon">🙋</span>
      Need Help?
      <span class="eg-notif" id="eg-notif">!</span>
    </button>

    <div id="eg-panel">

      <!-- WELCOME SCREEN -->
      <div id="eg-welcome" class="eg-show">
        <div id="eg-welcome-icon">👋</div>
        <h2>Hi! I'm Ade.</h2>
        <p>I'm your personal guide for <strong style="color:#FF6B2B">Errands</strong> — Lagos' fast bicycle delivery service.<br><br>
        I can help you place an order, track your package, or explain anything on this website. In simple words.</p>
        <button id="eg-welcome-start" onclick="ErrandsGuide.startChat()">Let's get started 🚀</button>
        <button id="eg-welcome-skip"  onclick="ErrandsGuide.skipWelcome()">Skip intro</button>
      </div>

      <!-- HEADER -->
      <div id="eg-header">
        <div id="eg-header-top">
          <div id="eg-agent-row">
            <div id="eg-avatar">🙋</div>
            <div>
              <div id="eg-agent-name">${CONFIG.agentName} — Errands Guide</div>
              <div class="eg-online"><span class="eg-online-dot"></span> Online & ready to help</div>
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

      <!-- SETUP (if no API key) -->
      <div id="eg-setup">
        <p>⚙️ <strong style="color:#FF6B2B">Setup needed:</strong> Add your Anthropic API key to activate the AI guide. Get one free at <a href="https://console.anthropic.com" target="_blank" style="color:#FF6B2B">console.anthropic.com</a></p>
        <input type="password" id="eg-key-input" placeholder="sk-ant-..." />
        <button id="eg-setup-btn" onclick="ErrandsGuide.saveKey()">Activate Guide ✅</button>
      </div>

      <!-- MESSAGES -->
      <div id="eg-messages"></div>

      <!-- QUICK ACTION CHIPS -->
      <div id="eg-chips"></div>

      <!-- INPUT -->
      <div id="eg-input-bar">
        <textarea id="eg-input" rows="1" placeholder="Ask me anything… 😊"
          onkeydown="ErrandsGuide.handleKey(event)"
          oninput="ErrandsGuide.autoResize(this)"></textarea>
        <button id="eg-voice-btn" onclick="ErrandsGuide.toggleSpeak()" title="Read last reply aloud">🔊</button>
        <button id="eg-send-btn" onclick="ErrandsGuide.send()">➤</button>
      </div>

    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = markup;
  document.body.appendChild(wrapper);

  /* ── STATE ───────────────────────────────────────── */
  let conversationHistory = [];
  let currentFontSize     = CONFIG.fontSize;
  let lastBotMessage      = '';
  let isSpeaking          = false;
  let resolvedApiKey      = CONFIG.apiKey !== 'YOUR_ANTHROPIC_API_KEY'
                            ? CONFIG.apiKey
                            : localStorage.getItem('errands_guide_key') || '';

  /* ── INIT CHIPS ─────────────────────────────────── */
  function renderChips () {
    const chips = document.getElementById('eg-chips');
    chips.innerHTML = QUICK_ACTIONS.map(a =>
      `<button class="eg-chip" onclick="ErrandsGuide.sendQuick('${a.msg.replace(/'/g,"\\'")}')">
        ${a.label}
      </button>`
    ).join('');
  }
  renderChips();

  /* ── CHECK SETUP ─────────────────────────────────── */
  if (!resolvedApiKey) {
    document.getElementById('eg-setup').style.display = 'flex';
  }

  /* ── PUBLIC API ──────────────────────────────────── */
  window.ErrandsGuide = {

    open () {
      document.getElementById('eg-panel').classList.add('eg-open');
      document.getElementById('eg-backdrop').classList.add('eg-show');
      // Show welcome if first visit
      const visited = localStorage.getItem('errands_guide_visited');
      if (!visited) {
        document.getElementById('eg-welcome').classList.add('eg-show');
      }
    },

    close () {
      document.getElementById('eg-panel').classList.remove('eg-open');
      document.getElementById('eg-backdrop').classList.remove('eg-show');
    },

    startChat () {
      localStorage.setItem('errands_guide_visited', '1');
      document.getElementById('eg-welcome').classList.remove('eg-show');
      this._addBot(`Hello! 😊 I'm Ade, your Errands helper.\n\nI can help you:\n\n1. **Place a delivery order** 📦\n2. **Track your package** 🔍\n3. **Understand how this works** 💡\n\nWhat would you like to do today?`);
    },

    skipWelcome () {
      localStorage.setItem('errands_guide_visited', '1');
      document.getElementById('eg-welcome').classList.remove('eg-show');
    },

    saveKey () {
      const key = document.getElementById('eg-key-input').value.trim();
      if (!key.startsWith('sk-ant-')) {
        alert('That does not look like a valid Anthropic API key. It should start with sk-ant-');
        return;
      }
      localStorage.setItem('errands_guide_key', key);
      resolvedApiKey = key;
      document.getElementById('eg-setup').style.display = 'none';
      this._addBot('✅ API key saved! I am now ready to help you. Ask me anything about Errands! 😊');
    },

    handleKey (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send(); }
    },

    autoResize (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 100) + 'px';
    },

    fontSize (delta) {
      currentFontSize = Math.max(13, Math.min(22, currentFontSize + delta));
      document.getElementById('eg-messages').style.fontSize = currentFontSize + 'px';
      document.getElementById('eg-chips').style.fontSize    = (currentFontSize - 3) + 'px';
    },

    sendQuick (msg) {
      document.getElementById('eg-input').value = msg;
      this.send();
    },

    async send () {
      const input = document.getElementById('eg-input');
      const text  = input.value.trim();
      if (!text) return;

      if (!resolvedApiKey) {
        document.getElementById('eg-setup').style.display = 'flex';
        return;
      }

      input.value = '';
      input.style.height = 'auto';
      document.getElementById('eg-send-btn').disabled = true;

      // Add user message
      this._addUser(text);
      conversationHistory.push({ role: 'user', content: text });

      // Show typing
      const typingId = this._addTyping();

      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type':         'application/json',
            'x-api-key':            resolvedApiKey,
            'anthropic-version':    '2023-06-01',
            'anthropic-dangerous-allow-browser': 'true',
          },
          body: JSON.stringify({
            model:      CONFIG.model,
            max_tokens: 600,
            system:     SYSTEM_PROMPT,
            messages:   conversationHistory,
          }),
        });

        const data = await res.json();

        if (data.error) throw new Error(data.error.message);

        const reply = data.content?.[0]?.text || 'Sorry, I did not get a response. Please try again.';
        conversationHistory.push({ role: 'assistant', content: reply });
        lastBotMessage = reply;

        this._removeTyping(typingId);
        this._addBot(reply);

      } catch (err) {
        this._removeTyping(typingId);
        const errMsg = err.message.includes('401')
          ? '⚠️ API key issue. Please check your key in the setup section above.'
          : '⚠️ Something went wrong. Please check your internet connection and try again.';
        this._addBot(errMsg);
        console.error('[ErrandsGuide]', err);
      }

      document.getElementById('eg-send-btn').disabled = false;
      document.getElementById('eg-input').focus();
    },

    toggleSpeak () {
      if (!('speechSynthesis' in window)) {
        alert('Sorry, your browser does not support voice reading.'); return;
      }
      if (isSpeaking) {
        speechSynthesis.cancel();
        isSpeaking = false;
        document.getElementById('eg-voice-btn').classList.remove('eg-speaking');
        return;
      }
      if (!lastBotMessage) return;

      // Strip markdown for speech
      const plain = lastBotMessage
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/#{1,3} /g, '')
        .replace(/\n+/g, '. ');

      const utter = new SpeechSynthesisUtterance(plain);
      utter.rate  = 0.88;
      utter.pitch = 1.05;
      utter.lang  = 'en-NG';

      utter.onend  = () => { isSpeaking = false; document.getElementById('eg-voice-btn').classList.remove('eg-speaking'); };
      utter.onerror= () => { isSpeaking = false; document.getElementById('eg-voice-btn').classList.remove('eg-speaking'); };

      isSpeaking = true;
      document.getElementById('eg-voice-btn').classList.add('eg-speaking');
      speechSynthesis.speak(utter);
    },

    /* ── PRIVATE HELPERS ─────────────────────── */
    _addUser (text) {
      this._appendMessage('eg-user', this._escHtml(text));
    },

    _addBot (text) {
      this._appendMessage('eg-bot', this._renderMarkdown(text));
    },

    _appendMessage (cls, html) {
      const msgs = document.getElementById('eg-messages');
      const time = new Date().toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
      const div  = document.createElement('div');
      div.className = `eg-msg ${cls}`;
      div.innerHTML = `<div class="eg-bubble">${html}</div><span class="eg-msg-time">${time}</span>`;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    },

    _addTyping () {
      const msgs = document.getElementById('eg-messages');
      const id   = 'eg-typing-' + Date.now();
      const div  = document.createElement('div');
      div.className = 'eg-msg eg-bot eg-typing';
      div.id        = id;
      div.innerHTML = `<div class="eg-bubble"><div class="eg-typing-dots"><span></span><span></span><span></span></div></div>`;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
      return id;
    },

    _removeTyping (id) {
      document.getElementById(id)?.remove();
    },

    _escHtml (t) {
      return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    },

    _renderMarkdown (t) {
      return t
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^(\d+)\. /gm, '<br>$1. ')
        .replace(/\n/g, '<br>');
    },
  };

  /* ── Close on backdrop click ─────────────────────── */
  document.getElementById('eg-backdrop').addEventListener('click', () => ErrandsGuide.close());

  /* ── Show "!" badge after 3s if first visit ──────── */
  setTimeout(() => {
    if (!localStorage.getItem('errands_guide_visited')) {
      document.getElementById('eg-notif').style.display = 'flex';
    }
  }, 3000);

})();