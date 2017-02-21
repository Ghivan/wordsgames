/// <reference path="../typings/index.d.ts" />

class Controller{
    private model: Model;
    private view: View;

    constructor(){
        this.model = new Model();
        this.view = new View();

        $('.nav-tabs a').on('show.bs.tab', this.view.reset.bind(this.view));

        let authorize = this.authorize.bind(this),
            register = this.register.bind(this);
        this.view.auth.loginBtn.on('click', authorize);
        this.view.registration.registerBtn.on('click', register);

        $('input').on('keyup', function (e) {
            if (e.keyCode === 13){
                let inputs = $(this).closest('form').find(':input');
                inputs.eq(inputs.index(this)+ 1 ).focus();
            }
        });

        let auth: Authorisation = this.view.auth;
        auth.loginInput.on('focusout', this.performChecking.bind(
            this,
            {pane: 'auth',
                field: 'login'
            }
            )
        );
        auth.loginInput.on('focusin', this.view.hideError.bind(
            this.view,
            {
                pane: 'auth',
                field: 'login'
            }
            )
        );
        auth.passwordInput.on('focusout', this.performChecking.bind(
            this,
            {pane: 'auth',
                field: 'password'
            }
            )
        );
        auth.passwordInput.on('focusin', this.view.hideError.bind(
            this.view,
            {
                pane: 'auth',
                field: 'password'
            }
            )
        );

        let reg: Registration = this.view.registration;
        reg.loginInput.on('focusout', this.performChecking.bind(
            this,
            {pane: 'registration',
                field: 'login'
            }
            )
        );
        reg.loginInput.on('focusin', this.view.hideError.bind(
            this.view,
            {
                pane: 'registration',
                field: 'login'
            }
            )
        );
        reg.passwordInput.on('focusout', this.performChecking.bind(
            this,
            {pane: 'registration',
                field: 'password'
            }
            )
        );
        reg.passwordInput.on('focusin', this.view.hideError.bind(
            this.view,
            {
                pane: 'registration',
                field: 'password'
            }
            )
        );

        reg.confirmPasswordInput.on('focusout', this.performChecking.bind(
            this,
            {pane: 'registration',
                field: 'confirmPassword'
            }
            )
        );
        reg.confirmPasswordInput.on('focusin', this.view.hideError.bind(
            this.view,
            {
                pane: 'registration',
                field: 'confirmPassword'
            }
            )
        );
        reg.emailInput.on('focusout', this.performChecking.bind(
            this,
            {pane: 'registration',
                field: 'email'
            }
            )
        );
        reg.emailInput.on('focusin', this.view.hideError.bind(
            this.view,
            {
                pane: 'registration',
                field: 'email'
            }
            )
        );

    }

    public authorize(): void{
        let model = this.model,
            authPanel: Authorisation = this.view.auth,
            login: string = authPanel.getInputVal('login'),
            password: string = authPanel.getInputVal('password');

        this.view.reset();
        model.removeErrors();
        model.login(login, password,this.onAuthSuccess, this.onAuthFail.bind(this))

    }

    private onAuthSuccess(): void{
        window.location.href = '/cabinet/';
    }

    private onAuthFail(){
        if (this.model.getError('global')){
            this.view.showError({pane: 'global'}, this.model.getError('global'))
        }

        if (this.model.getError('login')){
            this.view.showError({pane: 'auth', field: 'login'}, this.model.getError('login'))
        }

        if (this.model.getError('password')){
            this.view.showError({pane: 'auth', field: 'password'}, this.model.getError('password'))
        }
    }

    public register(): void{
        let model = this.model,
            regPanel: Registration = this.view.registration,
            data: RegisterInformation = {
                login: regPanel.getInputVal('login'),
                password: regPanel.getInputVal('password'),
                confirmPassword: regPanel.getInputVal('confirmPassword'),
                email: regPanel.getInputVal('email')
            };
        this.view.reset();
        model.removeErrors();
        model.register(data, this.onAuthSuccess, this.onRegFail.bind(this))
    }

    private onRegFail(){
        if (this.model.getError('global')){
            this.view.showError({pane: 'global'}, this.model.getError('global'))
        }

        if (this.model.getError('login')){
            this.view.showError({pane: 'registration', field: 'login'}, this.model.getError('login'))
        }

        if (this.model.getError('password')){
            this.view.showError({pane: 'registration', field: 'password'}, this.model.getError('password'))
        }

        if (this.model.getError('confirmPassword')){
            this.view.showError({pane: 'registration', field: 'confirmPassword'}, this.model.getError('confirmPassword'))
        }

        if (this.model.getError('email')){
            this.view.showError({pane: 'registration', field: 'email'}, this.model.getError('email'))
        }
    }

    private performChecking(context: PanelContext): void{
        let input = context.field,
            checking = this.model.checkInput(
                context.field,
                this.view[context.pane].getInputVal(input)
            );



        this.view.hideError(context);
        this.model.removeErrors(input);

        if (!checking.state){
            this.view.showError(context, checking.message);
            this.model.addError(input, checking.message)
        }

        if (context.pane === "registration" && (input === 'password' || 'confirmPassword')){
            this.passwordComparing()
        }
    }

    private passwordComparing() {
        let password = this.view.registration.getInputVal('password'),
            confirmPassword = this.view.registration.getInputVal('confirmPassword');
        if (password !== confirmPassword) {
            this.view.showError({pane: 'registration', field: 'confirmPassword'}, 'Введенные пароли не совпадают');
            this.model.addError('confirmPassword', 'Введенные пароли не совпадают')
        } else {
            this.view.hideError({pane: 'registration', field: 'confirmPassword'});
            this.model.removeErrors('confirmPassword');
        }
    }
}
