/// <reference path="../typings/index.d.ts" />

class Controller{
    private model: Model;
    private view: View;
    private updateState: UserDataUpdateState = {
        login: false,
        email: false
    };
    private errors: Errors;
    private successMessage: string ='';
    public freezeState: boolean = false;

    constructor(){
        let data = $('#profile-configure').data();

        this.model = new Model(data.login, data.email);
        this.view = new View();
        this.errors = new Errors();

        this.view.unregisterBtn.on('click', function (e) {
            e.preventDefault();
            e.cancelBubble =true;
            e.stopImmediatePropagation();

            $.ajax({
                url: 'server_scenarios/index.php',

                type: 'POST',

                success: function(data){
                    if (data.state) {
                        if (data.state){
                            window.location.href = '/login/';
                        } else {
                            alert('Нет соединения с сервером!');
                        }
                    } else {
                        alert('Нет соединения с сервером!');
                    }
                },

                error:function(){
                    alert('Нет соединения с сервером!');
                },

                data: {
                    'action' : 'logOut'
                }
            })
        });


        let mainBox = this.view.profileConfigureBox;
        mainBox.changeLoginBtn.on('click', this.prepareChange.bind(this, mainBox.changeLoginBtn));
        mainBox.changeEmailBtn.on('click', this.prepareChange.bind(this, mainBox.changeEmailBtn));
        mainBox.changeLoginInput.on('focusout', this.prepareChange.bind(this, mainBox.changeLoginBtn));
        mainBox.changeEmailInput.on('focusout', this.prepareChange.bind(this, mainBox.changeEmailBtn));
        mainBox.sendChangesBtn.on('click', this.sendChangesToServer.bind(this));

        mainBox.box.on('hide.bs.modal', this.resetProfileBox.bind(this));

        let changeAvatarBox = this.view.changeAvatarBox;
        changeAvatarBox.avatarFileInput.on('change', this.activatePreviewAvatar.bind(this));
        changeAvatarBox.uploadAvatarBtn.on('click', this.uploadAvatar.bind(this));
        changeAvatarBox.box.on('hide.bs.modal', changeAvatarBox.reset.bind(changeAvatarBox));

        let passwordBox = this.view.changePasswordBox;
        passwordBox.sendChangesBtn.on('click', this.sendNewPasswordToServer.bind(this));
        passwordBox.box.on('hide.bs.modal', passwordBox.reset.bind(passwordBox));

        this.view.sendFeedbackBox.form.on('submit', this.sendFeedback.bind(this));

        $('a[href="#game-1-records"]').on('click', function () {
            let box = $('#game-1-records');
            if (box.hasClass('active')) return;
            box.html('<img src="/_app_files/images/loading.gif" class="center-block" style="width: 40px" alt="Загрузка...">');
           $.ajax({
                url: '/games/wordsFromWord/server_scenarios/index.php',

                type: 'POST',

                success: function(data){
                    box.html(data);
                },

                error:function(){
                    box.html('<p class="text-danger">Соединение с сервером отсутствует!</p>');
                },

                data: {
                    'action' : 'getRecordTable'
                }
            })

        });

        $('a[href="#game-1-progress"]').on('click', function () {
            let box = $('#game-1-progress');
            if (box.hasClass('active')) return;
            box.html('<img src="/_app_files/images/loading.gif" class="center-block" style="width: 40px" alt="Загрузка...">');
            $.ajax({
                url: '/games/wordsFromWord/server_scenarios/index.php',

                type: 'POST',

                success: function(data){
                    box.html(data);
                },

                error:function(){
                    box.html('<p class="text-danger">Соединение с сервером отсутствует!</p>');
                },

                data: {
                    'action' : 'getPlayerProgress'
                }
            })
        })
    }

    public sendFeedback(e: Event){
        e.preventDefault();
        this.view.loader.show();
        let data = $(e.target).serializeArray().reduce(function(prev, curr) {
            prev[curr.name] = curr.value;
            return prev;
        }, {});
        this.model.sendFeedBackMessage(data, this.onSuccessFeedback.bind(this), this.onFailFeedback.bind(this));
        return false;
    }

    private onSuccessFeedback(message){
        this.view.loader.hide();
        this.view.sendFeedbackBox.displaySuccessMessage(message);
        document.forms[0].reset();
    }

    private onFailFeedback(message: string){
        this.view.loader.hide();
        this.view.sendFeedbackBox.displayError(message);
    }

    public freeze():void{
        this.freezeState = true;
        (function (context) {
            setTimeout(function () {
                context.freezeState = false;
            }, 200)
        })(this);
    }

    public resetProfileBox(): void{
        let mainBox = this.view.profileConfigureBox;
        mainBox.reset(this.model.getUserLogin(),this.model.getUserEmail());
        this.view.loginLabel.text(this.model.getUserLogin());
        this.errors.clearErrors();
        this.successMessage = '';
        mainBox.displaySuccessMessage('Настройки не изменены.');
        mainBox.displayError('');
    }

    public prepareChange(btn: JQuery): void{
        if (this.freezeState) return;
        this.freeze();
        let type = btn.data().fieldtype,
            stage = btn.text().toLowerCase(),
            mainBox = this.view.profileConfigureBox;
        switch (stage){

            case 'изменить':
                mainBox.toggleInputState(type);
                btn.text('Подтвердить');
                break;

            case 'подтвердить':
                let check = this.model.checkInput(type, mainBox.getChangeInputValue(type));
                this.errors.clearErrors(type);
                if (check.state){
                    mainBox.displaySuccessMessage('');
                    this.errors.addError('global', 'Нажмите "Сохранить изменения", чтобы отправить данные на сервер. Информация с ошибками не будет отправлена');
                    this.updateState[type] = true;
                }  else {
                    this.errors.addError(type, check.message);
                    this.updateState[type] = false;
                }
                mainBox.toggleInputState(type);
                mainBox.displayError(this.errors.toString());
                btn.text('Изменить');
                break;
        }

    }

    public sendChangesToServer(): void{
        let mainBox = this.view.profileConfigureBox;
        this.errors.clearErrors('global');
        this.successMessage = '';
        if (this.updateState.login){
            this.view.loader.show();
            this.updateState.login = false;
            this.model.changeUserLogin(mainBox.getChangeInputValue('login'),
                this.successServerDataChange.bind(this, 'login'),
                this.errorServerDataChange.bind(this, 'login'));
        }

        if (this.updateState.email){
            this.view.loader.show();
            this.updateState.email = false;
            this.model.changeUserEmail(mainBox.getChangeInputValue('email'),
                this.successServerDataChange.bind(this, 'email'),
                this.errorServerDataChange.bind(this, 'email'));
        }
    }

    private successServerDataChange(type: string): void{
        let mainBox = this.view.profileConfigureBox,
            view = this.view;
        switch (type){
            case 'login':
                this.errors.clearErrors('login');
                this.successMessage +=' Логин был изменен.';
                view.loginLabel.text(this.model.getUserLogin());
                break;
            case 'email':
                this.errors.clearErrors('email');
                this.successMessage +=' Email был изменен.';
                break;
        }

        mainBox.displaySuccessMessage(this.successMessage);
        mainBox.displayError(this.errors.toString());
        view.loader.hide();
    }

    private  errorServerDataChange(type: string, message: string): void{
        let mainBox = this.view.profileConfigureBox,
            view = this.view;

        switch (type){
            case 'login':
                this.errors.clearErrors(type);
                this.errors.addError(type, message);
                mainBox.setChangeInputValue(type, this.model.getUserLogin());
                break;
            case 'email':
                this.errors.clearErrors(type);
                this.errors.addError(type, message);
                mainBox.setChangeInputValue(type, this.model.getUserEmail());
                break;
        }

        mainBox.displaySuccessMessage(this.successMessage);
        mainBox.displayError(this.errors.toString());
        view.loader.hide();
    }

    public activatePreviewAvatar():void{
        let changeAvatarBox = this.view.changeAvatarBox,
            file = changeAvatarBox.getFileFromInput();
        if (!file) return;
        let checking = this.model.checkImage(file);
        if (checking.state){
            changeAvatarBox.hideError();
            changeAvatarBox.showAvatarPreview(file, this.view.loader);
        } else {
            changeAvatarBox.reset();
            changeAvatarBox.displayError(checking.message);
        }
    }

    public uploadAvatar(): void{
        let changeAvatarBox = this.view.changeAvatarBox,
            file = changeAvatarBox.getFileFromInput();
        if (file){
            this.view.loader.show();
            this.model.uploadAvatar(file,
                this.successUploadAvatar.bind(this),
                this.errorUploadAvatar.bind(this));
        }
    }

    private successUploadAvatar(pathToImg: string):void{
        let changeAvatarBox = this.view.changeAvatarBox,
            profileConfigureBox = this.view.profileConfigureBox;
        changeAvatarBox.userAvatarBox.attr('src', pathToImg + '?' + Date.now());
        changeAvatarBox.reset();
        changeAvatarBox.box.modal('hide');
        profileConfigureBox.displaySuccessMessage('Аватар был изменен');
        this.view.loader.hide();
    }

    private errorUploadAvatar(message: string):void{
        let changeAvatarBox = this.view.changeAvatarBox;
        changeAvatarBox.reset();
        changeAvatarBox.displayError(message);
        this.view.loader.hide();
    }

    public sendNewPasswordToServer(): void{
        let passwordBox: ChangePasswordBox = this.view.changePasswordBox,
            data: ChangePasswordData,
            checking: TransactionStateInformer;

        data = {
            oldPassword: passwordBox.getOldPasswordFromInput(),
            newPassword: passwordBox.getNewPasswordFromInput(),
            confirmNewPassword: passwordBox.getConfirmNewPasswordFromInput()
        };

        checking = this.model.checkPassword(data);
        if (checking.state){
            this.view.loader.show();
            this.model.changePassword(data, this.successServerChangePassword.bind(this), this.errorServerChangePassword.bind(this));
        } else {
            passwordBox.reset();
            passwordBox.displayError(checking.message);
        }

    }

    private successServerChangePassword(): void{
        let passwordBox: ChangePasswordBox = this.view.changePasswordBox,
            profileConfigureBox = this.view.profileConfigureBox;
        this.view.loader.hide();
        profileConfigureBox.displaySuccessMessage('Пароль был изменен. ');
        passwordBox.box.modal('hide');
    }

    private errorServerChangePassword(message: string): void{
        let passwordBox: ChangePasswordBox = this.view.changePasswordBox;
        this.view.loader.hide();
        passwordBox.reset();
        passwordBox.displayError(message);
    }

    public hideLoader(){
        this.view.loader.hide();
    }
}

class Errors implements UserDataChangeErrors{
    private global: Array<string>;
    private login: Array<string>;
    private email: Array<string>;

    constructor(){
        this.global = [];
        this.login = [];
        this.email = [];
    }

    public toString(): string {
        let totalErrors: Array<string> = [],
            cacheString: string,
            resultString: string = '';

        if (this.login.length > 0) totalErrors.push(this.login.join('<br>'));
        if (this.email.length > 0) totalErrors.push(this.email.join('<br>'));
        if (this.global.length > 0){
            resultString = this.global.join('<br>');
        }
        cacheString = totalErrors.join('<br>');
        if (cacheString !== ''){
            cacheString = '<b>Ошибка!</b><br>' + cacheString;
        }

        if (resultString !== '' && cacheString !== ''){
            return resultString + '<br>' + cacheString;
        }
        if (resultString !== '') return resultString;
        if (cacheString !== '') return cacheString;

        return '';
    }

    public addError(type: string, message: string): boolean {
        if (Array.isArray(this[type])) {
            for (let i = 0; i < this[type].length; i++){
                if (this[type][i] === message) return true;
            }
            this[type].push(message);
            return true;
        } else {
            console.warn('Такого типа ошибок не существует.');
            return false;
        }
    }

    public clearErrors(type?:string): boolean{

        if (type){
            if (this[type]) {
                this[type] = [];
                return true;
            } else {
                console.warn('Такого типа ошибок не существует.');
                return false;
            }
        }

        for (let prop in this){
            if (this.hasOwnProperty(prop) && Array.isArray(this[prop])){
                this[prop].length = 0;
            }
        }
        return true;
    }
}
