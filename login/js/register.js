var validator = {
    string: function(str){
        str = str.trim();

        if (str.length == 0){
            return {
                state: false,
                error: 'Ничего не введено'
            }
        }

        if (str.length < 4){
            return {
                state: false,
                error: 'Введено менее 4 символов'
            }
        }

        return  {
            state: true,
            error: 'None'
        }
    },

    email: function(str){

        let regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!str.match(regExp)) {
            return {
                state: false,
                error: 'Неверный email'
            }
        }

        return {
            state: true,
            error: 'None'
        }
    },

    password: function(str){

        str = str.trim();

        if (str.length == 0){
            return {
                state: false,
                error: 'Ничего не введено'
            }
        }

        if (str.length < 6){
            return {
                state: false,
                error: 'Введено менее 6 символов'
            }
        }

        return {
            state: true,
            error: 'None'
        }
    },

    displayError: function(elem, errMsg) {

        if (!(elem instanceof jQuery)){
            console.warn(elem + ' не является объектом jQuery');
            return false;
        }

        elem.parent().addClass('has-error');

        let glAlert = elem.parent().find('.glyphicon-alert'),
            errBox = elem.parent().next();

        glAlert.removeClass('hidden');
        errBox.text('Ошибка! '+ errMsg.trim());
        errBox.parent().css('padding-bottom', 0);
        errBox.removeClass('hidden');
    },

    resetErrorState: function() {
        for (let i = 0; i < arguments.length; i++){
            if (!(arguments[i] instanceof jQuery)){
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
    registerUser: function() {
        let username = $('#new-user'),
            pswrd = $('#new-pswrd'),
            cpswrd = $('#c-new-pswrd'),
            email = $('#new-email'),
            hasErrors = false,
            check;

        validator.resetErrorState(username, pswrd,cpswrd,email);

        check = validator.string(username.val());
        if (!check.state){
            hasErrors = true;
            validator.displayError(username, check.error);
        }

        check = validator.password(pswrd.val());
        if (!check.state){
            hasErrors = true;
            validator.displayError(pswrd, check.error);
        }

        if (pswrd.val() != cpswrd.val()){
            hasErrors = true;
            validator.displayError(cpswrd, 'Введенные пароли не совпадают.');
        }

        check = validator.email(email.val());
        if (!check.state && email.val().trim() != ''){
            hasErrors = true;
            validator.displayError(email, check.error);
        }

        if (!hasErrors){
            let data = {
                login: username.val().trim(),
                pswrd: pswrd.val().trim(),
                cpswrd: cpswrd.val().trim(),
                submit: true
            };
            if (email.val().trim()){
                data.email = email.val().trim();
            }
            $.post("/login/includes/register.php", data, function(data) {
                if (data.state){
                    window.location.href = '/cabinet/';
                } else {
                    alert(data.message);
                }
            })
        }

    },
    loginUser: function() {
        let username = $('#user'),
            pswrd = $('#pswrd'),
            hasErrors = false,
            check;

        validator.resetErrorState(username, pswrd);

        check = validator.string(username.val());
        if (!check.state){
            hasErrors = true;
            validator.displayError(username, check.error);
        }

        check = validator.password(pswrd.val());
        if (!check.state){
            hasErrors = true;
            validator.displayError(pswrd, check.error);
        }

        if (!hasErrors){
            let data = {
                login: username.val().trim(),
                pswrd: pswrd.val().trim(),
                submit: true
            };
            $.post("/login/includes/login.php", data, function(data) {
                if (data.state){
                    window.location.href = '/cabinet/';
                } else {
                    alert(data.message);
                }
            })
        }

    }
};

$(document).ready(function() {
    $("#register-button").on('click',validator.registerUser);

    $("#login-button").on('click',validator.loginUser);

    //Проверка налету
    $('#user').on('change', function(){
        let check = validator.string($(this).val());
        if (!check.state){
            validator.displayError($(this), check.error);
        } else {
            validator.resetErrorState($(this));
        }
    });

    $('#new-user').on('change', function(){
        let check = validator.string($(this).val());
        if (!check.state){
            $(this).paddingBottom -= 35;
            validator.displayError($(this), check.error);
        } else {
            validator.resetErrorState($(this));
        }
    });

    $('#pswrd').on('change', function(){
        let check = validator.password($(this).val());
        if (!check.state){
            validator.displayError($(this), check.error);
        } else {
            validator.resetErrorState($(this));
        }
    });

    $('#new-pswrd').on('change', function(){
        let check = validator.password($(this).val());
        if (!check.state){
            validator.displayError($(this), check.error);
        } else {
            validator.resetErrorState($(this));
        }
    });

    $('#c-new-pswrd').on('change', function(){
        let check = validator.password($(this).val());
        if ($(this).val() != $('#new-pswrd').val()){
            validator.displayError($(this), 'Введенные пароли не совпадают.')
        } else {
            validator.resetErrorState($(this));
        }

        if (!check.state){
            validator.displayError($(this), check.error);
        } else {
            validator.resetErrorState($(this));
        }
    });

    $('#new-email').on('change', function(){
        let check = validator.email($(this).val());
        if (!check.state && $(this).val().trim() != ''){
            validator.displayError($(this), check.error);
        } else {
            validator.resetErrorState($(this));
        }
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





