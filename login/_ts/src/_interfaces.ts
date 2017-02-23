interface TransactionStateInformer{
    state:boolean;
    message?: string;
}

interface UserDataChangeErrors {
    toString: () => string;
    addError: (type: string, message: string) => any;
    clearErrors: (type?: string)=> any;
}

interface RegisterInformation{
    login: string,
    password: string,
    confirmPassword: string,
    email?: string
}

interface PanelContext{
    pane: 'global'|'auth'|'registration',
    field?: string
}