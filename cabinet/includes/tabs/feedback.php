<div class="container-fluid tab-pane fade" id="feedback">

    <div class="row">
        <div class="h1 center-block text-center">
            Обратная связь
        </div>

        <form method="post" id="feedbackForm" action="includes/change_scripts/send_feedback.php">

            <div class="form-group">
                <label for="feedback-player">Ваше имя</label>
                <div class="input-group">
                    <span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>
                    <input type="text" class="form-control" id="feedback-player" name="player" value="<?= $controller->getUserDetails('login') ?>" required>
                </div>
            </div>

            <div class="form-group">
                <label for="feedback-player-email">Ваш email</label>
                <div class="input-group">
                    <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                    <input type="email" class="form-control" id="feedback-player-email" name="player-email"  value="<?= $controller->getUserDetails('email') ?>" required>
                </div>
            </div>

            <div class="form-group">
                <label for="feedback-subject" class="control-label btn-block">Выберите тип сообщения: </label>
                <select name="subject" id="feedback-subject">
                    <option value="Сотрудничество">
                        Сотрудничество
                    </option>
                    <option value="Баг">
                        Ошибка на сайте
                    </option>
                    <option value="Отзыв" selected>
                        Отзыв
                    </option>
                    <option value="Другое">
                        Другое
                    </option>
                </select>
            </div>

            <div class="form-group">
                <label for="feedback-message-header">Заголовок сообщения</label>
                <div class="input-group">
                    <span class="input-group-addon"><span class="glyphicon glyphicon-header"></span></span>
                    <input type="text" class="form-control" id="feedback-message-header" name="message-header"  placeholder="Заголовок сообщения..." maxlength="230" required>
                </div>
            </div>

            <div class="form-group">
                <label for="feedback-message-body" class="control-label">Текст сообщения</label>
                <div>
                    <textarea name="message-body" id="feedback-message-body" rows="10" cols="75" wrap="hard" required></textarea>
                </div>
            </div>

            <button type="submit" class="btn btn-default" id="sendFeedback" name="submit" value="btn">Отправить</button>
        </form>
    </div>
<!--Всплывающее окно с ошибкой-->
    <div id="feedback-error-box" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                   <h4 class="modal-title text-danger">Ошибка!</h4>
                </div>
                <div class="modal-body">
                    <p id="feedback-error-message"></p>
                </div>
            </div>

        </div>
    </div>

    <!--Всплывающее окно успешное-->
    <div id="feedback-success-box" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title text-success">Успех!</h4>
                </div>
                <div class="modal-body">
                    <p id="feedback-success-message"></p>
                </div>
            </div>

        </div>
    </div>

</div>