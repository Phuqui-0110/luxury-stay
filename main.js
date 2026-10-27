/* =====================================================
   LUXURY STAY - main.js (dữ liệu demo lưu bằng localStorage)
   ===================================================== */

// Đường dẫn gốc của site (để trang trong /admin chuyển hướng đúng)
const ROOT = (function () {
  try { return new URL('../', document.currentScript.src).href; } catch (e) { return ''; }
})();

// ========== TIỆN ÍCH ==========
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function readJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; }
  catch (e) { return fallback; }
}
function writeJSON(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
function formatPrice(n) { return Number(n || 0).toLocaleString('vi-VN') + 'đ'; }
function todayStr() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); // giờ địa phương, không phải UTC
  return d.toISOString().split('T')[0];
}
function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().split('T')[0];
}
function calcNights(ci, co) { return Math.round((Date.parse(co) - Date.parse(ci)) / 86400000); }
function datesValid(ci, co) { return !!ci && !!co && co > ci; }
function isValidPhone(p) { return /^(0|\+84)\d{8,10}$/.test(String(p).replace(/[\s.-]/g, '')); }
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

const FALLBACK_IMG = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#e9ecef"/>' +
  '<text x="50%" y="50%" fill="#999" font-family="sans-serif" font-size="28" text-anchor="middle">Luxury Stay</text></svg>');

// ========== DỮ LIỆU MẪU (khớp với sql/database.sql) ==========
const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Standard', description: 'Phòng tiêu chuẩn ấm cúng' },
  { id: 2, name: 'Deluxe', description: 'Phòng cao cấp rộng rãi' },
  { id: 3, name: 'Suite', description: 'Suite sang trọng view đẹp' },
  { id: 4, name: 'Presidential', description: 'Đỉnh cao sang trọng' },
  { id: 5, name: 'Family', description: 'Phòng gia đình rộng rãi' },
  { id: 6, name: 'Ocean View', description: 'Phòng view biển' }
];
const IMG = {
  std: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600',
  dlx: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600',
  ste: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600',
  pre: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
  fam: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600',
  oce: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600'
};
const DEFAULT_ROOMS = [
  { id: 1, name: 'Phòng Standard', number: '101', floor: 1, type: 'Standard', price: 850000, capacity: 2, area: 25, image: IMG.std, amenities: 'WiFi,TV,Điều hòa', status: 'available', desc: 'Phòng tiêu chuẩn đầy đủ tiện nghi cơ bản.' },
  { id: 2, name: 'Phòng Standard', number: '105', floor: 1, type: 'Standard', price: 850000, capacity: 2, area: 25, image: IMG.std, amenities: 'WiFi,TV,Điều hòa', status: 'occupied', desc: 'Phòng tiêu chuẩn ấm cúng.' },
  { id: 3, name: 'Phòng Deluxe', number: '201', floor: 2, type: 'Deluxe', price: 1350000, capacity: 2, area: 35, image: IMG.dlx, amenities: 'WiFi,TV,Minibar,Điều hòa', status: 'available', desc: 'Phòng cao cấp với minibar và view đẹp.' },
  { id: 4, name: 'Phòng Deluxe', number: '205', floor: 2, type: 'Deluxe', price: 1350000, capacity: 2, area: 35, image: IMG.dlx, amenities: 'WiFi,TV,Minibar,Điều hòa', status: 'occupied', desc: 'Phòng Deluxe sang trọng.' },
  { id: 5, name: 'Phòng Suite', number: '501', floor: 5, type: 'Suite', price: 2500000, capacity: 4, area: 55, image: IMG.ste, amenities: 'WiFi,TV,Jacuzzi,View biển,Minibar', status: 'available', desc: 'Suite với jacuzzi và view biển.' },
  { id: 6, name: 'Phòng Presidential', number: '701', floor: 7, type: 'Presidential', price: 5000000, capacity: 4, area: 90, image: IMG.pre, amenities: 'WiFi,Bar riêng,Butler,Jacuzzi', status: 'available', desc: 'Đỉnh cao sang trọng với butler 24/7.' },
  { id: 7, name: 'Phòng Gia đình', number: '402', floor: 4, type: 'Family', price: 1800000, capacity: 5, area: 45, image: IMG.fam, amenities: 'WiFi,TV,Kids area,Điều hòa', status: 'available', desc: 'Không gian rộng cho gia đình có trẻ nhỏ.' },
  { id: 8, name: 'Phòng Ocean View', number: '308', floor: 3, type: 'Ocean View', price: 2000000, capacity: 2, area: 40, image: IMG.oce, amenities: 'WiFi,Ban công,View biển,TV', status: 'available', desc: 'Ban công rộng với tầm nhìn biển.' }
];
const DEFAULT_USERS = [
  { id: 1, name: 'Admin System', email: 'admin@luxurystay.vn', phone: '0900000001', password: 'password', role: 'admin' },
  { id: 2, name: 'Nhân viên A', email: 'staff@luxurystay.vn', phone: '0900000002', password: 'password', role: 'staff' },
  { id: 3, name: 'Nguyễn Văn Khách', email: 'user@email.com', phone: '0901234567', password: 'password', role: 'customer' }
];

function seed(key, defaults) {
  let v = readJSON(key, null);
  if (!Array.isArray(v)) { v = JSON.parse(JSON.stringify(defaults)); writeJSON(key, v); }
  return v;
}
function getRooms() { return seed('rooms_data', DEFAULT_ROOMS); }
function saveRooms(r) { writeJSON('rooms_data', r); }
function getCategories() { return seed('categories_data', DEFAULT_CATEGORIES); }
function saveCategories(c) { writeJSON('categories_data', c); }
function getUsers() { return seed('users_data', DEFAULT_USERS); }
function saveUsers(u) { writeJSON('users_data', u); }
function nextId(list) { return list.reduce((m, x) => Math.max(m, x.id), 0) + 1; }
function roomTitle(r) { return r.name + (r.number ? ' #' + r.number : ''); }
const ROOM_STATUS = { available: 'Trống', occupied: 'Đang dùng', maintenance: 'Bảo trì' };

// ========== AUTH ==========
function getUser() { return readJSON('user', null); }
function setUser(u) { writeJSON('user', u); }
function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  window.location.href = ROOT + 'login.html';
}
function requireAuth(roles) {
  const u = getUser();
  const rec = u && getUsers().find(x => x.id === u.id);
  if (!u || !rec) {
    localStorage.removeItem('user');
    alert('Vui lòng đăng nhập để tiếp tục!');
    window.location.href = ROOT + 'login.html';
    return false;
  }
  if (rec.role !== u.role) { u.role = rec.role; setUser(u); } // quyền có thể đã bị đổi
  if (roles && !roles.includes(u.role)) {
    alert('Bạn không có quyền truy cập trang này!');
    window.location.href = ROOT + 'index.html';
    return false;
  }
  return true;
}
function updateNav() {
  const u = getUser();
  const loginBtn = document.getElementById('navLogin');
  const userInfo = document.getElementById('navUser');
  if (loginBtn && userInfo) {
    if (u) {
      loginBtn.style.display = 'none';
      userInfo.style.display = 'flex';
      userInfo.innerHTML = `<span style="color:#c9a227;font-weight:600;">${esc(u.name)}</span>
        <a href="#" onclick="logout();return false;" style="color:#fff;margin-left:10px;font-size:0.85rem;">Đăng xuất</a>`;
    } else {
      loginBtn.style.display = 'block';
      userInfo.style.display = 'none';
    }
  }
  const adminLink = document.getElementById('navAdmin');
  if (adminLink) adminLink.style.display = (u && (u.role === 'staff' || u.role === 'admin')) ? 'block' : 'none';
  // Nhân viên không được thấy mục quản lý tài khoản
  if (!u || u.role !== 'admin') {
    document.querySelectorAll('.admin-sidebar a[href="users.html"]').forEach(a => a.style.display = 'none');
  }
  updateCartCount();
}

// ========== ĐƠN HÀNG & KIỂM TRA PHÒNG TRỐNG ==========
function getOrders() { return readJSON('orders', []); }
function saveOrders(o) { writeJSON('orders', o); }
const ACTIVE_STATUS = ['pending', 'confirmed', 'checkedin'];
function genOrderCode() {
  const used = getOrders().map(o => o.code);
  let code;
  do { code = 'DP' + Date.now().toString().slice(-6) + String(Math.floor(Math.random() * 1000)).padStart(3, '0'); } while (used.includes(code));
  return code;
}
// Phòng đã có đơn (chưa hủy / chưa trả) trùng khoảng ngày?
function isRoomBooked(roomId, ci, co, ignoreCode) {
  return getOrders().some(o => ACTIVE_STATUS.includes(o.status) && o.code !== ignoreCode &&
    (o.items || []).some(i => i.id === roomId && ci < i.checkout && i.checkin < co));
}
function isRoomAvailable(room, ci, co) {
  if (!room || room.status !== 'available') return false;
  if (ci && co && isRoomBooked(room.id, ci, co)) return false;
  return true;
}

// ========== GIỎ ĐẶT PHÒNG ==========
function getCart() { return readJSON('cart', []); }
function saveCart(c) { writeJSON('cart', c); updateCartCount(); }
function updateCartCount() {
  const total = getCart().reduce((s, i) => s + (i.qty || 1), 0);
  document.querySelectorAll('.cart-badge').forEach(el => el.textContent = total);
}
function addToCart(roomId, checkin, checkout) {
  if (!requireAuth(['customer', 'staff', 'admin'])) return false;
  const room = getRooms().find(r => r.id === roomId);
  if (!room) { alert('Không tìm thấy phòng!'); return false; }
  if (!datesValid(checkin, checkout)) { alert('Vui lòng chọn ngày hợp lệ (ngày trả sau ngày nhận)!'); return false; }
  if (checkin < todayStr()) { alert('Ngày nhận phòng không được ở quá khứ!'); return false; }
  if (!isRoomAvailable(room, checkin, checkout)) {
    alert('Phòng này không còn trống trong khoảng thời gian đã chọn!');
    return false;
  }
  const nights = calcNights(checkin, checkout);
  let cart = getCart().filter(i => i.id !== roomId); // cùng phòng thì thay thế
  cart.push({ id: room.id, name: roomTitle(room), type: room.type, price: room.price, image: room.image, checkin, checkout, nights, qty: 1 });
  saveCart(cart);
  if (confirm('Đã thêm "' + roomTitle(room) + '" vào giỏ đặt phòng!\nĐi tới giỏ đặt ngay?')) location.href = 'cart.html';
  return true;
}
function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
  if (typeof renderCart === 'function') renderCart();
}

// ========== HIỂN THỊ PHÒNG ==========
function fillTypeSelect(selectId, firstLabel) {
  const el = document.getElementById(selectId);
  if (!el) return;
  el.innerHTML = `<option value="">${esc(firstLabel || 'Tất cả')}</option>` +
    getCategories().map(c => `<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('');
}
function renderRooms(list, containerId, dates) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!list.length) {
    el.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:#999;">Không tìm thấy phòng</p>';
    return;
  }
  const q = (dates && dates.checkin && dates.checkout)
    ? '&checkin=' + encodeURIComponent(dates.checkin) + '&checkout=' + encodeURIComponent(dates.checkout) : '';
  el.innerHTML = list.map(r => `
    <div class="room-card">
      <div style="position:relative;">
        <img src="${esc(r.image)}" alt="${esc(roomTitle(r))}" loading="lazy" onerror="this.onerror=null;this.src=FALLBACK_IMG">
        <span class="badge-type">${esc(r.type)}</span>
        ${r.status !== 'available' ? `<span class="badge-status">${esc(ROOM_STATUS[r.status] || r.status)}</span>` : ''}
      </div>
      <div class="body">
        <h5>${esc(roomTitle(r))}</h5>
        <div class="amenities">
          <span><i class="bi bi-people"></i> ${esc(r.capacity)} người</span>
          <span><i class="bi bi-rulers"></i> ${esc(r.area)}m²</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
          <div class="price">${formatPrice(r.price)}<span>/đêm</span></div>
          <a href="room-detail.html?id=${r.id}${q}" class="btn btn-primary btn-sm">Chi tiết</a>
        </div>
      </div>
    </div>
  `).join('');
}

// ========== THÔNG BÁO & HỘP THOẠI ==========
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}
function closeModal() { const m = document.getElementById('appModal'); if (m) m.remove(); }
function openModal(innerHtml) {
  closeModal();
  const wrap = document.createElement('div');
  wrap.id = 'appModal';
  wrap.className = 'modal-backdrop';
  wrap.innerHTML = '<div class="modal-box">' + innerHtml + '</div>';
  wrap.addEventListener('mousedown', e => { if (e.target === wrap) closeModal(); });
  document.body.appendChild(wrap);
  return wrap;
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Form thêm/sửa dùng chung cho trang quản trị
function openForm(title, fields, values, onSave) {
  values = values || {};
  const body = fields.map(f => {
    const v = values[f.name] == null ? '' : values[f.name];
    let input;
    if (f.type === 'select') {
      input = `<select name="${f.name}">${f.options.map(o =>
        `<option value="${esc(o.value)}" ${String(o.value) === String(v) ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}</select>`;
    } else if (f.type === 'textarea') {
      input = `<textarea name="${f.name}" rows="3">${esc(v)}</textarea>`;
    } else {
      input = `<input name="${f.name}" type="${f.type || 'text'}" value="${esc(v)}"
        ${f.min !== undefined ? 'min="' + f.min + '"' : ''} ${f.required ? 'required' : ''}
        ${f.placeholder ? 'placeholder="' + esc(f.placeholder) + '"' : ''}>`;
    }
    return `<div class="form-group"><label>${esc(f.label)}</label>${input}</div>`;
  }).join('');
  const wrap = openModal(`<h4>${esc(title)}</h4><form id="appModalForm">${body}
    <div class="modal-actions">
      <button type="button" class="btn btn-outline" id="appModalCancel">Hủy</button>
      <button type="submit" class="btn btn-primary">Lưu</button>
    </div></form>`);
  const form = wrap.querySelector('#appModalForm');
  wrap.querySelector('#appModalCancel').onclick = closeModal;
  form.onsubmit = e => {
    e.preventDefault();
    const data = {};
    fields.forEach(f => {
      const el = form.elements[f.name];
      data[f.name] = f.type === 'number' ? Number(el.value) : el.value.trim();
    });
    const err = onSave(data);
    if (err) { alert(err); return; }
    closeModal();
  };
}

// ========== MENU MOBILE & SIDEBAR ADMIN ==========
function toggleNav() {
  const nav = document.querySelector('.navbar-nav');
  if (nav) nav.classList.toggle('show');
}
function toggleAdminSidebar() {
  const side = document.querySelector('.admin-sidebar');
  const overlay = document.getElementById('adminOverlay');
  if (side) side.classList.toggle('show');
  if (overlay) overlay.classList.toggle('show');
}
function closeAdminSidebar() {
  const side = document.querySelector('.admin-sidebar');
  const overlay = document.getElementById('adminOverlay');
  if (side) side.classList.remove('show');
  if (overlay) overlay.classList.remove('show');
}

document.addEventListener('DOMContentLoaded', () => {
  updateNav();
  document.querySelectorAll('.navbar-nav a').forEach(a => {
    a.addEventListener('click', () => {
      const nav = document.querySelector('.navbar-nav');
      if (nav) nav.classList.remove('show');
    });
  });
});
