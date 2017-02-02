<?php
session_start();
// Отправляем
$to = 'ghivan.iv@gmail.com';
$subject = $_POST['subject'].': '.$_POST['message-header'];
$from = $_SESSION['pl_id']. ': ' . $_POST['player'];
$message = $_POST['player-email']. ' ' . $_POST['message-body'];
$headers = "From:" . $from;
mail($to, $subject, $message,$headers);