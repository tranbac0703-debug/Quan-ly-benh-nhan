// ===== VIỆN PHÍ & IN BILL (tích hợp trong main.html) =====
// Thông tin bệnh nhân lấy trực tiếp từ form "Hồ sơ bệnh án".
// Bill được dựng từ chính dữ liệu đang hiển thị trên trang, không hard-code.

// Dịch vụ mặc định (có thể thêm / xóa trên giao diện)
var dsDichVu = [
    { ten: 'Khám bệnh tổng quát', sl: 1, gia: 200000 },
    { ten: 'Xét nghiệm máu',      sl: 1, gia: 150000 },
    { ten: 'Thuốc điều trị',      sl: 2, gia: 100000 },
    { ten: 'Chụp X-quang',        sl: 1, gia: 250000 }
];

function $(id) { return document.getElementById(id); }

function tien(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
}

function ngayVN(iso) { // yyyy-mm-dd -> dd/mm/yyyy
    var p = (iso || '').split('-');
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : '';
}

function homNay() {
    var d = new Date();
    var z = function (x) { return (x < 10 ? '0' : '') + x; };
    return z(d.getDate()) + '/' + z(d.getMonth() + 1) + '/' + d.getFullYear();
}

// ---------- Thông tin bệnh nhân (đồng bộ từ hồ sơ) ----------
function capNhatThongTin() {
    document.querySelectorAll('#tt-info span[data-src]').forEach(function (s) {
        var input = $(s.getAttribute('data-src'));
        var v = input ? input.value.trim() : '';
        if (s.getAttribute('data-type') === 'date') v = ngayVN(v);
        s.textContent = v || '—';
    });
    $('tt-ngay').textContent = homNay();
    var bs = $('doctor-name');
    return bs ? bs.textContent.trim() : '';
}

// ---------- Bảng dịch vụ + tổng tiền ----------
function tinhTong() {
    var tong = dsDichVu.reduce(function (t, d) { return t + d.sl * d.gia; }, 0);
    var bh = Math.max(0, parseFloat($('tt-bhyt').value) || 0);
    var giam = Math.max(0, parseFloat($('tt-giam').value) || 0);
    var thanhTien = Math.max(0, tong - bh - giam);
    return { tong: tong, bh: bh, giam: giam, thanhTien: thanhTien };
}

function veBang() {
    var tb = $('danhSachDV');
    tb.innerHTML = '';
    dsDichVu.forEach(function (d, i) {
        var tr = document.createElement('tr');
        var cells = [
            [i + 1, ''], [d.ten, 'tt-name'], [d.sl, ''], [tien(d.gia), ''], [tien(d.sl * d.gia), 'tt-price']
        ];
        cells.forEach(function (c) {
            var td = document.createElement('td');
            td.textContent = c[0];
            if (c[1]) td.className = c[1];
            tr.appendChild(td);
        });
        var td = document.createElement('td');
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-delete';
        btn.textContent = '✕';
        btn.addEventListener('click', function () { dsDichVu.splice(i, 1); veBang(); });
        td.appendChild(btn);
        tr.appendChild(td);
        tb.appendChild(tr);
    });
    capNhatTong();
}

function capNhatTong() {
    var t = tinhTong();
    $('tt-tong').textContent = tien(t.tong);
    $('tt-thanhtien').textContent = tien(t.thanhTien);
}

function themDichVu() {
    var ten = $('ttTenDV').value.trim();
    var sl = parseInt($('ttSL').value, 10);
    var gia = parseFloat($('ttDonGia').value);
    if (!ten || !(sl > 0) || !(gia >= 0)) {
        alert('Vui lòng nhập đủ tên dịch vụ, số lượng (>0) và đơn giá!');
        return;
    }
    dsDichVu.push({ ten: ten, sl: sl, gia: gia });
    $('ttTenDV').value = $('ttSL').value = $('ttDonGia').value = '';
    veBang();
}

// ---------- Hình thức thanh toán ----------
function phuongThuc() {
    var r = document.querySelector('input[name="payment"]:checked');
    return r ? r.value : '';
}
function capNhatQR() {
    var r = document.querySelector('input[name="payment"]:checked');
    $('tt-qr-box').hidden = !(r && r.getAttribute('data-qr'));
}

// ---------- Dựng bill ----------
function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
}
function row(l, r, cls) {
    var x = el('div', 'bill-row' + (cls ? ' ' + cls : ''));
    x.appendChild(el('span', '', l));
    x.appendChild(el('span', '', r));
    return x;
}

function dungBill() {
    var bacSi = capNhatThongTin();
    var bill = $('bill');
    bill.innerHTML = '';
    bill.appendChild(el('div', 'bill-head'));

    var body = el('div', 'bill-body');
    body.appendChild(el('div', 'bill-title', 'Hóa đơn thanh toán viện phí'));

    document.querySelectorAll('#tt-info .tt-box').forEach(function (b) {
        body.appendChild(row(b.querySelector('label').textContent + ':', b.querySelector('span').textContent));
    });
    body.appendChild(el('hr', 'bill-line'));

    body.appendChild(el('div', 'bill-sec', 'Chi tiết dịch vụ'));
    dsDichVu.forEach(function (d, i) {
        var item = el('div', 'bill-item');
        var name = el('div', 'bill-item-name');
        name.appendChild(el('i', '', (i + 1) + '.'));
        name.appendChild(document.createTextNode(d.ten));
        item.appendChild(name);
        item.appendChild(row(d.sl + ' x ' + tien(d.gia), tien(d.sl * d.gia)));
        body.appendChild(item);
    });
    body.appendChild(el('hr', 'bill-line'));

    var t = tinhTong();
    body.appendChild(row('Tổng tiền dịch vụ', tien(t.tong)));
    body.appendChild(row('Bảo hiểm y tế', t.bh ? '-' + tien(t.bh) : '0đ'));
    body.appendChild(row('Giảm trừ', t.giam ? '-' + tien(t.giam) : '0đ'));
    body.appendChild(row('THÀNH TIỀN', tien(t.thanhTien), 'bill-total'));

    body.appendChild(el('hr', 'bill-line'));
    body.appendChild(row('Hình thức TT:', phuongThuc()));
    if (bacSi) body.appendChild(row('Bác sĩ phụ trách:', bacSi));
    bill.appendChild(body);

    var foot = el('div', 'bill-foot');
    foot.appendChild(el('b', '', 'Cảm ơn quý khách!'));
    foot.appendChild(el('p', '', 'Chúc quý khách mau bình phục'));
    bill.appendChild(foot);
}

// ---------- In: khổ 80mm, chiều cao theo nội dung ----------
function chuanBiIn() {
    dungBill();
    var h = Math.ceil($('bill').getBoundingClientRect().height * 25.4 / 96) + 1;
    var st = $('bill-page-style');
    if (!st) {
        st = document.createElement('style');
        st.id = 'bill-page-style';
        document.head.appendChild(st);
    }
    st.textContent = '@page { size: 80mm ' + h + 'mm; margin: 0; }';
    document.body.classList.add('printing-bill');
}

function xongIn() {
    document.body.classList.remove('printing-bill');
    var st = $('bill-page-style');
    if (st) st.remove();
}

// Tải trước ảnh nền để lần in đầu không bị thiếu nền
var anhNen = new Image();
var anhNenXong = new Promise(function (ok) { anhNen.onload = anhNen.onerror = ok; });
anhNen.src = 'back.png';

function inBill() {
    chuanBiIn();
    anhNenXong.then(function () {
        requestAnimationFrame(function () { window.print(); });
    });
}

// ---------- Sự kiện ----------
['p-code', 'p-name', 'p-pcode', 'p-dob', 'p-cccd'].forEach(function (id) {
    var e = $(id);
    if (e) e.addEventListener('input', capNhatThongTin);
});
$('ttThemDV').addEventListener('click', themDichVu);
$('tt-bhyt').addEventListener('input', capNhatTong);
$('tt-giam').addEventListener('input', capNhatTong);
document.querySelectorAll('input[name="payment"]').forEach(function (r) {
    r.addEventListener('change', capNhatQR);
});
$('btn-print-bill').addEventListener('click', inBill);
window.addEventListener('afterprint', xongIn);

$('btn-xacnhan-tt').addEventListener('click', function () {
    var name = $('p-name').value.trim() || 'bệnh nhân';
    alert('Đã xác nhận thanh toán ' + tien(tinhTong().thanhTien) + ' (' + phuongThuc() + ') cho ' + name + '.');
});
$('btn-huy-tt').addEventListener('click', function () {
    $('tt-bhyt').value = 100000;
    $('tt-giam').value = 0;
    document.querySelector('input[name="payment"]').checked = true;
    capNhatQR();
    capNhatTong();
});

capNhatThongTin();
capNhatQR();
veBang();
