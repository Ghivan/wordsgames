/// <reference path="../typings/index.d.ts" />
class Model{
    private user: User;
    readonly urlChangeLogin: string = 'includes/change_scripts/change_login.php';
    readonly urlChangeEmail: string = 'includes/change_scripts/change_email.php';
    readonly urlChangePassword: string = 'includes/change_scripts/change_password.php';
    readonly urlChangeAvatar: string = 'includes/change_scripts/change_avatar.php';
    readonly urlSendFeedback: string = 'includes/change_scripts/send_feedback.php';
    readonly PASSWORD_REG_EXP: RegExp = /^[a-z0-9а-я_-]{6,18}$/i;
    readonly LOGIN_REG_EXP: RegExp = /^[a-z0-9а-я_-]{3,16}$/i;
    readonly EMAIL_REG_EXP: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    readonly MAX_IMAGE_SIZE = 500; //kilobytes

    constructor(login: string, email: string){
        let data = {
            login: login,
            email: email
        };
        this.user = new User(data);
    }

    public getUserLogin(): string{
        return this.user.login;
    }

    public getUserEmail(): string{
        return this.user.email;
    }

    public checkInput(type: string, message: string){
        switch (type){
            case 'login':
                return this.checkLogin(message);
            case 'email':
                return this.checkEmail(message);
            default:
                console.warn('Проверки по ' + type + ' не существует!');
                return {
                    state: false,
                    message: 'Неверные данные!'
                }
        }
    }


    public changeUserLogin(newLogin: string,
                        success: (message: string) => any,
                        error: (message: string) => any): void{
        let checking: TransactionStateInformer;
        checking = this.checkLogin(newLogin);

        if (!checking.state){
            error(checking.message);
            return;
        }

        let data = {
            login: newLogin
        },
        user = this.user;

        $.ajax({
            url: this.urlChangeLogin,
            data: data,
            type: 'POST',

            success: function(data){
                if (data.state) {
                    user.login = newLogin;
                    success(data.message);
                } else {
                    error(data.message);
                }
            },

            error:function(){
                error('Ошибка соединения с сервером');
            }

        });
    }

    private checkLogin(login: string): TransactionStateInformer {
        if (login === ''){
            return {
                state: false,
                message: 'Поле логина не должно быть пустым!'
            };
        }

        if (!login.match(this.LOGIN_REG_EXP)){
            return {
                state: false,
                message: 'Логин должен состоять только из букв, цифр, дефисов и подчёркиваний, от 3 до 16 символов.'
            };
        }

        if (this.user.login == login){
            return {
                state: false,
                message: 'Старый и новый логин одинаковы'
            };
        }

        return{
            state: true
        }
    }


    public changeUserEmail(newEmail: string,
                        success: (message: string) => any,
                        error: (message: string) => any): void {
        let checking: TransactionStateInformer = this.checkEmail(newEmail);
        if (!checking.state){
            error(checking.message);
            return;
        }

        let data = {
            email: newEmail
        },
        user = this.user;

        $.ajax({
            url: this.urlChangeEmail,

            type: 'POST',

            success: function(data){
                if (data.state) {
                    user.email = newEmail;
                    success(data.message);
                } else {
                    error(data.message);
                }
            },

            error:function(){
                error('Ошибка соединения с сервером');
            },

            data: data
        });
    }

    private checkEmail(email: string): TransactionStateInformer{
        if (email === ''){
            return {
                state: false,
                message: 'Поле email не должно быть пустым!'
            };
        }

        if (!email.match(this.EMAIL_REG_EXP)) {
            return {
                state: false,
                message: 'Неверный формат email'
            };
        }

        if (this.user.email === email){
            return {
                state: false,
                message: 'Старый и новый email одинаковы'
            };
        }

        return {
            state: true
        }
    }


    public changePassword(data: ChangePasswordData,
                          success: (message: string) => any,
                          error: (message: string) => any): void {
        let checking: TransactionStateInformer = this.checkPassword(data);
        if (!checking.state){
            error(checking.message);
            return;
        }

        $.ajax({
            url: this.urlChangePassword,
            type: 'POST',
            data: data,
            success: function(data){
                if (data.state) {
                    success(data.message);
                } else {
                    error(data.message);
                }
            },
            error: function(){
                error('Ошибка соединения с сервером');
            }
        });
    }

    public checkPassword(data: ChangePasswordData): TransactionStateInformer{
        for (let prop in data){
            if (data.hasOwnProperty(prop)){
                if (data[prop] === '') {
                    return {
                        state: false,
                        message: 'Все поля должны быть заполнены!'
                    };
                }
            }
        }

        if (!data.newPassword.match(this.PASSWORD_REG_EXP)){
            return {
                state: false,
                message: 'Пароль должен состоять из букв, цифр, дефисов и подчёркиваний, от 6 до 16 символов.'
            };
        }

        if (data.oldPassword === data.newPassword){
            return {
                state: false,
                message: 'Старый и новый пароль совпадают!'
            };
        }

        if (data.newPassword !== data.confirmNewPassword){
            return {
                state: false,
                message: 'Введенные пароли не совпадают!'
            };
        }

        return {
            state: true
        }
    }


    public uploadAvatar(file: File,
                        success: (pathToImg: string) => any,
                        error: (message: string) => any): void{
        let checking: TransactionStateInformer = this.checkImage(file);
        if (!checking.state){
            error(checking.message);
            return;
        }

        let data = new FormData();
        data.append('userAvatar', file);

        $.ajax({
            url: this.urlChangeAvatar,
            type: 'POST',

            success: function(data){
                if (data.state){
                    success(data.src);
                } else {
                    error(data.message);
                }
            },
            error: function(){
                error('Ошибка соединения с сервером');
            },

            data: data,
            cache: false,
            contentType: false,
            processData: false
        });

    }

    public checkImage(img: File): TransactionStateInformer{
        let size = img.size,
            type = img.type,
            allowedImageTypes = ['image/jpeg', 'image/png'];

        if (allowedImageTypes.indexOf(type) < 0){
            return {
                state: false,
                message: 'Формат файла не jpg или png'
            };
        }

        if (size > (this.MAX_IMAGE_SIZE * 1024)){
            return {
                state: false,
                message: 'Размер файла больше ' + this.MAX_IMAGE_SIZE + ' KB'
            };
        }

        return {
            state: true
        }
    }

    public sendFeedBackMessage(data: Object,
                               success: (message: string) => any,
                               error: (message: string) => any): void{
        $.ajax({
            data: data,
            url: this.urlSendFeedback,
            type: 'POST',

            success: function(data){
               if (data.state){
                   success(data.message);
               } else {
                   error(data.message);
               }
            },

            error:function(){
                error('Ошибка соединения с сервером');
            },

        });
    }
}

class User{
    public login: string;
    public email: string;

    constructor(data: UserData){
        this.login = data.login;
        this.email = data.email;
    }
}
