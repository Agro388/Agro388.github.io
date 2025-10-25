// ==== Config ====
const DISCORD_LINK = "https://discord.gg/DpwtJ7n684"; // <--- easy to change here
const CODES = { admin: "admin123", mod: "mod456" };
const ROLE = { NONE: "none", MOD: "mod", ADMIN: "admin" };

// ==== Page Detection ====
const currentPage = window.location.pathname.split("/").pop();
const PAGE_KEY = "oculus_page_" + currentPage;

// ==== State ====
let currentRole = localStorage.getItem("oculus_role") || ROLE.NONE;

// ==== Helpers ====
function loadPageData() {
  const raw = localStorage.getItem(PAGE_KEY);
  if (raw) try { return JSON.parse(raw); } catch (e) {}
  return {};
}

function savePageData(data) {
  localStorage.setItem(PAGE_KEY, JSON.stringify(data));
}

// ==== Render Page Content ====
function render() {
  const data = loadPageData();
  const titleEl = document.getElementById("pageTitle");
  const metaEl = document.getElementById("pageMeta");
  if (titleEl) titleEl.innerText = data.title || titleEl.innerText;
  if (metaEl) metaEl.innerText = data.meta || metaEl.innerText;

  // auto-update Discord button if present
  const discordBtn = document.querySelector(".buttonDiscord");
  if (discordBtn) discordBtn.href = DISCORD_LINK;

  toggleAdminUI();
}

// ==== Admin Bar UI ====
function toggleAdminUI() {
  const bar = document.getElementById("adminBar");
  currentRole = localStorage.getItem("oculus_role") || ROLE.NONE;
  if (bar) bar.style.display = (currentRole === ROLE.NONE ? "none" : "block");
  const label = document.getElementById("adminRoleLabel");
  if (label && currentRole !== ROLE.NONE) label.innerText = currentRole.toUpperCase();
}

// ==== Login Modal ====
function openLogin() { document.getElementById("loginModal").style.display = "block"; }
function closeLogin() { document.getElementById("loginModal").style.display = "none"; }

function tryLogin() {
  const code = document.getElementById("loginCode").value.trim();
  if (code === CODES.admin) currentRole = ROLE.ADMIN;
  else if (code === CODES.mod) currentRole = ROLE.MOD;
  else return alert("Wrong code!");
  localStorage.setItem("oculus_role", currentRole);
  closeLogin();
  render();
}

// ==== Logout ====
function logout() {
  currentRole = ROLE.NONE;
  localStorage.removeItem("oculus_role");
  render();
}

// ==== Admin Edit Modal ====
function openEditor() {
  const modal = document.getElementById("adminModal");
  const data = loadPageData();
  if (!modal) return;
  document.getElementById("editTitle").value = data.title || document.getElementById("pageTitle").innerText;
  document.getElementById("editMeta").value = data.meta || document.getElementById("pageMeta").innerText;
  modal.style.display = "block";
}

function saveEdits() {
  const data = {
    title: document.getElementById("editTitle").value,
    meta: document.getElementById("editMeta").value
  };
  savePageData(data);
  render();
  closeAdminModal();
}

function resetPage() {
  if (confirm("Reset this page to default?")) {
    localStorage.removeItem(PAGE_KEY);
    render();
  }
}

function closeAdminModal() {
  document.getElementById("adminModal").style.display = "none";
}

// ==== Init ====
render();
