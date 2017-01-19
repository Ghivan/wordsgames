let validator;
validator = {
    string: function (str) {
        str = str.trim();

        if (str.length === 0) {
            return {
                state: false,
                error: 'Ничего не введено'
            };
        }

        if (str.length < 4) {
            return {
                state: false,
                error: 'Введено менее 4 символов'
            };
        }

        return {
            state: true,
            error: 'None'
        };
    },

    email: function (str) {

        let regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!str.match(regExp) && str !== '') {
            return {
                state: false,
                error: 'Неверный email'
            };
        }

        return {
            state: true,
            error: 'None'
        };
    },

    password: function (str) {

        str = str.trim();

        if (str.length === 0) {
            return {
                state: false,
                error: 'Ничего не введено'
            };
        }

        if (str.length < 6) {
            return {
                state: false,
                error: 'Введено менее 6 символов'
            };
        }

        return {
            state: true,
            error: 'None'
        };
    },

    check: function (type, value) {
        let message = {
            state: null,
            error: 'Нет данных'
        };
        switch (type){
            case 'text':
                message = this.string(value);
                break;
            case 'email':
                message = this.email(value);
                break;
            case 'password':
                message = this.password(value);
                break;
        }

        return message;
    },

    displayError: function (elem, errMsg) {

        if (!(elem instanceof jQuery)) {
            console.warn(elem + ' не является объектом jQuery');
            return false;
        }

        elem.val(elem.val().trim());

        elem.parent().addClass('has-error');

        let glAlert = elem.parent().find('.glyphicon-alert'),
            errBox = elem.parent().next();


        glAlert.removeClass('hidden');
        errBox.text('Ошибка! ' + errMsg.trim());
        errBox.parent().css('padding-bottom', 0);
        errBox.removeClass('hidden');
    },

    resetErrorState: function () {
        for (let i = 0; i < arguments.length; i++) {
            if (!(arguments[i] instanceof jQuery)) {
                console.warn(arguments[i] + ' не является объектом jQuery');
                return false;
            }

            arguments[i].parent().removeClass('has-error');

            let glAlert = arguments[i].parent().find('.glyphicon-alert'),
                errBox = arguments[i].parent().next();

            glAlert.addClass('hidden');
            errBox.addClass('hidden');
            errBox.parent().css('padding-bottom', 30);
        }
    },

    registerUser: function () {
        let fields ={
                username: $('#new-user'),
                pswrd: $('#new-pswrd'),
                cpswrd: $('#c-new-pswrd'),
                email: $('#new-email'),
        },
            hasErrors = false,
            check = validator.check.bind(validator);

        validator.resetErrorState(fields.username, fields.pswrd, fields.cpswrd, fields.email);
        fields.email.val(fields.email.val().trim());

        for (let key in fields){
            if (fields.hasOwnProperty(key)){
                let validation = check(fields[key].prop('type'), fields[key].val());
                if (validation.state !== null){
                    if (!validation.state){
                        validator.displayError(fields[key], validation.error);
                        hasErrors = true;
                    }
                }
            }
        }

        if (fields.pswrd.val() !== fields.cpswrd.val()) {
            hasErrors = true;
            validator.displayError(fields.cpswrd, 'Введенные пароли не совпадают.');
        }

        if (!hasErrors) {
            let data = {
                login: fields.username.val().trim(),
                pswrd: fields.pswrd.val().trim(),
                cpswrd: fields.cpswrd.val().trim(),
                email: fields.email.val().trim(),
                submit: true
            };

            $.post("/login/includes/register.php", data, function (data) {
                if (data.state) {
                    window.location.href = '/cabinet/';
                } else {
                    validator.showAlertBlock(data.message);
                    fields.pswrd.val('');
                    fields.cpswrd.val('');
                }
            });
        }

    },

    loginUser: function () {
        let fields ={
                username: $('#user'),
                pswrd: $('#pswrd'),
            },
            hasErrors = false,
            check = validator.check.bind(validator);

        validator.resetErrorState(fields.username, fields.pswrd);

        for (let key in fields){
            if (fields.hasOwnProperty(key)){
                let validation = check(fields[key].prop('type'), fields[key].val());
                if (validation.state !== null){
                    if (!validation.state){
                        validator.displayError(fields[key], validation.error);
                        hasErrors = true;
                    }
                }
            }
        }

        if (!hasErrors) {
            let data = {
                login: fields.username.val().trim(),
                pswrd: fields.pswrd.val().trim(),
                submit: true
            };

            $.post("/login/includes/login.php", data, function (data) {
                if (data.state) {
                    window.location.href = '/cabinet/';
                } else {
                    validator.showAlertBlock(data.message);
                    fields.pswrd.val('');
                }
            });
        }

    },

    showAlertBlock: function (message) {
        // <div class="alert alert-success alert-dismissable">
        //     <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
        // <strong>Success!</strong> Indicates a successful or positive action.
        // </div>
            let alertBox = $('<div class="alert alert-danger alert-dismissible" role="alert" id="registerError"></div>');
            alertBox.append('<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>');
            alertBox.append('<strong>Ошибка!</strong>');
            alertBox.append(' ' + message);
            $('h1').after(alertBox);
    }
};
$(document).ready(function() {
    $("#register-button").on('click',validator.registerUser);

    $("#login-button").on('click',validator.loginUser);


    $('input').each(function () {
        "use strict";
        let check = validator.check.bind(validator);
        $(this).on('change', function(){
            let validation = check($(this).prop('type'), $(this).val());
            if (validation.state !== null){
                if (!validation.state){
                    validator.displayError($(this), validation.error);
                } else {
                    validator.resetErrorState($(this));
                }

            }
        });

    });



    $(document).keyup(function(e) {
        if (e.keyCode === 13){
            if ($('#register').hasClass('active')){
                validator.registerUser();
            }

            if ($('#login').hasClass('active')){
                validator.loginUser();
            }
        }


    });
});





