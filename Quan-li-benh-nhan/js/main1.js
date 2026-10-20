const KHOA_LUU_TRU_HO_SO = "danhSachBenhAn";
const duLieuDaLuu = localStorage.getItem(KHOA_LUU_TRU_HO_SO);

let danhSach = duLieuDaLuu ? JSON.parse(duLieuDaLuu) : [
    {
        ma: "BA-1001",
        cccd: "001201012345",
        ten: "Nguyễn Văn An",
        ngaySinh: "1995-04-12",
        que: "Hà Nội",
        sdt: "0988111222",
        benh: "Viêm họng hạt cấp tính",
        thuoc: [
            { tenT: "Paracetamol 500mg", sl: "10",gia:"10000đ", dung: "Uống sau ăn" },
            { tenT: "Amoxicillin 500mg", sl: "14",gia:"10000đ", dung: "Ngày 2 viên" }
        ]
    }
];

let benhAnDangChon = null;
let thuocHienTai = [];

document.getElementById("search-patient").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        let tuKhoa = this.value.trim().toLowerCase();

        let timThay = null;
        for (let i = 0; i < danhSach.length; i++) {
            if (danhSach[i].ma.toLowerCase() === tuKhoa || danhSach[i].cccd === tuKhoa) {
                timThay = danhSach[i];
                break;
            }
        }

        if (timThay) {
            benhAnDangChon = timThay;
            document.getElementById("p-name").value = timThay.ten;
            document.getElementById("p-dob").value = timThay.ngaySinh;
            document.getElementById("p-hometown").value = timThay.que;
            document.getElementById("p-cccd").value = timThay.cccd;
            document.getElementById("p-phone").value = timThay.sdt;
            document.getElementById("p-code").value = timThay.ma;
            document.getElementById("p-condition").value = timThay.benh;
            thuocHienTai = timThay.thuoc.map(function (thuoc) {
                return { ...thuoc };
            });
            veBangThuoc();
            this.value = "";
        } else {
            alert("Không tìm thấy hồ sơ!");
        }
    }
});

document.getElementById("form-ho-so").addEventListener("submit", function (e) {
    e.preventDefault();

    if (!benhAnDangChon) {
        alert("Vui lòng tìm hồ sơ bệnh án trước khi lưu thay đổi!");
        return;
    }

    if (document.querySelector("#danhSachThuoc tr.is-editing")) {
        alert("Vui lòng lưu hoặc hủy chỉnh sửa thuốc trước khi lưu hồ sơ!");
        return;
    }

    const hoSoCapNhat = {
        ...benhAnDangChon,
        ten: document.getElementById("p-name").value.trim(),
        ngaySinh: document.getElementById("p-dob").value,
        que: document.getElementById("p-hometown").value.trim(),
        cccd: document.getElementById("p-cccd").value.trim(),
        sdt: document.getElementById("p-phone").value.trim(),
        ma: document.getElementById("p-code").value.trim(),
        benh: document.getElementById("p-condition").value.trim(),
        thuoc: thuocHienTai.map(function (thuoc) {
            return {
                tenT: thuoc.tenT,
                sl: thuoc.sl,
                gia: thuoc.gia,
                dung: thuoc.dung
            };
        })
    };
    const danhSachCapNhat = danhSach.map(function (hoSo) {
        return hoSo === benhAnDangChon ? hoSoCapNhat : hoSo;
    });
    const danhSachLuuTru = danhSachCapNhat.map(function (hoSo) {
        return {
            ...hoSo,
            thuoc: hoSo.thuoc.map(function (thuoc) {
                return {
                    tenT: thuoc.tenT,
                    sl: thuoc.sl,
                    gia: thuoc.gia,
                    dung: thuoc.dung
                };
            })
        };
    });

    try {
        localStorage.setItem(KHOA_LUU_TRU_HO_SO, JSON.stringify(danhSachLuuTru));
    } catch (error) {
        console.error("Không thể lưu hồ sơ bệnh án:", error);
        alert("Không thể lưu hồ sơ bệnh án. Vui lòng thử lại!");
        return;
    }

    danhSach = danhSachCapNhat;
    benhAnDangChon = hoSoCapNhat;
    alert("Đã lưu thay đổi hồ sơ bệnh án!");
});