<!-- Окно настроек -->
<div class="modal fade"
     id="profile-configure"
     tabindex="-1" role="dialog"
     aria-labelledby="myModalLabel"
     aria-hidden="true"
     data-login="<?=$controller->getUserDetails('login') ?>"
     data-email="<?=$controller->getUserDetails('email') ?>">

    <!-- Модальное окно -->
    <div class="modal-dialog">

        <!--Все содержимое модального окна -->
        <div class="modal-content">
            <!-- Заголовок модального окна -->
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="profile-configure-label">
                    Настройки профиля
                </h4>
                <div class="small text-success" id="profile-configure-success-box">Настройки не изменены.</div>
                <div class="small text-danger" id="profile-configure-error-box"></div>
            </div>

            <!-- Основное содержимое модального окна -->
            <div class="modal-body">

                <!--Изменение логина-->
                <label for="change-login-input">Ваш логин</label>
                <div class="userdata-change-group">

                    <div class="input-group">
                        <span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>
                        <input disabled type="text" class="form-control" id="change-login-input" value="<?=$controller->getUserDetails('login') ?>" required>
                    </div>
                    <a href="#" class="btn btn-info btn-info" id="change-login-btn" data-fieldType="login">Изменить</a>

                </div>

                <!--Изменение email-->
                <label for="change-email-input">Ваш email</label>
                <div class="userdata-change-group">

                    <div class="input-group">
                        <span class="input-group-addon"><span class="glyphicon glyphicon-envelope"></span></span>
                        <input disabled type="text" class="form-control" id="change-email-input" value="<?=$controller->getUserDetails('email') ?>" required>
                    </div>
                    <a href="#" class="btn btn-info btn-info" id="change-email-btn" data-fieldType="email">Изменить</a>

                </div>

                <!--Ссылка на модальное окно изменения аватара-->
                <div class="btn btn-info" href="#change-avatar-box" data-toggle="modal">Изменить аватар</div>

                <!--Ссылка на модальное окно изменения пароля-->
                <div class="btn btn-info" href="#change-password-box" data-toggle="modal">Изменить пароль</div>

            </div>
            <!--Конец основного содержимого модального окна -->

            <!-- Футер модального окна -->
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal" id="profile-configure-cancel-btn">Закрыть</button>
                <button type="button" class="btn btn-primary" id="send-changed-data-btn">Сохранить изменения</button>
            </div>

        </div>
        <!--Конец всего содержимого модального окна -->

    </div>
    <!--Конец модального окна -->

</div>
<!--Конец окна настроек-->


<!--Окно изменения аватара-->
<div id="change-avatar-box" class="modal fade">

    <!-- Модальное окно -->
    <div class="modal-dialog">

        <!--Все содержимое модального окна -->
        <div class="modal-content">

            <!-- Заголовок модального окна -->
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">Изменить аватар</h4>
                <div id="change-avatar-error-box" class="text-danger small"></div>
            </div>

            <!-- Основное содержимое модального окна -->
            <div class="modal-body">
                <div class="h3 text-center">Предпросмотр</div>
                <img class="img-circle center-block" src="<?=$controller->getUserDetails('avatar') ?>" id="avatar-preview-box">
                <input type="file" class="text-center" name="userAvatar" id="change-avatar-input" accept="image/*">
            </div>

            <!-- Футер модального окна -->
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal" id="change-avatar-cancel-btn">Закрыть</button>
                <button type="button" class="btn btn-primary" id="change-avatar-btn">Загрузить аватар</button>
            </div>

        </div>
        <!--Конец всего содержимого модального окна -->

    </div>
    <!--Конец модального окна -->

</div>
<!--Конец окна изменения аватара-->

<!--Окно изменения пароля-->
<div id="change-password-box" class="modal fade">

    <!-- Модальное окно -->
    <div class="modal-dialog">

        <!--Все содержимое модального окна -->
        <div class="modal-content">

            <!-- Заголовок модального окна -->
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">Изменить пароль</h4>
                <div id="change-password-error-box" class="text-danger small"></div>
            </div>

            <!-- Основное содержимое модального окна -->
            <div class="modal-body">

                <label for="old-password-input">Введите старый пароль:</label>
                <div class="input-group">
                    <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                    <input type="password" class="form-control" id="old-password-input" placeholder="Старый пароль..." required>
                </div>

                <label for="new-password-input">Придумайте новый пароль:</label>
                <div class="input-group">
                    <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                    <input type="password" class="form-control" id="new-password-input" placeholder="Придумайте новый пароль..." required>
                </div>

                <label for="сonfirm-new-password-input">Подтвердите новый пароль:</label>
                <div class="input-group">
                    <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                    <input type="password" class="form-control" id="сonfirm-new-password-input" placeholder="Повторите новый пароль..." required>
                </div>

            </div>

            <!-- Футер модального окна -->
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal" id="change-password-cancel-btn">Закрыть</button>
                <button type="button" class="btn btn-primary" id="change-password-btn">Изменить пароль</button>
            </div>

        </div>
        <!--Конец всего содержимого модального окна -->

    </div>
    <!--Конец модального окна -->

</div>
<!--Конец окна изменения пароля-->