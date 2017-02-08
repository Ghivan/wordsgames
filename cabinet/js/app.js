class Model {
    constructor(login, email) {
        this.urlChangeLogin = 'includes/change_scripts/change_login.php';
        this.urlChangeEmail = 'includes/change_scripts/change_email.php';
        this.urlChangePassword = 'includes/change_scripts/change_password.php';
        this.urlChangeAvatar = 'includes/change_scripts/change_avatar.php';
        this.urlSendFeedback = 'includes/change_scripts/send_feedback.php';
        this.PASSWORD_REG_EXP = /^[a-z0-9а-я_-]{6,18}$/i;
        this.LOGIN_REG_EXP = /^[a-z0-9а-я_-]{3,16}$/i;
        this.EMAIL_REG_EXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.MAX_IMAGE_SIZE = 500;
        let data = {
            login: login,
            email: email
        };
        this.user = new User(data);
    }
    getUserLogin() {
        return this.user.login;
    }
    getUserEmail() {
        return this.user.email;
    }
    checkInput(type, message) {
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
    }
    changeUserLogin(newLogin, success, error) {
        let checking;
        checking = this.checkLogin(newLogin);
        if (!checking.state) {
            error(checking.message);
            return;
        }
        let data = {
            login: newLogin
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
    }
    checkLogin(login) {
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
    }
    changeUserEmail(newEmail, success, error) {
        let checking = this.checkEmail(newEmail);
        if (!checking.state) {
            error(checking.message);
            return;
        }
        let data = {
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
    }
    checkEmail(email) {
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
    }
    changePassword(data, success, error) {
        let checking = this.checkPassword(data);
        if (!checking.state) {
            error(checking.message);
            return;
        }
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
    }
    checkPassword(data) {
        for (let prop in data) {
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
    }
    uploadAvatar(file, success, error) {
        let checking = this.checkImage(file);
        if (!checking.state) {
            error(checking.message);
            return;
        }
        let data = new FormData();
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
    }
    checkImage(img) {
        let size = img.size, type = img.type, allowedImageTypes = ['image/jpeg', 'image/png'];
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
    }
    sendFeedBackMessage(data, success, error) {
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
    }
}
class User {
    constructor(data) {
        this.login = data.login;
        this.email = data.email;
    }
}
class View {
    constructor() {
        this.loader = new Loader();
        this.profileConfigureBox = new ProfileConfigureBox();
        this.changeAvatarBox = new ChangeAvatarBox();
        this.changePasswordBox = new ChangePasswordBox();
        this.loginLabel = $('#userLoginLabel');
        this.unregisterBtn = $('#unregister');
        this.sendFeedbackBox = new SendFeedbackBox();
    }
}
class Loader {
    constructor() {
        this.box = $('#loader');
    }
    show() {
        this.box.show();
    }
    hide() {
        this.box.hide();
    }
}
class ProfileConfigureBox {
    constructor() {
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
    setChangeBtnTitle(btnFieldType, text) {
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
    }
    getChangeBtnTitle(btnFieldType) {
        switch (btnFieldType) {
            case 'login':
                return this.changeLoginBtn.text().trim();
            case 'email':
                return this.changeEmailBtn.text().trim();
            default:
                console.warn('Элемента ' + btnFieldType + ' не существует');
                return '';
        }
    }
    toggleInputState(inputType) {
        let input;
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
        let state = input.prop('disabled');
        if (state === true) {
            input.prop('disabled', false);
            input.focus();
            input.select();
        }
        if (state === false) {
            input.prop('disabled', true);
        }
    }
    setChangeInputValue(inputType, text) {
        let input;
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
    }
    getChangeInputValue(inputType) {
        let input;
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
    }
    displayError(errorMessage) {
        this.errorBox.html(errorMessage);
    }
    displaySuccessMessage(message) {
        this.successBox.html(message);
    }
    reset(login, email) {
        this.changeLoginInput.val(login);
        this.changeLoginInput.prop('disabled', true);
        this.changeEmailInput.val(email);
        this.changeEmailInput.prop('disabled', true);
        this.errorBox.html('');
        this.successBox.html('');
    }
}
class ChangeAvatarBox {
    constructor() {
        this.box = $('#change-avatar-box');
        this.errorBox = $('#change-avatar-error-box');
        this.previewBox = $('#avatar-preview-box');
        this.avatarFileInput = $('#change-avatar-input');
        this.uploadAvatarBtn = $('#change-avatar-btn');
        this.cancelBtn = $('#change-avatar-cancel-btn');
        this.userAvatarBox = $('#UserAvatar');
    }
    displayError(errorMessage) {
        this.errorBox.text(errorMessage);
    }
    hideError() {
        this.errorBox.text('');
    }
    showAvatarPreview(file, loader) {
        let reader = new FileReader(), previewBox = this.previewBox;
        loader.show();
        reader.readAsDataURL(file);
        reader.onload = function () {
            previewBox.attr('src', reader.result);
            loader.hide();
        };
    }
    getFileFromInput() {
        return this.avatarFileInput.prop('files')[0] || null;
    }
    reset() {
        this.hideError();
        this.previewBox.attr('src', this.userAvatarBox.attr('src'));
        this.avatarFileInput.val('');
    }
}
class ChangePasswordBox {
    constructor() {
        this.box = $('#change-password-box');
        this.errorBox = $('#change-password-error-box');
        this.oldPasswordInput = $('#old-password-input');
        this.newPasswordInput = $('#new-password-input');
        this.confirmNewPasswordInput = $('#сonfirm-new-password-input');
        this.sendChangesBtn = $('#change-password-btn');
        this.cancelBtn = $('#change-password-cancel-btn');
    }
    displayError(errorMessage) {
        this.errorBox.text(errorMessage);
    }
    hideError() {
        this.errorBox.text('');
    }
    getOldPasswordFromInput() {
        return this.oldPasswordInput.val().trim();
    }
    getNewPasswordFromInput() {
        return this.newPasswordInput.val().trim();
    }
    getConfirmNewPasswordFromInput() {
        return this.confirmNewPasswordInput.val().trim();
    }
    reset() {
        this.oldPasswordInput.val('');
        this.newPasswordInput.val('');
        this.confirmNewPasswordInput.val('');
        this.errorBox.text('');
    }
}
class SendFeedbackBox {
    constructor() {
        this.form = $('#feedbackForm');
        this.feedbackErrorBox = $('#feedback-error-box');
        this.feedbackErrorMessage = $('#feedback-error-message');
        this.feedbackSuccessBox = $('#feedback-success-box');
        this.feedbackSuccessMessage = $('#feedback-success-message');
    }
    displayError(message) {
        this.feedbackErrorMessage.text(message);
        this.feedbackErrorBox.modal('show');
    }
    displaySuccessMessage(message) {
        this.feedbackSuccessMessage.text(message);
        this.feedbackSuccessBox.modal('show');
    }
}
class Controller {
    constructor() {
        this.updateState = {
            login: false,
            email: false
        };
        this.successMessage = '';
        this.freezeState = false;
        let data = $('#profile-configure').data();
        this.model = new Model(data.login, data.email);
        this.view = new View();
        this.errors = new Errors();
        this.view.unregisterBtn.on('click', function (e) {
            e.preventDefault();
            e.cancelBubble = true;
            e.stopImmediatePropagation();
            $.post("/login/includes/unregister.php", function (data) {
                if (data.state) {
                    window.location.href = '/login/';
                }
                else {
                    alert('Нет соединения с сервером!');
                }
            });
        });
        let mainBox = this.view.profileConfigureBox;
        mainBox.changeLoginBtn.on('click', this.prepareChange.bind(this, mainBox.changeLoginBtn));
        mainBox.changeEmailBtn.on('click', this.prepareChange.bind(this, mainBox.changeEmailBtn));
        mainBox.changeLoginInput.on('focusout', this.prepareChange.bind(this, mainBox.changeLoginBtn));
        mainBox.changeEmailInput.on('focusout', this.prepareChange.bind(this, mainBox.changeEmailBtn));
        mainBox.sendChangesBtn.on('click', this.sendChangesToServer.bind(this));
        mainBox.box.on('hide.bs.modal', this.resetProfileBox.bind(this));
        let changeAvatarBox = this.view.changeAvatarBox;
        changeAvatarBox.avatarFileInput.on('change', this.activatePreviewAvatar.bind(this));
        changeAvatarBox.uploadAvatarBtn.on('click', this.uploadAvatar.bind(this));
        changeAvatarBox.box.on('hide.bs.modal', changeAvatarBox.reset.bind(changeAvatarBox));
        let passwordBox = this.view.changePasswordBox;
        passwordBox.sendChangesBtn.on('click', this.sendNewPasswordToServer.bind(this));
        passwordBox.box.on('hide.bs.modal', passwordBox.reset.bind(passwordBox));
        this.view.sendFeedbackBox.form.on('submit', this.sendFeedback.bind(this));
    }
    sendFeedback(e) {
        e.preventDefault();
        this.view.loader.show();
        let data = $(e.target).serialize().split("&").reduce(function (prev, curr) {
            let p = curr.split("=");
            prev[decodeURIComponent(p[0])] = decodeURIComponent(p[1]).trim();
            return prev;
        }, {});
        this.model.sendFeedBackMessage(data, this.onSuccessFeedback.bind(this), this.onFailFeedback.bind(this));
        return false;
    }
    onSuccessFeedback(message) {
        this.view.loader.hide();
        this.view.sendFeedbackBox.displaySuccessMessage(message);
    }
    onFailFeedback(message) {
        this.view.loader.hide();
        this.view.sendFeedbackBox.displayError(message);
    }
    freeze() {
        this.freezeState = true;
        (function (context) {
            setTimeout(function () {
                context.freezeState = false;
            }, 200);
        })(this);
    }
    resetProfileBox() {
        let mainBox = this.view.profileConfigureBox;
        mainBox.reset(this.model.getUserLogin(), this.model.getUserEmail());
        this.view.loginLabel.text(this.model.getUserLogin());
        this.errors.clearErrors();
        this.successMessage = '';
        mainBox.displaySuccessMessage('Настройки не изменены.');
        mainBox.displayError('');
    }
    prepareChange(btn) {
        if (this.freezeState)
            return;
        this.freeze();
        let type = btn.data().fieldtype, stage = btn.text().toLowerCase(), mainBox = this.view.profileConfigureBox;
        switch (stage) {
            case 'изменить':
                mainBox.toggleInputState(type);
                btn.text('Подтвердить');
                break;
            case 'подтвердить':
                let check = this.model.checkInput(type, mainBox.getChangeInputValue(type));
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
    }
    sendChangesToServer() {
        let mainBox = this.view.profileConfigureBox;
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
    }
    successServerDataChange(type) {
        let mainBox = this.view.profileConfigureBox, view = this.view;
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
    }
    errorServerDataChange(type, message) {
        let mainBox = this.view.profileConfigureBox, view = this.view;
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
    }
    activatePreviewAvatar() {
        let changeAvatarBox = this.view.changeAvatarBox, file = changeAvatarBox.getFileFromInput();
        if (!file)
            return;
        let checking = this.model.checkImage(file);
        if (checking.state) {
            changeAvatarBox.hideError();
            changeAvatarBox.showAvatarPreview(file, this.view.loader);
        }
        else {
            changeAvatarBox.reset();
            changeAvatarBox.displayError(checking.message);
        }
    }
    uploadAvatar() {
        let changeAvatarBox = this.view.changeAvatarBox, file = changeAvatarBox.getFileFromInput();
        if (file) {
            this.view.loader.show();
            this.model.uploadAvatar(file, this.successUploadAvatar.bind(this), this.errorUploadAvatar.bind(this));
        }
    }
    successUploadAvatar(pathToImg) {
        let changeAvatarBox = this.view.changeAvatarBox, profileConfigureBox = this.view.profileConfigureBox;
        changeAvatarBox.userAvatarBox.attr('src', pathToImg + '?' + Date.now());
        changeAvatarBox.reset();
        changeAvatarBox.box.modal('hide');
        profileConfigureBox.displaySuccessMessage('Аватар был изменен');
        this.view.loader.hide();
    }
    errorUploadAvatar(message) {
        let changeAvatarBox = this.view.changeAvatarBox;
        changeAvatarBox.reset();
        changeAvatarBox.displayError(message);
        this.view.loader.hide();
    }
    sendNewPasswordToServer() {
        let passwordBox = this.view.changePasswordBox, data, checking;
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
    }
    successServerChangePassword() {
        let passwordBox = this.view.changePasswordBox, profileConfigureBox = this.view.profileConfigureBox;
        this.view.loader.hide();
        profileConfigureBox.displaySuccessMessage('Пароль был изменен. ');
        passwordBox.box.modal('hide');
    }
    errorServerChangePassword(message) {
        let passwordBox = this.view.changePasswordBox;
        this.view.loader.hide();
        passwordBox.reset();
        passwordBox.displayError(message);
    }
    hideLoader() {
        this.view.loader.hide();
    }
}
class Errors {
    constructor() {
        this.global = [];
        this.login = [];
        this.email = [];
    }
    toString() {
        let totalErrors = [], cacheString, resultString = '';
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
    }
    addError(type, message) {
        if (Array.isArray(this[type])) {
            for (let i = 0; i < this[type].length; i++) {
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
    }
    clearErrors(type) {
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
        for (let prop in this) {
            if (this.hasOwnProperty(prop) && Array.isArray(this[prop])) {
                this[prop].length = 0;
            }
        }
        return true;
    }
}
$('document').ready(function () {
    let app = new Controller();
    app.hideLoader();
});
//# sourceMappingURL=app.js.map