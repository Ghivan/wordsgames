let userData ={
        freeze: false,
        dataChanged: false,
        serverSuccess: false,
        login: '',
        newLogin: false,
        email: '',
        newEmail: false,
        updateReminder: function(){
            $('#profile-configure-success-box').text('');
            $('#profile-configure-error-box').text('Нажмите "Сохранить изменения", чтобы отправить данные на сервер');
        },

        changeLogin: function (btn) {
            if (userData.freeze) {
                return;
            }
            let input = $('#change-login-input');
            switch (btn.text()){
                case 'Изменить логин':
                    input.prop('disabled', false);
                    input.focus();
                    input.select();
                    btn.text('Подтвердить');
                    break;
                case 'Подтвердить':
                    if (input.val().trim() !== '' && userData.login !== input.val()){
                        userData.newLogin = input.val();
                        userData.dataChanged = true;
                        userData.updateReminder();
                    }
                    input.prop('disabled', true);
                    btn.text('Изменить логин');
                    break;
            }
        },

        changeEmail: function (btn){
            if (userData.freeze) {
                return;
            }
            let input = $('#change-email-input');
            switch (btn.text()){
                case 'Изменить email':
                    input.prop('disabled', false);
                    input.focus();
                    input.select();
                    btn.text('Подтвердить');
                    break;
                case 'Подтвердить':
                    if (input.val().trim() !== '' && userData.email !== input.val()){
                        userData.newEmail = input.val();
                        userData.dataChanged = true;
                        userData.updateReminder();
                    }
                    input.prop('disabled', true);
                    btn.text('Изменить email');
                    break;
            }

        },

        verifyImage: function(file){
            let size = file.size,
                type = file.type,
                imageTypes = ['image/jpeg', 'image/png'],
                MAX_IMAGE_SIZE = 2097152,
                convenientImage = true,
                errorMessage = '';


            if (imageTypes.indexOf(type) < 0){
                convenientImage = false;
                errorMessage = 'Формат файла не jpg или png';
            }

            if (size > MAX_IMAGE_SIZE){
                convenientImage = false;
                errorMessage = 'Размер файла больше 2 Mb';
            }

            return {
                state: convenientImage,
                message: errorMessage
            };
        },

        previewAvatar: function(){
            let errorBox = $('#change-avatar-error-box');
            errorBox.html('');

            if (this.files && this.files[0]){
                let file = this.files[0],
                    check = userData.verifyImage(file),
                    reader = new FileReader();

                if (check.state){
                    reader.readAsDataURL(file);
                    view.addLoader();
                    reader.onload = function(){
                        $('#avatar-preview-box').attr('src', reader.result);
                        view.removeLoader();
                    };
                } else {
                    errorBox.text(check.message);
                    this.value = '';
                }

            }
        },

        changeAvatar: function(){
            let fileInput = $('#change-avatar-input'),
                file = fileInput.prop('files')[0] || null;
            if (file){
                view.addLoader();
                let check = userData.verifyImage(file),
                    errorBox = $('#change-avatar-error-box');

                if (check.state){
                    let formData = new FormData();
                    formData.append('userAvatar', file);

                    $.ajax({
                        url: 'includes/change_scripts/change_avatar.php',
                        type: 'POST',
                        success: function(data){
                            view.removeLoader();
                            if (data.state){
                                $('#UserAvatar').prop('src', data.src + '?' + Date.now());
                                fileInput.val('');
                            } else {
                                $('#profile-configure-error-box').html(data.message);
                            }
                            $('#change-avatar-box').modal('hide');
                            $('#profile-configure-success-box').html('Аватар изменен');

                        },

                        error: function(data){
                            errorBox.text('Ошибка соединения с сервером');
                            view.removeLoader();

                        },

                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false
                    });
                } else {
                    errorBox.text(check.message);
                    fileInput.val('');
                }
            }

        },

        sendChanges: function(){
            let reminder = $('#profile-configure-error-box'),
                answerSuccess = $('#profile-configure-success-box');

            reminder.html('');
            answerSuccess.html('');

            if (userData.newLogin){
                let data = {
                    login: userData.newLogin
                };

                view.addLoader();

                $.ajax({
                    url: 'includes/change_scripts/change_login.php',

                    type: 'POST',
                    success: function(data){
                        view.removeLoader();
                        if (!data.state) {
                            reminder.html(reminder.html() + data.message + '<br>');
                            $('#change-login-input').val(userData.login);
                            userData.newLogin = false;

                        } else {
                            answerSuccess.html(answerSuccess.html() + 'Логин изменен' + '<br>');
                            userData.login = userData.newLogin;
                            userData.newLogin = false;
                            userData.serverSuccess = true;
                        }
                    },

                    error: function(data){
                        reminder.html('Ошибка соединения с сервером');
                        view.removeLoader();
                    },

                    data: data
                });
            }

            if (userData.newEmail){
                let data = {
                    email: userData.newEmail
                };
                view.addLoader();

                $.ajax({
                    url: 'includes/change_scripts/change_email.php',
                    type: 'POST',
                    success: function(data){
                        view.removeLoader();
                        if (!data.state) {
                            reminder.html(reminder.html() + data.message + '<br>');
                            $('#change-email-input').val(userData.email);
                            userData.newEmail = false;
                        } else {
                            answerSuccess.html(answerSuccess.html() + 'Email изменен' + '<br>');
                            userData.email = userData.newEmail;
                            userData.newEmail = false;
                            userData.serverSuccess = true;
                        }
                    },

                    error: function(data){
                        reminder.html('Ошибка соединения с сервером');
                        view.removeLoader();
                    },

                    data: data
                });
            }
        },

        verifyPasswords: function(oldPassword, newPassword, cNewPassword){
            if (oldPassword.val() === newPassword.val()){
                return {
                    state: false,
                    message: 'Старый и новый пароль одинаковы'
                };
            }

            if (newPassword.val() !== cNewPassword.val()){
                return {
                    state: false,
                    message: 'Новый пароль и подтверждение не совпадают'
                };
            }

            return {
                state: true
            };
        },

        changePassword: function () {
            let oldPassword = $('#old-password-input'),
                newPassword = $('#new-password-input'),
                cNewPassword = $('#сonfirm-new-password-input'),
                errorBox = $('#change-password-error-box'),
                answerSuccess = $('#profile-configure-success-box'),
                check = false;

            check = userData.verifyPasswords(oldPassword, newPassword, cNewPassword);


            if (!check.state){
                errorBox.html(check.message);
                return false;
            }



            let data = {
                oldPassword: oldPassword.val(),
                newPassword: newPassword.val(),
                confirmNewPassword: cNewPassword.val()

            };

            view.addLoader();

            $.ajax({
                url: 'includes/change_scripts/change_password.php',
                type: 'POST',
                success: function(data){
                    view.removeLoader();
                    if (!data.state) {
                        errorBox.html(data.message);
                        oldPassword.val('');
                        newPassword.val('');
                        cNewPassword.val('');
                    } else {
                        answerSuccess.html('Пароль изменен');
                        userData.serverSuccess = true;
                        $('#newPasswordBox').modal('hide');
                        oldPassword.val('');
                        newPassword.val('');
                        cNewPassword.val('');
                    }
                },

                error: function(data){
                    errorBox.html('Ошибка соединения с сервером');
                    view.removeLoader();
                },

                data: data

            });


        }

    },



    view = {
        addLoader: function () {
            $('#loader').show();
        },
        removeLoader: function(){
            $('#loader').hide();
        }

    };

$('document').ready(function () {
    $('#loader').hide();
    let change_login_btn = $('#change-login-btn'),
        change_email_btn = $('#change-email-btn'),
        change_password_btn = $('#change-password-btn'),
        serverSenderBtn = $('#send-changed-data-btn'),
        emailInput = $('#change-email-input'),
        loginInput = $('#change-login-input');

    //установка начальных значений
    userData.login = loginInput.prop('placeholder');
    userData.email = emailInput.prop('placeholder');

    //изменение логина
    change_login_btn.on('click', function () {
        userData.changeLogin(change_login_btn);
    });
    loginInput.on('focusout', function(){
        userData.changeLogin(change_login_btn);
        userData.freeze = true;
        setTimeout(function () {
            userData.freeze = false;
        }, 500);

    });

    //изменение email
    change_email_btn.on('click', function () {
        userData.changeEmail(change_email_btn);
    });
    emailInput.on('focusout', function(){
        userData.changeEmail(change_email_btn);
        userData.freeze = true;
        setTimeout(function () {
            userData.freeze = false;
        }, 500);
    });

    //изменение пароля
    change_password_btn.on('click', function () {
        userData.changePassword();
    });

    //реакция на закрытие окна
    $('#profile-configure').on('hide.bs.modal', function () {
        if (userData.serverSuccess){
            window.location.href = '/cabinet/';
        }
    });


    //отправка измнений логина или почты на сервер, если таковые были
    serverSenderBtn.on('click', function () {
        if (!userData.dataChanged){
            $('#profile-configure').modal('hide');
        }
        userData.sendChanges();
    });

    //предпросмотр аватара
    $('#change-avatar-input').on('change', userData.previewAvatar);

    // загрузка автара
    $('#change-avatar-btn').on( 'click', userData.changeAvatar);


});