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

if (hamburger && mobileMenu) hamburger.addEventListener('click', function () {
  mobileMenu.classList.toggle('open')
})


/* Package lookup removed - tracking handled by track.html?tracking=MAG-XXXX */




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