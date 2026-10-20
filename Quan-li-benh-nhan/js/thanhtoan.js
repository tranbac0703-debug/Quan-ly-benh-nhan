
var dsDichVu = [];

function $(id) { return document.getElementById(id); }

function tien(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
}

function tinhTong() {
    var tong = dsDichVu.reduce(function (t, d) { return t + d.sl * d.gia; }, 0);
    var bh = Math.max(0, parseFloat($('tt-bhyt').value) || 0);
    var giam = Math.max(0, parseFloat($('tt-giam').value) || 0);
    var thanhTien = Math.max(0, tong - bh - giam);
    return { tong: tong, bh: bh, giam: giam, thanhTien: thanhTien };
}

function themDichVuThuoc(id, ten, sl, gia) {
    dsDichVu.push({ id: id, ten: ten, sl: sl, gia: gia, loai: 'thuoc' });
    veBang();
}

function capNhatDichVuThuoc(id, ten, sl, gia) {
    var dichVu = dsDichVu.find(function (d) { return d.id === id; });
    if (!dichVu) return;
    dichVu.ten = ten;
    dichVu.sl = sl;
    dichVu.gia = gia;
    veBang();
}

function xoaDichVuThuoc(id) {
    dsDichVu = dsDichVu.filter(function (d) {
        return d.id !== id;
    });
    veBang();
}

function xoaDichVu(index) {
    var dichVu = dsDichVu[index];
    if (dichVu.loai === 'thuoc') xoaThuocTheoId(dichVu.id);
    dsDichVu.splice(index, 1);
    veBang();
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
        btn.addEventListener('click', function () { xoaDichVu(i); });
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

// ---------- Sự kiện ----------
$('ttThemDV').addEventListener('click', themDichVu);
$('tt-bhyt').addEventListener('input', capNhatTong);
$('tt-giam').addEventListener('input', capNhatTong);
document.querySelectorAll('input[name="payment"]').forEach(function (r) {
    r.addEventListener('change', capNhatQR);
});

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

capNhatQR();
veBang();
