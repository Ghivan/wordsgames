/// <reference path="../typings/index.d.ts" />
class View{
    public auth: Authorisation;
    public registration: Registration;
    private globalErrorMessageBox: JQuery;
    private globalErrorMessage: JQuery;

    constructor(){
        this.auth = new Authorisation();
        this.registration = new Registration();
        this.globalErrorMessage = $('#global-error-message');
        this.globalErrorMessageBox = this.globalErrorMessage.parent();
    }

    public showError(context: PanelContext, message: string){
        if (context.pane === 'global'){
            this.globalErrorMessage.text(message);
            this.globalErrorMessageBox.removeClass('hidden');
        }

        if (context.pane === 'auth'){
            this.auth.displayError(context.field, message);
        }

        if (context.pane === 'registration'){
            this.registration.displayError(context.field, message);
        }

    }

    public hideError(context: PanelContext){
        if (context.pane === 'global'){
            this.globalErrorMessage.text('');
            this.globalErrorMessageBox.addClass('hidden');
        }

        if (context.pane === 'auth'){
            this.auth.hideError(context.field);
        }

        if (context.pane === 'registration'){
            this.registration.hideError(context.field);
        }
    }

    public reset(): void{
       this.hideError({pane: "global"});
       this.auth.reset();
       this.registration.reset();
    }

}

class Authorisation{
    public loginInput: JQuery;
    public loginInputGroup: JQuery;
    public loginErrorBox: JQuery;
    public loginGlyphError: JQuery;

    public passwordInput: JQuery;
    public passwordInputGroup: JQuery;
    public passwordErrorBox: JQuery;
    public passwordGlyphError: JQuery;

    public loginBtn: JQuery;
    constructor(){
        this.loginInput = $('#user');
        this.loginInputGroup = this.loginInput.parent();
        this.loginErrorBox = $('#enter-login-error');
        this.loginGlyphError = this.loginInputGroup.children('.glyphicon.glyphicon-alert');

        this.passwordInput = $('#pswrd');
        this.passwordInputGroup = this.passwordInput.parent();
        this.passwordErrorBox = $('#enter-pswrd-error');
        this.passwordGlyphError = this.passwordInputGroup.children('.glyphicon.glyphicon-alert');

        this.loginBtn = $('#login-button')
    }

    public displayError(type: string, message: string): void{
        this[type + 'ErrorBox'].text(message);
        this[type + 'InputGroup'].addClass('has-error');
        this[type + 'GlyphError'].removeClass('hidden');
    }

    public hideError(type: string): void{
        this[type + 'ErrorBox'].text('');
        this[type + 'InputGroup'].removeClass('has-error');
        this[type + 'GlyphError'].addClass('hidden');
    }

    public setInputVal(type: string, message: string): void{
        this[type+'Input'].val(message);
    }

    public getInputVal(type: string): string{
        return this[type+'Input'].val().trim();
    }

    public reset(): void{
        this.hideError('login');
        this.hideError('password');
        this.setInputVal('login', '');
        this.setInputVal('password', '')
    }
}

class Registration{
    public loginInput: JQuery;
    public loginInputGroup: JQuery;
    public loginErrorBox: JQuery;
    public loginGlyphError: JQuery;

    public passwordInput: JQuery;
    public passwordInputGroup: JQuery;
    public passwordErrorBox: JQuery;
    public passwordGlyphError: JQuery;

    public confirmPasswordInput: JQuery;
    public confirmPasswordInputGroup: JQuery;
    public confirmPasswordErrorBox: JQuery;
    public confirmPasswordGlyphError: JQuery;

    public emailInput: JQuery;
    public emailInputGroup: JQuery;
    public emailErrorBox: JQuery;
    public emailGlyphError: JQuery;

    public registerBtn: JQuery;

    constructor(){
        this.loginInput = $('#new-user');
        this.loginInputGroup = this.loginInput.parent();
        this.loginErrorBox = $('#register-login-error');
        this.loginGlyphError = this.loginInputGroup.children('.glyphicon.glyphicon-alert');

        this.passwordInput = $('#new-pswrd');
        this.passwordInputGroup = this.passwordInput.parent();
        this.passwordErrorBox = $('#register-pswrd-error');
        this.passwordGlyphError = this.passwordInputGroup.children('.glyphicon.glyphicon-alert');

        this.confirmPasswordInput = $('#c-new-pswrd');
        this.confirmPasswordInputGroup = this.confirmPasswordInput.parent();
        this.confirmPasswordErrorBox = $('#register-cpswrd-error');
        this.confirmPasswordGlyphError = this.confirmPasswordInputGroup.children('.glyphicon.glyphicon-alert');

        this.emailInput = $('#new-email');
        this.emailInputGroup = this.emailInput.parent();
        this.emailErrorBox = $('#register-email-error');
        this.emailGlyphError = this.emailInputGroup.children('.glyphicon.glyphicon-alert');

        this.registerBtn = $('#register-button')
    }

    public displayError(type: string, message: string){
        this[type + 'ErrorBox'].text(message);
        this[type + 'InputGroup'].addClass('has-error');
        this[type + 'GlyphError'].removeClass('hidden');
    }

    public hideError(type: string){
        this[type + 'ErrorBox'].text('');
        this[type + 'InputGroup'].removeClass('has-error');
        this[type + 'GlyphError'].addClass('hidden');
    }

    public setInputVal(type: string, message: string): void{
        this[type+'Input'].val(message);
    }

    public getInputVal(type: string): string{
        return this[type+'Input'].val().trim();
    }

    public reset(): void{
        this.hideError('login');
        this.hideError('password');
        this.hideError('confirmPassword');
        this.hideError('email');

        this.setInputVal('login', '');
        this.setInputVal('password', '');
        this.setInputVal('confirmPassword', '');
        this.setInputVal('email', '');
    }
}