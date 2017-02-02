<div class="container-fluid tab-pane fade" id="feedback">

    <div class="row">
        <div class="h1 center-block text-center">
            Обратная связь
        </div>

        <form method="post" id="feedbackForm" action="test.php">

            <div class="form-group">
                <label for="player">Ваше имя</label>
                <div class="input-group">
                    <span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>
                    <input type="text" class="form-control" id="player" name="player" value="<?= $controller->getUserDetails('login') ?>" required>
                    <span class="glyphicon glyphicon-alert form-control-feedback hidden"></span>
                </div>
                <span class="help-block text-center text-danger hidden">Текст ошибки</span>
            </div>

            <div class="form-group">
                <label for="player-email">Ваш email</label>
                <div class="input-group">
                    <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                    <input type="email" class="form-control" id="player-email" name="player-email"  value="<?= $controller->getUserDetails('email') ?>" required>
                    <span class="glyphicon glyphicon-ok form-control-feedback hidden"></span>
                    <span class="glyphicon glyphicon-alert form-control-feedback hidden"></span>
                </div>
                <span class="help-block text-center text-danger hidden">Текст ошибки</span>
            </div>

            <div class="form-group">
                <label class="control-label btn-block">Выберите тип сообщения: </label>
                <label class="radio-inline"><input type="radio" name="subject" value="Сотрудничество">Сотрудничество</label>
                <label class="radio-inline"><input type="radio" name="subject" value="Ошибка на сайте">Ошибка на сайте</label>
                <label class="radio-inline"><input type="radio" name="subject" value="Отзыв" checked>Отзыв</label>
                <label class="radio-inline"><input type="radio" name="subject" value="Другое">Другое</label>

            </div>

            <div class="form-group">
                <label for="message-header">Заголовок сообщения</label>
                <div class="input-group">
                    <span class="input-group-addon"><span class="glyphicon glyphicon-header"></span></span>
                    <input type="text" class="form-control" id="message-header" name="message-header"  placeholder="Заголовок сообщения..." required>
                    <span class="glyphicon glyphicon-ok form-control-feedback hidden"></span>
                    <span class="glyphicon glyphicon-alert form-control-feedback hidden"></span>
                </div>
                <span class="help-block text-center text-danger hidden">Текст ошибки</span>
            </div>

            <div class="form-group">
                <label for="message-body" class="control-label">Текст сообщения</label>
                <div>
                    <textarea name="message-body" id="message-body" cols="30" rows="10"></textarea>
                </div>
                <span class="help-block text-center text-danger hidden">Текст ошибки</span>
            </div>

            <button type="submit" class="btn btn-default" id="sendFeedback" name="submit" value="btn">Отправить</button>
        </form>

    </div>
</div>