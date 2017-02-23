<?php

class InputValidator
{
    const LOGIN_REGEXP = "/^[a-zа-я0-9_-]{3,16}$/iu";
    const LOGIN_REQUIREMENTS = 'Логин должен состоять из букв, цифр, дефисов и подчёркиваний, от 3 до 16 символов.';
    const PASSWORD_REGEXP = "/^[a-z0-9а-я_-]{6,18}$/iu";
    const PASSWORD_REQUIREMENTS =  'Пароль должен состоять только из букв, цифр, дефисов и подчёркиваний, от 6 до 16 символов.';

    public static function validatePassword(string $password){
        return (preg_match(self::PASSWORD_REGEXP, $password) !== false);
    }

    public static function validateLogin(string $login){
        return (preg_match(self::LOGIN_REGEXP, $login) !== false);
    }

    public static function validateEmail($email){
        return (filter_var($email, FILTER_VALIDATE_EMAIL) ? true : false);
    }
}