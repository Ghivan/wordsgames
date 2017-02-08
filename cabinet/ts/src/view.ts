/// <reference path="../typings/index.d.ts" />
class View{
    public loader: Loader;
    public profileConfigureBox: ProfileConfigureBox;
    public changeAvatarBox: ChangeAvatarBox;
    public changePasswordBox: ChangePasswordBox;
    public sendFeedbackBox: SendFeedbackBox;
    public loginLabel: JQuery;
    public unregisterBtn: JQuery;

    constructor(){
        this.loader = new Loader();
        this.profileConfigureBox = new ProfileConfigureBox();
        this.changeAvatarBox = new ChangeAvatarBox();
        this.changePasswordBox = new ChangePasswordBox();
        this.loginLabel = $('#userLoginLabel');
        this.unregisterBtn = $('#unregister');
        this.sendFeedbackBox = new SendFeedbackBox()
    }

}

class Loader{
    private box: JQuery;

    constructor(){
        this.box = $('#loader');
    }

    public show():void{
        this.box.show();
    }

    public hide():void{
        this.box.hide();
    }
}

class ProfileConfigureBox{
    public box: JQuery;
    public errorBox: JQuery;
    public successBox: JQuery;
    public changeLoginInput: JQuery;
    public changeEmailInput: JQuery;
    public changeLoginBtn: JQuery;
    public changeEmailBtn: JQuery;
    public sendChangesBtn: JQuery;
    public cancelBtn: JQuery;

    constructor(){
        this.box = $('#profile-configure');
        this.errorBox = $('#profile-configure-error-box');
        this.successBox = $('#profile-configure-success-box');
        this.changeLoginInput = $('#change-login-input');
        this.changeEmailInput = $('#change-email-input');
        this.changeLoginBtn = $('#change-login-btn');
        this.changeEmailBtn = $('#change-email-btn');
        this.sendChangesBtn = $('#send-changed-data-btn');
        this.cancelBtn = $('#profile-configure-cancel-btn');
    }

    public setChangeBtnTitle(btnFieldType: string, text: string):void{
        switch (btnFieldType){
            case 'login':
                this.changeLoginBtn.text(text);
                break;
            case 'email':
                this.changeEmailBtn.text(text);
                break;
            default:
                console.warn('Элемента ' + btnFieldType + ' не существует');
                break;
        }
    }

    public getChangeBtnTitle(btnFieldType: string):string{
        switch (btnFieldType){
            case 'login':
                return this.changeLoginBtn.text().trim();
            case 'email':
                return this.changeEmailBtn.text().trim();
            default:
                console.warn('Элемента ' + btnFieldType + ' не существует');
                return '';
        }
    }

    public toggleInputState(inputType: string):void{
        let input: JQuery;
        switch (inputType){
            case 'login':
                input = this.changeLoginInput;
                break;
            case 'email':
                input = this.changeEmailInput;
                break;
            default:
                console.warn('Элемента ' + inputType + ' не существует');
                return;
        }

        let state = input.prop('disabled');
        if (state === true){
            input.prop('disabled', false);
            input.focus();
            input.select();
        }
        if (state === false){
            input.prop('disabled', true);
        }
    }

    public setChangeInputValue(inputType: string, text: string): void{
        let input: JQuery;
        switch (inputType){
            case 'login':
                input = this.changeLoginInput;
                break;
            case 'email':
                input = this.changeEmailInput;
                break;
            default:
                console.warn('Элемента ' + inputType + ' не существует');
                return;
        }
        input.val(text);
    }

    public getChangeInputValue(inputType: string): string{
        let input: JQuery;
        switch (inputType){
            case 'login':
                input = this.changeLoginInput;
                break;
            case 'email':
                input = this.changeEmailInput;
                break;
            default:
                console.warn('Элемента ' + inputType + ' не существует');
                return '';
        }
        return input.val().trim();
    }

     public displayError(errorMessage: string):void{
        this.errorBox.html(errorMessage);
    }

    public displaySuccessMessage(message: string):void{
        this.successBox.html(message);
    }

    public reset(login: string, email: string):void{
        this.changeLoginInput.val(login);
        this.changeLoginInput.prop('disabled', true);
        this.changeEmailInput.val(email);
        this.changeEmailInput.prop('disabled', true);
        this.errorBox.html('');
        this.successBox.html('');
    }

}

class ChangeAvatarBox{
    public box: JQuery;
    public errorBox: JQuery;
    public previewBox: JQuery;
    public avatarFileInput: JQuery;
    public uploadAvatarBtn: JQuery;
    public cancelBtn: JQuery;
    public userAvatarBox: JQuery;

    constructor(){
        this.box = $('#change-avatar-box');
        this.errorBox = $('#change-avatar-error-box');
        this.previewBox = $('#avatar-preview-box');
        this.avatarFileInput = $('#change-avatar-input');
        this.uploadAvatarBtn = $('#change-avatar-btn');
        this.cancelBtn = $('#change-avatar-cancel-btn');
        this.userAvatarBox = $('#UserAvatar');
    }

    public displayError(errorMessage: string):void{
        this.errorBox.text(errorMessage);
    }

    public hideError():void{
        this.errorBox.text('');
    }

    public showAvatarPreview(file: File, loader: Loader):void{
        let reader = new FileReader(),
            previewBox = this.previewBox;
        loader.show();
        reader.readAsDataURL(file);
        reader.onload = function () {
            previewBox.attr('src', reader.result);
            loader.hide();
        }
    }

    public getFileFromInput(): File|null{
        return this.avatarFileInput.prop('files')[0] || null;
    }

    public reset(){
        this.hideError();
        this.previewBox.attr('src', this.userAvatarBox.attr('src'));
        this.avatarFileInput.val('');
    }
}

class ChangePasswordBox{
    public box: JQuery;
    public errorBox: JQuery;
    public oldPasswordInput: JQuery;
    public newPasswordInput: JQuery;
    public confirmNewPasswordInput: JQuery;
    public sendChangesBtn: JQuery;
    public cancelBtn: JQuery;

    constructor(){
        this.box = $('#change-password-box');
        this.errorBox = $('#change-password-error-box');
        this.oldPasswordInput = $('#old-password-input');
        this.newPasswordInput = $('#new-password-input');
        this.confirmNewPasswordInput = $('#сonfirm-new-password-input');
        this.sendChangesBtn = $('#change-password-btn');
        this.cancelBtn = $('#change-password-cancel-btn');
    }

    public displayError(errorMessage: string):void{
        this.errorBox.text(errorMessage);
    }

    public hideError():void{
        this.errorBox.text('');
    }

    public getOldPasswordFromInput():string{
        return this.oldPasswordInput.val().trim();
    }

    public getNewPasswordFromInput():string{
        return this.newPasswordInput.val().trim();
    }

    public getConfirmNewPasswordFromInput():string{
        return this.confirmNewPasswordInput.val().trim();
    }

    public reset():void{
        this.oldPasswordInput.val('');
        this.newPasswordInput.val('');
        this.confirmNewPasswordInput.val('');
        this.errorBox.text('')
    }

}

class SendFeedbackBox{
    public form: JQuery;
    public feedbackErrorBox: JQuery;
    public feedbackErrorMessage: JQuery;
    public feedbackSuccessBox: JQuery;
    public feedbackSuccessMessage: JQuery;

    constructor(){
        this.form = $('#feedbackForm');
        this.feedbackErrorBox = $('#feedback-error-box');
        this.feedbackErrorMessage = $('#feedback-error-message');
        this.feedbackSuccessBox = $('#feedback-success-box');
        this.feedbackSuccessMessage = $('#feedback-success-message');
    }

    public displayError(message: string){
        this.feedbackErrorMessage.text(message);
        this.feedbackErrorBox.modal('show');
    }

    public displaySuccessMessage(message: string){
        this.feedbackSuccessMessage.text(message);
        this.feedbackSuccessBox.modal('show');
    }
}