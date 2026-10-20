const user = [
    {
        maNV: "NV001",
        matKhau: "123456",
        tenBacSi: "Bác sĩ Đỗ Duy Mạnh"
    },
    {
        maNV: "admin",
        matKhau: "admin123",
        tenBacSi: "Quản trị viên"
    },
    {
        maNV: "BS02",
        matKhau: "123456",
        tenBacSi: "Bác sĩ Nguyễn Văn An"
    }
];

function login(event) {
    event.preventDefault();

    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value;

    var loggedUser = null;

    for (var i = 0; i < user.length; i++) {
        if (username === user[i].maNV && password === user[i].matKhau) {
            loggedUser = user[i];
            break;
        }
    }

    if (loggedUser) {
        localStorage.setItem("bacSiHienTai", loggedUser.tenBacSi);
        window.location.href = "main.html";
    } else {
        alert("Sai tài khoản hoặc mật khẩu!");
    }
}

document.getElementById("form-login").addEventListener("submit", login);