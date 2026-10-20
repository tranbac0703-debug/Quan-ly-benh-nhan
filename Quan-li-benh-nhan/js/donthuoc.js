var thuocIdTiepTheo = 0;

function veBangThuoc() {
    const tbody = document.getElementById("danhSachThuoc");
    tbody.innerHTML = "";

    thuocHienTai.forEach(function (thuoc, index) {
        const row = document.createElement("tr");
        if (thuoc.billingId) row.dataset.billingId = thuoc.billingId;

        [index + 1, thuoc.tenT, thuoc.sl, thuoc.gia, thuoc.dung].forEach(function (value, cellIndex) {
            const cell = document.createElement("td");
            if (cellIndex === 0) cell.className = "stt";
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "btn-edit";
        editButton.textContent = "Sửa";
        editButton.addEventListener("click", function () {
            suaThuoc(index);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn-delete";
        deleteButton.textContent = "✕";
        deleteButton.addEventListener("click", function () {
            xoaThuoc(deleteButton);
        });

        actionCell.append(editButton, deleteButton);
        row.appendChild(actionCell);
        tbody.appendChild(row);
    });
}

function suaThuoc(index) {
    const thuoc = thuocHienTai[index];
    const row = document.querySelectorAll("#danhSachThuoc tr")[index];
    row.classList.add("is-editing");

    const gia = Number(String(thuoc.gia).replace(/[^\d]/g, ""));
    const giaHienTai = Number.isFinite(gia) ? gia : 0;
    const values = [thuoc.tenT, thuoc.sl, giaHienTai, thuoc.dung];
    const inputTypes = ["text", "number", "number", "text"];

    values.forEach(function (value, valueIndex) {
        const cell = row.cells[valueIndex + 1];
        const input = document.createElement("input");
        input.type = inputTypes[valueIndex];
        input.value = value;
        input.setAttribute("aria-label", ["Tên thuốc", "Số lượng", "Đơn giá", "Cách dùng"][valueIndex]);
        if (valueIndex === 1) input.min = "1";
        if (valueIndex === 2) {
            input.min = "0";
            input.step = "1";
        }
        cell.replaceChildren(input);
    });

    const actionCell = row.cells[5];
    actionCell.replaceChildren();
    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "btn-edit-save";
    saveButton.textContent = "Lưu";
    saveButton.addEventListener("click", function () {
        luuSuaThuoc(index, row);
    });

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "btn-edit-cancel";
    cancelButton.textContent = "Hủy";
    cancelButton.addEventListener("click", veBangThuoc);
    actionCell.append(saveButton, cancelButton);
    row.cells[1].querySelector("input").focus();
}

function luuSuaThuoc(index, row) {
    const inputs = Array.from(row.querySelectorAll("input"));
    const ten = inputs[0].value.trim();
    const soLuong = Number(inputs[1].value);
    const gia = Number(inputs[2].value);
    const cachDung = inputs[3].value.trim();

    if (!ten || !Number.isInteger(soLuong) || soLuong <= 0 ||
        inputs[2].value === "" || !Number.isFinite(gia) || gia < 0 || !cachDung) {
        alert("Vui lòng nhập đầy đủ thông tin thuốc, số lượng lớn hơn 0 và đơn giá không âm!");
        return;
    }

    const thuocCu = thuocHienTai[index];
    const thuocMoi = {
        ...thuocCu,
        tenT: ten,
        sl: String(soLuong),
        gia: new Intl.NumberFormat("vi-VN").format(gia) + "đ",
        dung: cachDung
    };
    thuocHienTai[index] = thuocMoi;
    if (thuocCu.billingId) {
        capNhatDichVuThuoc(thuocCu.billingId, ten, soLuong, gia);
    }
    veBangThuoc();
}

function themThuoc() {
    const tenThuoc = document.getElementById("tenThuoc").value.trim();
    const soLuong = Number(document.getElementById("soLuong").value);
    const giaThuoc = Number(document.getElementById("giaThuoc").value);
    const cachDung = document.getElementById("cachDung").value.trim();

    if (!tenThuoc || !Number.isInteger(soLuong) || soLuong <= 0 ||
        document.getElementById("giaThuoc").value === "" || !Number.isFinite(giaThuoc) ||
        giaThuoc < 0 || !cachDung) {
        alert("Vui lòng nhập đầy đủ thông tin thuốc, số lượng lớn hơn 0 và đơn giá không âm!");
        return;
    }

    const id = String(++thuocIdTiepTheo);
    thuocHienTai.push({
        tenT: tenThuoc,
        sl: String(soLuong),
        gia: new Intl.NumberFormat("vi-VN").format(giaThuoc) + "đ",
        dung: cachDung,
        billingId: id
    });
    veBangThuoc();

    themDichVuThuoc(id, tenThuoc, soLuong, giaThuoc);

    ["tenThuoc", "soLuong", "giaThuoc", "cachDung"].forEach(function (inputId) {
        document.getElementById(inputId).value = "";
    });

}

function xoaThuoc(button) {
    const row = button.closest("tr");
    const billingId = row.dataset.billingId;
    const index = Array.from(row.parentElement.children).indexOf(row);
    thuocHienTai.splice(index, 1);
    row.remove();
    capNhatSTT();
    if (billingId) xoaDichVuThuoc(billingId);
}

function xoaThuocTheoId(id) {
    const index = thuocHienTai.findIndex(function (thuoc) {
        return thuoc.billingId === id;
    });
    if (index !== -1) thuocHienTai.splice(index, 1);
    veBangThuoc();
}

function capNhatSTT() {
    document.querySelectorAll("#danhSachThuoc tr").forEach(function (row, index) {
        row.querySelector(".stt").textContent = index + 1;
    });
}
