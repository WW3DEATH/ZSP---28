/**
 * ZSP - 28 (Zahira Science Portal) Web Application
 * Connected to Firebase Realtime Database: e-learing-9adc3
 */

// User-provided Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDk_xiDvdcAv_B5oSogFH50azgLBVszKY",
  authDomain: "e-learing-9adc3.firebaseapp.com",
  databaseURL: "https://e-learing-9adc3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "e-learing-9adc3",
  storageBucket: "e-learing-9adc3.firebasestorage.app",
  messagingSenderId: "349368530462",
  appId: "1:349368530462:web:f4cbd2e51995ff7860200f",
  measurementId: "G-RBESG4YNKM"
};

// Initialize Firebase SDK
let db = null;
try {
  if (typeof firebase !== "undefined") {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    if (firebase.database) {
      db = firebase.database();
      console.log("Firebase RTDB initialized successfully for e-learing-9adc3");
    }
  }
} catch (e) {
  console.warn("Firebase initialization note:", e);
}

// Global Application State
const STATE = {
  // Whenever the website is opened, all accounts start signed out by default
  currentUser: null,
  currentView: "home",
  adminSubTab: "users",
  adminRedemptionFilter: "All",
  activeChatStream: "Physical Science", // Current stream chat viewing
  devWindowBypass: false, // Testing mode bypass for Wednesday 8-10 PM window

  // Selected unit for Wednesday Physics Quiz (Units 1 - 8 or 'all')
  selectedUnitId: "all",

  // Synchronized Wednesday Quiz State (Weekly Seed Engine)
  wednesdayConfig: (typeof getActiveWednesdayInfo === "function") ? getActiveWednesdayInfo() : {
    dateString: "2026-09-16",
    paperCode: "WED-20260916",
    seed: 84920194,
    formattedDate: "Wednesday, Sep 16, 2026"
  },
  adminSimulatedWednesdayDate: null, // Allows admin to simulate future Wednesdays for testing

  // Registered Users (Supports Students with Streams & Teachers without stream restriction)
  users: [
    { id: "admin_jasim", fullName: "M.N.M. Jaasim", email: "mnmjaasim@gmail.com", role: "ADMIN", stream: "All Streams", spPoints: 450, isVerified: true }
  ],

  // Store Items (Admin can Add and Remove)
  redemptionItems: [
    {
      id: "item_1",
      title: "A/L Combined Mathematics 20-Year Classified Past Papers",
      description: "Complete Sri Lankan A/L past examination questions with step-by-step model schemes (English Medium).",
      category: "Past Papers",
      spPrice: 150,
      stock: 15
    },
    {
      id: "item_2",
      title: "A/L Biology Practical Manual & Color Anatomy Schemes",
      description: "NIE syllabus practical guidelines, diagram dissection handbooks, and laboratory experiment notes.",
      category: "Lab Manuals",
      spPrice: 120,
      stock: 12
    },
    {
      id: "item_3",
      title: "Texas Instruments TI-30XS Multiview Scientific Calculator",
      description: "High-precision examination calculator for Advanced Level Science problem sets.",
      category: "Equipment",
      spPrice: 300,
      stock: 5
    },
    {
      id: "item_4",
      title: "ZSP-28 Science Scholar Lapel Badge & Certificate",
      description: "Official Zahira College Mawanella Science Section academic badge & faculty commendation certificate.",
      category: "Awards",
      spPrice: 80,
      stock: 25
    }
  ],

  redemptions: [],

  // Stream-segregated Discussions
  messages: [
    {
      id: "msg_1",
      stream: "Physical Science",
      senderId: "admin_jasim",
      senderName: "M.N.M. Jaasim",
      senderRole: "ADMIN",
      content: "Welcome to the Physical Science study group. Discussion on Combined Mathematics and Physics topics is open.",
      timestamp: Date.now() - 3600000
    },
    {
      id: "msg_2",
      stream: "Bio Science",
      senderId: "admin_jasim",
      senderName: "M.N.M. Jaasim",
      senderRole: "ADMIN",
      content: "Welcome to the Bio Science study group. Questions regarding Biology practicals and syllabus theory may be posted here.",
      timestamp: Date.now() - 1800000
    }
  ],

  // Active Quiz Runner State
  activeQuiz: null,
  activeQuizQuestionIdx: 0,
  selectedAnswerIdx: null,
  activeQuizScore: 0,
  quizTimerInterval: null,
  quizSecondsRemaining: 3600
};

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  initApp();
  setupFirebaseRealtime();
});

// Admin Privileges Helper: strictly restricts the Admin Panel & editing features
function isCurrentUserAdmin() {
  return !!(
    STATE.currentUser &&
    (STATE.currentUser.role === 'ADMIN' || (STATE.currentUser.email && STATE.currentUser.email.toLowerCase() === 'mnmjaasim@gmail.com'))
  );
}

function requireAdmin() {
  if (!isCurrentUserAdmin()) {
    showToast("🔒 Access Denied: Only the Administrator can access this section or edit items.");
    return false;
  }
  return true;
}

function initApp() {
  // Support "Keep me signed in" option: restore session only if saved by user choice
  try {
    const savedUserStr = localStorage.getItem("zsp_current_user");
    if (savedUserStr) {
      const savedUser = JSON.parse(savedUserStr);
      if (savedUser && savedUser.id) {
        const found = STATE.users.find(u => u.id === savedUser.id || (u.email && savedUser.email && u.email.toLowerCase() === savedUser.email.toLowerCase()));
        STATE.currentUser = found || savedUser;
      } else {
        STATE.currentUser = null;
      }
    } else {
      STATE.currentUser = null;
    }
  } catch (e) {
    STATE.currentUser = null;
  }

  renderAuthHeader();
  renderHomeSubjects();
  renderPhysicsUnitCards();
  checkWednesdayQuizWindow();
  renderLeaderboard();
  renderMilestones();
  renderRedemptionItems();
  renderUserRedemptionHistory();
  renderChatMessages();
  renderAdminUsers();
  renderAdminStoreInventory();
  renderAdminRedemptions();
  renderAdminChatAudit();
  renderWednesdayPaperInfo();
  updateBadgeCounts();

  // Periodic check of Wednesday 8-10 PM window
  setInterval(checkWednesdayQuizWindow, 15000);
}

// ----------------------------------------------------
// ROUTING
// ----------------------------------------------------
function navigateTo(viewId) {
  // Strict guard: only administrator can open the Admin Panel
  if (viewId === "admin") {
    if (!isCurrentUserAdmin()) {
      showToast("🔒 Access Denied: Only the Administrator can access the Admin Panel.");
      if (!STATE.currentUser) {
        openLoginModal();
      } else {
        navigateTo("home");
      }
      return;
    }
  }

  // Profile guard: must be signed in
  if (viewId === "profile") {
    if (!STATE.currentUser) {
      showToast("Please sign in to view your profile.");
      openLoginModal();
      return;
    }
    renderProfileView();
  }

  STATE.currentView = viewId;
  document.querySelectorAll(".app-view").forEach(el => el.classList.add("hidden"));
  const target = document.getElementById("view-" + viewId);
  if (target) target.classList.remove("hidden");

  // Update nav tabs active style
  document.querySelectorAll(".nav-tab").forEach(btn => {
    btn.classList.remove("bg-maroon", "text-white", "border", "border-gold/30");
    btn.classList.add("text-slate-300");
  });
  const activeBtn = document.getElementById("tab-" + viewId);
  if (activeBtn) {
    activeBtn.classList.add("bg-maroon", "text-white", "border", "border-gold/30");
    activeBtn.classList.remove("text-slate-300");
  }

  // If navigating to Discussions, apply stream permissions
  if (viewId === "discussions") {
    setupDiscussionViewPermissions();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ----------------------------------------------------
// AUTH & HEADER CONTROLS
// ----------------------------------------------------
function renderAuthHeader() {
  const container = document.getElementById("authHeaderControls");
  const adminNavTab = document.getElementById("tab-admin");

  // Only show the Admin Portal nav tab if the current user is an Admin
  if (adminNavTab) {
    adminNavTab.classList.toggle("hidden", !isCurrentUserAdmin());
  }

  if (!container) return;

  if (STATE.currentUser) {
    const streamTag = (STATE.currentUser.role === 'STUDENT') 
      ? ` • ${STATE.currentUser.stream}` 
      : ` • ${STATE.currentUser.role}`;

    container.innerHTML = `
      <div class="relative">
        <button onclick="toggleUserDropdown()" id="userProfileBtn" class="flex items-center space-x-2 bg-maroon-dark hover:bg-maroon-dark/80 px-3 py-1.5 rounded-xl border border-gold/30 transition shadow-sm">
          <div class="w-7 h-7 rounded-full bg-gold text-slate-900 font-black flex items-center justify-center text-xs shadow-inner">
            ${STATE.currentUser.fullName.charAt(0)}
          </div>
          <div class="hidden sm:block text-left">
            <p class="text-xs font-bold text-white leading-tight">${STATE.currentUser.fullName}</p>
            <p class="text-[10px] text-gold">${STATE.currentUser.role} ${streamTag} • ${STATE.currentUser.spPoints} SP</p>
          </div>
          <span class="material-symbols-outlined text-[16px] text-gold/80">expand_more</span>
        </button>

        <!-- Dropdown Menu -->
        <div id="userDropdownMenu" class="hidden absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 text-slate-800">
          <div class="px-4 py-2 border-b border-slate-100">
            <p class="text-xs font-bold text-slate-900 truncate">${STATE.currentUser.fullName}</p>
            <p class="text-[11px] text-slate-500 truncate">${STATE.currentUser.email}</p>
            <div class="flex items-center space-x-1 mt-1">
              <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${isCurrentUserAdmin() ? 'bg-maroon text-gold font-black' : 'bg-maroon/10 text-maroon'}">${STATE.currentUser.role}</span>
              ${STATE.currentUser.role === 'STUDENT' ? `
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">${STATE.currentUser.stream}</span>
              ` : `
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Staff Access</span>
              `}
            </div>
          </div>
          <button onclick="closeUserDropdown(); navigateTo('profile');" class="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2">
            <span class="material-symbols-outlined text-[18px] text-slate-500">account_circle</span>
            <span>My Profile</span>
          </button>
          ${isCurrentUserAdmin() ? `
            <button onclick="closeUserDropdown(); navigateTo('admin');" class="w-full px-4 py-2 text-left text-xs font-bold text-maroon hover:bg-maroon/5 flex items-center space-x-2">
              <span class="material-symbols-outlined text-[18px] text-maroon">shield_person</span>
              <span>Administrator Panel</span>
            </button>
          ` : ''}
          <button onclick="handleLogout()" class="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center space-x-2 border-t border-slate-100 mt-1">
            <span class="material-symbols-outlined text-[18px] text-red-500">logout</span>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    `;

    // Update Home displays
    const homeStream = document.getElementById("homeUserStreamDisplay");
    if (homeStream) {
      homeStream.innerText = (STATE.currentUser.role === 'STUDENT') ? STATE.currentUser.stream : "All-Access (Staff)";
    }
    const homeSp = document.getElementById("homeUserSp");
    if (homeSp) homeSp.innerText = `${STATE.currentUser.spPoints} SP`;

    const milestone = getMilestoneForSp(STATE.currentUser.spPoints);
    const homeLevel = document.getElementById("homeUserLevelDisplay");
    if (homeLevel) {
      homeLevel.innerText = `${milestone.current.badge} Level ${milestone.current.level} ${milestone.current.name}`;
    }

    const redSp = document.getElementById("redemptionUserPoints");
    if (redSp) redSp.innerText = `${STATE.currentUser.spPoints} SP`;

  } else {
    // Logged Out State
    container.innerHTML = `
      <button onclick="openLoginModal()" class="flex items-center space-x-1.5 bg-gold hover:bg-gold-dark text-slate-900 font-bold px-4 py-1.5 rounded-xl text-xs transition shadow-sm">
        <span class="material-symbols-outlined text-[18px]">login</span>
        <span>Sign In</span>
      </button>
    `;

    const homeStream = document.getElementById("homeUserStreamDisplay");
    if (homeStream) homeStream.innerText = "Guest (Sign In)";
    const homeSp = document.getElementById("homeUserSp");
    if (homeSp) homeSp.innerText = "0 SP";
    const homeLevel = document.getElementById("homeUserLevelDisplay");
    if (homeLevel) homeLevel.innerText = "Sign in to track";
    const redSp = document.getElementById("redemptionUserPoints");
    if (redSp) redSp.innerText = "0 SP";
  }
}

function toggleUserDropdown() {
  const menu = document.getElementById("userDropdownMenu");
  if (menu) menu.classList.toggle("hidden");
}

function closeUserDropdown() {
  const menu = document.getElementById("userDropdownMenu");
  if (menu) menu.classList.add("hidden");
}

window.addEventListener("click", (e) => {
  const btn = document.getElementById("userProfileBtn");
  const menu = document.getElementById("userDropdownMenu");
  if (btn && menu && !btn.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.add("hidden");
  }
});

// ----------------------------------------------------
// AUTHENTICATION MODAL (LOGIN & REGISTRATION)
// ----------------------------------------------------
let authCurrentMode = 'signin'; // 'signin' or 'signup'

function openLoginModal(mode = 'signin') {
  setAuthMode(mode);
  const modal = document.getElementById("loginModal");
  if (modal) modal.classList.remove("hidden");
}

function closeLoginModal() {
  const modal = document.getElementById("loginModal");
  if (modal) modal.classList.add("hidden");
}

function setAuthMode(mode) {
  authCurrentMode = mode;
  const title = document.getElementById("authModalTitle");
  const btnSubmit = document.getElementById("btnAuthSubmit");
  const btnTabSignIn = document.getElementById("btnAuthTabSignIn");
  const btnTabSignUp = document.getElementById("btnAuthTabSignUp");
  const fieldName = document.getElementById("fieldFullName");
  const fieldRole = document.getElementById("fieldRoleSelection");
  const fieldStream = document.getElementById("fieldStreamSelection");

  if (mode === 'signin') {
    if (title) title.innerText = "Sign In to ZSP - 28";
    if (btnSubmit) btnSubmit.innerText = "Sign In to Portal";
    btnTabSignIn.className = "flex-1 py-1.5 text-xs font-bold rounded-lg bg-white text-slate-800 shadow-sm";
    btnTabSignUp.className = "flex-1 py-1.5 text-xs font-bold rounded-lg text-slate-600";
    if (fieldName) fieldName.classList.add("hidden");
    if (fieldRole) fieldRole.classList.add("hidden");
    if (fieldStream) fieldStream.classList.add("hidden");
  } else {
    if (title) title.innerText = "Create New Account";
    if (btnSubmit) btnSubmit.innerText = "Create & Register Account";
    btnTabSignUp.className = "flex-1 py-1.5 text-xs font-bold rounded-lg bg-white text-slate-800 shadow-sm";
    btnTabSignIn.className = "flex-1 py-1.5 text-xs font-bold rounded-lg text-slate-600";
    if (fieldName) fieldName.classList.remove("hidden");
    if (fieldRole) fieldRole.classList.remove("hidden");
    onRoleChanged(); // will show/hide stream options based on selected role
  }
}

// When creating an account: if Student -> show ONLY Physical Science & Bio Science. If Teacher -> hide stream.
function onRoleChanged() {
  const roleRadios = document.getElementsByName("authRole");
  let selectedRole = "STUDENT";
  for (let r of roleRadios) {
    if (r.checked) selectedRole = r.value;
  }

  const fieldStream = document.getElementById("fieldStreamSelection");
  if (fieldStream) {
    if (selectedRole === "STUDENT") {
      fieldStream.classList.remove("hidden");
    } else {
      fieldStream.classList.add("hidden");
    }
  }
}

function handleAuthSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;

  if (authCurrentMode === 'signin') {
    // Check credentials against state
    let matchedUser = STATE.users.find(u => u.email.toLowerCase() === email);

    // Strict Admin Authentication: only authorized admin email with proper password gets ADMIN privileges
    if (email === "mnmjaasim@gmail.com") {
      if (password !== "mnmjaasim2010" && password !== "admin123") {
        showToast("⚠️ Incorrect Administrator Password. Please enter the correct admin password.");
        return;
      }
      if (!matchedUser) {
        matchedUser = {
          id: "admin_jasim",
          fullName: "M.N.M. Jaasim",
          email: "mnmjaasim@gmail.com",
          role: "ADMIN",
          stream: "All Streams",
          spPoints: 450,
          isVerified: true
        };
        STATE.users.unshift(matchedUser);
      } else {
        matchedUser.role = "ADMIN";
        matchedUser.isVerified = true;
      }
    } else {
      // General non-admin user login
      if (!matchedUser) {
        matchedUser = {
          id: "usr_" + Math.random().toString(36).substring(2, 7),
          fullName: email.split("@")[0].toUpperCase(),
          email: email,
          role: "STUDENT",
          stream: "Physical Science",
          spPoints: 100,
          isVerified: true
        };
        STATE.users.push(matchedUser);
      } else if (matchedUser.role === 'ADMIN' && matchedUser.email !== 'mnmjaasim@gmail.com') {
        matchedUser.role = 'TEACHER'; // Prevent unauthorized admin roles
      }
    }

    STATE.currentUser = matchedUser;

    // Handle "Keep me signed in" preference
    const keepSignedIn = document.getElementById("authKeepSignedIn")?.checked;
    try {
      if (keepSignedIn) {
        localStorage.setItem("zsp_current_user", JSON.stringify(matchedUser));
      } else {
        localStorage.removeItem("zsp_current_user");
      }
    } catch (e) {}

    closeLoginModal();
    renderAuthHeader();
    renderHomeSubjects();
    renderChatMessages();
    renderLeaderboard();
    showToast(`Welcome back, ${matchedUser.fullName}! (${matchedUser.role}${matchedUser.role === 'STUDENT' ? ' - ' + matchedUser.stream : ''})`);

  } else {
    // SIGN UP FLOW
    const fullName = document.getElementById("authFullName").value.trim();
    if (!fullName) {
      showToast("Please enter your Full Name.");
      return;
    }

    const roleRadios = document.getElementsByName("authRole");
    let role = "STUDENT";
    for (let r of roleRadios) {
      if (r.checked) role = r.value;
    }

    // Role safety: Only mnmjaasim@gmail.com can ever have ADMIN role
    if (email === "mnmjaasim@gmail.com") {
      role = "ADMIN";
    } else if (role === "ADMIN") {
      role = "STUDENT";
    }

    let stream = "All Streams";
    if (role === "STUDENT") {
      const streamRadios = document.getElementsByName("authStream");
      for (let s of streamRadios) {
        if (s.checked) stream = s.value;
      }
    }

    const newUser = {
      id: (role === "ADMIN" ? "admin_" : role === "TEACHER" ? "teacher_" : "student_") + Math.random().toString(36).substring(2, 7),
      fullName: fullName,
      email: email,
      role: role,
      stream: stream,
      spPoints: (role === "ADMIN" || role === "TEACHER" ? 500 : 50),
      isVerified: (role === "ADMIN" || role === "TEACHER")
    };

    STATE.users.push(newUser);
    STATE.currentUser = newUser;

    // Handle "Keep me signed in" preference for sign up
    const keepSignedIn = document.getElementById("authKeepSignedIn")?.checked;
    try {
      if (keepSignedIn) {
        localStorage.setItem("zsp_current_user", JSON.stringify(newUser));
      } else {
        localStorage.removeItem("zsp_current_user");
      }
    } catch (e) {}

    // Sync user to Firebase
    if (db) {
      try {
        db.ref("users/" + newUser.id).set(newUser);
      } catch (err) {
        console.warn("RTDB user sync note:", err);
      }
    }

    closeLoginModal();
    renderAuthHeader();
    renderHomeSubjects();
    renderChatMessages();
    renderLeaderboard();
    renderAdminUsers();
    showToast(`🎉 Account registered as ${role}! Enrolled stream: ${stream}`);
  }
}

function handleLogout() {
  closeUserDropdown();
  STATE.currentUser = null;
  try {
    localStorage.removeItem("zsp_current_user");
    sessionStorage.clear();
  } catch (e) {}
  renderAuthHeader();
  renderChatMessages();
  renderUserRedemptionHistory();
  renderHomeSubjects();
  navigateTo("home");
  showToast("You have been signed out of Zahira Science Portal.");
}

// ----------------------------------------------------
// PROFILE VIEW
// ----------------------------------------------------
function renderProfileView() {
  if (!STATE.currentUser) {
    openLoginModal();
    return;
  }

  const nameEl = document.getElementById("profileFullName");
  const avatarEl = document.getElementById("profileAvatar");
  const emailEl = document.getElementById("profileEmail");
  const roleBadge = document.getElementById("profileRoleBadge");
  const accountType = document.getElementById("profileAccountType");
  const streamEl = document.getElementById("profileStream");
  const spEl = document.getElementById("profileSpPoints");
  const milestoneEl = document.getElementById("profileMilestoneDisplay");

  if (nameEl) nameEl.innerText = STATE.currentUser.fullName;
  if (avatarEl) avatarEl.innerText = STATE.currentUser.fullName.charAt(0);
  if (emailEl) emailEl.innerText = STATE.currentUser.email;
  if (roleBadge) roleBadge.innerText = STATE.currentUser.role;
  if (accountType) accountType.innerText = STATE.currentUser.role === 'STUDENT' ? 'G.C.E. A/L Science Student' : 'Teacher / Administrator';
  if (streamEl) streamEl.innerText = STATE.currentUser.role === 'STUDENT' ? STATE.currentUser.stream : 'All Streams (Full Access)';
  if (spEl) spEl.innerText = `${STATE.currentUser.spPoints} SP`;

  const m = getMilestoneForSp(STATE.currentUser.spPoints);
  if (milestoneEl) milestoneEl.innerText = `${m.current.badge} Level ${m.current.level} ${m.current.name}`;
}

// ----------------------------------------------------
// HOME SUBJECTS (FILTERED ACCORDING TO STUDENT STREAM)
// ----------------------------------------------------
function renderHomeSubjects() {
  const container = document.getElementById("subjectCardsContainer");
  if (!container) return;

  const currentStream = (STATE.currentUser && STATE.currentUser.role === 'STUDENT') 
    ? STATE.currentUser.stream 
    : "All";

  // National syllabus subjects
  const allSubjects = [
    { name: "Combined Mathematics", stream: "Physical Science", units: "8 Units Covered", icon: "calculate", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { name: "Physics", stream: "Both", units: "8 Comprehensive Units (100 Q each)", icon: "bolt", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { name: "Chemistry", stream: "Both", units: "10 Units Covered", icon: "science", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { name: "Biology", stream: "Bio Science", units: "9 Units Covered", icon: "psychology", color: "bg-purple-50 text-purple-700 border-purple-200" }
  ];

  // Filter based on user's enrolled stream
  const filtered = allSubjects.filter(s => {
    if (currentStream === "All") return true;
    if (s.stream === "Both") return true;
    return s.stream === currentStream;
  });

  container.innerHTML = filtered.map(s => `
    <div class="p-4 rounded-xl border ${s.color} space-y-2 flex flex-col justify-between">
      <div>
        <div class="flex items-center space-x-2">
          <span class="material-symbols-outlined">${s.icon}</span>
          <h3 class="font-bold text-sm">${s.name}</h3>
        </div>
        <p class="text-xs opacity-80 mt-1">${s.units}</p>
        <span class="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-white/60">
          Stream: ${s.stream === 'Both' ? 'Physical & Bio' : s.stream}
        </span>
      </div>
      <button onclick="navigateTo('quiz')" class="text-[11px] font-bold underline hover:opacity-75 pt-2 text-left">
        Take Wednesday Quiz →
      </button>
    </div>
  `).join("");
}

// ----------------------------------------------------
// WEDNESDAY 8:00 PM – 10:00 PM COMPETITIVE QUIZ ENGINE
// ----------------------------------------------------
// Checks if current time is Wednesday between 20:00 (8 PM) and 22:00 (10 PM)
function isWednesdayQuizWindowOpen() {
  if (STATE.devWindowBypass) return true; // Simulated bypass mode

  const now = new Date();
  const day = now.getDay(); // 3 = Wednesday
  const hour = now.getHours();

  // Wednesday between 20 (8 PM) and 21 (up to 21:59:59)
  return (day === 3 && hour >= 20 && hour < 22);
}

function checkWednesdayQuizWindow() {
  const statusEl = document.getElementById("wednesdayWindowStatusText");
  const liveBadge = document.getElementById("quizWindowLiveBadge");
  const bypassBtn = document.getElementById("btnDevBypassWindow");

  const isOpen = isWednesdayQuizWindowOpen();

  if (isOpen) {
    if (statusEl) {
      statusEl.innerHTML = `<span class="text-emerald-600 font-extrabold flex items-center justify-end gap-1">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
        LIVE NOW (8:00 PM - 10:00 PM)
      </span>`;
    }
    if (liveBadge) {
      liveBadge.className = "px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1";
      liveBadge.innerHTML = `<span class="material-symbols-outlined text-[14px]">bolt</span><span>LIVE: Wednesday Examination Window Open!</span>`;
    }
  } else {
    if (statusEl) {
      statusEl.innerHTML = `<span class="text-slate-600">Opens Wednesday 8:00 PM</span>`;
    }
    if (liveBadge) {
      liveBadge.className = "px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center space-x-1";
      liveBadge.innerHTML = `<span class="material-symbols-outlined text-[14px]">schedule</span><span>Opens Wednesday 8:00 PM – 10:00 PM</span>`;
    }
  }

  if (bypassBtn) {
    bypassBtn.innerText = STATE.devWindowBypass ? "Disable Test Mode (Window Locked)" : "Simulate Window (Test Mode)";
  }
}

function toggleDevWindowBypass() {
  STATE.devWindowBypass = !STATE.devWindowBypass;
  checkWednesdayQuizWindow();
  showToast(STATE.devWindowBypass ? "Wednesday 8:00 PM – 10:00 PM Window Simulated for Testing!" : "Live Window constraint restored.");
}

// Render the All Units Grand Paper and 8 Units selector (Each has 100 questions)
function renderPhysicsUnitCards() {
  const container = document.getElementById("physicsUnitsGrid");
  if (!container || typeof PHYSICS_UNITS === "undefined") return;

  container.innerHTML = PHYSICS_UNITS.map(u => {
    const isSelected = String(STATE.selectedUnitId) === String(u.id);
    const isGrand = u.id === "all" || u.isGrand;

    if (isGrand) {
      return `
        <div onclick="selectPhysicsUnit('${u.id}')" id="unitCard_${u.id}" class="sm:col-span-2 lg:col-span-4 p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm ${isSelected ? 'border-maroon bg-gradient-to-r from-maroon/10 via-gold/10 to-amber-500/10 ring-2 ring-maroon/30' : 'border-gold/60 bg-gradient-to-r from-amber-500/5 to-white hover:border-gold'}">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-maroon text-gold">OFFICIAL NATIONAL PAPER</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">100 Questions (All 8 Units Mixed)</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Identical for All Students
              </span>
            </div>
            <h4 class="font-black text-sm text-slate-900">${u.name}</h4>
            <p class="text-xs text-slate-600">${u.desc}</p>
          </div>
          <div class="shrink-0 text-right">
            <span class="inline-block px-4 py-2 rounded-xl text-xs font-bold transition ${isSelected ? 'bg-maroon text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
              ${isSelected ? '✓ Selected Paper' : 'Select Grand Paper'}
            </span>
          </div>
        </div>
      `;
    }

    return `
      <div onclick="selectPhysicsUnit('${u.id}')" id="unitCard_${u.id}" class="p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${isSelected ? 'border-maroon bg-maroon/5 ring-2 ring-maroon/30' : 'border-slate-200 bg-white hover:border-slate-300'}">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-black uppercase text-maroon">Unit ${u.id}</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">100 Questions</span>
          </div>
          <h4 class="font-bold text-xs text-slate-900 mt-1">${u.name.replace(`Unit ${u.id}: `, '')}</h4>
          <p class="text-[11px] text-slate-500 line-clamp-2 mt-1">${u.desc}</p>
        </div>
        <div class="mt-2 text-right">
          <span class="text-[11px] font-bold ${isSelected ? 'text-maroon' : 'text-slate-400'}">
            ${isSelected ? '● Selected' : 'Select Unit'}
          </span>
        </div>
      </div>
    `;
  }).join("");
}

function selectPhysicsUnit(unitId) {
  STATE.selectedUnitId = unitId;
  renderPhysicsUnitCards();

  const unit = PHYSICS_UNITS.find(u => String(u.id) === String(unitId));
  const label = document.getElementById("selectedUnitLabel");
  if (label && unit) {
    label.innerText = `${unit.name} (100 Questions)`;
  }
}

function startSelectedUnitQuiz() {
  if (!STATE.currentUser) {
    showToast("Please sign in with your account to sit the Wednesday examination.");
    openLoginModal();
    return;
  }

  // Enforce Wednesday 8:00 PM – 10:00 PM examination window unless bypassed
  if (!isWednesdayQuizWindowOpen()) {
    showToast("⚠️ Examination Restricted: The Wednesday Main Quiz opens strictly from 8:00 PM to 10:00 PM every Wednesday night.");
    return;
  }

  const weeklySeed = (STATE.wednesdayConfig && STATE.wednesdayConfig.seed) ? STATE.wednesdayConfig.seed : 84920194;
  
  // Deterministically generate/shuffle 100 questions for this Wednesday using the weekly seed
  const questions = (typeof getSynchronizedWednesdayQuestions === "function")
    ? getSynchronizedWednesdayQuestions(STATE.selectedUnitId, weeklySeed)
    : (ALL_PHYSICS_QUESTIONS[STATE.selectedUnitId] || []);

  if (!questions || questions.length === 0) {
    showToast("Loading unit questions...");
    return;
  }

  const unit = PHYSICS_UNITS.find(u => String(u.id) === String(STATE.selectedUnitId)) || { name: `Unit ${STATE.selectedUnitId}` };

  STATE.activeQuiz = {
    unitId: STATE.selectedUnitId,
    unitTitle: unit.name,
    questions: questions,
    rewardSp: 100, // 100 SP for completing 100 questions
    paperCode: STATE.wednesdayConfig.paperCode || `WED-${weeklySeed}`,
    seed: weeklySeed
  };

  STATE.activeQuizQuestionIdx = 0;
  STATE.selectedAnswerIdx = null;
  STATE.activeQuizScore = 0;
  STATE.quizSecondsRemaining = 3600; // 60 minutes

  // Open active runner
  const runner = document.getElementById("activeQuizRunner");
  if (runner) runner.classList.remove("hidden");

  const runnerPaperEl = document.getElementById("quizRunnerPaperCode");
  if (runnerPaperEl) runnerPaperEl.innerText = STATE.activeQuiz.paperCode;

  renderCurrentPhysicsQuestion();
  startQuizTimer();
  runner.scrollIntoView({ behavior: "smooth" });
  showToast(`Exam Started: ${unit.name} (Synchronized Paper ${STATE.activeQuiz.paperCode})`);
}

function renderCurrentPhysicsQuestion() {
  const q = STATE.activeQuiz.questions[STATE.activeQuizQuestionIdx];
  const unit = PHYSICS_UNITS.find(u => u.id === STATE.activeQuiz.unitId);

  document.getElementById("quizSubjectTag").innerText = unit ? unit.name : "Physics";
  document.getElementById("quizCurrentTitle").innerText = `Question ${STATE.activeQuizQuestionIdx + 1} of 100`;
  document.getElementById("quizProgressCount").innerText = `${STATE.activeQuizQuestionIdx + 1} / 100`;
  document.getElementById("quizQuestionText").innerText = q.q;

  const container = document.getElementById("quizOptionsContainer");
  container.innerHTML = q.options.map((opt, i) => `
    <label class="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition">
      <input type="radio" name="activeQuizOption" value="${i}" onchange="STATE.selectedAnswerIdx = ${i}" class="text-maroon focus:ring-maroon" />
      <span class="text-xs sm:text-sm font-medium text-slate-800">${opt}</span>
    </label>
  `).join("");
}

function submitQuizAnswer() {
  if (STATE.selectedAnswerIdx === null) {
    showToast("Please select an answer choice before submitting.");
    return;
  }

  const currentQ = STATE.activeQuiz.questions[STATE.activeQuizQuestionIdx];
  if (STATE.selectedAnswerIdx === currentQ.correctIndex) {
    STATE.activeQuizScore++;
  }

  // Advance to next question or complete
  STATE.activeQuizQuestionIdx++;
  if (STATE.activeQuizQuestionIdx < STATE.activeQuiz.questions.length) {
    STATE.selectedAnswerIdx = null;
    renderCurrentPhysicsQuestion();
  } else {
    finishQuizAndAwardMilestones();
  }
}

function finishQuizAndAwardMilestones() {
  clearInterval(STATE.quizTimerInterval);

  const totalQ = STATE.activeQuiz.questions.length;
  const score = STATE.activeQuizScore;
  const earnedSp = Math.round((score / totalQ) * 100);

  // Award SP points
  STATE.currentUser.spPoints += earnedSp;

  // Check milestone level up
  const milestone = getMilestoneForSp(STATE.currentUser.spPoints);

  // Sync score and SP to Firebase
  if (db) {
    try {
      db.ref("quiz_submissions/" + Date.now()).set({
        userId: STATE.currentUser.id,
        userName: STATE.currentUser.fullName,
        unitId: STATE.activeQuiz.unitId,
        score: score,
        total: totalQ,
        earnedSp: earnedSp,
        timestamp: Date.now()
      });
      db.ref("users/" + STATE.currentUser.id + "/spPoints").set(STATE.currentUser.spPoints);
    } catch (e) {
      console.warn("RTDB quiz sync error:", e);
    }
  }

  renderAuthHeader();
  renderLeaderboard();
  renderMilestones();

  showToast(`🎉 Exam Completed! Score: ${score}/${totalQ}. You earned ${earnedSp} SP Points! Current Level: ${milestone.current.name}`);
  abandonQuiz();
}

function abandonQuiz() {
  clearInterval(STATE.quizTimerInterval);
  STATE.activeQuiz = null;
  const runner = document.getElementById("activeQuizRunner");
  if (runner) runner.classList.add("hidden");
}

function startQuizTimer() {
  clearInterval(STATE.quizTimerInterval);
  const timerDisplay = document.getElementById("quizTimerDisplay");

  STATE.quizTimerInterval = setInterval(() => {
    STATE.quizSecondsRemaining--;
    if (STATE.quizSecondsRemaining <= 0) {
      clearInterval(STATE.quizTimerInterval);
      showToast("⏱️ Time is up! Calculating examination score...");
      finishQuizAndAwardMilestones();
      return;
    }

    const mins = Math.floor(STATE.quizSecondsRemaining / 60);
    const secs = STATE.quizSecondsRemaining % 60;
    if (timerDisplay) {
      timerDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }, 1000);
}

// ----------------------------------------------------
// MILESTONE REWARDS & LEADERBOARD
// ----------------------------------------------------
function renderMilestones() {
  const container = document.getElementById("milestonesCardContainer");
  if (!container || typeof MILESTONE_LEVELS === "undefined") return;

  const userSp = STATE.currentUser ? STATE.currentUser.spPoints : 0;

  container.innerHTML = MILESTONE_LEVELS.map(m => {
    const isUnlocked = userSp >= m.spRequired;
    return `
      <div class="p-4 rounded-xl border ${isUnlocked ? 'border-gold bg-gold/5 shadow-sm' : 'border-slate-200 bg-slate-50 opacity-70'} flex flex-col justify-between space-y-2">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-2xl">${m.badge}</span>
            <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}">
              ${isUnlocked ? 'UNLOCKED' : 'LOCKED'}
            </span>
          </div>
          <h4 class="font-bold text-xs text-slate-900 mt-2">Level ${m.level}: ${m.name}</h4>
          <p class="text-[11px] text-slate-500 font-semibold">${m.spRequired} SP Required</p>
          <p class="text-[11px] text-slate-700 mt-1">${m.rewardTitle}</p>
        </div>
        <div class="pt-2 border-t border-slate-100">
          <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div class="bg-gold h-full" style="width: ${Math.min(100, Math.round((userSp / (m.spRequired || 1)) * 100))}%"></div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// User requested to REMOVE top 10 restriction in leaderboard, showing full ranking
function renderLeaderboard() {
  const tbody = document.getElementById("leaderboardTableBody");
  if (!tbody) return;

  const sorted = [...STATE.users].sort((a, b) => b.spPoints - a.spPoints);

  tbody.innerHTML = sorted.map((u, i) => {
    const milestone = getMilestoneForSp(u.spPoints);
    return `
      <tr class="hover:bg-slate-50 transition">
        <td class="p-3 font-bold text-slate-800">
          ${i === 0 ? "🥇 #1" : i === 1 ? "🥈 #2" : i === 2 ? "🥉 #3" : `#${i + 1}`}
        </td>
        <td class="p-3 font-semibold text-slate-900 flex items-center space-x-2">
          <span>${u.fullName}</span>
          ${STATE.currentUser && STATE.currentUser.id === u.id ? '<span class="text-[9px] bg-maroon text-white font-bold px-1.5 py-0.2 rounded">YOU</span>' : ''}
        </td>
        <td class="p-3 text-slate-600 text-xs">
          <span class="font-semibold text-slate-800">${u.role}</span>
          <span class="text-slate-400">• ${u.stream}</span>
        </td>
        <td class="p-3 text-xs font-bold text-slate-700">
          ${milestone.current.badge} Level ${milestone.current.level} (${milestone.current.name})
        </td>
        <td class="p-3 font-black text-gold-dark">${u.spPoints} SP</td>
        <td class="p-3 text-right">
          <span class="text-[10px] font-bold px-2 py-0.5 rounded ${u.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
            ${u.isVerified ? 'VERIFIED' : 'PENDING'}
          </span>
        </td>
      </tr>
    `;
  }).join("");
}

// ----------------------------------------------------
// REDEMPTION STORE (ADD / REMOVE ITEMS & REQUESTS)
// ----------------------------------------------------
function renderRedemptionItems() {
  const container = document.getElementById("redemptionItemsGrid");
  if (!container) return;

  container.innerHTML = STATE.redemptionItems.map(item => `
    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
      <div class="space-y-2">
        <div class="flex justify-between items-start">
          <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">${item.category}</span>
          <span class="text-xs text-slate-500 font-semibold">${item.stock} in stock</span>
        </div>
        <h3 class="font-bold text-slate-900 text-base leading-snug">${item.title}</h3>
        <p class="text-xs text-slate-600 leading-relaxed">${item.description}</p>
      </div>

      <div class="pt-3 border-t flex items-center justify-between">
        <div>
          <span class="text-[10px] uppercase font-bold text-slate-400">Required</span>
          <p class="text-base font-black text-amber-700">${item.spPrice} SP</p>
        </div>
        <button onclick="requestRedemption('${item.id}')" class="bg-maroon hover:bg-maroon-dark text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition">
          Redeem Reward
        </button>
      </div>
    </div>
  `).join("");
}

function requestRedemption(itemId) {
  if (!STATE.currentUser) {
    showToast("Please sign in with your student account to redeem rewards.");
    openLoginModal();
    return;
  }

  const item = STATE.redemptionItems.find(i => i.id === itemId);
  if (!item) return;

  if (STATE.currentUser.spPoints < item.spPrice) {
    showToast(`Insufficient SP! You need ${item.spPrice} SP, but have ${STATE.currentUser.spPoints} SP.`);
    return;
  }

  if (item.stock <= 0) {
    showToast("Item is currently out of stock. Please wait for administrator restock.");
    return;
  }

  // Deduct points and stock
  STATE.currentUser.spPoints -= item.spPrice;
  item.stock = Math.max(0, item.stock - 1);

  const newRedemption = {
    id: "red_" + Math.random().toString(36).substring(2, 9),
    userId: STATE.currentUser.id,
    userName: STATE.currentUser.fullName,
    userEmail: STATE.currentUser.email,
    userStream: STATE.currentUser.stream,
    itemId: item.id,
    itemTitle: item.title,
    spSpent: item.spPrice,
    timestamp: Date.now(),
    status: "Pending"
  };

  STATE.redemptions.unshift(newRedemption);

  // Sync to Firebase RTDB
  if (db) {
    try {
      db.ref("redemption_requests/" + newRedemption.id).set(newRedemption);
      db.ref("users/" + STATE.currentUser.id + "/spPoints").set(STATE.currentUser.spPoints);
      db.ref("store_items/" + item.id).set(item);
    } catch (e) {
      console.warn("RTDB sync error:", e);
    }
  }

  renderAuthHeader();
  renderRedemptionItems();
  renderUserRedemptionHistory();
  renderAdminRedemptions();
  renderAdminStoreInventory();
  updateBadgeCounts();

  showToast(`✅ Request for "${item.title}" submitted to Administration for collection!`);
}

function renderUserRedemptionHistory() {
  const container = document.getElementById("userRedemptionHistoryList");
  if (!container) return;

  if (!STATE.currentUser) {
    container.innerHTML = `<p class="text-xs text-slate-500 italic">Please sign in to view your redemption requests.</p>`;
    return;
  }

  const userReds = STATE.redemptions.filter(r => r.userId === STATE.currentUser.id);
  if (userReds.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-500 italic">You have not submitted any reward redemption requests yet.</p>`;
    return;
  }

  container.innerHTML = userReds.map(r => `
    <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
      <div>
        <p class="text-xs font-bold text-slate-900">${r.itemTitle}</p>
        <p class="text-[11px] text-slate-500">Requested: ${new Date(r.timestamp).toLocaleDateString()} • Spent: ${r.spSpent} SP</p>
      </div>
      <span class="text-xs font-bold px-3 py-1 rounded-full text-center ${getStatusBadgeClass(r.status)}">
        ${r.status}
      </span>
    </div>
  `).join("");
}

// ----------------------------------------------------
// STREAM-RESTRICTED CHAT DISCUSSIONS
// ----------------------------------------------------
function setupDiscussionViewPermissions() {
  const switcher = document.getElementById("chatAdminStreamSwitcher");
  const badge = document.getElementById("chatStreamBadge");
  const notice = document.getElementById("chatStreamNotice");
  const navLabel = document.getElementById("discussionsNavLabel");

  if (!STATE.currentUser) {
    if (switcher) switcher.classList.add("hidden");
    if (badge) badge.innerText = "Guest Mode (Sign In Required)";
    renderChatMessages();
    return;
  }

  // Teachers and Admins have access to BOTH streams
  if (STATE.currentUser.role === "ADMIN" || STATE.currentUser.role === "TEACHER") {
    if (switcher) switcher.classList.remove("hidden");
    if (badge) badge.innerText = `${STATE.activeChatStream} Channel (Moderator View)`;
    if (notice) notice.innerText = `You have staff access to view and communicate in both Physical Science and Bio Science streams.`;
    if (navLabel) navLabel.innerText = "Discussions (All-Access)";
  } else {
    // Student: Lock to their chosen stream only
    STATE.activeChatStream = STATE.currentUser.stream;
    if (switcher) switcher.classList.add("hidden");
    if (badge) badge.innerText = `${STATE.currentUser.stream} Channel`;
    if (notice) notice.innerText = `You are enrolled in ${STATE.currentUser.stream}. You can view and participate strictly in your stream discussions.`;
    if (navLabel) navLabel.innerText = `${STATE.currentUser.stream} Chat`;
  }

  renderChatMessages();
}

function switchChatStream(streamName) {
  STATE.activeChatStream = streamName;
  const btnPhys = document.getElementById("btnChatPhysical");
  const btnBio = document.getElementById("btnChatBio");

  if (streamName === "Physical Science") {
    if (btnPhys) btnPhys.className = "px-3 py-1 rounded-lg text-xs font-bold bg-maroon text-white";
    if (btnBio) btnBio.className = "px-3 py-1 rounded-lg text-xs font-bold bg-white text-slate-700";
  } else {
    if (btnPhys) btnPhys.className = "px-3 py-1 rounded-lg text-xs font-bold bg-white text-slate-700";
    if (btnBio) btnBio.className = "px-3 py-1 rounded-lg text-xs font-bold bg-maroon text-white";
  }

  setupDiscussionViewPermissions();
}

function renderChatMessages() {
  const box = document.getElementById("chatMessagesBox");
  if (!box) return;

  const currentUserId = STATE.currentUser ? STATE.currentUser.id : null;

  // Filter messages according to currently viewed stream
  const filtered = STATE.messages.filter(m => {
    if (!m.stream) return true; // Legacy message fallback
    return m.stream === STATE.activeChatStream;
  });

  if (filtered.length === 0) {
    box.innerHTML = `<div class="text-center py-12 text-xs text-slate-400">No messages yet in the ${STATE.activeChatStream} discussion room. Be the first to start a conversation!</div>`;
    return;
  }

  box.innerHTML = filtered.map(m => `
    <div class="flex items-start space-x-3 p-3 rounded-xl ${currentUserId && m.senderId === currentUserId ? 'bg-maroon/5 ml-8 border border-maroon/20' : 'bg-white mr-8 border border-slate-200 shadow-sm'}">
      <div class="w-8 h-8 rounded-full ${m.senderRole === 'ADMIN' ? 'bg-maroon text-gold' : m.senderRole === 'TEACHER' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'} font-bold flex items-center justify-center text-xs shrink-0">
        ${m.senderName.charAt(0)}
      </div>
      <div class="flex-1">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-xs font-bold text-slate-900">${m.senderName}</span>
            <span class="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${m.senderRole === 'ADMIN' ? 'bg-maroon text-white' : m.senderRole === 'TEACHER' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">${m.senderRole || 'STUDENT'}</span>
          </div>
          <span class="text-[10px] text-slate-400">${new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <p class="text-xs text-slate-700 mt-1 leading-relaxed">${m.content}</p>
      </div>
    </div>
  `).join("");

  box.scrollTop = box.scrollHeight;
}

function postChatMessage(e) {
  e.preventDefault();
  if (!STATE.currentUser) {
    showToast("Please sign in to participate in student discussions.");
    openLoginModal();
    return;
  }

  const input = document.getElementById("chatInputMessage");
  const text = input.value.trim();
  if (!text) return;

  const targetStream = (STATE.currentUser.role === 'ADMIN' || STATE.currentUser.role === 'TEACHER')
    ? STATE.activeChatStream
    : STATE.currentUser.stream;

  const newMsg = {
    id: "msg_" + Date.now(),
    stream: targetStream,
    senderId: STATE.currentUser.id,
    senderName: STATE.currentUser.fullName,
    senderRole: STATE.currentUser.role,
    content: text,
    timestamp: Date.now()
  };

  STATE.messages.push(newMsg);
  input.value = "";

  // Sync to Firebase Realtime Database
  if (db) {
    try {
      db.ref("discussions/" + newMsg.id).set(newMsg);
    } catch (e) {
      console.warn("RTDB discussion sync note:", e);
    }
  }

  renderChatMessages();
  renderAdminChatAudit();
}

// ----------------------------------------------------
// ADMINISTRATOR PANEL (USERS, STORE, REDEMPTIONS, CHAT)
// ----------------------------------------------------
function switchAdminTab(tabKey) {
  if (!requireAdmin()) {
    navigateTo("home");
    return;
  }

  STATE.adminSubTab = tabKey;
  document.querySelectorAll(".admin-subtab").forEach(btn => {
    btn.classList.remove("bg-maroon", "text-white");
    btn.classList.add("text-slate-600", "hover:bg-slate-100");
  });
  const activeBtn = document.getElementById("adminTab-" + tabKey);
  if (activeBtn) {
    activeBtn.classList.add("bg-maroon", "text-white");
    activeBtn.classList.remove("text-slate-600", "hover:bg-slate-100");
  }

  document.querySelectorAll(".admin-panel").forEach(p => p.classList.add("hidden"));
  const panel = document.getElementById("adminPanel-" + tabKey);
  if (panel) panel.classList.remove("hidden");

  if (tabKey === "quiz") {
    renderWednesdayPaperInfo();
  }
}

// 1. User Management & Permanent Account Deletion
function renderAdminUsers() {
  if (!isCurrentUserAdmin()) return;
  const tbody = document.getElementById("adminUsersTableBody");
  if (!tbody) return;

  const searchInput = document.getElementById("adminUserSearchInput");
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

  const filtered = STATE.users.filter(u => {
    if (!query) return true;
    return u.fullName.toLowerCase().includes(query) || u.email.toLowerCase().includes(query);
  });

  tbody.innerHTML = filtered.map(u => `
    <tr class="hover:bg-slate-50 transition">
      <td class="p-3 font-semibold text-slate-900">${u.fullName}</td>
      <td class="p-3 text-xs text-slate-500">${u.email}</td>
      <td class="p-3 text-xs font-bold">${u.role}</td>
      <td class="p-3 text-xs text-slate-600">${u.stream}</td>
      <td class="p-3 text-xs font-bold text-gold-dark">${u.spPoints} SP</td>
      <td class="p-3">
        <span class="text-[10px] font-bold px-2 py-0.5 rounded ${u.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}">
          ${u.isVerified ? 'VERIFIED' : 'PENDING'}
        </span>
      </td>
      <td class="p-3 text-right space-x-2 whitespace-nowrap">
        ${!u.isVerified ? `
          <button onclick="verifyUser('${u.id}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow">
            Verify
          </button>
        ` : ''}
        ${u.id !== 'admin_jasim' ? `
          <button onclick="adminDeleteUser('${u.id}')" class="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold shadow flex-inline items-center space-x-1">
            <span class="material-symbols-outlined text-[14px]">delete</span>
            <span>Delete</span>
          </button>
        ` : `
          <span class="text-xs text-slate-400 italic">Root Admin</span>
        `}
      </td>
    </tr>
  `).join("");
}

function verifyUser(userId) {
  if (!requireAdmin()) return;
  const u = STATE.users.find(user => user.id === userId);
  if (u) {
    u.isVerified = true;
    if (db) {
      try {
        db.ref("users/" + u.id + "/isVerified").set(true);
      } catch (e) {
        console.warn("RTDB verify user note:", e);
      }
    }
    renderAdminUsers();
    renderLeaderboard();
    updateBadgeCounts();
    showToast(`Verified account for ${u.fullName}!`);
  }
}

// Admin can permanently delete users
function adminDeleteUser(userId) {
  if (!requireAdmin()) return;
  const u = STATE.users.find(user => user.id === userId);
  if (!u) return;

  if (confirm(`Are you sure you want to permanently delete user "${u.fullName}" (${u.email})? This action cannot be undone.`)) {
    STATE.users = STATE.users.filter(user => user.id !== userId);

    // Sync deletion to Firebase
    if (db) {
      try {
        db.ref("users/" + userId).remove();
      } catch (e) {
        console.warn("RTDB remove user note:", e);
      }
    }

    renderAdminUsers();
    renderLeaderboard();
    updateBadgeCounts();
    showToast(`Deleted user ${u.fullName} from database.`);
  }
}

// 2. Redemption Store Inventory Management (Add & Remove Items)
function renderAdminStoreInventory() {
  if (!isCurrentUserAdmin()) return;
  const container = document.getElementById("adminStoreItemsList");
  if (!container) return;

  container.innerHTML = STATE.redemptionItems.map(item => `
    <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-start">
          <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">${item.category}</span>
          <span class="text-xs font-bold text-maroon">${item.spPrice} SP</span>
        </div>
        <h4 class="font-bold text-sm text-slate-900 mt-1">${item.title}</h4>
        <p class="text-xs text-slate-600 mt-1">${item.description}</p>
        <p class="text-[11px] text-slate-500 font-semibold mt-2">Available Stock: ${item.stock} units</p>
      </div>
      <div class="pt-2 border-t border-slate-200 flex justify-end">
        <button onclick="adminRemoveStoreItem('${item.id}')" class="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center space-x-1">
          <span class="material-symbols-outlined text-[16px]">delete</span>
          <span>Remove from Store</span>
        </button>
      </div>
    </div>
  `).join("");
}

function handleAdminAddStoreItem(e) {
  e.preventDefault();
  if (!requireAdmin()) return;

  const title = document.getElementById("newStoreTitle").value.trim();
  const category = document.getElementById("newStoreCategory").value;
  const spPrice = parseInt(document.getElementById("newStoreSpPrice").value, 10);
  const stock = parseInt(document.getElementById("newStoreStock").value, 10);
  const desc = document.getElementById("newStoreDesc").value.trim();

  if (!title || !desc || isNaN(spPrice) || isNaN(stock)) {
    showToast("Please complete all store item fields.");
    return;
  }

  const newItem = {
    id: "item_" + Date.now(),
    title: title,
    category: category,
    spPrice: spPrice,
    stock: stock,
    description: desc
  };

  STATE.redemptionItems.unshift(newItem);

  // Sync to Firebase
  if (db) {
    try {
      db.ref("store_items/" + newItem.id).set(newItem);
    } catch (e) {
      console.warn("RTDB store sync note:", e);
    }
  }

  // Clear form
  e.target.reset();

  renderRedemptionItems();
  renderAdminStoreInventory();
  showToast(`✅ Successfully added "${title}" to the Redemption Store!`);
}

function adminRemoveStoreItem(itemId) {
  if (!requireAdmin()) return;
  const item = STATE.redemptionItems.find(i => i.id === itemId);
  if (!item) return;

  if (confirm(`Remove "${item.title}" from the redemption store?`)) {
    STATE.redemptionItems = STATE.redemptionItems.filter(i => i.id !== itemId);

    // Sync removal to Firebase
    if (db) {
      try {
        db.ref("store_items/" + itemId).remove();
      } catch (e) {
        console.warn("RTDB remove item note:", e);
      }
    }

    renderRedemptionItems();
    renderAdminStoreInventory();
    showToast(`Removed "${item.title}" from store inventory.`);
  }
}

// 3. Redemption Requests Oversight
function setAdminRedemptionFilter(filter) {
  STATE.adminRedemptionFilter = filter;
  document.querySelectorAll(".admin-red-filter").forEach(b => {
    b.classList.remove("bg-maroon", "text-white");
    b.classList.add("bg-slate-100", "text-slate-700");
  });
  if (typeof event !== "undefined" && event && event.target) {
    event.target.classList.add("bg-maroon", "text-white");
    event.target.classList.remove("bg-slate-100", "text-slate-700");
  }
  renderAdminRedemptions();
}

function renderAdminRedemptions() {
  const container = document.getElementById("adminRedemptionsListContainer");
  if (!container) return;

  const totalEl = document.getElementById("adminStatTotalRequests");
  const pendingEl = document.getElementById("adminStatPendingRequests");
  const fulfilledEl = document.getElementById("adminStatFulfilledRequests");

  const total = STATE.redemptions.length;
  const pending = STATE.redemptions.filter(r => (r.status || "").toLowerCase() === "pending").length;
  const fulfilled = STATE.redemptions.filter(r => (r.status || "").toLowerCase() === "fulfilled").length;

  if (totalEl) totalEl.innerText = total;
  if (pendingEl) pendingEl.innerText = pending;
  if (fulfilledEl) fulfilledEl.innerText = fulfilled;

  const searchInput = document.getElementById("adminRedemptionSearchInput");
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

  const filterLower = (STATE.adminRedemptionFilter || "All").toLowerCase();

  const filtered = STATE.redemptions.filter(r => {
    const statusLower = (r.status || "").toLowerCase();
    let matchesFilter = (filterLower === "all");
    if (!matchesFilter) {
      if (filterLower === "rejected" || filterLower === "cancelled") {
        matchesFilter = (statusLower === "rejected" || statusLower === "cancelled");
      } else {
        matchesFilter = (statusLower === filterLower);
      }
    }
    const matchesQuery = !query ||
      (r.userName && r.userName.toLowerCase().includes(query)) ||
      (r.itemTitle && r.itemTitle.toLowerCase().includes(query)) ||
      (r.userEmail && r.userEmail.toLowerCase().includes(query));
    return matchesFilter && matchesQuery;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-xs text-slate-400">No student redemption requests found for this filter.</div>`;
    return;
  }

  container.innerHTML = filtered.map(r => {
    const targetId = r.id || r.firebaseKey;
    const statusLower = (r.status || "pending").toLowerCase();
    const isCompleted = (statusLower === "fulfilled");
    const isCancelled = (statusLower === "cancelled" || statusLower === "rejected");
    const isActive = !isCompleted && !isCancelled;

    return `
      <div class="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-sm">
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-bold text-sm text-slate-900">${r.userName || 'Student'}</h4>
            <p class="text-xs text-slate-500">${r.userEmail || ''} • Stream: <strong>${r.userStream || 'Physical Science'}</strong></p>
          </div>
          <span class="text-xs font-bold px-2.5 py-1 rounded-full ${getStatusBadgeClass(r.status)}">
            ${isCancelled ? 'Cancelled & Refunded' : isCompleted ? 'Handed Over' : r.status || 'Pending'}
          </span>
        </div>

        <div class="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
          <div>
            <p class="font-semibold text-xs text-slate-800">${r.itemTitle || 'Reward Item'}</p>
            <p class="text-[11px] text-slate-500">${r.timestamp ? new Date(r.timestamp).toLocaleString() : 'Recent'}</p>
          </div>
          <span class="font-black text-amber-700 text-sm">${r.spSpent || 0} SP</span>
        </div>

        <div class="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
          ${isActive ? `
            ${statusLower === "pending" ? `
              <button type="button" onclick="updateRedemptionStatus('${targetId}', 'Approved')" class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center space-x-1 transition">
                <span class="material-symbols-outlined text-[15px]">done</span>
                <span>Approve</span>
              </button>
            ` : ''}
            <button type="button" onclick="updateRedemptionStatus('${targetId}', 'Fulfilled')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center space-x-1 transition">
              <span class="material-symbols-outlined text-[15px]">inventory_2</span>
              <span>Mark Handed Over</span>
            </button>
            <button type="button" onclick="updateRedemptionStatus('${targetId}', 'Cancelled')" class="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center space-x-1 transition">
              <span class="material-symbols-outlined text-[15px]">cancel</span>
              <span>Cancel & Refund</span>
            </button>
          ` : isCompleted ? `
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center space-x-1">
                <span class="material-symbols-outlined text-[15px]">check_circle</span>
                <span>Handed Over & Completed</span>
              </span>
              <button type="button" onclick="updateRedemptionStatus('${targetId}', 'Cancelled')" class="px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:text-red-600 hover:border-red-300 text-xs font-semibold transition" title="Reverse and refund SP to student">
                Cancel & Refund
              </button>
            </div>
          ` : `
            <span class="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 flex items-center space-x-1">
              <span class="material-symbols-outlined text-[15px]">block</span>
              <span>Cancelled & Refunded (${r.spSpent || 0} SP)</span>
            </span>
          `}
        </div>
      </div>
    `;
  }).join("");
}

function updateRedemptionStatus(redemptionId, newStatus) {
  if (!requireAdmin()) return;

  const red = STATE.redemptions.find(r => r.id === redemptionId || r.firebaseKey === redemptionId);
  if (!red) {
    showToast("⚠️ Redemption request record not found.");
    return;
  }

  const prevStatus = (red.status || "").toLowerCase();
  const isCancelOrReject = (newStatus.toLowerCase() === "cancelled" || newStatus.toLowerCase() === "rejected");
  const wasAlreadyRefunded = (prevStatus === "cancelled" || prevStatus === "rejected");

  // If cancelling/refunding and not previously refunded, restore Science Points to the student
  if (isCancelOrReject && !wasAlreadyRefunded) {
    const refundSp = Number(red.spSpent) || 0;

    // Find user in STATE.users
    let user = STATE.users.find(u => (red.userId && u.id === red.userId) || (red.userEmail && u.email && u.email.toLowerCase() === red.userEmail.toLowerCase()));
    if (user) {
      user.spPoints = (Number(user.spPoints) || 0) + refundSp;
    }

    if (STATE.currentUser && ((red.userId && STATE.currentUser.id === red.userId) || (red.userEmail && STATE.currentUser.email && STATE.currentUser.email.toLowerCase() === red.userEmail.toLowerCase()))) {
      STATE.currentUser.spPoints = (Number(STATE.currentUser.spPoints) || 0) + refundSp;
    }

    // Sync refund to Firebase RTDB
    if (db && red.userId) {
      try {
        const targetUserId = user ? user.id : red.userId;
        const finalSp = user ? user.spPoints : refundSp;
        db.ref("users/" + targetUserId + "/spPoints").set(finalSp);
      } catch (err) {
        console.warn("RTDB refund SP error:", err);
      }
    }
  }

  red.status = newStatus;

  // Sync to Firebase RTDB
  if (db) {
    const targetKey = red.firebaseKey || red.id;
    try {
      db.ref("redemption_requests/" + targetKey).update({
        status: newStatus,
        updatedAt: Date.now()
      });
    } catch (e) {
      console.warn("RTDB update error:", e);
    }
  }

  renderAuthHeader();
  renderAdminRedemptions();
  renderUserRedemptionHistory();
  renderLeaderboard();
  updateBadgeCounts();

  if (isCancelOrReject) {
    showToast(`↩️ Cancelled request for "${red.userName}" and refunded ${red.spSpent} SP.`);
  } else if (newStatus === "Fulfilled") {
    showToast(`🎁 Reward for "${red.userName}" marked as Handed Over!`);
  } else {
    showToast(`✅ Updated request for "${red.userName}" to ${newStatus}.`);
  }
}

// 4. Chat Moderation across Both Streams
function renderAdminChatAudit() {
  if (!isCurrentUserAdmin()) return;
  const box = document.getElementById("adminChatAuditBox");
  if (!box) return;

  box.innerHTML = STATE.messages.map(m => `
    <div class="flex justify-between items-center p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">
      <div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-bold text-slate-900">${m.senderName}</span>
          <span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-maroon/10 text-maroon">${m.stream || 'All'}</span>
          <span class="text-[10px] text-slate-400">${new Date(m.timestamp).toLocaleTimeString()}</span>
        </div>
        <p class="text-xs text-slate-700 mt-0.5">"${m.content}"</p>
      </div>
      <button onclick="adminDeleteChatMessage('${m.id}')" class="text-red-600 hover:text-red-800 p-1.5 text-xs rounded-lg hover:bg-red-50" title="Delete message">
        <span class="material-symbols-outlined text-[18px]">delete</span>
      </button>
    </div>
  `).join("");
}

function adminDeleteChatMessage(msgId) {
  if (!requireAdmin()) return;
  STATE.messages = STATE.messages.filter(m => m.id !== msgId);
  if (db) {
    try {
      db.ref("discussions/" + msgId).remove();
    } catch (e) {
      console.warn("RTDB delete message note:", e);
    }
  }
  renderChatMessages();
  renderAdminChatAudit();
  showToast("Message deleted by Administrator.");
}

// ----------------------------------------------------
// FIREBASE REALTIME DATABASE SYNC
// ----------------------------------------------------
const REMOVED_MOCK_EMAILS = [
  "k.perera@zahira.lk",
  "ahamad.rizvi@zahira.lk",
  "sara.fathima@zahira.lk",
  "nifras.mr@zahira.lk",
  "aisha.m@zahira.lk"
];
const REMOVED_MOCK_IDS = [
  "teacher_perera",
  "student_ahamad",
  "student_sara",
  "student_nifras",
  "student_aisha"
];

function setupFirebaseRealtime() {
  if (!db) return;

  const statusEl = document.getElementById("firebaseConnectionStatus");
  if (statusEl) statusEl.innerText = "Firebase Cloud Connected";

  try {
    // Listen for users (excluding the removed mock demo accounts)
    db.ref("users").on("value", snapshot => {
      const data = snapshot.val();
      if (data) {
        const cloudUsers = Object.values(data).filter(u => {
          if (!u) return false;
          const emailLower = (u.email || "").toLowerCase();
          return !REMOVED_MOCK_EMAILS.includes(emailLower) && !REMOVED_MOCK_IDS.includes(u.id);
        });
        cloudUsers.forEach(cu => {
          const idx = STATE.users.findIndex(u => u.id === cu.id || (u.email && cu.email && u.email.toLowerCase() === cu.email.toLowerCase()));
          if (idx >= 0) {
            STATE.users[idx] = cu;
          } else {
            STATE.users.push(cu);
          }
        });
        // Also remove mock demo accounts from Firebase RTDB to keep cloud database pristine
        REMOVED_MOCK_IDS.forEach(mid => {
          try { db.ref("users/" + mid).remove(); } catch(e) {}
        });
        renderLeaderboard();
        renderAdminUsers();
      }
    });

    // Listen for discussions
    db.ref("discussions").on("value", snapshot => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data).filter(m => {
          if (!m) return false;
          return !REMOVED_MOCK_IDS.includes(m.senderId);
        });
        if (list.length > 0) {
          STATE.messages = list;
        }
        renderChatMessages();
        renderAdminChatAudit();
      }
    });

    // Listen for store items
    db.ref("store_items").on("value", snapshot => {
      const data = snapshot.val();
      if (data) {
        STATE.redemptionItems = Object.values(data);
        renderRedemptionItems();
        renderAdminStoreInventory();
      }
    });

    // Listen for redemptions
    db.ref("redemption_requests").on("value", snapshot => {
      const list = [];
      snapshot.forEach(child => {
        const val = child.val();
        if (val) {
          list.push({
            ...val,
            id: val.id || child.key,
            firebaseKey: child.key
          });
        }
      });
      STATE.redemptions = list;
      renderAdminRedemptions();
      renderUserRedemptionHistory();
      updateBadgeCounts();
    });

    // Listen for Wednesday Exam Synchronized Configuration
    db.ref("wednesday_quiz_config").on("value", snapshot => {
      const data = snapshot.val();
      if (data && data.seed) {
        STATE.wednesdayConfig = data;
        renderWednesdayPaperInfo();
      } else {
        // If not present in cloud yet, initialize cloud with current calculated seed
        try {
          db.ref("wednesday_quiz_config").set(STATE.wednesdayConfig);
        } catch (err) {
          console.warn("RTDB wednesday_quiz_config set note:", err);
        }
      }
    });

  } catch (e) {
    console.warn("RTDB listeners active in fallback mode:", e);
  }
}

// ----------------------------------------------------
// WEDNESDAY SYNCHRONIZED EXAM ENGINE & ADMIN CONTROLS
// ----------------------------------------------------
function renderWednesdayPaperInfo() {
  const cfg = STATE.wednesdayConfig;
  if (!cfg) return;

  // Student Examination View Indicators
  const codeDisplay = document.getElementById("wednesdayPaperCodeDisplay");
  if (codeDisplay) codeDisplay.innerText = cfg.paperCode || "WED-20260916";

  const seedDisplay = document.getElementById("wednesdaySeedDisplay");
  if (seedDisplay) seedDisplay.innerText = `#${cfg.seed || "84920194"}`;

  // Admin Panel Indicators
  const adminDate = document.getElementById("adminCurrentWedDate");
  if (adminDate) adminDate.innerText = cfg.formattedDate || cfg.dateString || "Wednesday, Sep 16, 2026";

  const adminCode = document.getElementById("adminCurrentPaperCode");
  if (adminCode) adminCode.innerText = cfg.paperCode || "WED-20260916";

  const adminSeed = document.getElementById("adminCurrentSeed");
  if (adminSeed) adminSeed.innerText = `#${cfg.seed || "84920194"}`;

  renderAdminQuestionInspection();
}

function adminForceReseedQuiz() {
  if (!requireAdmin()) return;

  const newSeed = Math.floor(Math.random() * 89999999) + 10000000;
  const currentInfo = (typeof getActiveWednesdayInfo === "function")
    ? getActiveWednesdayInfo(STATE.adminSimulatedWednesdayDate)
    : { dateString: "2026-09-16", paperCode: "WED-20260916", formattedDate: "Wednesday, Sep 16, 2026" };

  STATE.wednesdayConfig = {
    dateString: currentInfo.dateString,
    paperCode: `${currentInfo.paperCode}-R${String(newSeed).slice(-4)}`,
    seed: newSeed,
    formattedDate: currentInfo.formattedDate,
    updatedAt: Date.now(),
    updatedBy: STATE.currentUser ? STATE.currentUser.fullName : "Administrator"
  };

  // Broadcast through Firebase Realtime Database so all connected student devices receive the new seed instantly
  if (db) {
    try {
      db.ref("wednesday_quiz_config").set(STATE.wednesdayConfig);
    } catch (e) {
      console.warn("RTDB quiz seed sync:", e);
    }
  }

  renderWednesdayPaperInfo();
  showToast(`Exam Reseeded! Paper Code: ${STATE.wednesdayConfig.paperCode} (Seed: #${newSeed})`);
}

function adminAdvanceNextWednesday() {
  if (!requireAdmin()) return;

  const baseDate = STATE.adminSimulatedWednesdayDate ? new Date(STATE.adminSimulatedWednesdayDate) : new Date();
  baseDate.setDate(baseDate.getDate() + 7);
  STATE.adminSimulatedWednesdayDate = baseDate;

  const newInfo = (typeof getActiveWednesdayInfo === "function")
    ? getActiveWednesdayInfo(baseDate)
    : { dateString: "2026-09-23", paperCode: "WED-20260923", seed: 94819201, formattedDate: "Wednesday, Sep 23, 2026" };

  STATE.wednesdayConfig = {
    ...newInfo,
    updatedAt: Date.now(),
    updatedBy: STATE.currentUser ? STATE.currentUser.fullName : "Administrator"
  };

  if (db) {
    try {
      db.ref("wednesday_quiz_config").set(STATE.wednesdayConfig);
    } catch (e) {
      console.warn("RTDB quiz seed sync:", e);
    }
  }

  renderWednesdayPaperInfo();
  showToast(`Simulating Next Wednesday: ${newInfo.formattedDate} (Paper: ${newInfo.paperCode})`);
}

function adminResetCalendarWednesday() {
  if (!requireAdmin()) return;

  STATE.adminSimulatedWednesdayDate = null;
  const newInfo = (typeof getActiveWednesdayInfo === "function")
    ? getActiveWednesdayInfo()
    : { dateString: "2026-09-16", paperCode: "WED-20260916", seed: 84920194, formattedDate: "Wednesday, Sep 16, 2026" };

  STATE.wednesdayConfig = {
    ...newInfo,
    updatedAt: Date.now(),
    updatedBy: "System Calendar"
  };

  if (db) {
    try {
      db.ref("wednesday_quiz_config").set(STATE.wednesdayConfig);
    } catch (e) {
      console.warn("RTDB quiz seed sync:", e);
    }
  }

  renderWednesdayPaperInfo();
  showToast(`Restored to Official Calendar Wednesday: ${newInfo.formattedDate}`);
}

function renderAdminQuestionInspection() {
  const select = document.getElementById("adminInspectUnitSelect");
  const container = document.getElementById("adminQuestionInspectorList");
  if (!container) return;

  const unitId = select ? select.value : "all";
  const seed = (STATE.wednesdayConfig && STATE.wednesdayConfig.seed) ? STATE.wednesdayConfig.seed : 84920194;

  const sampleQuestions = (typeof getSynchronizedWednesdayQuestions === "function")
    ? getSynchronizedWednesdayQuestions(unitId, seed).slice(0, 5)
    : [];

  if (sampleQuestions.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-400 italic">No questions found for selection.</p>`;
    return;
  }

  container.innerHTML = sampleQuestions.map((q, i) => `
    <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
      <div class="flex items-center justify-between">
        <span class="font-bold text-maroon">Exam Question #${i + 1} (${q.paperCode || STATE.wednesdayConfig.paperCode})</span>
        <span class="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          ● Locked for All Students
        </span>
      </div>
      <p class="font-semibold text-slate-900">${q.q}</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
        ${q.options.map((opt, optIdx) => `
          <div class="p-2 rounded-lg border ${optIdx === q.correctIndex ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-700'}">
            <span class="font-mono text-[10px] mr-1">${['A','B','C','D'][optIdx]}:</span> ${opt}
            ${optIdx === q.correctIndex ? ' <span class="text-[10px] text-emerald-600 font-extrabold ml-1">✓ (Correct Answer)</span>' : ''}
          </div>
        `).join("")}
      </div>
      <p class="text-[11px] text-slate-500 italic mt-0.5">Scheme/Explanation: ${q.explanation}</p>
    </div>
  `).join("");
}

// ----------------------------------------------------
// UI UTILITIES
// ----------------------------------------------------
function updateBadgeCounts() {
  const pendingRedemptions = STATE.redemptions.filter(r => r.status.toLowerCase() === "pending").length;
  const pendingUsers = STATE.users.filter(u => !u.isVerified).length;

  const navBadge = document.getElementById("navPendingBadge");
  if (navBadge) {
    navBadge.innerText = pendingRedemptions + pendingUsers;
    navBadge.classList.toggle("hidden", (pendingRedemptions + pendingUsers) === 0);
  }

  const adminRedBadge = document.getElementById("adminPendingRedemptionsCount");
  if (adminRedBadge) adminRedBadge.innerText = pendingRedemptions;

  const adminUserBadge = document.getElementById("adminPendingUsersCount");
  if (adminUserBadge) adminUserBadge.innerText = pendingUsers;
}

function getStatusBadgeClass(status) {
  switch ((status || "").toLowerCase()) {
    case "approved":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "fulfilled":
      return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    case "rejected":
    case "cancelled":
      return "bg-red-100 text-red-800 border border-red-200";
    default:
      return "bg-amber-100 text-amber-800 border border-amber-200";
  }
}

function showToast(message) {
  const toast = document.getElementById("toastNotification");
  const msgEl = document.getElementById("toastMessage");
  if (!toast || !msgEl) return;

  msgEl.innerText = message;
  toast.classList.remove("hidden", "translate-y-2");
  setTimeout(() => {
    toast.classList.add("hidden", "translate-y-2");
  }, 4000);
}
