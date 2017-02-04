
interface UserData{
    login: string;
    email: string;
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
