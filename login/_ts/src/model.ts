/// <reference path="../typings/index.d.ts" />
class Model{
    readonly LOGIN_REG_EXP: RegExp = /^[a-z0-9а-я_-]{3,16}$/i;
    readonly PASSWORD_REG_EXP: RegExp = /^[a-z0-9а-я_-]{6,18}$/i;
    readonly EMAIL_REG_EXP: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    readonly URL_LOGIN: string = 'server_scenarios/index.php';
    readonly URL_REGISTER: string = 'server_scenarios/index.php';
    private errors: Errors;

    constructor(){
        this.errors = new Errors();
    }

    public getError(type: string): string{
        if (this.errors[type] !== undefined){
            return this.errors[type];
        } else {
            console.warn('Такого типа ошибок не существует.');
            return '';
        }
    }

    public removeErrors(type?: string): boolean{
        if (type){
            return this.errors.clearErrors(type);
        } else {
            return this.errors.clearErrors();
        }
    }

    public addError(type: string, message: string): boolean{
        return this.errors.addError(type, message);
    }

    public login(login: string,
                 password: string,
                 success: () => any,
                 error: () => any):void{
        let checking = {
            login: this.checkLogin(login),
            password: this.checkPassword(password)
        };

        if (checking.login.state && checking.password.state){
            let data = {
                action: 'login',
                login: login,
                pswrd: password,
            };
            console.log(data);
            this.sendRequest(this.URL_LOGIN, data, success, error)
        } else {
            if (!checking.login.state){
                this.addError('login', checking.login.message)
            }
            if (!checking.password.state){
                this.addError('password', checking.password.message)
            }
            error();
        }
    }

    public register(information: RegisterInformation,
                    success: () => any,
                    error: () => any):void{
        let checking = {
            login: this.checkLogin(information.login),
            password: this.checkPassword(information.password),
            confirmPassword : this.checkPassword(information.confirmPassword),
            email: (information.email) ? this.checkEmail(information.email) : {state: true}
        };

        if (checking.login.state &&
            checking.password.state &&
            checking.confirmPassword.state &&
            checking.email.state &&
            (information.password === information.confirmPassword)
        ){
            let data = {
                action: 'register',
                login: information.login,
                pswrd: information.password,
                cpswrd: information.confirmPassword,
                email: (information.email) ? information.email : ''
            };
            console.log(data);
            this.sendRequest(this.URL_REGISTER, data, success, error)
        } else {
            if (!checking.login.state){
                this.addError('login', checking.login.message);
            }
            if (!checking.password.state){
                this.addError('password', checking.password.message);
            }
            if (!checking.confirmPassword.state){
                this.addError('confirmPassword', checking.confirmPassword.message);
            }
            if (!checking.email.state){
                this.addError('email', checking.email.message);
            }
            if (information.password !== information.confirmPassword){
                this.addError('confirmPassword', 'Введенные пароли не совпадают');
            }
            error();
        }
    }

    private sendRequest(url,
                        data,
                        success: () => any,
                        error: () => any){
        let errors = this. errors;

        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            success: function(data){
                if (data.state) {
                    success();
                } else {
                    errors.addError('global', data.message);
                    error();
                }
            },
            error: function(data){
                errors.addError('global','Ошибка соединения с сервером.');
                error();
            }
        });
    }

    public checkInput(type: string, message: string){
        switch (type){
            case 'login':
                return this.checkLogin(message);
            case 'email':
                return this.checkEmail(message);
            case 'password': case 'confirmPassword':
            return this.checkPassword(message);
            default:
                console.warn('Проверки по ' + type + ' не существует!');
                return {
                    state: false,
                    message: 'Неверные данные!'
                }
        }
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

        return{
            state: true
        }
    }

    private checkEmail(email: string): TransactionStateInformer{
        if (email === ''){
            return {
                state: true
            };
        }
        if (!email.match(this.EMAIL_REG_EXP)) {
            return {
                state: false,
                message: 'Неверный формат email.'
            };
        }

        return {
            state: true
        }
    }

    public checkPassword(password: string): TransactionStateInformer {
        if (password === ''){
            return {
                state: false,
                message: 'Поле пароля не должно быть пустым!'
            };
        }

        if (!password.match(this.PASSWORD_REG_EXP)){
            return {
                state: false,
                message: 'Пароль должен состоять из букв, цифр, дефисов и подчёркиваний, от 6 до 16 символов.'
            };
        }

        return{
            state: true
        }
    }
}

class Errors implements UserDataChangeErrors{
    private global: string;
    private login: string;
    private email: string;
    private password: string;
    private confirmPassword: string;

    constructor(){
        this.global = '';
        this.login = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
    }

    public addError(type: string, message: string): boolean {
        if (this[type] !== undefined) {
            this[type] = message;
            return true;
        } else {
            console.warn('Такого типа ошибок не существует.');
            return false;
        }
    }

    public clearErrors(type?:string): boolean{

        if (type){
            if (this[type] !== undefined) {
                this[type] = '';
                return true;
            } else {
                console.warn('Такого типа ошибок не существует.');
                return false;
            }
        }

        for (let prop in this){
            if (this.hasOwnProperty(prop) && typeof this[prop] === "string"){
                this[prop] = '';
            }
        }
        return true;
    }
}

