var Model = (function () {
    function Model(login, email) {
        this.urlChangeLogin = 'includes/change_scripts/change_login.php';
        this.urlChangeEmail = 'includes/change_scripts/change_email.php';
        this.urlChangePassword = 'includes/change_scripts/change_password.php';
        this.urlChangeAvatar = 'includes/change_scripts/change_avatar.php';
        this.PASSWORD_MIN_LENGTH = 6;
        this.LOGIN_MIN_LENGTH = 4;
        this.MAX_IMAGE_SIZE = 500;
        var data = {
            login: login,
            email: email
        };
        this.user = new User(data);
    }
    Model.prototype.getUserLogin = function () {
        return this.user.login;
    };
    Model.prototype.getUserEmail = function () {
        return this.user.email;
    };
    Model.prototype.changeUserLogin = function (newLogin, success, error) {
        var checking;
        checking = this.checkLogin(newLogin);
        if (!checking.state) {
            error(checking.message);
            return;
        }
        var data = {
            login: newLogin
        }, user = this.user;
        $.ajax({
            url: this.urlChangeLogin,
            type: 'POST',
            success: function (data) {
                if (data.state) {
                    user.login = newLogin;
                    success(data.message);
                }
                else {
                    error(data.message);
                }
            },
            error: function () {
                error('Ошибка соединения с сервером');
            },
            data: data
        });
    };
    Model.prototype.changeUserEmail = function (newEmail, success, error) {
        var checking = this.checkEmail(newEmail);
        if (!checking.state) {
            error(checking.message);
            return;
        }
        var data = {
            email: newEmail
        }, user = this.user;
        $.ajax({
            url: this.urlChangeEmail,
            type: 'POST',
            success: function (data) {
                if (data.state) {
                    user.email = newEmail;
                    success(data.message);
                }
                else {
                    error(data.message);
                }
            },
            error: function () {
                error('Ошибка соединения с сервером');
            },
            data: data
        });
    };
    Model.prototype.changePassword = function (data, success, error) {
        var checking = this.checkPassword(data);
        if (!checking.state) {
            error(checking.message);
            return;
        }
        $.ajax({
            url: this.urlChangePassword,
            type: 'POST',
            success: function (data) {
                if (!data.state) {
                    success(data.message);
                }
                else {
                    error(data.message);
                }
            },
            error: function () {
                error('Ошибка соединения с сервером');
            },
            data: data
        });
    };
    Model.prototype.changeAvatar = function (file, success, error) {
        var checking = this.checkImage(file);
        if (!checking.state) {
            error(checking.message);
            return;
        }
        var data = new FormData();
        data.append('userAvatar', file);
        $.ajax({
            url: this.urlChangeAvatar,
            type: 'POST',
            success: function (data) {
                if (data.state) {
                    success(data.src);
                }
                else {
                    error(data.message);
                }
            },
            error: function () {
                error('Ошибка соединения с сервером');
            },
            data: data,
            cache: false,
            contentType: false,
            processData: false
        });
    };
    Model.prototype.checkLogin = function (login) {
        if (login.length < this.LOGIN_MIN_LENGTH) {
            return {
                state: false,
                message: 'Длина логина меньше ' + this.LOGIN_MIN_LENGTH + ' символов'
            };
        }
        if (this.user.login === login) {
            return {
                state: false,
                message: 'Старый и новый логин одинаковы'
            };
        }
        return {
            state: true
        };
    };
    Model.prototype.checkEmail = function (email) {
        var regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!email.match(regExp)) {
            return {
                state: false,
                message: 'Неверный формат email'
            };
        }
        if (this.user.email === email) {
            return {
                state: false,
                message: 'Старый и новый email одинаковы'
            };
        }
        return {
            state: true
        };
    };
    Model.prototype.checkPassword = function (data) {
        if (data.newPassword.length < this.PASSWORD_MIN_LENGTH) {
            return {
                state: false,
                message: 'Длина пароля меньше ' + this.PASSWORD_MIN_LENGTH + ' символов'
            };
        }
        if (data.oldPassword === data.newPassword) {
            return {
                state: false,
                message: 'Старый и новый пароль совпадают!'
            };
        }
        if (data.newPassword !== data.confirmNewPassword) {
            return {
                state: false,
                message: 'Введенные пароли не совпадают!'
            };
        }
        return {
            state: true
        };
    };
    Model.prototype.checkImage = function (img) {
        var size = img.size, type = img.type, allowedImageTypes = ['image/jpeg', 'image/png'];
        if (allowedImageTypes.indexOf(type) < 0) {
            return {
                state: false,
                message: 'Формат файла не jpg или png'
            };
        }
        if (size > (this.MAX_IMAGE_SIZE * 1024)) {
            return {
                state: false,
                message: 'Размер файла больше ' + this.MAX_IMAGE_SIZE + ' KB'
            };
        }
        return {
            state: true
        };
    };
    return Model;
}());
var User = (function () {
    function User(data) {
        this.login = data.login;
        this.email = data.email;
    }
    return User;
}());
var Controller = (function () {
    function Controller() {
        this.model = new Model('sdsd', 'sdsdsd');
    }
    return Controller;
}());
var app = new Controller();
console.log(new Controller());
//# sourceMappingURL=app.js.map