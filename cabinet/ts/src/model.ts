/// <reference path="../typings/index.d.ts" />
class Model{
    private user: User;
    readonly urlChangeLogin = 'includes/change_scripts/change_login.php';
    readonly urlChangeEmail = 'includes/change_scripts/change_email.php';
    readonly urlChangePassword = 'includes/change_scripts/change_password.php';
    readonly urlChangeAvatar = 'includes/change_scripts/change_avatar.php';
    readonly PASSWORD_MIN_LENGTH = 6;
    readonly LOGIN_MIN_LENGTH = 4;
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
            },

            data: data
        });
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
            success: function(data){
                if (!data.state) {
                    success(data.message);
                } else {
                    error(data.message);
                }
            },

            error: function(){
                error('Ошибка соединения с сервером');
            },

            data: data

        });
    }

    public changeAvatar(file: File,
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

    private checkLogin(login: string): TransactionStateInformer {

        if (login.length < this.LOGIN_MIN_LENGTH){
            return {
                state: false,
                message: 'Длина логина меньше ' + this.LOGIN_MIN_LENGTH + ' символов'
            };
        }

        if (this.user.login === login){
            return {
                state: false,
                message: 'Старый и новый логин одинаковы'
            };
        }

        return{
            state: true
        }
    }

    private checkEmail(email: string): TransactionStateInformer{
        let regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!email.match(regExp)) {
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

    private checkPassword(data: ChangePasswordData): TransactionStateInformer{

        if (data.newPassword.length < this.PASSWORD_MIN_LENGTH){
            return {
                state: false,
                message: 'Длина пароля меньше ' + this.PASSWORD_MIN_LENGTH + ' символов'
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

    private checkImage(img: File): TransactionStateInformer{
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
}

class User{
    public login: string;
    public email: string;

    constructor(data: UserData){
        this.login = data.login;
        this.email = data.email;
    }
}
