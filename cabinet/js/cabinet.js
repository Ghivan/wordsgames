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
            let errorBox = $('#avatarError');
            errorBox.html('');

            if (this.files && this.files[0]){
                let file = this.files[0],
                    check = userData.verifyImage(file),
                    reader = new FileReader();

                if (check.state){
                    reader.readAsDataURL(file);
                    view.addLoader();
                    reader.onload = function(){
                        $('#userAvatarPreview').attr('src', reader.result);
                        view.removeLoader();
                    };
                } else {
                    errorBox.text(check.message);
                    this.value = '';
                }

            }
        },

        changeAvatar: function(){
            let fileInput = $('#fileInputAvatar'),
                file = fileInput.prop('files')[0] || null;
            if (file){
                view.addLoader();
                let check = userData.verifyImage(file),
                    errorBox = $('#avatarError');

                if (check.state){
                    let formData = new FormData();
                    formData.append('userAvatar', file);

                    $.ajax({
                        url: 'change_scripts/change_avatar.php',
                        type: 'POST',
                        success: function(data){
                            view.removeLoader();
                            if (data.state){
                                errorBox.html('');
                                errorBox.append($('<div class="text-success">Аватар изменен</div>'));
                                $('#UserAvatar').prop('src', data.src);
                                fileInput.val('');
                            }

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
            let reminder = $('#changesReminder'),
                answerSuccess = $('#answerReminder');

            reminder.html('');
            answerSuccess.html('');

            if (userData.loginChanged){
                let data = {
                    login: userData.login
                };

                view.addLoader();

                $.post("change_scripts/change_login.php", data, function (data) {
                    view.removeLoader();
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
                view.addLoader();

                $.post("change_scripts/change_email.php", data, function (data) {
                    view.removeLoader();
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
        serverSenderBtn = $('#ServerDataSender');

    //установка начальных значений
    userData.login = $('#user').prop('placeholder');
    userData.email = $('#email').prop('placeholder');

    //изменение логина
    change_login_btn.on('click', function () {
        userData.changeLogin(change_login_btn);
    });

    //изменение email
    change_email_btn.on('click', function () {
        userData.changeEmail(change_email_btn);
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
    $('#fileInputAvatar').on('change', userData.previewAvatar);

    // загрузка автара
    $('#loadAvatar').on( 'click', userData.changeAvatar);


});