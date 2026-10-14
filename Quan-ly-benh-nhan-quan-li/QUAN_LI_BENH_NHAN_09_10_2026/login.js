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

function login() {
    event.preventDefault();

    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value;

    var isLoginSuccess = false;

    for (var i = 0; i < user.length; i++) {
        if (username === user[i].maNV && password === user[i].matKhau) {
            isLoginSuccess = true;
            alert("Đăng nhập thành công! Xin chào " + user[i].tenBacSi);
            window.location.href = "main.html";
            break;
        }
    }

    if (!isLoginSuccess) {
        alert("Sai tài khoản hoặc mật khẩu");
    }
}

document.getElementById("form-login").addEventListener("submit", login);