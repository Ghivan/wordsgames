var Model = (function () {
    function Model(login, email) {
        this.urlChangeLogin = 'server_scenarios/index.php';
        this.urlChangeEmail = 'server_scenarios/index.php';
        this.urlChangePassword = 'server_scenarios/index.php';
        this.urlChangeAvatar = 'server_scenarios/index.php';
        this.urlSendFeedback = 'server_scenarios/index.php';
        this.PASSWORD_REG_EXP = /^[a-z0-9а-я_-]{6,18}$/i;
        this.LOGIN_REG_EXP = /^[a-z0-9а-я_-]{3,16}$/i;
        this.EMAIL_REG_EXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
    Model.prototype.checkInput = function (type, message) {
        switch (type) {
            case 'login':
                return this.checkLogin(message);
            case 'email':
                return this.checkEmail(message);
            default:
                console.warn('Проверки по ' + type + ' не существует!');
                return {
                    state: false,
                    message: 'Неверные данные!'
                };
        }
    };
    Model.prototype.changeUserLogin = function (newLogin, success, error) {
        var checking;
        checking = this.checkLogin(newLogin);
        if (!checking.state) {
            error(checking.message);
            return;
        }
        var data = {
            login: newLogin,
            action: 'changeLogin'
        }, user = this.user;
        $.ajax({
            url: this.urlChangeLogin,
            data: data,
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
            }
        });
    };
    Model.prototype.checkLogin = function (login) {
        if (login === '') {
            return {
                state: false,
                message: 'Поле логина не должно быть пустым!'
            };
        }
        if (!login.match(this.LOGIN_REG_EXP)) {
            return {
                state: false,
                message: 'Логин должен состоять только из букв, цифр, дефисов и подчёркиваний, от 3 до 16 символов.'
            };
        }
        if (this.user.login == login) {
            return {
                state: false,
                message: 'Старый и новый логин одинаковы'
            };
        }
        return {
            state: true
        };
    };
    Model.prototype.changeUserEmail = function (newEmail, success, error) {
        var checking = this.checkEmail(newEmail);
        if (!checking.state) {
            error(checking.message);
            return;
        }
        var data = {
            email: newEmail,
            action: 'changeEmail'
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
    Model.prototype.checkEmail = function (email) {
        if (email === '') {
            return {
                state: false,
                message: 'Поле email не должно быть пустым!'
            };
        }
        if (!email.match(this.EMAIL_REG_EXP)) {
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
    Model.prototype.changePassword = function (data, success, error) {
        var checking = this.checkPassword(data);
        if (!checking.state) {
            error(checking.message);
            return;
        }
        data.action = 'changePassword';
        $.ajax({
            url: this.urlChangePassword,
            type: 'POST',
            data: data,
            success: function (data) {
                if (data.state) {
                    success(data.message);
                }
                else {
                    error(data.message);
                }
            },
            error: function () {
                error('Ошибка соединения с сервером');
            }
        });
    };
    Model.prototype.checkPassword = function (data) {
        for (var prop in data) {
            if (data.hasOwnProperty(prop)) {
                if (data[prop] === '') {
                    return {
                        state: false,
                        message: 'Все поля должны быть заполнены!'
                    };
                }
            }
        }
        if (!data.newPassword.match(this.PASSWORD_REG_EXP)) {
            return {
                state: false,
                message: 'Пароль должен состоять из букв, цифр, дефисов и подчёркиваний, от 6 до 16 символов.'
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
    Model.prototype.uploadAvatar = function (file, success, error) {
        var checking = this.checkImage(file);
        if (!checking.state) {
            error(checking.message);
            return;
        }
        var data = new FormData();
        data.append('userAvatar', file);
        data.append('action', 'changeAvatar');
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
    Model.prototype.sendFeedBackMessage = function (data, success, error) {
        $.ajax({
            data: data,
            url: this.urlSendFeedback,
            type: 'POST',
            success: function (data) {
                if (data.state) {
                    success(data.message);
                }
                else {
                    error(data.message);
                }
            },
            error: function () {
                error('Ошибка соединения с сервером');
            },
        });
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
var View = (function () {
    function View() {
        this.loader = new Loader();
        this.profileConfigureBox = new ProfileConfigureBox();
        this.changeAvatarBox = new ChangeAvatarBox();
        this.changePasswordBox = new ChangePasswordBox();
        this.loginLabel = $('#userLoginLabel');
        this.unregisterBtn = $('#unregister');
        this.sendFeedbackBox = new SendFeedbackBox();
    }
    return View;
}());
var Loader = (function () {
    function Loader() {
        this.box = $('#loader');
    }
    Loader.prototype.show = function () {
        this.box.show();
    };
    Loader.prototype.hide = function () {
        this.box.hide();
    };
    return Loader;
}());
var ProfileConfigureBox = (function () {
    function ProfileConfigureBox() {
        this.box = $('#profile-configure');
        this.errorBox = $('#profile-configure-error-box');
        this.successBox = $('#profile-configure-success-box');
        this.changeLoginInput = $('#change-login-input');
        this.changeEmailInput = $('#change-email-input');
        this.changeLoginBtn = $('#change-login-btn');
        this.changeEmailBtn = $('#change-email-btn');
        this.sendChangesBtn = $('#send-changed-data-btn');
        this.cancelBtn = $('#profile-configure-cancel-btn');
    }
    ProfileConfigureBox.prototype.setChangeBtnTitle = function (btnFieldType, text) {
        switch (btnFieldType) {
            case 'login':
                this.changeLoginBtn.text(text);
                break;
            case 'email':
                this.changeEmailBtn.text(text);
                break;
            default:
                console.warn('Элемента ' + btnFieldType + ' не существует');
                break;
        }
    };
    ProfileConfigureBox.prototype.getChangeBtnTitle = function (btnFieldType) {
        switch (btnFieldType) {
            case 'login':
                return this.changeLoginBtn.text().trim();
            case 'email':
                return this.changeEmailBtn.text().trim();
            default:
                console.warn('Элемента ' + btnFieldType + ' не существует');
                return '';
        }
    };
    ProfileConfigureBox.prototype.toggleInputState = function (inputType) {
        var input;
        switch (inputType) {
            case 'login':
                input = this.changeLoginInput;
                break;
            case 'email':
                input = this.changeEmailInput;
                break;
            default:
                console.warn('Элемента ' + inputType + ' не существует');
                return;
        }
        var state = input.prop('disabled');
        if (state === true) {
            input.prop('disabled', false);
            input.focus();
            input.select();
        }
        if (state === false) {
            input.prop('disabled', true);
        }
    };
    ProfileConfigureBox.prototype.setChangeInputValue = function (inputType, text) {
        var input;
        switch (inputType) {
            case 'login':
                input = this.changeLoginInput;
                break;
            case 'email':
                input = this.changeEmailInput;
                break;
            default:
                console.warn('Элемента ' + inputType + ' не существует');
                return;
        }
        input.val(text);
    };
    ProfileConfigureBox.prototype.getChangeInputValue = function (inputType) {
        var input;
        switch (inputType) {
            case 'login':
                input = this.changeLoginInput;
                break;
            case 'email':
                input = this.changeEmailInput;
                break;
            default:
                console.warn('Элемента ' + inputType + ' не существует');
                return '';
        }
        return input.val().trim();
    };
    ProfileConfigureBox.prototype.displayError = function (errorMessage) {
        this.errorBox.html(errorMessage);
    };
    ProfileConfigureBox.prototype.displaySuccessMessage = function (message) {
        this.successBox.html(message);
    };
    ProfileConfigureBox.prototype.reset = function (login, email) {
        this.changeLoginInput.val(login);
        this.changeLoginInput.prop('disabled', true);
        this.changeEmailInput.val(email);
        this.changeEmailInput.prop('disabled', true);
        this.errorBox.html('');
        this.successBox.html('');
    };
    return ProfileConfigureBox;
}());
var ChangeAvatarBox = (function () {
    function ChangeAvatarBox() {
        this.box = $('#change-avatar-box');
        this.errorBox = $('#change-avatar-error-box');
        this.previewBox = $('#avatar-preview-box');
        this.avatarFileInput = $('#change-avatar-input');
        this.uploadAvatarBtn = $('#change-avatar-btn');
        this.cancelBtn = $('#change-avatar-cancel-btn');
        this.userAvatarBox = $('#UserAvatar');
    }
    ChangeAvatarBox.prototype.displayError = function (errorMessage) {
        this.errorBox.text(errorMessage);
    };
    ChangeAvatarBox.prototype.hideError = function () {
        this.errorBox.text('');
    };
    ChangeAvatarBox.prototype.showAvatarPreview = function (file, loader) {
        var reader = new FileReader(), previewBox = this.previewBox;
        loader.show();
        reader.readAsDataURL(file);
        reader.onload = function () {
            previewBox.attr('src', reader.result);
            loader.hide();
        };
    };
    ChangeAvatarBox.prototype.getFileFromInput = function () {
        return this.avatarFileInput.prop('files')[0] || null;
    };
    ChangeAvatarBox.prototype.reset = function () {
        this.hideError();
        this.previewBox.attr('src', this.userAvatarBox.attr('src'));
        this.avatarFileInput.val('');
    };
    return ChangeAvatarBox;
}());
var ChangePasswordBox = (function () {
    function ChangePasswordBox() {
        this.box = $('#change-password-box');
        this.errorBox = $('#change-password-error-box');
        this.oldPasswordInput = $('#old-password-input');
        this.newPasswordInput = $('#new-password-input');
        this.confirmNewPasswordInput = $('#сonfirm-new-password-input');
        this.sendChangesBtn = $('#change-password-btn');
        this.cancelBtn = $('#change-password-cancel-btn');
    }
    ChangePasswordBox.prototype.displayError = function (errorMessage) {
        this.errorBox.text(errorMessage);
    };
    ChangePasswordBox.prototype.hideError = function () {
        this.errorBox.text('');
    };
    ChangePasswordBox.prototype.getOldPasswordFromInput = function () {
        return this.oldPasswordInput.val().trim();
    };
    ChangePasswordBox.prototype.getNewPasswordFromInput = function () {
        return this.newPasswordInput.val().trim();
    };
    ChangePasswordBox.prototype.getConfirmNewPasswordFromInput = function () {
        return this.confirmNewPasswordInput.val().trim();
    };
    ChangePasswordBox.prototype.reset = function () {
        this.oldPasswordInput.val('');
        this.newPasswordInput.val('');
        this.confirmNewPasswordInput.val('');
        this.errorBox.text('');
    };
    return ChangePasswordBox;
}());
var SendFeedbackBox = (function () {
    function SendFeedbackBox() {
        this.form = $('#feedbackForm');
        this.feedbackErrorBox = $('#feedback-error-box');
        this.feedbackErrorMessage = $('#feedback-error-message');
        this.feedbackSuccessBox = $('#feedback-success-box');
        this.feedbackSuccessMessage = $('#feedback-success-message');
    }
    SendFeedbackBox.prototype.displayError = function (message) {
        this.feedbackErrorMessage.text(message);
        this.feedbackErrorBox.modal('show');
    };
    SendFeedbackBox.prototype.displaySuccessMessage = function (message) {
        this.feedbackSuccessMessage.text(message);
        this.feedbackSuccessBox.modal('show');
    };
    return SendFeedbackBox;
}());
var Controller = (function () {
    function Controller() {
        this.updateState = {
            login: false,
            email: false
        };
        this.successMessage = '';
        this.freezeState = false;
        var data = $('#profile-configure').data();
        this.model = new Model(data.login, data.email);
        this.view = new View();
        this.errors = new Errors();
        this.view.unregisterBtn.on('click', function (e) {
            e.preventDefault();
            e.cancelBubble = true;
            e.stopImmediatePropagation();
            $.ajax({
                url: 'server_scenarios/index.php',
                type: 'POST',
                success: function (data) {
                    if (data.state) {
                        if (data.state) {
                            window.location.href = '/login/';
                        }
                        else {
                            alert('Нет соединения с сервером!');
                        }
                    }
                    else {
                        alert('Нет соединения с сервером!');
                    }
                },
                error: function () {
                    alert('Нет соединения с сервером!');
                },
                data: {
                    'action': 'logOut'
                }
            });
        });
        var mainBox = this.view.profileConfigureBox;
        mainBox.changeLoginBtn.on('click', this.prepareChange.bind(this, mainBox.changeLoginBtn));
        mainBox.changeEmailBtn.on('click', this.prepareChange.bind(this, mainBox.changeEmailBtn));
        mainBox.changeLoginInput.on('focusout', this.prepareChange.bind(this, mainBox.changeLoginBtn));
        mainBox.changeEmailInput.on('focusout', this.prepareChange.bind(this, mainBox.changeEmailBtn));
        mainBox.sendChangesBtn.on('click', this.sendChangesToServer.bind(this));
        mainBox.box.on('hide.bs.modal', this.resetProfileBox.bind(this));
        var changeAvatarBox = this.view.changeAvatarBox;
        changeAvatarBox.avatarFileInput.on('change', this.activatePreviewAvatar.bind(this));
        changeAvatarBox.uploadAvatarBtn.on('click', this.uploadAvatar.bind(this));
        changeAvatarBox.box.on('hide.bs.modal', changeAvatarBox.reset.bind(changeAvatarBox));
        var passwordBox = this.view.changePasswordBox;
        passwordBox.sendChangesBtn.on('click', this.sendNewPasswordToServer.bind(this));
        passwordBox.box.on('hide.bs.modal', passwordBox.reset.bind(passwordBox));
        this.view.sendFeedbackBox.form.on('submit', this.sendFeedback.bind(this));
        $('a[href="#game-1-records"]').on('click', function () {
            var box = $('#game-1-records');
            if (box.hasClass('active'))
                return;
            box.html('<img src="/_app_files/images/loading.gif" class="center-block" style="width: 40px" alt="Загрузка...">');
            $.ajax({
                url: '/games/wordsFromWord/server_scenarios/index.php',
                type: 'POST',
                success: function (data) {
                    box.html(data);
                },
                error: function () {
                    box.html('<p class="text-danger">Соединение с сервером отсутствует!</p>');
                },
                data: {
                    'action': 'getRecordTable'
                }
            });
        });
        $('a[href="#game-1-progress"]').on('click', function () {
            var box = $('#game-1-progress');
            if (box.hasClass('active'))
                return;
            box.html('<img src="/_app_files/images/loading.gif" class="center-block" style="width: 40px" alt="Загрузка...">');
            $.ajax({
                url: '/games/wordsFromWord/server_scenarios/index.php',
                type: 'POST',
                success: function (data) {
                    box.html(data);
                },
                error: function () {
                    box.html('<p class="text-danger">Соединение с сервером отсутствует!</p>');
                },
                data: {
                    'action': 'getPlayerProgress'
                }
            });
        });
    }
    Controller.prototype.sendFeedback = function (e) {
        e.preventDefault();
        this.view.loader.show();
        var data = $(e.target).serializeArray().reduce(function (prev, curr) {
            prev[curr.name] = curr.value;
            return prev;
        }, {});
        this.model.sendFeedBackMessage(data, this.onSuccessFeedback.bind(this), this.onFailFeedback.bind(this));
        return false;
    };
    Controller.prototype.onSuccessFeedback = function (message) {
        this.view.loader.hide();
        this.view.sendFeedbackBox.displaySuccessMessage(message);
        document.forms[0].reset();
    };
    Controller.prototype.onFailFeedback = function (message) {
        this.view.loader.hide();
        this.view.sendFeedbackBox.displayError(message);
    };
    Controller.prototype.freeze = function () {
        this.freezeState = true;
        (function (context) {
            setTimeout(function () {
                context.freezeState = false;
            }, 200);
        })(this);
    };
    Controller.prototype.resetProfileBox = function () {
        var mainBox = this.view.profileConfigureBox;
        mainBox.reset(this.model.getUserLogin(), this.model.getUserEmail());
        this.view.loginLabel.text(this.model.getUserLogin());
        this.errors.clearErrors();
        this.successMessage = '';
        mainBox.displaySuccessMessage('Настройки не изменены.');
        mainBox.displayError('');
    };
    Controller.prototype.prepareChange = function (btn) {
        if (this.freezeState)
            return;
        this.freeze();
        var type = btn.data().fieldtype, stage = btn.text().toLowerCase(), mainBox = this.view.profileConfigureBox;
        switch (stage) {
            case 'изменить':
                mainBox.toggleInputState(type);
                btn.text('Подтвердить');
                break;
            case 'подтвердить':
                var check = this.model.checkInput(type, mainBox.getChangeInputValue(type));
                this.errors.clearErrors(type);
                if (check.state) {
                    mainBox.displaySuccessMessage('');
                    this.errors.addError('global', 'Нажмите "Сохранить изменения", чтобы отправить данные на сервер. Информация с ошибками не будет отправлена');
                    this.updateState[type] = true;
                }
                else {
                    this.errors.addError(type, check.message);
                    this.updateState[type] = false;
                }
                mainBox.toggleInputState(type);
                mainBox.displayError(this.errors.toString());
                btn.text('Изменить');
                break;
        }
    };
    Controller.prototype.sendChangesToServer = function () {
        var mainBox = this.view.profileConfigureBox;
        this.errors.clearErrors('global');
        this.successMessage = '';
        if (this.updateState.login) {
            this.view.loader.show();
            this.updateState.login = false;
            this.model.changeUserLogin(mainBox.getChangeInputValue('login'), this.successServerDataChange.bind(this, 'login'), this.errorServerDataChange.bind(this, 'login'));
        }
        if (this.updateState.email) {
            this.view.loader.show();
            this.updateState.email = false;
            this.model.changeUserEmail(mainBox.getChangeInputValue('email'), this.successServerDataChange.bind(this, 'email'), this.errorServerDataChange.bind(this, 'email'));
        }
    };
    Controller.prototype.successServerDataChange = function (type) {
        var mainBox = this.view.profileConfigureBox, view = this.view;
        switch (type) {
            case 'login':
                this.errors.clearErrors('login');
                this.successMessage += ' Логин был изменен.';
                view.loginLabel.text(this.model.getUserLogin());
                break;
            case 'email':
                this.errors.clearErrors('email');
                this.successMessage += ' Email был изменен.';
                break;
        }
        mainBox.displaySuccessMessage(this.successMessage);
        mainBox.displayError(this.errors.toString());
        view.loader.hide();
    };
    Controller.prototype.errorServerDataChange = function (type, message) {
        var mainBox = this.view.profileConfigureBox, view = this.view;
        switch (type) {
            case 'login':
                this.errors.clearErrors(type);
                this.errors.addError(type, message);
                mainBox.setChangeInputValue(type, this.model.getUserLogin());
                break;
            case 'email':
                this.errors.clearErrors(type);
                this.errors.addError(type, message);
                mainBox.setChangeInputValue(type, this.model.getUserEmail());
                break;
        }
        mainBox.displaySuccessMessage(this.successMessage);
        mainBox.displayError(this.errors.toString());
        view.loader.hide();
    };
    Controller.prototype.activatePreviewAvatar = function () {
        var changeAvatarBox = this.view.changeAvatarBox, file = changeAvatarBox.getFileFromInput();
        if (!file)
            return;
        var checking = this.model.checkImage(file);
        if (checking.state) {
            changeAvatarBox.hideError();
            changeAvatarBox.showAvatarPreview(file, this.view.loader);
        }
        else {
            changeAvatarBox.reset();
            changeAvatarBox.displayError(checking.message);
        }
    };
    Controller.prototype.uploadAvatar = function () {
        var changeAvatarBox = this.view.changeAvatarBox, file = changeAvatarBox.getFileFromInput();
        if (file) {
            this.view.loader.show();
            this.model.uploadAvatar(file, this.successUploadAvatar.bind(this), this.errorUploadAvatar.bind(this));
        }
    };
    Controller.prototype.successUploadAvatar = function (pathToImg) {
        var changeAvatarBox = this.view.changeAvatarBox, profileConfigureBox = this.view.profileConfigureBox;
        changeAvatarBox.userAvatarBox.attr('src', pathToImg + '?' + Date.now());
        changeAvatarBox.reset();
        changeAvatarBox.box.modal('hide');
        profileConfigureBox.displaySuccessMessage('Аватар был изменен');
        this.view.loader.hide();
    };
    Controller.prototype.errorUploadAvatar = function (message) {
        var changeAvatarBox = this.view.changeAvatarBox;
        changeAvatarBox.reset();
        changeAvatarBox.displayError(message);
        this.view.loader.hide();
    };
    Controller.prototype.sendNewPasswordToServer = function () {
        var passwordBox = this.view.changePasswordBox, data, checking;
        data = {
            oldPassword: passwordBox.getOldPasswordFromInput(),
            newPassword: passwordBox.getNewPasswordFromInput(),
            confirmNewPassword: passwordBox.getConfirmNewPasswordFromInput()
        };
        checking = this.model.checkPassword(data);
        if (checking.state) {
            this.view.loader.show();
            this.model.changePassword(data, this.successServerChangePassword.bind(this), this.errorServerChangePassword.bind(this));
        }
        else {
            passwordBox.reset();
            passwordBox.displayError(checking.message);
        }
    };
    Controller.prototype.successServerChangePassword = function () {
        var passwordBox = this.view.changePasswordBox, profileConfigureBox = this.view.profileConfigureBox;
        this.view.loader.hide();
        profileConfigureBox.displaySuccessMessage('Пароль был изменен. ');
        passwordBox.box.modal('hide');
    };
    Controller.prototype.errorServerChangePassword = function (message) {
        var passwordBox = this.view.changePasswordBox;
        this.view.loader.hide();
        passwordBox.reset();
        passwordBox.displayError(message);
    };
    Controller.prototype.hideLoader = function () {
        this.view.loader.hide();
    };
    return Controller;
}());
var Errors = (function () {
    function Errors() {
        this.global = [];
        this.login = [];
        this.email = [];
    }
    Errors.prototype.toString = function () {
        var totalErrors = [], cacheString, resultString = '';
        if (this.login.length > 0)
            totalErrors.push(this.login.join('<br>'));
        if (this.email.length > 0)
            totalErrors.push(this.email.join('<br>'));
        if (this.global.length > 0) {
            resultString = this.global.join('<br>');
        }
        cacheString = totalErrors.join('<br>');
        if (cacheString !== '') {
            cacheString = '<b>Ошибка!</b><br>' + cacheString;
        }
        if (resultString !== '' && cacheString !== '') {
            return resultString + '<br>' + cacheString;
        }
        if (resultString !== '')
            return resultString;
        if (cacheString !== '')
            return cacheString;
        return '';
    };
    Errors.prototype.addError = function (type, message) {
        if (Array.isArray(this[type])) {
            for (var i = 0; i < this[type].length; i++) {
                if (this[type][i] === message)
                    return true;
            }
            this[type].push(message);
            return true;
        }
        else {
            console.warn('Такого типа ошибок не существует.');
            return false;
        }
    };
    Errors.prototype.clearErrors = function (type) {
        if (type) {
            if (this[type]) {
                this[type] = [];
                return true;
            }
            else {
                console.warn('Такого типа ошибок не существует.');
                return false;
            }
        }
        for (var prop in this) {
            if (this.hasOwnProperty(prop) && Array.isArray(this[prop])) {
                this[prop].length = 0;
            }
        }
        return true;
    };
    return Errors;
}());
$('document').ready(function () {
    var app = new Controller();
    app.hideLoader();
    setTimeout(function () {
        var nav = $('.nav')[0], offset = $(nav).offset().top;
        nav.setAttribute('data-offset-top', offset.toString());
    }, 1000);
});
//# sourceMappingURL=app.js.map