let userData ={
    dataChanged: false,
    serverSuccess: false,
    login: '',
    loginChanged: false,
    email: '',
    emailChanged: false,
    updateReminder: function(){
        let reminder = $('#changesReminder');
        if (reminder.hasClass('text-success')){
            reminder.removeClass('text-success');
            reminder.text('Нажмите "Сохранить изменения", чтобы отправить данные на сервер');
            reminder.addClass('text-danger');
        }

    },

    changeLogin: function (btn) {
        let input = $('#user');
        switch (btn.text()){
            case 'Изменить логин':
                input.prop('disabled', false);
                input.focus();
                input.select();
                btn.text('Подтвердить');
                break;
            case 'Подтвердить':
                if (input.val().trim() !== '' && userData.login !== input.val()){
                    userData.login = input.val();
                    userData.dataChanged = true;
                    userData.loginChanged = true;
                    userData.updateReminder();
                }
                input.prop('disabled', true);
                btn.text('Изменить логин');
                break;
        }
    },

    changeEmail: function (btn){
        let input = $('#email');
        switch (btn.text()){
            case 'Изменить email':
                input.prop('disabled', false);
                input.focus();
                input.select();
                btn.text('Подтвердить');
                break;
            case 'Подтвердить':
                if (input.val().trim() !== '' && userData.email !== input.val()){
                    userData.email = input.val();
                    userData.dataChanged = true;
                    userData.emailChanged = true;
                    userData.updateReminder();
                }
                input.prop('disabled', true);
                btn.text('Изменить email');
                break;
        }

    },

    sendChanges: function(){
        let reminder = $('#changesReminder'),
            answerSuccess = $('#answerReminder');

        reminder.html('');
        answerSuccess.html('');

        if (userData.loginChanged){
            let data = {
                login: userData.login
            };

            $.post("change_scripts/change_login.php", data, function (data) {
                if (!data.state) {
                    reminder.html(reminder.html() + data.message + '<br>');
                    reminder.addClass('text-danger');
                } else {
                    answerSuccess.html(answerSuccess.html() + 'Логин изменен' + '<br>');
                    userData.serverSuccess = true;
                }
            });
        }

        if (userData.emailChanged){
            let data = {
                email: userData.email
            };

            $.post("change_scripts/change_email.php", data, function (data) {
                if (!data.state) {
                    reminder.html(reminder.html() + data.message + '<br>');
                    reminder.addClass('text-danger');
                }else {
                    answerSuccess.html(answerSuccess.html() + 'Email изменен' + '<br>');
                    userData.serverSuccess = true;
                }

            });
        }


    }
};

$('document').ready(function () {
    let change_login_btn = $('#change-login-btn'),
        change_email_btn = $('#change-email-btn'),
        serverSenderBtn = $('#ServerDataSender');

    userData.login = $('#user').prop('placeholder');
    userData.email = $('#email').prop('placeholder');

    change_login_btn.on('click', function () {
        userData.changeLogin(change_login_btn);
    });

    change_email_btn.on('click', function () {
        userData.changeEmail(change_email_btn);
    });

    $('#profile-configure').on('hide.bs.modal', function () {
        if (userData.serverSuccess){
            window.location.href = '/cabinet/';
        }
    });


    serverSenderBtn.on('click', function () {
        if (!userData.dataChanged){
            $('#profile-configure').modal('hide');
        }
        userData.sendChanges();
    });


});