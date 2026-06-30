@'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="robots" content="noindex, nofollow, noarchive"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Admin Portal — MAG-CITY Errands</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
<style>
  :root {
    --black:#0a0a0a; --orange:#FF6B2B; --cream:#FFF8F2;
    --gray:#888; --border:#e8e0d8; --green:#22c55e;
    --blue:#3b82f6; --yellow:#f59e0b; --red:#ef4444;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:var(--cream); font-family:'DM Sans',sans-serif; color:var(--black); min-height:100vh; }

  /* ── Header ── */
  header { background:var(--black); padding:16px 32px; display:flex; align-items:center; justify-content:space-between; }
  .logo  { font-family:'Bebas Neue',sans-serif; font-size:26px; color:var(--orange); letter-spacing:2px; }
  .admin-badge { background:rgba(255,107,43,0.15); color:var(--orange); font-size:12px; font-weight:700; padding:4px 12px; border-radius:20px; letter-spacing:1px; }

  /* ── Login Screen ── */
  #loginScreen {
    display:flex; align-items:center; justify-content:center;
    min-height:calc(100vh - 60px); padding:24px;
  }
  .login-card {
    background:#fff; border-radius:20px; box-shadow:0 20px 60px rgba(0,0,0,0.1);
    padding:48px 40px; width:100%; max-width:420px;
  }
  .login-card h1 { font-family:'Bebas Neue',sans-serif; font-size:36px; letter-spacing:3px; margin-bottom:8px; }
  .login-card p  { color:var(--gray); font-size:14px; margin-bottom:32px; }
  .field { margin-bottom:20px; }
  .field label { display:block; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--gray); margin-bottom:6px; }
  .field input {
    width:100%; padding:14px 16px; border:2px solid var(--border);
    border-radius:10px; font-family:'DM Sans',sans-serif; font-size:15px;
    outline:none; transition:border-color .2s; background:var(--cream);
  }
  .field input:focus { border-color:var(--orange); background:#fff; }
  .login-btn {
    width:100%; padding:16px; background:var(--orange); color:#fff; border:none;
    border-radius:10px; font-family:'Bebas Neue',sans-serif; font-size:20px;
    letter-spacing:2px; cursor:pointer; transition:background .2s; margin-top:8px;
  }
  .login-btn:hover { background:#e05520; }
  .login-error { display:none; background:rgba(239,68,68,0.1); color:#dc2626; border-radius:8px; padding:12px 16px; font-size:14px; margin-top:16px; }
  .login-error.show { display:block; }

  /* ── Dashboard ── */
  #dashboard { display:none; }
  .dash-nav {
    background:var(--black); padding:0 32px;
    display:flex; gap:4px; overflow-x:auto;
  }
  .dash-nav button {
    color:#aaa; background:none; border:none; padding:14px 20px;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500;
    cursor:pointer; border-bottom:3px solid transparent; white-space:nowrap;
    transition:all .2s;
  }
  .dash-nav button:hover  { color:#fff; }
  .dash-nav button.active { color:var(--orange); border-bottom-color:var(--orange); }

  .dash-content { padding:32px; max-width:1200px; margin:0 auto; }

  /* ── Stats ── */
  .stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:16px; margin-bottom:32px; }
  .stat-card  { background:#fff; border-radius:14px; padding:20px 24px; box-shadow:0 4px 20px rgba(0,0,0,0.06); }
  .stat-label { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--gray); margin-bottom:8px; }
  .stat-value { font-family:'Bebas Neue',sans-serif; font-size:36px; letter-spacing:2px; }
  .stat-value.orange { color:var(--orange); }
  .stat-value.green  { color:var(--green);  }
  .stat-value.blue   { color:var(--blue);   }
  .stat-value.yellow { color:var(--yellow); }

  /* ── Section header ── */
  .section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:12px; }
  .section-header h2 { font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:2px; }
  .filter-row { display:flex; gap:10px; flex-wrap:wrap; }
  .filter-row select, .filter-row input {
    padding:8px 14px; border:2px solid var(--border); border-radius:8px;
    font-family:'DM Sans',sans-serif; font-size:13px; outline:none;
    background:var(--cream); transition:border-color .2s;
  }
  .filter-row select:focus, .filter-row input:focus { border-color:var(--orange); }

  /* ── Orders Table ── */
  .table-wrap { background:#fff; border-radius:16px; box-shadow:0 4px 20px rgba(0,0,0,0.06); overflow:hidden; }
  table { width:100%; border-collapse:collapse; }
  thead { background:var(--black); }
  thead th { color:#aaa; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; padding:14px 16px; text-align:left; }
  tbody tr { border-bottom:1px solid var(--border); transition:background .15s; }
  tbody tr:last-child { border-bottom:none; }
  tbody tr:hover { background:var(--cream); }
  tbody td { padding:14px 16px; font-size:14px; }
  .track-id { font-family:'Bebas Neue',sans-serif; font-size:16px; color:var(--orange); letter-spacing:1px; }

  /* ── Status badges ── */
  .badge { display:inline-block; padding:4px 12px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; }
  .badge-Pending   { background:rgba(245,158,11,0.15); color:#b45309; }
  .badge-PickedUp  { background:rgba(59,130,246,0.15);  color:#1d4ed8; }
  .badge-OnTheWay  { background:rgba(59,130,246,0.15);  color:#1d4ed8; }
  .badge-Delivered { background:rgba(34,197,94,0.15);   color:#15803d; }
  .badge-Cancelled { background:rgba(239,68,68,0.15);   color:#dc2626; }

  /* ── Action buttons ── */
  .btn { padding:6px 14px; border-radius:7px; font-size:12px; font-weight:600; cursor:pointer; border:none; transition:opacity .2s; }
  .btn:hover { opacity:.8; }
  .btn-orange { background:var(--orange); color:#fff; }
  .btn-gray   { background:#f1f1f1;       color:#555; }
  .btn-red    { background:var(--red);    color:#fff; }

  /* ── Modal ── */
  .modal-backdrop {
    display:none; position:fixed; inset:0;
    background:rgba(0,0,0,0.5); z-index:100;
    align-items:center; justify-content:center; padding:20px;
  }
  .modal-backdrop.show { display:flex; }
  .modal {
    background:#fff; border-radius:20px; padding:36px;
    width:100%; max-width:500px; max-height:90vh; overflow-y:auto;
  }
  .modal h3 { font-family:'Bebas Neue',sans-serif; font-size:26px; letter-spacing:2px; margin-bottom:20px; }
  .modal-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px; }
  .modal-field label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--gray); display:block; margin-bottom:4px; }
  .modal-field p { font-size:15px; font-weight:500; }
  .modal-field.full { grid-column:1/-1; }
  .modal select {
    width:100%; padding:12px 14px; border:2px solid var(--border);
    border-radius:10px; font-family:'DM Sans',sans-serif; font-size:14px;
    outline:none; background:var(--cream); margin-bottom:12px;
  }
  .modal select:focus { border-color:var(--orange); }
  .modal textarea {
    width:100%; padding:12px 14px; border:2px solid var(--border);
    border-radius:10px; font-family:'DM Sans',sans-serif; font-size:14px;
    outline:none; resize:vertical; min-height:80px; background:var(--cream);
    margin-bottom:20px;
  }
  .modal textarea:focus { border-color:var(--orange); }
  .modal-actions { display:flex; gap:12px; justify-content:flex-end; }
  .divider { height:1px; background:var(--border); margin:20px 0; }

  /* ── Loading / empty ── */
  .loading { text-align:center; padding:60px; color:var(--gray); }
  .loading-spinner {
    width:40px; height:40px; border:3px solid var(--border);
    border-top-color:var(--orange); border-radius:50%;
    animation:spin .8s linear infinite; margin:0 auto 16px;
  }
  @keyframes spin { to { transform:rotate(360deg); } }
  .empty-state { text-align:center; padding:60px; color:var(--gray); }
  .empty-state .icon { font-size:48px; margin-bottom:12px; }

  /* ── Log out ── */
  .logout-btn {
    background:none; border:1px solid rgba(255,255,255,0.2);
    color:#aaa; padding:7px 16px; border-radius:8px;
    font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer;
    transition:all .2s;
  }
  .logout-btn:hover { border-color:var(--orange); color:var(--orange); }

  /* ── Mobile ── */
  @media(max-width:700px) {
    .dash-content { padding:16px; }
    .modal-grid   { grid-template-columns:1fr; }
    thead th:nth-child(3), tbody td:nth-child(3),
    thead th:nth-child(4), tbody td:nth-child(4) { display:none; }
    .stats-grid { grid-template-columns:1fr 1fr; }
  }
</style>
</head>
<body>

<header>
  <div class="logo">MAG-CITY Errands</div>
  <div style="display:flex;align-items:center;gap:16px;">
    <span class="admin-badge">ADMIN</span>
    <button class="logout-btn" id="logoutBtn" style="display:none;" onclick="logout()">Log Out</button>
  </div>
</header>

<!-- ═══════════ LOGIN ═══════════ -->
<div id="loginScreen">
  <div class="login-card">
    <h1>Admin Login</h1>
    <p>MAG-CITY Errands staff access only</p>
    <div class="field">
      <label>Username</label>
      <input type="text" id="loginUser" placeholder="Enter username" autocomplete="username"
             onkeydown="if(event.key==='Enter') doLogin()"/>
    </div>
    <div class="field">
      <label>Password</label>
      <input type="password" id="loginPass" placeholder="Enter password" autocomplete="current-password"
             onkeydown="if(event.key==='Enter') doLogin()"/>
    </div>
    <button class="login-btn" onclick="doLogin()">LOGIN</button>
    <div class="login-error" id="loginError">Incorrect username or password. Try again.</div>
  </div>
</div>

<!-- ═══════════ DASHBOARD ═══════════ -->
<div id="dashboard">
  <nav class="dash-nav">
    <button class="active" onclick="showTab('orders',this)">All Orders</button>
    <button onclick="showTab('pending',this)">Pending</button>
    <button onclick="showTab('active',this)">Active</button>
    <button onclick="showTab('delivered',this)">Delivered</button>
  </nav>

  <div class="dash-content">

    <!-- Stats -->
    <div class="stats-grid" id="statsGrid">
      <div class="stat-card"><div class="stat-label">Total Orders</div><div class="stat-value orange" id="statTotal">—</div></div>
      <div class="stat-card"><div class="stat-label">Pending</div><div class="stat-value yellow" id="statPending">—</div></div>
      <div class="stat-card"><div class="stat-label">Active</div><div class="stat-value blue" id="statActive">—</div></div>
      <div class="stat-card"><div class="stat-label">Delivered</div><div class="stat-value green" id="statDelivered">—</div></div>
    </div>

    <!-- Orders Section -->
    <div class="section-header">
      <h2 id="sectionTitle">All Orders</h2>
      <div class="filter-row">
        <input type="text" id="searchInput" placeholder="Search name / tracking..." oninput="applyFilters()" style="width:220px;"/>
      </div>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Tracking #</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Service</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="ordersBody">
          <tr><td colspan="6"><div class="loading"><div class="loading-spinner"></div><p>Loading orders...</p></div></td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- ═══════════ ORDER MODAL ═══════════ -->
<div class="modal-backdrop" id="modalBackdrop" onclick="closeModal(event)">
  <div class="modal">
    <h3 id="modalTitle">Order Details</h3>
    <div class="modal-grid" id="modalDetails"></div>
    <div class="divider"></div>
    <label style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--gray);display:block;margin-bottom:8px;">Update Status</label>
    <select id="modalStatus">
      <option value="Pending">Pending</option>
      <option value="Picked Up">Picked Up</option>
      <option value="On The Way">On The Way</option>
      <option value="Delivered">Delivered</option>
      <option value="Cancelled">Cancelled</option>
    </select>
    <label style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--gray);display:block;margin-bottom:8px;">Note (optional)</label>
    <textarea id="modalNote" placeholder="e.g. Left with neighbour, called customer..."></textarea>
    <div class="modal-actions">
      <button class="btn btn-gray" onclick="document.getElementById('modalBackdrop').classList.remove('show')">Cancel</button>
      <button class="btn btn-orange" onclick="saveStatus()">Save Status</button>
    </div>
  </div>
</div>

<script type="module">
import { initializeApp }    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, arrayUnion, Timestamp }
       from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ─── Firebase config (same project as track.html) ─── */
const firebaseConfig = {
  apiKey:            "AIzaSyDyWMcMx6tqYHxumN3sPImoDUaTeAkNHCU",
  authDomain:        "mag-city-errands.firebaseapp.com",
  projectId:         "mag-city-errands",
  storageBucket:     "mag-city-errands.firebasestorage.app",
  messagingSenderId: "315623986569",
  appId:             "1:315623986569:web:ba7200af8ca50abc5f3d58"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

/* ─── Admin credentials — CHANGE THESE ─── */
const ADMINS = [
  { username: "admin",   password: "magcity2024" },
  { username: "manager", password: "errands2024" }
];

/* ─── State ─── */
let allOrders   = [];
let currentTab  = "orders";
let currentDocId = null;

/* ─── Login ─── */
window.doLogin = function () {
  const u = document.getElementById("loginUser").value.trim();
  const p = document.getElementById("loginPass").value;
  const match = ADMINS.find(a => a.username === u && a.password === p);
  if (match) {
    sessionStorage.setItem("mc_admin_session", JSON.stringify({
      token: btoa(u + ":" + Date.now()),
      expires: Date.now() + 8 * 60 * 60 * 1000,
      user: u
    }));
    showDashboard();
  } else {
    document.getElementById("loginError").classList.add("show");
    document.getElementById("loginPass").value = "";
  }
};

window.logout = function () {
  sessionStorage.removeItem("mc_admin_session");
  location.reload();
};

/* ─── Session check ─── */
function checkSession() {
  try {
    const raw = sessionStorage.getItem("mc_admin_session");
    if (!raw) return false;
    const s = JSON.parse(raw);
    if (!s.token || Date.now() >= s.expires) {
      sessionStorage.removeItem("mc_admin_session");
      return false;
    }
    return true;
  } catch { return false; }
}

function showDashboard() {
  document.getElementById("loginScreen").style.display  = "none";
  document.getElementById("dashboard").style.display    = "block";
  document.getElementById("logoutBtn").style.display    = "block";
  loadOrders();
}

/* ─── Load orders ─── */
async function loadOrders() {
  try {
    const snap = await getDocs(collection(db, "orders"));
    allOrders = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
    updateStats();
    renderTable(allOrders);
  } catch (err) {
    document.getElementById("ordersBody").innerHTML =
      `<tr><td colspan="6"><div class="empty-state"><div class="icon">⚠️</div><p>Failed to load orders: ${err.message}</p></div></td></tr>`;
  }
}

/* ─── Stats ─── */
function updateStats() {
  document.getElementById("statTotal").textContent    = allOrders.length;
  document.getElementById("statPending").textContent  = allOrders.filter(o => o.status === "Pending").length;
  document.getElementById("statActive").textContent   = allOrders.filter(o => ["Picked Up","On The Way"].includes(o.status)).length;
  document.getElementById("statDelivered").textContent = allOrders.filter(o => o.status === "Delivered").length;
}

/* ─── Render table ─── */
function renderTable(orders) {
  const tbody = document.getElementById("ordersBody");
  if (!orders.length) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="icon">📦</div><p>No orders found</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><span class="track-id">${o.trackingNumber || "—"}</span></td>
      <td>${o.customerName || "—"}</td>
      <td>${o.customerPhone || "—"}</td>
      <td>${o.serviceType || "—"}</td>
      <td><span class="badge badge-${(o.status || "").replace(/\s/g,"")}">${o.status || "—"}</span></td>
      <td>
        <button class="btn btn-orange" onclick='openModal(${JSON.stringify(o._id)})'>Update</button>
      </td>
    </tr>`).join("");
}

/* ─── Tab filter ─── */
window.showTab = function (tab, btn) {
  currentTab = tab;
  document.querySelectorAll(".dash-nav button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  const titles = { orders:"All Orders", pending:"Pending Orders", active:"Active Orders", delivered:"Delivered Orders" };
  document.getElementById("sectionTitle").textContent = titles[tab] || "Orders";
  applyFilters();
};

window.applyFilters = function () {
  const search = document.getElementById("searchInput").value.toLowerCase();
  let filtered = allOrders;

  if (currentTab === "pending")   filtered = filtered.filter(o => o.status === "Pending");
  if (currentTab === "active")    filtered = filtered.filter(o => ["Picked Up","On The Way"].includes(o.status));
  if (currentTab === "delivered") filtered = filtered.filter(o => o.status === "Delivered");

  if (search) {
    filtered = filtered.filter(o =>
      (o.customerName    || "").toLowerCase().includes(search) ||
      (o.trackingNumber  || "").toLowerCase().includes(search) ||
      (o.customerPhone   || "").toLowerCase().includes(search)
    );
  }
  renderTable(filtered);
};

/* ─── Modal ─── */
window.openModal = async function (docId) {
  const order = allOrders.find(o => o._id === docId);
  if (!order) return;
  currentDocId = docId;

  document.getElementById("modalTitle").textContent = order.trackingNumber || "Order Details";
  document.getElementById("modalStatus").value = order.status || "Pending";
  document.getElementById("modalNote").value   = "";

  const fields = [
    ["Customer",     order.customerName],
    ["Phone",        order.customerPhone],
    ["Service",      order.serviceType],
    ["Package Size", order.packageSize],
    ["Pickup",       order.pickupAddress],
    ["Delivery",     order.deliveryAddress],
  ];
  if (order.packageDescription) fields.push(["Package Details", order.packageDescription]);

  document.getElementById("modalDetails").innerHTML = fields.map(([label, val], i) => `
    <div class="modal-field ${i >= 4 ? 'full' : ''}">
      <label>${label}</label>
      <p>${val || "—"}</p>
    </div>`).join("");

  document.getElementById("modalBackdrop").classList.add("show");
};

window.closeModal = function (e) {
  if (e.target === document.getElementById("modalBackdrop"))
    document.getElementById("modalBackdrop").classList.remove("show");
};

/* ─── Save status ─── */
window.saveStatus = async function () {
  if (!currentDocId) return;
  const newStatus = document.getElementById("modalStatus").value;
  const note      = document.getElementById("modalNote").value.trim();
  const btn       = document.querySelector(".modal-actions .btn-orange");

  btn.textContent = "Saving...";
  btn.disabled    = true;

  try {
    const ref = doc(db, "orders", currentDocId);
    const historyEntry = {
      status: newStatus,
      note:   note || "",
      time:   new Date().toISOString()
    };
    await updateDoc(ref, {
      status:        newStatus,
      statusHistory: arrayUnion(historyEntry)
    });

    const idx = allOrders.findIndex(o => o._id === currentDocId);
    if (idx !== -1) {
      allOrders[idx].status = newStatus;
      if (!allOrders[idx].statusHistory) allOrders[idx].statusHistory = [];
      allOrders[idx].statusHistory.push(historyEntry);
    }

    updateStats();
    applyFilters();
    document.getElementById("modalBackdrop").classList.remove("show");
  } catch (err) {
    alert("Error saving: " + err.message);
  } finally {
    btn.textContent = "Save Status";
    btn.disabled    = false;
  }
};

/* ─── Init ─── */
if (checkSession()) {
  showDashboard();
}
</script>
</body>
</html>

'@ | Set-Content 'admin-portal.html' -Encoding UTF8
Write-Host 'Done! File size:' (Get-Item 'admin-portal.html').Length 'bytes' -ForegroundColor Green