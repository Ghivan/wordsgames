<?php
session_start();
$time2 = date_timestamp_get(date_create());
echo  $time2.' ';
var_dump(date_create());
echo $time2 - $_SESSION['time1'];