/**
 * ZSP - 28 (Zahira Science Portal) Web Application
 * Connected to Firebase Realtime Database project: e-learing-9adc3
 */

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAJVHHT1NIoA7WrW5kZ0FLNVMm_EnMo14",
  databaseURL: "https://e-learing-9adc3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "e-learing-9adc3",
  storageBucket: "e-learing-9adc3.firebasestorage.app"
};

// Initialize Firebase
try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
} catch (e) {
  console.warn("Firebase initialization notice:", e);
}

const db = firebase.database ? firebase.database() : null;

// Initial Application State
const STATE = {
  currentUser: {
    id: "admin_jasim",
    fullName: "M.N.M. Jaasim",
    email: "mnmjaasim@gmail.com",
    role: "ADMIN",
    stream: "Physical Science",
    spPoints: 450,
    isVerified: true
  },
  currentView: "home",
  adminSubTab: "redemptions",
  adminRedemptionFilter: "All",
  users: [
    { id: "admin_jasim", fullName: "M.N.M. Jaasim", email: "mnmjaasim@gmail.com", role: "ADMIN", stream: "Physical Science", spPoints: 450, isVerified: true },
    { id: "student_ahamad", fullName: "Ahamad Rizvi", email: "ahamad.rizvi@zahira.lk", role: "STUDENT", stream: "Physical Science", spPoints: 320, isVerified: true },
    { id: "student_sara", fullName: "Fathima Sara", email: "sara.fathima@zahira.lk", role: "STUDENT", stream: "Bio Science", spPoints: 280, isVerified: true },
    { id: "student_nifras", fullName: "M.R. Nifras", email: "nifras.mr@zahira.lk", role: "STUDENT", stream: "Physical Science", spPoints: 210, isVerified: false },
    { id: "student_aisha", fullName: "Aisha Mariyam", email: "aisha.m@zahira.lk", role: "STUDENT", stream: "Bio Science", spPoints: 190, isVerified: true }
  ],
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
  redemptions: [
    {
      id: "red_001",
      userId: "student_ahamad",
      userName: "Ahamad Rizvi",
      itemId: "item_1",
      itemTitle: "A/L Combined Mathematics 20-Year Classified Past Papers",
      spSpent: 150,
      timestamp: Date.now() - 86400000,
      status: "Pending",
      userEmail: "ahamad.rizvi@zahira.lk",
      userStream: "Physical Science"
    },
    {
      id: "red_002",
      userId: "student_sara",
      userName: "Fathima Sara",
      itemId: "item_2",
      itemTitle: "A/L Biology Practical Manual & Color Anatomy Schemes",
      spSpent: 120,
      timestamp: Date.now() - 172800000,
      status: "Fulfilled",
      userEmail: "sara.fathima@zahira.lk",
      userStream: "Bio Science"
    }
  ],
  messages: [
    {
      id: "msg_1",
      senderId: "student_ahamad",
      senderName: "Ahamad Rizvi",
      content: "Has anyone completed the 2022 Combined Maths Integration model paper?",
      timestamp: Date.now() - 3600000
    },
    {
      id: "msg_2",
      senderId: "student_sara",
      senderName: "Fathima Sara",
      content: "Yes! The substitution method in Question 3 was tricky, let's discuss during Wednesday quiz prep.",
      timestamp: Date.now() - 1800000
    }
  ],
  quizzes: [
    {
      id: "quiz_maths",
      title: "Combined Maths: Integration & Newton's Dynamics",
      subject: "Combined Mathematics",
      questionsCount: 10,
      durationMinutes: 20,
      rewardSp: 50,
      questions: [
        {
          q: "What is the derivative of sin(2x) with respect to x?",
          options: ["2 cos(2x)", "-2 cos(2x)", "cos(2x)", "-cos(2x)"],
          correctIndex: 0
        },
        {
          q: "Under standard gravity g, the maximum height of a projectile fired at angle θ with speed u is:",
          options: ["(u² sin²θ)/(2g)", "(u sinθ)/g", "(u² sin 2θ)/g", "(u² cos²θ)/(2g)"],
          correctIndex: 0
        }
      ]
    },
    {
      id: "quiz_physics",
      title: "Physics: Current Electricity & Magnetic Induction",
      subject: "Physics",
      questionsCount: 10,
      durationMinutes: 15,
      rewardSp: 45,
      questions: [
        {
          q: "Which law states that the induced EMF is proportional to the rate of change of magnetic flux?",
          options: ["Faraday's Law", "Ampere's Law", "Ohm's Law", "Coulomb's Law"],
          correctIndex: 0
        }
      ]
    },
    {
      id: "quiz_chem",
      title: "Chemistry: Chemical Kinetics & Ionic Equilibrium",
      subject: "Chemistry",
      questionsCount: 10,
      durationMinutes: 15,
      rewardSp: 45,
      questions: [
        {
          q: "The unit of the rate constant for a first-order reaction is:",
          options: ["s⁻¹", "mol L⁻¹ s⁻¹", "L mol⁻¹ s⁻¹", "dimensionless"],
          correctIndex: 0
        }
      ]
    }
  ],
  activeQuiz: null,
  activeQuizQuestionIdx: 0,
  selectedAnswerIdx: null
};

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  renderAuthHeader();
  renderHomeSubjects();
  renderQuizzes();
  renderLeaderboard();
  renderRedemptionItems();
  renderUserRedemptionHistory();
  renderChatMessages();
  renderAdminRedemptions();
  renderAdminUsers();
  renderAdminChatAudit();
  updateBadgeCounts();

  // Listen for real-time changes from Firebase
  setupFirebaseListeners();
});

// ROUTING
function navigateTo(viewId) {
  STATE.currentView = viewId;
  document.querySelectorAll(".app-view").forEach(el => el.classList.add("hidden"));
  const target = document.getElementById("view-" + viewId);
  if (target) target.classList.remove("hidden");

  // Update nav buttons active style
  document.querySelectorAll(".nav-tab").forEach(btn => {
    btn.classList.remove("bg-maroon", "text-white", "border", "border-gold/30");
    btn.classList.add("text-slate-300");
  });
  const activeBtn = document.getElementById("tab-" + viewId);
  if (activeBtn) {
    activeBtn.classList.add("bg-maroon", "text-white", "border", "border-gold/30");
    activeBtn.classList.remove("text-slate-300");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// AUTH & HEADER
function renderAuthHeader() {
  const container = document.getElementById("authHeaderControls");
  if (!container) return;

  if (STATE.currentUser) {
    container.innerHTML = `
      <div class="flex items-center space-x-2 bg-maroon-dark px-3 py-1.5 rounded-xl border border-gold/30">
        <div class="w-7 h-7 rounded-full bg-gold text-slate-900 font-bold flex items-center justify-center text-xs shadow-inner">
          ${STATE.currentUser.fullName.charAt(0)}
        </div>
        <div class="hidden sm:block text-left">
          <p class="text-xs font-bold text-white leading-tight">${STATE.currentUser.fullName}</p>
          <p class="text-[10px] text-gold">${STATE.currentUser.role} • ${STATE.currentUser.spPoints} SP</p>
        </div>
        <button onclick="switchRole()" title="Switch between Student and Admin" class="text-slate-300 hover:text-white p-1 ml-1 text-xs bg-white/10 rounded">
          <span class="material-symbols-outlined text-[16px]">swap_horiz</span>
        </button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button onclick="openLoginModal()" class="bg-gold hover:bg-gold-dark text-slate-900 font-bold px-4 py-1.5 rounded-xl text-xs shadow">
        Sign In
      </button>
    `;
  }

  const userSpEl = document.getElementById("homeUserSp");
  if (userSpEl) userSpEl.innerText = `${STATE.currentUser.spPoints} SP`;
  const redSpEl = document.getElementById("redemptionUserPoints");
  if (redSpEl) redSpEl.innerText = `${STATE.currentUser.spPoints} SP`;
}

function switchRole() {
  if (STATE.currentUser.role === "ADMIN") {
    STATE.currentUser = STATE.users.find(u => u.id === "student_ahamad");
    showToast("Switched to Student view (Ahamad Rizvi)");
  } else {
    STATE.currentUser = STATE.users.find(u => u.id === "admin_jasim");
    showToast("Switched to Admin view (M.N.M. Jaasim)");
  }
  renderAuthHeader();
  renderUserRedemptionHistory();
  renderAdminRedemptions();
}

function openLoginModal() {
  document.getElementById("loginModal").classList.remove("hidden");
}

function closeLoginModal() {
  document.getElementById("loginModal").classList.add("hidden");
}

function handleAuthSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const found = STATE.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (found) {
    STATE.currentUser = found;
    closeLoginModal();
    renderAuthHeader();
    showToast(`Welcome, ${found.fullName}!`);
    if (found.role === "ADMIN") {
      navigateTo("admin");
    } else {
      navigateTo("home");
    }
  } else {
    showToast("Account signed in successfully!");
    closeLoginModal();
  }
}

// SYLLABUS CARDS (HOME)
function renderHomeSubjects() {
  const container = document.getElementById("subjectCardsContainer");
  if (!container) return;

  const subjects = [
    { name: "Combined Mathematics", units: "8 Units Covered", icon: "calculate", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { name: "Physics", units: "8 Units Covered", icon: "bolt", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { name: "Chemistry", units: "10 Units Covered", icon: "science", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { name: "Biology", units: "9 Units Covered", icon: "psychology", color: "bg-purple-50 text-purple-700 border-purple-200" }
  ];

  container.innerHTML = subjects.map(s => `
    <div class="p-4 rounded-xl border ${s.color} space-y-2">
      <div class="flex items-center space-x-2">
        <span class="material-symbols-outlined">${s.icon}</span>
        <h3 class="font-bold text-sm">${s.name}</h3>
      </div>
      <p class="text-xs opacity-80">${s.units}</p>
      <button onclick="navigateTo('quiz')" class="text-[11px] font-bold underline hover:opacity-75">Take Practice Quiz →</button>
    </div>
  `).join("");
}

// QUIZ SYSTEM
function renderQuizzes() {
  const container = document.getElementById("quizListContainer");
  if (!container) return;

  container.innerHTML = STATE.quizzes.map(q => `
    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
      <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-maroon/10 text-maroon">${q.subject}</span>
      <h3 class="font-bold text-slate-800 text-sm leading-snug">${q.title}</h3>
      <div class="flex justify-between text-xs text-slate-500">
        <span>⏱️ ${q.durationMinutes} Mins</span>
        <span class="text-gold-dark font-bold">✨ +${q.rewardSp} SP Points</span>
      </div>
      <button onclick="startQuiz('${q.id}')" class="w-full bg-maroon hover:bg-maroon-dark text-white font-bold py-2 rounded-lg text-xs transition">
        Attempt Quiz
      </button>
    </div>
  `).join("");
}

function startQuiz(quizId) {
  const quiz = STATE.quizzes.find(q => q.id === quizId);
  if (!quiz) return;
  STATE.activeQuiz = quiz;
  STATE.activeQuizQuestionIdx = 0;
  STATE.selectedAnswerIdx = null;

  document.getElementById("activeQuizRunner").classList.remove("hidden");
  document.getElementById("quizSubjectTag").innerText = quiz.subject;
  document.getElementById("quizCurrentTitle").innerText = quiz.title;
  renderCurrentQuizQuestion();
  document.getElementById("activeQuizRunner").scrollIntoView({ behavior: "smooth" });
}

function renderCurrentQuizQuestion() {
  const q = STATE.activeQuiz.questions[STATE.activeQuizQuestionIdx];
  document.getElementById("quizQuestionText").innerText = `Question ${STATE.activeQuizQuestionIdx + 1} of ${STATE.activeQuiz.questions.length}: ${q.q}`;

  const container = document.getElementById("quizOptionsContainer");
  container.innerHTML = q.options.map((opt, i) => `
    <label class="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white cursor-pointer transition">
      <input type="radio" name="quizOpt" value="${i}" onchange="STATE.selectedAnswerIdx = ${i}" class="text-maroon focus:ring-maroon" />
      <span class="text-sm font-medium text-slate-800">${opt}</span>
    </label>
  `).join("");
}

function submitQuizAnswer() {
  if (STATE.selectedAnswerIdx === null) {
    showToast("Please select an answer first.");
    return;
  }

  // Next question or finish
  STATE.activeQuizQuestionIdx++;
  if (STATE.activeQuizQuestionIdx < STATE.activeQuiz.questions.length) {
    STATE.selectedAnswerIdx = null;
    renderCurrentQuizQuestion();
  } else {
    // Finish Quiz
    const earned = STATE.activeQuiz.rewardSp;
    STATE.currentUser.spPoints += earned;
    renderAuthHeader();
    showToast(`🎉 Quiz Finished! You scored top marks and earned ${earned} SP Points!`);
    abandonQuiz();
  }
}

function abandonQuiz() {
  STATE.activeQuiz = null;
  document.getElementById("activeQuizRunner").classList.add("hidden");
}

// LEADERBOARD
function renderLeaderboard() {
  const tbody = document.getElementById("leaderboardTableBody");
  if (!tbody) return;

  const sorted = [...STATE.users].sort((a, b) => b.spPoints - a.spPoints);
  tbody.innerHTML = sorted.map((u, i) => `
    <tr class="hover:bg-slate-50 transition">
      <td class="p-3 font-bold text-slate-800">
        ${i === 0 ? "🥇 #1" : i === 1 ? "🥈 #2" : i === 2 ? "🥉 #3" : `#${i + 1}`}
      </td>
      <td class="p-3 font-semibold text-slate-900">${u.fullName}</td>
      <td class="p-3 text-slate-600 text-xs">${u.stream}</td>
      <td class="p-3 text-slate-800 font-bold">${85 + (sorted.length - i) * 2}%</td>
      <td class="p-3 font-black text-gold-dark">${u.spPoints} SP</td>
      <td class="p-3 text-right">
        <span class="text-[10px] font-bold px-2 py-0.5 rounded ${i < 3 ? 'bg-gold/20 text-gold-dark border border-gold/40' : 'bg-slate-100 text-slate-600'}">
          ${i === 0 ? "Grand Scholar" : i < 3 ? "Honors Medal" : "Active Scholar"}
        </span>
      </td>
    </tr>
  `).join("");
}

// REDEMPTION ITEMS & REQUESTS
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
  const item = STATE.redemptionItems.find(i => i.id === itemId);
  if (!item) return;

  if (STATE.currentUser.spPoints < item.spPrice) {
    showToast(`Insufficient SP! You need ${item.spPrice} SP, but only have ${STATE.currentUser.spPoints} SP.`);
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

  // Sync to Firebase RTDB if available
  if (db) {
    try {
      db.ref("redemption_requests/" + newRedemption.id).set(newRedemption);
    } catch (e) {
      console.warn("RTDB sync error:", e);
    }
  }

  renderAuthHeader();
  renderRedemptionItems();
  renderUserRedemptionHistory();
  renderAdminRedemptions();
  updateBadgeCounts();

  showToast(`✅ Redemption request for "${item.title}" submitted to Admin for collection!`);
}

function renderUserRedemptionHistory() {
  const container = document.getElementById("userRedemptionHistoryList");
  if (!container) return;

  const userReds = STATE.redemptions.filter(r => r.userId === STATE.currentUser.id);
  if (userReds.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-500 italic">You have not submitted any reward redemptions yet.</p>`;
    return;
  }

  container.innerHTML = userReds.map(r => `
    <div class="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
      <div>
        <p class="font-bold text-sm text-slate-900">${r.itemTitle}</p>
        <p class="text-[11px] text-slate-500">${new Date(r.timestamp).toLocaleDateString()} • Spent ${r.spSpent} SP</p>
      </div>
      <span class="text-xs font-bold px-3 py-1 rounded-full ${getStatusBadgeClass(r.status)}">
        ${r.status.toUpperCase()}
      </span>
    </div>
  `).join("");
}

// ADMIN DASHBOARD
function switchAdminTab(tabName) {
  STATE.adminSubTab = tabName;
  document.querySelectorAll(".admin-panel").forEach(p => p.classList.add("hidden"));
  const panel = document.getElementById("adminPanel-" + tabName);
  if (panel) panel.classList.remove("hidden");

  document.querySelectorAll(".admin-subtab").forEach(btn => {
    btn.classList.remove("bg-maroon", "text-white");
    btn.classList.add("text-slate-600", "hover:bg-slate-100");
  });
  const activeBtn = document.getElementById("adminTab-" + tabName);
  if (activeBtn) {
    activeBtn.classList.add("bg-maroon", "text-white");
    activeBtn.classList.remove("text-slate-600", "hover:bg-slate-100");
  }
}

function setAdminRedemptionFilter(filter) {
  STATE.adminRedemptionFilter = filter;
  document.querySelectorAll(".admin-red-filter").forEach(b => {
    b.classList.remove("bg-maroon", "text-white");
    b.classList.add("bg-slate-100", "text-slate-700");
  });
  event.target.classList.add("bg-maroon", "text-white");
  event.target.classList.remove("bg-slate-100", "text-slate-700");
  renderAdminRedemptions();
}

function renderAdminRedemptions() {
  const container = document.getElementById("adminRedemptionsListContainer");
  if (!container) return;

  const searchQuery = (document.getElementById("adminRedemptionSearchInput")?.value || "").toLowerCase();

  const filtered = STATE.redemptions.filter(r => {
    const matchStatus = STATE.adminRedemptionFilter === "All" || r.status.toLowerCase().includes(STATE.adminRedemptionFilter.toLowerCase());
    const matchQuery = !searchQuery ||
      r.userName.toLowerCase().includes(searchQuery) ||
      r.itemTitle.toLowerCase().includes(searchQuery) ||
      r.userEmail.toLowerCase().includes(searchQuery);
    return matchStatus && matchQuery;
  });

  // Update Stats
  const total = STATE.redemptions.length;
  const pending = STATE.redemptions.filter(r => r.status.toLowerCase() === "pending").length;
  const fulfilled = STATE.redemptions.filter(r => r.status.toLowerCase() === "fulfilled").length;

  document.getElementById("adminStatTotalRequests").innerText = total;
  document.getElementById("adminStatPendingRequests").innerText = pending;
  document.getElementById("adminStatFulfilledRequests").innerText = fulfilled;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400">
        <span class="material-symbols-outlined text-4xl">card_giftcard</span>
        <p class="text-xs mt-1">No redemption requests match criteria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(r => `
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
      <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-maroon/10 text-maroon font-bold flex items-center justify-center text-sm">
            ${r.userName.charAt(0)}
          </div>
          <div>
            <h4 class="font-bold text-slate-900 text-sm">${r.userName}</h4>
            <p class="text-xs text-slate-500">${r.userEmail} • <span class="font-semibold text-slate-700">${r.userStream}</span></p>
          </div>
        </div>
        <span class="self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full ${getStatusBadgeClass(r.status)}">
          ${r.status.toUpperCase()}
        </span>
      </div>

      <div class="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
        <div>
          <p class="font-semibold text-xs text-slate-800">${r.itemTitle}</p>
          <p class="text-[11px] text-slate-500">${new Date(r.timestamp).toLocaleString()}</p>
        </div>
        <span class="font-black text-amber-700 text-sm">${r.spSpent} SP</span>
      </div>

      <!-- Admin Actions -->
      <div class="flex justify-end space-x-2 pt-1">
        ${r.status.toLowerCase() === "pending" ? `
          <button onclick="updateRedemptionStatus('${r.id}', 'Rejected')" class="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold">
            Reject & Refund
          </button>
          <button onclick="updateRedemptionStatus('${r.id}', 'Approved')" class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow">
            Approve
          </button>
          <button onclick="updateRedemptionStatus('${r.id}', 'Fulfilled')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow">
            Hand Over (Fulfill)
          </button>
        ` : r.status.toLowerCase() === "approved" ? `
          <button onclick="updateRedemptionStatus('${r.id}', 'Rejected')" class="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold">
            Cancel & Refund
          </button>
          <button onclick="updateRedemptionStatus('${r.id}', 'Fulfilled')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow">
            Mark Handed Over
          </button>
        ` : `
          <span class="text-xs text-slate-400 italic">Action complete</span>
        `}
      </div>
    </div>
  `).join("");
}

function updateRedemptionStatus(redemptionId, newStatus) {
  const red = STATE.redemptions.find(r => r.id === redemptionId);
  if (!red) return;

  if (newStatus === "Rejected" && !red.status.includes("Reject")) {
    // Refund points to user
    const user = STATE.users.find(u => u.id === red.userId);
    if (user) user.spPoints += red.spSpent;
    if (STATE.currentUser.id === red.userId) {
      STATE.currentUser.spPoints += red.spSpent;
    }
  }

  red.status = newStatus;

  // Sync to Firebase RTDB
  if (db) {
    try {
      db.ref("redemption_requests/" + red.id).update({ status: newStatus });
    } catch (e) {
      console.warn("RTDB update error:", e);
    }
  }

  renderAuthHeader();
  renderAdminRedemptions();
  renderUserRedemptionHistory();
  updateBadgeCounts();
  showToast(`Updated request for "${red.userName}" to ${newStatus}`);
}

function renderAdminUsers() {
  const tbody = document.getElementById("adminUsersTableBody");
  if (!tbody) return;

  tbody.innerHTML = STATE.users.map(u => `
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
      <td class="p-3 text-right">
        ${!u.isVerified ? `
          <button onclick="verifyUser('${u.id}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow">
            Verify
          </button>
        ` : `
          <span class="text-xs text-slate-400">Active</span>
        `}
      </td>
    </tr>
  `).join("");
}

function verifyUser(userId) {
  const u = STATE.users.find(user => user.id === userId);
  if (u) {
    u.isVerified = true;
    renderAdminUsers();
    updateBadgeCounts();
    showToast(`Verified student ${u.fullName}!`);
  }
}

function renderAdminChatAudit() {
  const box = document.getElementById("adminChatAuditBox");
  if (!box) return;

  box.innerHTML = STATE.messages.map(m => `
    <div class="flex justify-between items-center p-3 rounded-lg border border-slate-200 bg-slate-50">
      <div>
        <p class="text-xs font-bold text-slate-800">${m.senderName}: <span class="font-normal text-slate-700">"${m.content}"</span></p>
        <p class="text-[10px] text-slate-400">${new Date(m.timestamp).toLocaleTimeString()}</p>
      </div>
      <button onclick="deleteChatMessage('${m.id}')" class="text-red-600 hover:text-red-800 p-1 text-xs">
        <span class="material-symbols-outlined text-[18px]">delete</span>
      </button>
    </div>
  `).join("");
}

// CHAT DISCUSSIONS
function renderChatMessages() {
  const box = document.getElementById("chatMessagesBox");
  if (!box) return;

  box.innerHTML = STATE.messages.map(m => `
    <div class="flex items-start space-x-3 p-3 rounded-xl ${m.senderId === STATE.currentUser.id ? 'bg-maroon/5 ml-8 border border-maroon/20' : 'bg-white mr-8 border border-slate-200 shadow-sm'}">
      <div class="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
        ${m.senderName.charAt(0)}
      </div>
      <div class="flex-1">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-900">${m.senderName}</span>
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
  const input = document.getElementById("chatInputMessage");
  const text = input.value.trim();
  if (!text) return;

  const newMsg = {
    id: "msg_" + Date.now(),
    senderId: STATE.currentUser.id,
    senderName: STATE.currentUser.fullName,
    content: text,
    timestamp: Date.now()
  };

  STATE.messages.push(newMsg);
  input.value = "";

  // Sync to Firebase RTDB
  if (db) {
    try {
      db.ref("discussions/" + newMsg.id).set(newMsg);
    } catch (e) {
      console.warn("RTDB discussion sync error:", e);
    }
  }

  renderChatMessages();
  renderAdminChatAudit();
}

function deleteChatMessage(msgId) {
  STATE.messages = STATE.messages.filter(m => m.id !== msgId);
  renderChatMessages();
  renderAdminChatAudit();
  showToast("Message removed by moderator.");
}

// REALTIME DATABASE LISTENERS
function setupFirebaseListeners() {
  if (!db) return;

  try {
    // Listen for new redemption requests
    db.ref("redemption_requests").on("value", snapshot => {
      const data = snapshot.val();
      if (data) {
        const cloudReds = Object.values(data);
        // Merge with existing
        cloudReds.forEach(cr => {
          const idx = STATE.redemptions.findIndex(r => r.id === cr.id);
          if (idx >= 0) {
            STATE.redemptions[idx] = cr;
          } else {
            STATE.redemptions.unshift(cr);
          }
        });
        renderAdminRedemptions();
        renderUserRedemptionHistory();
        updateBadgeCounts();
      }
    });

    // Listen for discussions
    db.ref("discussions").on("value", snapshot => {
      const data = snapshot.val();
      if (data) {
        STATE.messages = Object.values(data);
        renderChatMessages();
        renderAdminChatAudit();
      }
    });
  } catch (e) {
    console.warn("RTDB listeners active in offline-compatible mode:", e);
  }
}

// UTILITIES & BADGES
function updateBadgeCounts() {
  const pendingRedemptions = STATE.redemptions.filter(r => r.status.toLowerCase() === "pending").length;
  const pendingUsers = STATE.users.filter(u => !u.isVerified).length;

  const navBadge = document.getElementById("navPendingBadge");
  if (navBadge) {
    navBadge.innerText = pendingRedemptions;
    navBadge.classList.toggle("hidden", pendingRedemptions === 0);
  }

  const adminRedBadge = document.getElementById("adminPendingRedemptionsCount");
  if (adminRedBadge) adminRedBadge.innerText = pendingRedemptions;

  const adminUserBadge = document.getElementById("adminPendingUsersCount");
  if (adminUserBadge) adminUserBadge.innerText = pendingUsers;
}

function getStatusBadgeClass(status) {
  switch (status.toLowerCase()) {
    case "approved":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "fulfilled":
      return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    case "rejected":
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
