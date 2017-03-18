var Model = (function () {
    function Model() {
        this.LOGIN_REG_EXP = /^[a-z0-9а-я_-]{3,16}$/i;
        this.PASSWORD_REG_EXP = /^[a-z0-9а-я_-]{6,18}$/i;
        this.EMAIL_REG_EXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.URL_LOGIN = 'server_scenarios/index.php';
        this.URL_REGISTER = 'server_scenarios/index.php';
        this.errors = new Errors();
    }
    Model.prototype.getError = function (type) {
        if (this.errors[type] !== undefined) {
            return this.errors[type];
        }
        else {
            console.warn('Такого типа ошибок не существует.');
            return '';
        }
    };
    Model.prototype.removeErrors = function (type) {
        if (type) {
            return this.errors.clearErrors(type);
        }
        else {
            return this.errors.clearErrors();
        }
    };
    Model.prototype.addError = function (type, message) {
        return this.errors.addError(type, message);
    };
    Model.prototype.login = function (login, password, success, error) {
        var checking = {
            login: this.checkLogin(login),
            password: this.checkPassword(password)
        };
        if (checking.login.state && checking.password.state) {
            var data = {
                action: 'login',
                login: login,
                pswrd: password,
            };
            this.sendRequest(this.URL_LOGIN, data, success, error);
        }
        else {
            if (!checking.login.state) {
                this.addError('login', checking.login.message);
            }
            if (!checking.password.state) {
                this.addError('password', checking.password.message);
            }
            error();
        }
    };
    Model.prototype.register = function (information, success, error) {
        var checking = {
            login: this.checkLogin(information.login),
            password: this.checkPassword(information.password),
            confirmPassword: this.checkPassword(information.confirmPassword),
            email: (information.email) ? this.checkEmail(information.email) : { state: true }
        };
        if (checking.login.state &&
            checking.password.state &&
            checking.confirmPassword.state &&
            checking.email.state &&
            (information.password === information.confirmPassword)) {
            var data = {
                action: 'register',
                login: information.login,
                pswrd: information.password,
                cpswrd: information.confirmPassword,
                email: (information.email) ? information.email : ''
            };
            this.sendRequest(this.URL_REGISTER, data, success, error);
        }
        else {
            if (!checking.login.state) {
                this.addError('login', checking.login.message);
            }
            if (!checking.password.state) {
                this.addError('password', checking.password.message);
            }
            if (!checking.confirmPassword.state) {
                this.addError('confirmPassword', checking.confirmPassword.message);
            }
            if (!checking.email.state) {
                this.addError('email', checking.email.message);
            }
            if (information.password !== information.confirmPassword) {
                this.addError('confirmPassword', 'Введенные пароли не совпадают');
            }
            error();
        }
    };
    Model.prototype.sendRequest = function (url, data, success, error) {
        var errors = this.errors;
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            success: function (data) {
                if (data.state) {
                    success();
                }
                else {
                    errors.addError('global', data.message);
                    error();
                }
            },
            error: function (data) {
                errors.addError('global', 'Ошибка соединения с сервером.');
                error();
            }
        });
    };
    Model.prototype.checkInput = function (type, message) {
        switch (type) {
            case 'login':
                return this.checkLogin(message);
            case 'email':
                return this.checkEmail(message);
            case 'password':
            case 'confirmPassword':
                return this.checkPassword(message);
            default:
                console.warn('Проверки по ' + type + ' не существует!');
                return {
                    state: false,
                    message: 'Неверные данные!'
                };
        }
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
        return {
            state: true
        };
    };
    Model.prototype.checkEmail = function (email) {
        if (email === '') {
            return {
                state: true
            };
        }
        if (!email.match(this.EMAIL_REG_EXP)) {
            return {
                state: false,
                message: 'Неверный формат email.'
            };
        }
        return {
            state: true
        };
    };
    Model.prototype.checkPassword = function (password) {
        if (password === '') {
            return {
                state: false,
                message: 'Поле пароля не должно быть пустым!'
            };
        }
        if (!password.match(this.PASSWORD_REG_EXP)) {
            return {
                state: false,
                message: 'Пароль должен состоять из букв, цифр, дефисов и подчёркиваний, от 6 до 16 символов.'
            };
        }
        return {
            state: true
        };
    };
    return Model;
}());
var Errors = (function () {
    function Errors() {
        this.global = '';
        this.login = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
    }
    Errors.prototype.addError = function (type, message) {
        if (this[type] !== undefined) {
            this[type] = message;
            return true;
        }
        else {
            console.warn('Такого типа ошибок не существует.');
            return false;
        }
    };
    Errors.prototype.clearErrors = function (type) {
        if (type) {
            if (this[type] !== undefined) {
                this[type] = '';
                return true;
            }
            else {
                console.warn('Такого типа ошибок не существует.');
                return false;
            }
        }
        for (var prop in this) {
            if (this.hasOwnProperty(prop) && typeof this[prop] === "string") {
                this[prop] = '';
            }
        }
        return true;
    };
    return Errors;
}());
var View = (function () {
    function View() {
        this.auth = new Authorisation();
        this.registration = new Registration();
        this.globalErrorMessage = $('#global-error-message');
        this.globalErrorMessageBox = this.globalErrorMessage.parent();
        this.loader = new Loader();
    }
    View.prototype.showError = function (context, message) {
        if (context.pane === 'global') {
            this.globalErrorMessage.text(message);
            this.globalErrorMessageBox.removeClass('hidden');
        }
        if (context.pane === 'auth') {
            this.auth.displayError(context.field, message);
        }
        if (context.pane === 'registration') {
            this.registration.displayError(context.field, message);
        }
    };
    View.prototype.hideError = function (context) {
        if (context.pane === 'global') {
            this.globalErrorMessage.text('');
            this.globalErrorMessageBox.addClass('hidden');
        }
        if (context.pane === 'auth') {
            this.auth.hideError(context.field);
        }
        if (context.pane === 'registration') {
            this.registration.hideError(context.field);
        }
    };
    View.prototype.reset = function () {
        this.hideError({ pane: "global" });
        this.auth.reset();
        this.registration.reset();
    };
    return View;
}());
var Authorisation = (function () {
    function Authorisation() {
        this.loginInput = $('#user');
        this.loginInputGroup = this.loginInput.parent();
        this.loginErrorBox = $('#enter-login-error');
        this.loginGlyphError = this.loginInputGroup.children('.glyphicon.glyphicon-alert');
        this.passwordInput = $('#pswrd');
        this.passwordInputGroup = this.passwordInput.parent();
        this.passwordErrorBox = $('#enter-pswrd-error');
        this.passwordGlyphError = this.passwordInputGroup.children('.glyphicon.glyphicon-alert');
        this.loginBtn = $('#login-button');
    }
    Authorisation.prototype.displayError = function (type, message) {
        this[type + 'ErrorBox'].text(message);
        this[type + 'InputGroup'].addClass('has-error');
        this[type + 'GlyphError'].removeClass('hidden');
    };
    Authorisation.prototype.hideError = function (type) {
        this[type + 'ErrorBox'].text('');
        this[type + 'InputGroup'].removeClass('has-error');
        this[type + 'GlyphError'].addClass('hidden');
    };
    Authorisation.prototype.setInputVal = function (type, message) {
        this[type + 'Input'].val(message);
    };
    Authorisation.prototype.getInputVal = function (type) {
        return this[type + 'Input'].val().trim();
    };
    Authorisation.prototype.reset = function () {
        this.hideError('login');
        this.hideError('password');
        this.setInputVal('login', '');
        this.setInputVal('password', '');
    };
    return Authorisation;
}());
var Registration = (function () {
    function Registration() {
        this.loginInput = $('#new-user');
        this.loginInputGroup = this.loginInput.parent();
        this.loginErrorBox = $('#register-login-error');
        this.loginGlyphError = this.loginInputGroup.children('.glyphicon.glyphicon-alert');
        this.passwordInput = $('#new-pswrd');
        this.passwordInputGroup = this.passwordInput.parent();
        this.passwordErrorBox = $('#register-pswrd-error');
        this.passwordGlyphError = this.passwordInputGroup.children('.glyphicon.glyphicon-alert');
        this.confirmPasswordInput = $('#c-new-pswrd');
        this.confirmPasswordInputGroup = this.confirmPasswordInput.parent();
        this.confirmPasswordErrorBox = $('#register-cpswrd-error');
        this.confirmPasswordGlyphError = this.confirmPasswordInputGroup.children('.glyphicon.glyphicon-alert');
        this.emailInput = $('#new-email');
        this.emailInputGroup = this.emailInput.parent();
        this.emailErrorBox = $('#register-email-error');
        this.emailGlyphError = this.emailInputGroup.children('.glyphicon.glyphicon-alert');
        this.registerBtn = $('#register-button');
    }
    Registration.prototype.displayError = function (type, message) {
        this[type + 'ErrorBox'].text(message);
        this[type + 'InputGroup'].addClass('has-error');
        this[type + 'GlyphError'].removeClass('hidden');
    };
    Registration.prototype.hideError = function (type) {
        this[type + 'ErrorBox'].text('');
        this[type + 'InputGroup'].removeClass('has-error');
        this[type + 'GlyphError'].addClass('hidden');
    };
    Registration.prototype.setInputVal = function (type, message) {
        this[type + 'Input'].val(message);
    };
    Registration.prototype.getInputVal = function (type) {
        return this[type + 'Input'].val().trim();
    };
    Registration.prototype.reset = function () {
        this.hideError('login');
        this.hideError('password');
        this.hideError('confirmPassword');
        this.hideError('email');
        this.setInputVal('login', '');
        this.setInputVal('password', '');
        this.setInputVal('confirmPassword', '');
        this.setInputVal('email', '');
    };
    return Registration;
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
var Controller = (function () {
    function Controller() {
        this.model = new Model();
        this.view = new View();
        $('.nav-tabs a').on('show.bs.tab', this.view.reset.bind(this.view));
        var authorize = this.authorize.bind(this), register = this.register.bind(this);
        this.view.auth.loginBtn.on('click', authorize);
        this.view.registration.registerBtn.on('click', register);
        $('input').on('keyup', function (e) {
            if (e.keyCode === 13) {
                var inputs = $(this).closest('form').find(':input');
                inputs.eq(inputs.index(this) + 1).focus();
            }
        });
        var auth = this.view.auth;
        auth.loginInput.on('focusout', this.performChecking.bind(this, { pane: 'auth',
            field: 'login'
        }));
        auth.loginInput.on('focusin', this.view.hideError.bind(this.view, {
            pane: 'auth',
            field: 'login'
        }));
        auth.passwordInput.on('focusout', this.performChecking.bind(this, { pane: 'auth',
            field: 'password'
        }));
        auth.passwordInput.on('focusin', this.view.hideError.bind(this.view, {
            pane: 'auth',
            field: 'password'
        }));
        var reg = this.view.registration;
        reg.loginInput.on('focusout', this.performChecking.bind(this, { pane: 'registration',
            field: 'login'
        }));
        reg.loginInput.on('focusin', this.view.hideError.bind(this.view, {
            pane: 'registration',
            field: 'login'
        }));
        reg.passwordInput.on('focusout', this.performChecking.bind(this, { pane: 'registration',
            field: 'password'
        }));
        reg.passwordInput.on('focusin', this.view.hideError.bind(this.view, {
            pane: 'registration',
            field: 'password'
        }));
        reg.confirmPasswordInput.on('focusout', this.performChecking.bind(this, { pane: 'registration',
            field: 'confirmPassword'
        }));
        reg.confirmPasswordInput.on('focusin', this.view.hideError.bind(this.view, {
            pane: 'registration',
            field: 'confirmPassword'
        }));
        reg.emailInput.on('focusout', this.performChecking.bind(this, { pane: 'registration',
            field: 'email'
        }));
        reg.emailInput.on('focusin', this.view.hideError.bind(this.view, {
            pane: 'registration',
            field: 'email'
        }));
        this.view.loader.hide();
    }
    Controller.prototype.authorize = function () {
        var model = this.model, authPanel = this.view.auth, login = authPanel.getInputVal('login'), password = authPanel.getInputVal('password');
        model.removeErrors();
        this.view.loader.show();
        model.login(login, password, this.onAuthSuccess, this.onAuthFail.bind(this));
    };
    Controller.prototype.onAuthSuccess = function () {
        window.location.href = '/cabinet/';
    };
    Controller.prototype.onAuthFail = function () {
        this.view.reset();
        this.view.loader.hide();
        if (this.model.getError('global')) {
            this.view.showError({ pane: 'global' }, this.model.getError('global'));
        }
        if (this.model.getError('login')) {
            this.view.showError({ pane: 'auth', field: 'login' }, this.model.getError('login'));
        }
        if (this.model.getError('password')) {
            this.view.showError({ pane: 'auth', field: 'password' }, this.model.getError('password'));
        }
    };
    Controller.prototype.register = function () {
        var model = this.model, regPanel = this.view.registration, data = {
            login: regPanel.getInputVal('login'),
            password: regPanel.getInputVal('password'),
            confirmPassword: regPanel.getInputVal('confirmPassword'),
            email: regPanel.getInputVal('email')
        };
        this.view.loader.show();
        model.removeErrors();
        model.register(data, this.onAuthSuccess, this.onRegFail.bind(this));
    };
    Controller.prototype.onRegFail = function () {
        this.view.reset();
        this.view.loader.hide();
        if (this.model.getError('global')) {
            this.view.showError({ pane: 'global' }, this.model.getError('global'));
        }
        if (this.model.getError('login')) {
            this.view.showError({ pane: 'registration', field: 'login' }, this.model.getError('login'));
        }
        if (this.model.getError('password')) {
            this.view.showError({ pane: 'registration', field: 'password' }, this.model.getError('password'));
        }
        if (this.model.getError('confirmPassword')) {
            this.view.showError({ pane: 'registration', field: 'confirmPassword' }, this.model.getError('confirmPassword'));
        }
        if (this.model.getError('email')) {
            this.view.showError({ pane: 'registration', field: 'email' }, this.model.getError('email'));
        }
    };
    Controller.prototype.performChecking = function (context) {
        var input = context.field, checking = this.model.checkInput(context.field, this.view[context.pane].getInputVal(input));
        this.view.hideError(context);
        this.model.removeErrors(input);
        if (!checking.state) {
            this.view.showError(context, checking.message);
            this.model.addError(input, checking.message);
        }
        if (context.pane === "registration" && (input === 'password' || 'confirmPassword')) {
            this.passwordComparing();
        }
    };
    Controller.prototype.passwordComparing = function () {
        var password = this.view.registration.getInputVal('password'), confirmPassword = this.view.registration.getInputVal('confirmPassword');
        if (password !== confirmPassword) {
            this.view.showError({ pane: 'registration', field: 'confirmPassword' }, 'Введенные пароли не совпадают');
            this.model.addError('confirmPassword', 'Введенные пароли не совпадают');
        }
        else {
            this.view.hideError({ pane: 'registration', field: 'confirmPassword' });
            this.model.removeErrors('confirmPassword');
        }
    };
    return Controller;
}());
$('document').ready(function () {
    var app = new Controller();
});
//# sourceMappingURL=reg.js.map