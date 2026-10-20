const formLichHen = document.getElementById('form-lich-hen');
const danhSachLichHen = document.getElementById('danhSachLichHen');
const ngayHen = document.getElementById('hen-ngay');
ngayHen.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

formLichHen.addEventListener('submit', function (event) {
    event.preventDefault();

    const dong = danhSachLichHen.insertRow();
    const ngay = ngayHen.value.split('-').reverse().join('/');
    const giaTri = [
        danhSachLichHen.rows.length,
        ngay,
        document.getElementById('hen-gio').value,
        document.getElementById('hen-bac-si').value.trim(),
        document.getElementById('hen-ghi-chu').value.trim() || '—'
    ];

    giaTri.forEach(function (giaTriO) {
        dong.insertCell().textContent = giaTriO;
    });

    const nutXoa = document.createElement('button');
    nutXoa.type = 'button';
    nutXoa.className = 'btn-delete';
    nutXoa.textContent = '✕';
    nutXoa.addEventListener('click', function () {
        dong.remove();
        Array.from(danhSachLichHen.rows).forEach(function (dong, index) {
            dong.cells[0].textContent = index + 1;
        });
    });
    dong.insertCell().appendChild(nutXoa);
    formLichHen.reset();
});
