function themThuoc() { /*value dùng để lấy giá trị người dùng nhập vào ô input, trim() để loại bỏ khoảng trắng đầu và cuối*/
    const maThuoc = document.getElementById("maThuoc").value.trim(); /*Tìm ô có id là mã thuốc và lấy giá trị của nó*/
    const tenThuoc = document.getElementById("tenThuoc").value.trim();
    const soLuong = document.getElementById("soLuong").value.trim();
    const cachDung = document.getElementById("cachDung").value.trim();

    if (!maThuoc || !tenThuoc || !soLuong || !cachDung) {
        alert("Vui lòng điền đầy đủ thông tin thuốc!");
        return;
    }

    const tbody = document.getElementById("danhSachThuoc");

    // Tạo hàng <tr> mới
    const row = document.createElement("tr");
    row.innerHTML = `
        <td class="stt"></td>
        <td>${maThuoc}</td>
        <td>${tenThuoc}</td>
        <td>${soLuong}</td>
        <td>${cachDung}</td>
        <td><button class="btn-delete" onclick="xoaThuoc(this)">✕</button></td>
    `;

    tbody.appendChild(row);

    // Xóa dữ liệu trong ô input sau khi thêm
    document.getElementById("maThuoc").value = "";
    document.getElementById("tenThuoc").value = "";
    document.getElementById("soLuong").value = "";
    document.getElementById("cachDung").value = "";

    // Đánh lại số thứ tự STT
    capNhatSTT();
}

// Hàm xóa thuốc khi bấm nút ✕
function xoaThuoc(button) {
    const row = button.closest("tr");
    row.remove();
    capNhatSTT(); // Tự động đánh lại STT sau khi xóa
}

// Hàm đánh lại số thứ tự (STT) từ 1 đến hết
function capNhatSTT() {
    const rows = document.querySelectorAll("#danhSachThuoc tr");
    rows.forEach((row, index) => {
        row.querySelector(".stt").textContent = index + 1;
    });
}