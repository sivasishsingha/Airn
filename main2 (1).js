'use strict';

// CUSTOM CURSOR
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  if (!cursor || !cursorRing) return;
  
  // Hide custom cursor on touch devices
  const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
  };
  
  if (isTouchDevice()) {
    cursor.style.display = 'none';
    cursorRing.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }
  
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX - 6 + 'px';
    cursor.style.top  = mouseY - 6 + 'px';
  });
  (function animateRing() {
    ringX += (mouseX - ringX - 18) * 0.12;
    ringY += (mouseY - ringY - 18) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.transform = 'scale(2)'; cursorRing.style.width = '60px'; cursorRing.style.height = '60px'; });
    el.addEventListener('mouseleave', () => { cursor.style.transform = 'scale(1)'; cursorRing.style.width = '36px'; cursorRing.style.height = '36px'; });
  });
})();

// SCROLL REVEAL
(function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { setTimeout(() => entry.target.classList.add('visible'), 60); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// NAV SCROLL
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (nav) nav.style.background = window.scrollY > 50 ? 'rgba(0,0,0,0.92)' : 'rgba(0,0,0,0.7)';
});

// PARALLAX ORBS
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  document.querySelectorAll('.hero-bg-orb').forEach((orb, i) => {
    orb.style.transform = 'translateY(' + (scrolled * [0.3,0.2,0.4][i]) + 'px)';
  });
});

// HAMBURGER
window.toggleMobileMenu = function() {
  document.querySelector('.nav-links').classList.toggle('mobile-open');
  document.getElementById('hamburger').classList.toggle('open');
};
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('mobile-open');
    const btn = document.getElementById('hamburger');
    if (btn) btn.classList.remove('open');
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  const navLinks = document.querySelector('.nav-links');
  const hamburger = document.getElementById('hamburger');
  if (navLinks && hamburger && navLinks.classList.contains('mobile-open')) {
    if (!e.target.closest('nav')) {
      navLinks.classList.remove('mobile-open');
      hamburger.classList.remove('open');
    }
  }
});

// ANIMATED COUNTER
function animateCounter(el, target, suffix) {
  suffix = suffix || '';
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / 2000, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(num => {
        const text = num.textContent;
        if (text.includes('K')) { const v = parseFloat(text); animateCounter(num, v * 1000, 'K+'); setTimeout(() => { num.textContent = text; }, 2100); }
      });
      statsObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObs.observe(heroStats);

// TAB SYSTEM
window.showTab = function(name, linkEl) {
  document.querySelectorAll('.tab-page').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('tab-active'));
  const tab = document.getElementById('tab-' + name);
  if (tab) tab.classList.add('active');
  if (linkEl) linkEl.classList.add('tab-active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (name === 'marketplace') { inventions = getInventions(); renderMktGrid(); }
  if (name === 'innovate') { setTimeout(initInnovateReveal, 120); }
  sessionStorage.setItem('airn_tab', name);
};

document.addEventListener('click', function(e) {
  const a = e.target.closest('a');
  if (!a) return;
  const href = a.getAttribute('href') || '';
  if (href === 'marketplace.html' || (href.includes('#marketplace') && href !== '#marketplace')) {
    e.preventDefault(); showTab('marketplace', document.getElementById('tab-link-marketplace'));
  }
  if (href === 'innovate.html') { e.preventDefault(); showTab('innovate', document.getElementById('tab-link-innovate')); }
});

const lastTab = sessionStorage.getItem('airn_tab');
if (lastTab && lastTab !== 'home') setTimeout(() => showTab(lastTab, document.getElementById('tab-link-' + lastTab)), 50);

window.initInnovateReveal = function() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), 60); obs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('#tab-innovate .reveal').forEach(el => { el.classList.remove('visible'); obs.observe(el); });
};

// AUTH
const GOOGLE_CLIENT_ID = '883027040719-64j73f95ga3cc8aadacrueki0loanu56.apps.googleusercontent.com';

function renderGoogleButtons() {
  if (typeof google === 'undefined' || !google.accounts) return false;
  try {
    google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogleCredential, auto_select: false });
    ['googleSignInBtn','googleSignUpBtn'].forEach(function(id, i) {
      const el = document.getElementById(id);
      if (el && !el.hasChildNodes()) {
        google.accounts.id.renderButton(el, { theme: 'filled_black', size: 'large', width: 340, text: i === 0 ? 'signin_with' : 'signup_with', shape: 'rectangular' });
      }
    });
    return true;
  } catch(e) { console.error(e); return false; }
}
window.addEventListener('load', function() { if (!renderGoogleButtons()) { setTimeout(renderGoogleButtons, 500); setTimeout(renderGoogleButtons, 1500); } });

window.handleGoogleCredential = function(response) {
  const payload = JSON.parse(atob(response.credential.split('.')[1]));
  loginSuccess(payload.name, payload.picture, payload.email);
};
window.handleEmailLogin = function() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const statusEl = document.getElementById('loginStatus');
  if (!email || !password) { statusEl.textContent = 'Please enter email and password.'; statusEl.style.color = '#FF6B6B'; return; }
  statusEl.textContent = '';
  loginSuccess(email.split('@')[0], '', email);
};
window.handleEmailSignup = function() {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const statusEl = document.getElementById('signupStatus');
  if (!name || !email || !password) { statusEl.textContent = 'Please fill in all fields.'; statusEl.style.color = '#FF6B6B'; return; }
  if (password.length < 6) { statusEl.textContent = 'Password must be at least 6 characters.'; statusEl.style.color = '#FF6B6B'; return; }
  loginSuccess(name, '', email);
};
window.loginSuccess = function(name, picture, email) {
  document.getElementById('loginModal').style.display = 'none';
  document.getElementById('signupModal').style.display = 'none';
  document.getElementById('loginBtn').style.display = 'none';
  document.getElementById('signupBtn').style.display = 'none';
  const avatar = document.getElementById('userAvatar');
  avatar.style.display = 'flex';
  const pic = document.getElementById('userPic');
  if (picture) { pic.src = picture; pic.style.background = 'transparent'; }
  
  // Update dropdown info
  const dropdownPic = document.getElementById('dropdownUserPic');
  if (picture) { dropdownPic.src = picture; }
  
  // Set name and email if elements exist
  const nameInput = document.getElementById('profileName');
  if (nameInput) nameInput.value = name;
  const emailDisplay = document.getElementById('profileEmailDisplay');
  if (emailDisplay) emailDisplay.textContent = email;
  
  // Load saved profile data
  loadProfileData();
  
  sessionStorage.setItem('airn_user', JSON.stringify({ name: name, picture: picture, email: email }));
};

// Profile Dropdown Functions
window.toggleProfileDropdown = function() {
  const dropdown = document.getElementById('profileDropdown');
  if (dropdown.style.display === 'none' || dropdown.style.display === '') {
    // Load user data before showing
    loadProfileData();
    dropdown.style.display = 'block';
  } else {
    dropdown.style.display = 'none';
  }
};

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  const avatar = document.getElementById('userAvatar');
  const dropdown = document.getElementById('profileDropdown');
  if (avatar && dropdown && !avatar.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = 'none';
  }
});

// Prevent dropdown from closing when clicking inside it
document.getElementById('profileDropdown').addEventListener('click', function(e) {
  e.stopPropagation();
});

// OTP Variables
let generatedOTP = null;
let otpTimerInterval = null;

window.sendOTP = function() {
  const phone = document.getElementById('profilePhone').value.trim();
  if (!phone || phone.length < 10) {
    showToast('Please enter a valid phone number');
    return;
  }
  
  // Generate 6-digit OTP
  generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('OTP (for demo):', generatedOTP); // For testing
  
  // Show OTP section
  document.getElementById('otpSection').style.display = 'block';
  document.getElementById('sendOtpBtn').textContent = 'Resend';
  document.getElementById('sendOtpBtn').disabled = true;
  document.getElementById('sendOtpBtn').style.opacity = '0.5';
  
  // Start countdown
  let countdown = 60;
  document.getElementById('otpCountdown').textContent = countdown;
  document.getElementById('otpTimer').style.display = 'block';
  
  if (otpTimerInterval) clearInterval(otpTimerInterval);
  otpTimerInterval = setInterval(function() {
    countdown--;
    document.getElementById('otpCountdown').textContent = countdown;
    if (countdown <= 0) {
      clearInterval(otpTimerInterval);
      document.getElementById('sendOtpBtn').disabled = false;
      document.getElementById('sendOtpBtn').style.opacity = '1';
    }
  }, 1000);
  
  showToast('OTP sent to ' + phone);
};

window.verifyOTP = function() {
  const enteredOTP = document.getElementById('otpInput').value.trim();
  if (!enteredOTP) {
    showToast('Please enter the OTP');
    return;
  }
  
  if (enteredOTP === generatedOTP) {
    document.getElementById('phoneVerified').style.display = 'block';
    document.getElementById('otpSection').style.display = 'none';
    showToast('Phone number verified successfully!');
    if (otpTimerInterval) clearInterval(otpTimerInterval);
  } else {
    showToast('Invalid OTP. Please try again.');
  }
};

window.saveProfile = function() {
  const name = document.getElementById('profileName').value.trim();
  const phone = document.getElementById('profilePhone').value.trim();
  const mobile = document.getElementById('profileMobile').value.trim();
  const dob = document.getElementById('profileAge').value;
  
  // Calculate age from DOB
  let ageText = '';
  if (dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    ageText = 'Age: ' + age + ' years';
    document.getElementById('ageDisplay').textContent = ageText;
  }
  
  // Save to session
  const user = getCurrentUser();
  if (user) {
    user.name = name || user.name;
    user.phone = phone;
    user.mobile = mobile;
    user.dob = dob;
    user.phoneVerified = document.getElementById('phoneVerified').style.display === 'block';
    sessionStorage.setItem('airn_user', JSON.stringify(user));
  }
  
  document.getElementById('profileDropdown').style.display = 'none';
  showToast('Profile saved successfully!');
};

// Add event listener for save profile button
document.getElementById('saveProfileBtn').addEventListener('click', function() {
  window.saveProfile();
});

// Add event listener for sign out button
document.getElementById('signOutBtn').addEventListener('click', function() {
  window.handleSignOut();
});

// Add event listener for send OTP button
const sendOtpBtn = document.getElementById('sendOtpBtn');
if (sendOtpBtn) {
  sendOtpBtn.addEventListener('click', function() {
    window.sendOTP();
  });
}

// Add event listener for verify OTP button
const verifyOtpBtn = document.getElementById('verifyOtpBtn');
if (verifyOtpBtn) {
  verifyOtpBtn.addEventListener('click', function() {
    window.verifyOTP();
  });
}

// Add event listener for profile photo input
const profilePhotoInput = document.getElementById('profilePhotoInput');
if (profilePhotoInput) {
  profilePhotoInput.addEventListener('change', function(event) {
    window.handleProfilePhotoUpload(event);
  });
}

window.loadProfileData = function() {
  const user = getCurrentUser();
  if (!user) return;
  
  // Load name
  const nameInput = document.getElementById('profileName');
  if (nameInput && user.name) {
    nameInput.value = user.name;
  }
  // Load email
  const emailDisplay = document.getElementById('profileEmailDisplay');
  if (emailDisplay && user.email) {
    emailDisplay.textContent = user.email;
  }
  // Load phone
  const phoneInput = document.getElementById('profilePhone');
  if (phoneInput && user.phone) {
    phoneInput.value = user.phone;
  }
  // Load mobile
  const mobileInput = document.getElementById('profileMobile');
  if (mobileInput && user.mobile) {
    mobileInput.value = user.mobile;
  }
  // Load DOB
  const dobInput = document.getElementById('profileAge');
  if (dobInput && user.dob) {
    dobInput.value = user.dob;
    const birthDate = new Date(user.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const ageDisplay = document.getElementById('ageDisplay');
    if (ageDisplay) {
      ageDisplay.textContent = 'Age: ' + age + ' years';
    }
  }
  // Load phone verified status
  if (user.phoneVerified) {
    const phoneVerified = document.getElementById('phoneVerified');
    if (phoneVerified) {
      phoneVerified.style.display = 'block';
    }
  }
  // Update dropdown pic if user has custom picture
  if (user.picture) {
    const dropdownPic = document.getElementById('dropdownUserPic');
    const userPic = document.getElementById('userPic');
    if (dropdownPic) dropdownPic.src = user.picture;
    if (userPic) userPic.src = user.picture;
  }
};

window.handleSignOut = function() {
  if (typeof google !== 'undefined') google.accounts.id.disableAutoSelect();
  sessionStorage.removeItem('airn_user');
  document.getElementById('userAvatar').style.display = 'none';
  document.getElementById('profileDropdown').style.display = 'none';
  document.getElementById('loginBtn').style.display = 'inline-block';
  document.getElementById('signupBtn').style.display = 'inline-block';
};
window.getCurrentUser = function() {
  const saved = sessionStorage.getItem('airn_user');
  return saved ? JSON.parse(saved) : null;
};
window.togglePwVis = function(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (inp.type === 'password') { inp.type = 'text'; btn.textContent = '🔒'; } else { inp.type = 'password'; btn.textContent = '👁'; }
};

const savedUser = sessionStorage.getItem('airn_user');
if (savedUser) {
  const u = JSON.parse(savedUser);
  window.addEventListener('DOMContentLoaded', function() { loginSuccess(u.name, u.picture, u.email); });
}

// INVENTION STORE
let inventions = [];
function getInventions() { return JSON.parse(localStorage.getItem('airn_inventions') || '[]'); }
function saveInventions(data) { localStorage.setItem('airn_inventions', JSON.stringify(data)); }
function getCategoryEmoji(cat) { return { 'AI Robot':'🤖','AI Chip':'💾','Robotics':'⚙️','Smart Device':'📱','Tech Invention':'🔬','Software':'💻' }[cat] || '🔧'; }
function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff/60) + 'm ago';
  if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
  return Math.floor(diff/86400) + 'd ago';
}
window.showToast = function(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.style.display = 'block';
  setTimeout(function() { t.style.display = 'none'; }, 3500);
};

// UPLOAD
window.openUploadModal = function() {
  const user = getCurrentUser();
  if (!user) { document.getElementById('loginModal').style.display = 'flex'; showToast('Please log in first'); return; }
  document.getElementById('uploadModal').style.display = 'flex';
};
window.previewImage = function(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById('uploadPreview');
      preview.src = e.target.result; preview.style.display = 'block';
      const zc = document.getElementById('uploadZoneContent');
      if (zc) zc.style.opacity = '0';
    };
    reader.readAsDataURL(input.files[0]);
  }
};
window.submitInvention = function() {
  const user = getCurrentUser();
  const title = document.getElementById('invTitle').value.trim();
  const desc = document.getElementById('invDesc').value.trim();
  const category = document.getElementById('invCategory').value;
  const price = parseFloat(document.getElementById('invPrice').value);
  const license = document.getElementById('invLicense').value;
  const imgEl = document.getElementById('uploadPreview');
  const imgSrc = imgEl && imgEl.src !== window.location.href ? imgEl.src : null;
  const errEl = document.getElementById('uploadError');
  if (!title) { errEl.textContent = 'Please enter a title.'; errEl.style.display = 'block'; return; }
  if (!desc) { errEl.textContent = 'Please add a description.'; errEl.style.display = 'block'; return; }
  if (!category) { errEl.textContent = 'Please select a category.'; errEl.style.display = 'block'; return; }
  if (isNaN(price) || price < 0) { errEl.textContent = 'Please enter a valid price.'; errEl.style.display = 'block'; return; }
  errEl.style.display = 'none';
  const invention = { id: Date.now(), title: title, desc: desc, category: category, price: price, license: license, image: imgSrc, author: user.name, authorPic: user.picture || '', authorEmail: user.email, timestamp: new Date().toISOString(), likes: 0, likedBy: [], sold: false };
  inventions = getInventions(); inventions.unshift(invention); saveInventions(inventions); renderFeed();
  document.getElementById('uploadModal').style.display = 'none';
  ['invTitle','invDesc','invPrice'].forEach(function(id) { document.getElementById(id).value = ''; });
  document.getElementById('invCategory').value = '';
  if (imgEl) { imgEl.src = ''; imgEl.style.display = 'none'; }
  const zc = document.getElementById('uploadZoneContent'); if (zc) zc.style.opacity = '1';
  showToast('Invention published!');
  const lm = document.getElementById('live-marketplace'); if (lm) lm.scrollIntoView({ behavior: 'smooth' });
};

// DELETE
window.deleteInvention = function(id, e) {
  if (e) e.stopPropagation();
  const user = getCurrentUser(); if (!user) { showToast('Please log in'); return; }
  inventions = getInventions();
  const inv = inventions.find(function(i) { return i.id === id; });
  if (!inv) return;
  if (inv.authorEmail !== user.email) { showToast('You can only delete your own inventions'); return; }
  if (!confirm('Delete "' + inv.title + '"?\nThis cannot be undone.')) return;
  inventions = inventions.filter(function(i) { return i.id !== id; });
  saveInventions(inventions); renderFeed(); renderMktGrid();
  document.getElementById('detailModal').style.display = 'none';
  showToast('Invention deleted');
};

// LIKE
window.toggleLike = function(id, e) {
  if (e) e.stopPropagation();
  const user = getCurrentUser(); if (!user) { showToast('Please log in to like'); return; }
  inventions = getInventions();
  const inv = inventions.find(function(i) { return i.id === id; }); if (!inv) return;
  if (!inv.likedBy) inv.likedBy = [];
  if (inv.likedBy.includes(user.email)) { inv.likedBy = inv.likedBy.filter(function(x) { return x !== user.email; }); inv.likes = Math.max(0, (inv.likes || 1) - 1); }
  if (!inv.likedBy) inv.likedBy = [];
  if (inv.likedBy.includes(user.email)) { inv.likedBy = inv.likedBy.filter(function(x) { return x !== user.email; }); inv.likes = Math.max(0, (inv.likes || 1) - 1); }
  else { inv.likedBy.push(user.email); inv.likes = (inv.likes || 0) + 1; }
  saveInventions(inventions); renderFeed(); renderMktGrid();
};
window.mktToggleLike = window.toggleLike;

// BUY
window.buyInvention = function(id, e) {
  if (e) e.stopPropagation();
  const user = getCurrentUser(); if (!user) { showToast('Please log in to buy'); return; }
  inventions = getInventions();
  const inv = inventions.find(function(i) { return i.id === id; }); if (!inv || inv.sold) return;
  if (inv.authorEmail === user.email) { showToast('Cannot buy your own invention'); return; }
  if (confirm('Purchase "' + inv.title + '" for $' + Number(inv.price).toLocaleString() + '?')) {
    inv.sold = true; saveInventions(inventions); renderFeed(); renderMktGrid();
    document.getElementById('detailModal').style.display = 'none';
    showToast('Purchase initiated! ' + inv.author + ' will be notified.');
  }
};
window.mktBuy = window.buyInvention;

// DETAIL VIEW
window.openDetail = function(id) {
  inventions = getInventions();
  const inv = inventions.find(function(i) { return i.id === id; }); if (!inv) return;
  const user = getCurrentUser();
  const liked = user && inv.likedBy && inv.likedBy.includes(user.email);
  const imgHtml = inv.image ? '<img src="' + inv.image + '" style="width:100%;height:100%;object-fit:cover;">' : '<div style="font-size:80px;">' + getCategoryEmoji(inv.category) + '</div>';
  const bg = inv.image ? '' : 'background:linear-gradient(135deg,rgba(0,50,150,0.4),rgba(60,0,120,0.4));';
  const authorIcon = inv.authorPic ? '<img src="' + inv.authorPic + '" style="width:40px;height:40px;border-radius:50%;border:2px solid rgba(0,200,255,0.3);">' : '<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#0066FF,#7B2FFF);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;">' + inv.author[0].toUpperCase() + '</div>';
  document.getElementById('detailContent').innerHTML = '<div style="' + bg + 'height:280px;display:flex;align-items:center;justify-content:center;border-radius:24px 24px 0 0;overflow:hidden;">' + imgHtml + '</div><div style="padding:28px 32px 32px;"><div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;"><span style="padding:4px 12px;background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.3);border-radius:100px;font-size:11px;letter-spacing:2px;color:#00D4FF;">' + inv.category.toUpperCase() + '</span><span style="padding:4px 12px;background:rgba(123,47,255,0.1);border:1px solid rgba(123,47,255,0.3);border-radius:100px;font-size:11px;color:#B57BFF;">' + inv.license + '</span>' + (inv.sold ? '<span style="padding:4px 12px;background:rgba(255,100,100,0.1);border:1px solid rgba(255,100,100,0.3);border-radius:100px;font-size:11px;color:#FF6B6B;">SOLD</span>' : '') + '</div><h2 style="font-family:Manrope,sans-serif;font-size:24px;font-weight:800;margin-bottom:12px;">' + inv.title + '</h2><p style="font-size:14px;color:rgba(255,255,255,0.55);line-height:1.8;margin-bottom:24px;">' + inv.desc + '</p><div style="display:flex;align-items:center;gap:10px;padding:16px;background:rgba(255,255,255,0.03);border-radius:12px;border:1px solid rgba(255,255,255,0.07);margin-bottom:24px;">' + authorIcon + '<div><div style="font-family:Manrope,sans-serif;font-size:14px;font-weight:600;">' + inv.author + '</div><div style="font-size:12px;color:rgba(255,255,255,0.35);">Posted ' + timeAgo(inv.timestamp) + '</div></div></div><div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;"><div><div style="font-size:11px;color:rgba(255,255,255,0.35);margin-bottom:4px;">PRICE</div><div style="font-family:Manrope,sans-serif;font-size:32px;font-weight:900;background:linear-gradient(90deg,#4DA6FF,#00D4FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">$' + Number(inv.price).toLocaleString() + '</div></div><div style="display:flex;gap:10px;"><button onclick="toggleLike(' + inv.id + ',event)" style="padding:12px 20px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:' + (liked ? '#FF6B6B' : 'rgba(255,255,255,0.5)') + ';font-size:16px;cursor:pointer;">' + (liked ? '❤️' : '🤍') + ' ' + (inv.likes || 0) + '</button><button onclick="buyInvention(' + inv.id + ')" ' + (inv.sold ? 'disabled' : '') + ' style="padding:12px 32px;border-radius:10px;border:none;background:' + (inv.sold ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#0066FF,#7B2FFF)') + ';color:' + (inv.sold ? 'rgba(255,255,255,0.3)' : '#fff') + ';font-family:Manrope,sans-serif;font-size:15px;font-weight:700;cursor:' + (inv.sold ? 'not-allowed' : 'pointer') + ';">' + (inv.sold ? 'Sold Out' : 'Buy Now') + '</button></div></div></div>';
  document.getElementById('detailModal').style.display = 'flex';
};
window.openMktDetail = window.openDetail;

// LIVE FEED
let currentFilter = 'all';
window.filterFeed = function(cat) {
  currentFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active-filter'); });
  if (event && event.target) event.target.classList.add('active-filter');
  renderFeed();
};

window.renderFeed = function() {
  inventions = getInventions();
  const feed = document.getElementById('inventionFeed');
  const empty = document.getElementById('emptyFeed');
  if (!feed) return;
  const filtered = currentFilter === 'all' ? inventions : inventions.filter(function(i) { return i.category === currentFilter; });
  feed.querySelectorAll('.inv-card').forEach(function(c) { c.remove(); });
  if (!filtered.length) { if (empty) empty.style.display = 'block'; return; }
  if (empty) empty.style.display = 'none';
  const user = getCurrentUser();
  filtered.forEach(function(inv, idx) {
    const card = document.createElement('div');
    card.className = 'inv-card';
    card.style.cssText = 'background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;cursor:pointer;transition:all 0.3s ease;animation-delay:' + (idx*0.05) + 's;';
    const imgHtml = inv.image ? '<img src="' + inv.image + '" style="width:100%;height:100%;object-fit:cover;">' : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:52px;">' + getCategoryEmoji(inv.category) + '</div>';
    const liked = user && inv.likedBy && inv.likedBy.includes(user.email);
    const delBtn = user && inv.authorEmail === user.email ? '<button onclick="deleteInvention(' + inv.id + ',event)" style="background:rgba(255,60,60,0.1);border:1px solid rgba(255,60,60,0.25);border-radius:6px;color:rgba(255,100,100,0.7);font-size:12px;padding:3px 8px;cursor:pointer;">🗑</button>' : '';
    const aIcon = inv.authorPic ? '<img src="' + inv.authorPic + '" style="width:24px;height:24px;border-radius:50%;border:1px solid rgba(0,200,255,0.3);">' : '<div style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#0066FF,#7B2FFF);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;">' + inv.author[0].toUpperCase() + '</div>';
    card.innerHTML = '<div style="height:200px;background:linear-gradient(135deg,rgba(0,50,150,0.3),rgba(60,0,120,0.3));position:relative;overflow:hidden;">' + imgHtml + '<div style="position:absolute;top:12px;left:12px;padding:4px 10px;background:rgba(0,0,0,0.6);border:1px solid rgba(0,212,255,0.3);border-radius:100px;font-family:Inter,sans-serif;font-size:10px;letter-spacing:2px;color:#00D4FF;">' + inv.category.toUpperCase() + '</div>' + (inv.sold ? '<div style="position:absolute;top:12px;right:12px;padding:4px 10px;background:rgba(255,100,100,0.2);border:1px solid rgba(255,100,100,0.4);border-radius:100px;font-size:10px;color:#FF6B6B;">SOLD</div>' : '') + '</div><div style="padding:18px;"><h3 style="font-family:Manrope,sans-serif;font-size:15px;font-weight:700;margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + inv.title + '</h3><p style="font-family:Inter,sans-serif;font-size:12px;color:rgba(255,255,255,0.45);line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:14px;">' + inv.desc + '</p><div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">' + aIcon + '<span style="font-family:Inter,sans-serif;font-size:12px;color:rgba(255,255,255,0.4);">' + inv.author + '</span><span style="margin-left:auto;font-family:Inter,sans-serif;font-size:11px;color:rgba(255,255,255,0.25);">' + timeAgo(inv.timestamp) + '</span>' + delBtn + '</div><div style="display:flex;align-items:center;justify-content:space-between;"><span style="font-family:Manrope,sans-serif;font-size:20px;font-weight:800;background:linear-gradient(90deg,#4DA6FF,#00D4FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">$' + Number(inv.price).toLocaleString() + '</span><div style="display:flex;gap:8px;"><button onclick="toggleLike(' + inv.id + ',event)" style="padding:7px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:' + (liked ? '#FF6B6B' : 'rgba(255,255,255,0.4)') + ';font-size:13px;cursor:pointer;">' + (liked ? '❤️' : '🤍') + ' ' + (inv.likes || 0) + '</button><button onclick="openDetail(' + inv.id + ')" style="padding:7px 16px;border-radius:8px;border:1px solid rgba(0,150,255,0.3);background:rgba(0,100,255,0.12);color:#4DA6FF;font-size:12px;font-weight:600;cursor:pointer;">View</button><button onclick="buyInvention(' + inv.id + ',event)" ' + (inv.sold ? 'disabled' : '') + ' style="padding:7px 16px;border-radius:8px;border:none;background:' + (inv.sold ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#0066FF,#7B2FFF)') + ';color:' + (inv.sold ? 'rgba(255,255,255,0.3)' : '#fff') + ';font-size:12px;font-weight:600;cursor:' + (inv.sold ? 'not-allowed' : 'pointer') + ';">' + (inv.sold ? 'Sold' : 'Buy') + '</button></div></div></div>';
    card.addEventListener('mouseenter', function() { card.style.transform = 'translateY(-6px)'; card.style.borderColor = 'rgba(0,150,255,0.25)'; card.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5)'; });
    card.addEventListener('mouseleave', function() { card.style.transform = ''; card.style.borderColor = 'rgba(255,255,255,0.08)'; card.style.boxShadow = ''; });
    feed.appendChild(card);
  });
};

// MARKETPLACE GRID
let mktFilter = 'all';
window.setMktFilter = function(cat, btn) {
  mktFilter = cat;
  document.querySelectorAll('.mpill').forEach(function(p) { p.classList.remove('active-mpill'); });
  btn.classList.add('active-mpill');
  renderMktGrid();
};
window.renderMktGrid = function() {
  inventions = getInventions();
  const grid = document.getElementById('mktGrid'); if (!grid) return;
  grid.innerHTML = '';
  var el1=document.getElementById('mktStatTotal'); if(el1) el1.textContent=inventions.length;
  var el2=document.getElementById('mktStatCats'); if(el2) el2.textContent=new Set(inventions.map(function(i){return i.category;})).size;
  var el3=document.getElementById('mktStatAvail'); if(el3) el3.textContent=inventions.filter(function(i){return !i.sold;}).length;
  var list = mktFilter==='all' ? inventions.slice() : inventions.filter(function(i){return i.category===mktFilter;});
  var q=(document.getElementById('mktSearch')||{}).value||'';
  if(q) list=list.filter(function(i){return (i.title+i.desc+i.author).toLowerCase().includes(q.toLowerCase());});
  var sort=(document.getElementById('mktSort')||{}).value||'newest';
  if(sort==='newest') list.sort(function(a,b){return b.id-a.id;});
  else if(sort==='oldest') list.sort(function(a,b){return a.id-b.id;});
  else if(sort==='price-low') list.sort(function(a,b){return a.price-b.pph)f}
  else if(sort==='popular') list.sort(function(a,b){return (b.likes||0)-(a.likes||0);});
  if(!list.length){ grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:rgba(255,255,255,0.25);"><div style="font-size:56px;margin-bottom:16px;">🔬</div><p style="font-family:Manrope,sans-serif;font-size:18px;font-weight:600;margin-bottom:8px;">No inventions yet</p><p>Be the first to upload!</p></div>'; return; }
  var user=getCurrentUser();
  list.forEach(function(inv,idx){
    var liked=user&&inv.likedBy&&inv.likedBy.includes(user.email);
    var card=document.createElement('div');
    card.style.cssText='background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:18px;overflow:hidden;transition:all 0.3s;animation:cardIn 0.4s ease both;animation-delay:'+(idx*0.04)+'s;cursor:pointer;';
    var imgHtml=inv.image?'<img src="'+inv.image+'" style="width:100%;height:100%;object-fit:cover;">'+'':'<div style="font-size:52px;">'+getCategoryEmoji(inv.category)+'</div>';
    var bg=inv.image?'':'background:linear-gradient(135deg,rgba(0,50,150,0.3),rgba(60,0,120,0.3));';
    var delBtn=user&&inv.authorEmail===user.email?'<button onclick="deleteInvention('+inv.id+',event)" style="background:rgba(255,60,60,0.1);border:1px solid rgba(255,60,60,0.25);border-radius:6px;color:rgba(255,100,100,0.7);font-size:12px;padding:3px 8px;cursor:pointer;">🗑</button>':'';
    var aIcon=inv.authorPic?'<img src="'+inv.authorPic+'" style="width:24px;height:24px;border-radius:50%;border:1px solid rgba(0,200,255,0.3);">'+'':'<div style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#0066FF,#7B2FFF);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;">'+inv.author[0].toUpperCase()+'</div>';
    card.innerHTML='<div style="'+bg+'height:210px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;">'+imgHtml+'<span style="position:absolute;top:12px;left:12px;padding:4px 10px;background:rgba(0,0,0,0.65);border:1px solid rgba(0,212,255,0.3);border-radius:100px;font-size:10px;letter-spacing:2px;color:#00D4FF;">'+inv.category.toUpperCase()+'</span>'+(inv.sold?'<span style="position:absolute;top:12px;right:12px;padding:4px 10px;background:rgba(255,80,80,0.2);border:1px solid rgba(255,80,80,0.4);border-radius:100px;font-size:10px;color:#FF6B6B;">SOLD</span>':'')+'</div><div style="padding:18px 18px 14px;"><div style="font-family:Manrope,sans-serif;font-size:15px;font-weight:700;margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+inv.title+'</div><div style="font-size:12px;color:rgba(255,255,255,0.4);line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:14px;">'+inv.desc+'</div><div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">'+aIcon+'<span style="font-size:12px;color:rgba(255,255,255,0.4);">'+inv.author+'</span><span style="margin-left:auto;font-size:11px;color:rgba(255,255,255,0.22);">'+timeAgo(inv.timestamp)+'</span>'+delBtn+'</div><div style="display:flex;align-items:center;justify-content:space-between;"><span style="font-family:Manrope,sans-serif;font-size:20px;font-weight:900;background:linear-gradient(90deg,#4DA6FF,#00D4FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">$'+Number(inv.price).toLocaleString()+'</span><div style="display:flex;gap:7px;"><button onclick="toggleLike('+inv.id+',event)" style="padding:7px 11px;border-radius:8px;border:1px solid '+(liked?'rgba(255,100,100,0.4)':'rgba(255,255,255,0.1)')+';background:transparent;color:'+(liked?'#FF6B6B':'rgba(255,255,255,0.4)')+';font-size:13px;cursor:pointer;">'+(liked?'❤️':'🤍')+' '+(inv.likes||0)+'</button><button onclick="openMktDetail('+inv.id+')" style="padding:7px 14px;border-radius:8px;border:1px solid rgba(0,150,255,0.3);background:rgba(0,100,255,0.1);color:#4DA6FF;font-size:12px;font-weight:600;cursor:pointer;">View</button><button onclick="mktBuy('+inv.id+',event)" '+(inv.sold?'disabled':'')+' style="padding:7px 14px;border-radius:8px;border:none;background:'+(inv.sold?'rgba(255,255,255,0.05)':'linear-gradient(135deg,#0066FF,#7B2FFF)')+';color:'+(inv.sold?'rgba(255,255,255,0.3)':'#fff')+';font-size:12px;font-weight:600;cursor:'+(inv.sold?'not-allowed':'pointer')+';">'+(inv.sold?'Sold':'Buy')+'</button></div></div></div>';
    card.addEventListener('mouseenter',function(){card.style.transform='translateY(-6px)';card.style.borderColor='rgba(0,150,255,0.25)';card.style.boxShadow='0 24px 60px rgba(0,0,0,0.6)';});
    card.addEventListener('mouseleave',function(){card.style.transform='';card.style.borderColor='rgba(255,255,255,0.08)';card.style.boxShadow='';});
    grid.appendChild(card);
  });
};
setInterval(function(){
  if(document.getElementById('tab-marketplace')&&document.getElementById('tab-marketplace').classList.contains('active')) renderMktGrid();
},5000);

// CHATBOT
var chatOpen=false,chatHistory=[],isTyping=false;
var AIRN_SYSTEM='You are AIRN Assistant, the helpful AI for AIRN — the world first marketplace for AI robots, AI chips, robotics, smart devices and tech inventions. Help users with uploading, selling, buying inventions, stipends ($500/mo), grants (up to $25K), and navigating the platform. Be friendly and concise.';
var quickReplies=["How do I upload an invention?","What rewards do creators get?","How do I buy an invention?","What is AIRN?"];

window.toggleChat=function(){
  chatOpen=!chatOpen;
  var win=document.getElementById('chatWindow');
  win.style.display=chatOpen?'flex':'none';
  if(chatOpen&&chatHistory.length===0) setTimeout(function(){addBotMessage("👋 Hey! I am the AIRN Assistant. I can help you explore the marketplace, upload inventions, and learn about creator rewards.\n\nWhat would you like to know?",true);},300);
  if(chatOpen) setTimeout(function(){document.getElementById('chatInput').focus();},400);
};

function addBotMessage(text,withQR){
  var msgs=document.getElementById('chatMessages');
  var typing=document.getElementById('typingIndicator'); if(typing) typing.remove();
  var msg=document.createElement('div'); msg.className='msg bot';
  var qrHtml=withQR?'<div class="quick-replies">'+quickReplies.map(function(q){return '<button class="quick-reply" onclick="sendQuick(\''+q+'\')">'+q+'</button>';}).join('')+'</div>':'';
  msg.innerHTML='<div class="msg-pic">🤖</div><div><div class="msg-bubble">'+text.replace(/\n/g,'<br>')+'</div>'+qrHtml+'</div>';
  msgs.appendChild(msg); msgs.scrollTop=msgs.scrollHeight;
}
function addUserMessage(text){
  var msgs=document.getElementById('chatMessages');
  var user=getCurrentUser();
  var msg=document.createElement('div'); msg.className='msg user';
  msg.innerHTML='<div class="msg-bubble">'+text+'</div><div class="msg-pic">'+(user&&user.picture?'<img src="'+user.picture+'" style="width:26px;height:26px;border-radius:50%;object-fit:cover;">':(user&&user.name?user.name[0].toUpperCase():'👤'))+'</div>';
  msgs.appendChild(msg); msgs.scrollTop=msgs.scrollHeight;
}
function showTyping(){
  var msgs=document.getElementById('chatMessages');
  var div=document.createElement('div'); div.className='msg bot'; div.id='typingIndicator';
  div.innerHTML='<div class="msg-pic">🤖</div><div class="msg-bubble" style="padding:10px 14px;"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
  msgs.appendChild(div); msgs.scrollTop=msgs.scrollHeight;
}
window.sendChat=async function(){
  var input=document.getElementById('chatInput');
  var text=input.value.trim(); if(!text||isTyping) return;
  input.value=''; input.style.height='auto';
  addUserMessage(text); chatHistory.push({role:'user',content:text}); isTyping=true; showTyping();
  try {
    var response=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,system:AIRN_SYSTEM,messages:chatHistory})});
    var data=await response.json();
    var reply=data.content&&data.content[0]?data.content[0].text:"Sorry, couldn't get a response. Please try again!";
    chatHistory.push({role:'assistant',content:reply}); addBotMessage(reply);
  } catch(err){addBotMessage("Having trouble connecting. Please try again!");}
  isTyping=false;
};
window.sendQuick=function(text){document.getElementById('chatInput').value=text;sendChat();};

// MODAL BACKDROP CLOSE
['loginModal','signupModal','uploadModal','detailModal'].forEach(function(id){
  var el=document.getElementById(id);
  if(el) el.addEventListener('click',function(e){if(e.target===el) el.style.display='none';});
});

// INITIAL RENDER
window.addEventListener('DOMContentLoaded',function(){
  inventions=getInventions(); renderFeed();
  var chatInput=document.getElementById('chatInput');
  if(chatInput){
    chatInput.addEventListener('input',function(){this.style.height='auto';this.style.height=Math.min(this.scrollHeight,80)+'px';});
    chatInput.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat();}});
  }
});
JSEOF
echo "Done"