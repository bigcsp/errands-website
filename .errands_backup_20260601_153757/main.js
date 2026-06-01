/* ============================================================
   main.js — Errands delivery website
   Sections (in order of page flow):
     1. Mobile menu toggle
     2. Package data
     3. Fill tracking input (sample numbers)
     4. Track a package
     5. Press Enter to track
     6. Animated stat counters
     7. ETA countdown timer
     8. Scroll-reveal animations
   ============================================================ */


/* ============================================================
   1. MOBILE MENU TOGGLE
      Tapping the hamburger icon opens/closes the mobile nav
   ============================================================ */

const hamburger  = document.getElementById('hamburger')
const mobileMenu = document.getElementById('mobileMenu')

hamburger.addEventListener('click', function () {
  mobileMenu.classList.toggle('open')
})


/* ============================================================
   2. PACKAGE DATA
      Acts as a mini database of tracked deliveries.
      In a real app this would come from a backend API.

      Each package has:
        id     — tracking number
        status — 'On the way' | 'Delivered' | 'Pickup pending'
        rider  — rider's name
        from   — pickup address
        to     — drop-off address
        eta    — estimated arrival or delivery time
        item   — type of item being delivered
   ============================================================ */

const packages = {

  'ERR-00423': {
    id:     'ERR-00423',
    status: 'On the way',
    rider:  'Kwame A.',
    from:   'Magodo Phase 2 Entrance, Lagos',
    to:     'CMD Road, Magodo Phase 2',
    eta:    '4 minutes',
    item:   'Small package',
  },

  'ERR-00891': {
    id:     'ERR-00891',
    status: 'Delivered',
    rider:  'Chidi O.',
    from:   'Magodo Phase 2 Entrance, Lagos',
    to:     'CMD Road, Magodo Phase 2',
    eta:    'Delivered at 2:45pm',
    item:   'Documents',
  },

  'ERR-00312': {
    id:     'ERR-00312',
    status: 'Pickup pending',
    rider:  'Not assigned yet',
    from:   'Magodo Phase 2 Entrance, Lagos',
    to:     'CMD Road, Magodo Phase 2',
    eta:    'Estimating...',
    item:   'Fragile item',
  },

}


/* ============================================================
   3. FILL TRACKING INPUT
      Called when the user clicks a sample tracking number
      in the hero section (e.g. "Try: ERR-00423")
      Pastes the code into the input and focuses it.
   ============================================================ */

function fillTracking(code) {
  const input = document.getElementById('trackInput')
  input.value = code
  input.focus()
}


/* ============================================================
   4. TRACK A PACKAGE
      Called by the "Track now" button (or pressing Enter).
      Steps:
        a) Read + sanitise the input value
        b) Show a warning if the field is empty
        c) Look up the code in the packages object
        d) Render a result card if found, or an error if not
        e) Scroll smoothly to the result
   ============================================================ */

function trackPackage() {

  // a) Read input, remove spaces, force uppercase
  const input     = document.getElementById('trackInput').value.trim().toUpperCase()
  const resultBox = document.getElementById('trackingResult')

  // b) Empty input — show warning and stop
  if (!input) {
    resultBox.innerHTML = `
      <div class="result-error">
        ⚠️ Please enter a tracking number first.
      </div>
    `
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }

  // c) Look up the code
  const pkg = packages[input]

  if (pkg) {

    // d-i) Package found — pick colour + icon based on status
    let statusColor = '#E85D26'   // orange  = on the way (default)
    let statusIcon  = '🚴'
    if (pkg.status === 'Delivered')      { statusColor = '#16a34a'; statusIcon = '✅' }
    if (pkg.status === 'Pickup pending') { statusColor = '#d97706'; statusIcon = '🕐' }

    // d-ii) Build and inject the result card HTML
    resultBox.innerHTML = `
      <div class="result-card">

        <!-- Header row: package ID + status badge -->
        <div class="result-header">
          <h3>📦 ${pkg.id}</h3>
          <span class="result-status-badge"
                style="background:${statusColor}20;
                       color:${statusColor};
                       border:1px solid ${statusColor}40;">
            ${statusIcon} ${pkg.status}
          </span>
        </div>

        <!-- Detail rows -->
        <div class="result-row">
          <span>Rider</span>
          <strong>${pkg.rider}</strong>
        </div>
        <div class="result-row">
          <span>From</span>
          <strong>${pkg.from}</strong>
        </div>
        <div class="result-row">
          <span>To</span>
          <strong>${pkg.to}</strong>
        </div>
        <div class="result-row">
          <span>Item</span>
          <strong>${pkg.item}</strong>
        </div>
        <div class="result-row">
          <span>ETA</span>
          <strong style="color:${statusColor}">${pkg.eta}</strong>
        </div>

      </div>
    `

  } else {

    // d-iii) Package not found — show error with examples
    resultBox.innerHTML = `
      <div class="result-error">
        ❌ No package found for <strong>${input}</strong>.
        Please check the number and try again.
        <div class="result-hint">
          Try: ERR-00423, ERR-00891, or ERR-00312
        </div>
      </div>
    `
  }

  // e) Scroll to result
  resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' })
}


/* ============================================================
   5. PRESS ENTER TO TRACK
      Allows the user to hit Enter instead of clicking the button
   ============================================================ */

document.getElementById('trackInput').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') trackPackage()
})


/* ============================================================
   6. ANIMATED STAT COUNTERS
      Makes the numbers in the stats bar (100+, 98%, 10+) count
      up from 0 when the stats bar scrolls into view.
      Only animates once — the observer disconnects after firing.
   ============================================================ */

// Helper: counts an element's text from 0 → target over `duration` ms
function animateCounter(el, target, duration) {
  let current = 0
  const step  = target / (duration / 16)   // increment per ~60fps frame

  const timer = setInterval(function () {
    current += step

    if (current >= target) {
      el.textContent = target    // snap to exact final value
      clearInterval(timer)
    } else {
      el.textContent = Math.floor(current)
    }
  }, 16)
}

// Select all stat numbers that have a data-target attribute
const statNums = document.querySelectorAll('.stat-num[data-target]')
const statsBar = document.querySelector('.stats-bar')

// Watch the stats bar with IntersectionObserver
const counterObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      statNums.forEach(function (el) {
        animateCounter(el, parseInt(el.dataset.target), 1500)
      })
      counterObserver.disconnect()   // only run once
    }
  })
}, { threshold: 0.5 })   // fires when 50% of the bar is visible

if (statsBar) counterObserver.observe(statsBar)


/* ============================================================
   7. ETA COUNTDOWN TIMER
      The "4 mins" ETA in the live tracking panel counts down
      in real time, updating every second.
      Switches from "X mins" to "X secs" when under 1 minute.
   ============================================================ */

let etaSeconds = 240   // 240 seconds = 4 minutes
const etaEl    = document.getElementById('eta')

if (etaEl) {
  setInterval(function () {

    if (etaSeconds > 0) etaSeconds -= 1   // decrement by 1 each second

    const mins = Math.floor(etaSeconds / 60)
    const secs = etaSeconds % 60

    if (mins > 0) {
      etaEl.textContent = `${mins} min${mins > 1 ? 's' : ''}`
    } else {
      etaEl.textContent = `${secs} secs`
    }

  }, 1000)   // runs every 1000ms = every second
}


/* ============================================================
   8. SCROLL-REVEAL ANIMATIONS
      Service cards, how-it-works steps, and contact cards
      fade up into view as the user scrolls down the page.
      Each element only animates once.
   ============================================================ */

const revealEls = document.querySelectorAll('.service-card, .step, .contact-card')

const revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry, i) {
    if (entry.isIntersecting) {
      entry.target.style.animation = `fadeUp 0.5s ease ${i * 0.08}s both`
      revealObserver.unobserve(entry.target)
    }
  })
}, { threshold: 0.15 })

revealEls.forEach(function (el) {
  revealObserver.observe(el)
})