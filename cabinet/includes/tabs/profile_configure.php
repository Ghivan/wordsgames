
<div class="modal fade" id="profile-configure" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="myModalLabel">
                    Настройки профиля
                </h4>
                <div class="small text-success" id="changesReminder">Настройки не изменены</div>
                <div class="small text-success" id="answerReminder"></div>
            </div>
            <div class="modal-body">
                <label for="user">Ваш логин</label>
                <div class="userdata-change-group">

                    <div class="input-group">
                        <span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>
                        <input disabled type="text" class="form-control" id="user" placeholder="<?=$controller->getUserDetails('login') ?>" required>
                        <span class="glyphicon glyphicon-alert form-control-feedback hidden"></span>
                    </div>
                    <a href="#" class="btn btn-info btn-info" id="change-login-btn">Изменить логин</a>

                </div>
                <div class="btn btn-info">Изменить пароль</div>
                <div class="btn btn-info">Изменить аватар</div>
                <label for="user">Ваш email</label>
                <div class="userdata-change-group">

                    <div class="input-group">
                        <span class="input-group-addon"><span class="glyphicon glyphicon-envelope"></span></span>
                        <input disabled type="text" class="form-control" id="email" placeholder="<?=$controller->getUserDetails('email') ?>" required>
                        <span class="glyphicon glyphicon-alert form-control-feedback hidden"></span>
                    </div>
                    <a href="#" class="btn btn-info btn-info" id="change-email-btn">Изменить email</a>

                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>
                <button type="button" class="btn btn-primary" id="ServerDataSender">Сохранить изменения</button>
            </div>
        </div>
    </div>
</div>
