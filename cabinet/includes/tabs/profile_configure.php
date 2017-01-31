<!-- Окно настроек -->
<div class="modal fade" id="profile-configure" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">

    <!-- Модальное окно -->
    <div class="modal-dialog">

        <!--Все содержимое модального окна -->
        <div class="modal-content">
            <!-- Заголовок модального окна -->
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="myModalLabel">
                    Настройки профиля
                </h4>
                <div class="small text-danger" id="changesReminder"></div>
                <div class="small text-success" id="answerReminder">Настройки не изменены</div>
            </div>

            <!-- Основное содержимое модального окна -->
            <div class="modal-body">

                <!--Изменение логина-->
                <label for="user">Ваш логин</label>
                <div class="userdata-change-group">

                    <div class="input-group">
                        <span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>
                        <input disabled type="text" class="form-control" id="user" placeholder="<?=$controller->getUserDetails('login') ?>" required>
                        <span class="glyphicon glyphicon-alert form-control-feedback hidden"></span>
                    </div>
                    <a href="#" class="btn btn-info btn-info" id="change-login-btn">Изменить логин</a>

                </div>

                <!--Изменение email-->
                <label for="user">Ваш email</label>
                <div class="userdata-change-group">

                    <div class="input-group">
                        <span class="input-group-addon"><span class="glyphicon glyphicon-envelope"></span></span>
                        <input disabled type="text" class="form-control" id="email" placeholder="<?=$controller->getUserDetails('email') ?>" required>
                        <span class="glyphicon glyphicon-alert form-control-feedback hidden"></span>
                    </div>
                    <a href="#" class="btn btn-info btn-info" id="change-email-btn">Изменить email</a>

                </div>

                <!--Ссылка на модальное окно изменения аватара-->
                <div class="btn btn-info" href="#avatarBox" data-toggle="modal">Изменить аватар</div>

                <!--Ссылка на модальное окно изменения пароля-->
                <div class="btn btn-info">Изменить пароль</div>

            </div>
            <!--Конец основного содержимого модального окна -->

            <!-- Футер модального окна -->
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>
                <button type="button" class="btn btn-primary" id="ServerDataSender">Сохранить изменения</button>
            </div>

        </div>
        <!--Конец всего содержимого модального окна -->

    </div>
    <!--Конец модального окна -->

</div>
<!--Конец окна настроек-->


<!--Окно изменения аватара-->
<div id="avatarBox" class="modal fade">

    <!-- Модальное окно -->
    <div class="modal-dialog">

        <!--Все содержимое модального окна -->
        <div class="modal-content">

            <!-- Заголовок модального окна -->
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">Изменить аватар</h4>
                <div id="avatarError" class="text-danger small"></div>
            </div>

            <!-- Основное содержимое модального окна -->
            <div class="modal-body">
                <div class="h3 text-center">Предпросмотр</div>
                <img class="img-circle center-block" src="<?=$controller->getUserDetails('avatar') ?>" id="userAvatarPreview">
                    <input type="file" class="text-center" name="userAvatar" id="fileInputAvatar" accept="image/*">
            </div>

            <!-- Футер модального окна -->
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>
                <button type="button" class="btn btn-primary" id="loadAvatar">Загрузить аватар</button>
            </div>

        </div>
        <!--Конец всего содержимого модального окна -->

    </div>
    <!--Конец модального окна -->

</div>
<!--Конец окна изменения аватара-->

