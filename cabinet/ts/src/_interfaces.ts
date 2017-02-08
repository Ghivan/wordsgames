
interface UserData{
    login: string;
    email: string;
}

interface UserDataUpdateState{
    login: boolean;
    email: boolean;
}

interface UserDataChangeErrors {
     toString: () => string;
     addError: (type: string, message: string) => any;
     clearErrors: (type?: string)=> any;
}

interface ChangePasswordData{
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

interface TransactionStateInformer{
    state:boolean;
    message?: string;
}
