<?php
define('MAIN_DIR', $_SERVER['DOCUMENT_ROOT']);
include_once MAIN_DIR . '/_config/config.php';
echo json_encode(array(
        'т'=>10
    )) . '<br>';
function mbStringToArray ($string) {
    $array = [];
    $strlen = mb_strlen($string);
    while ($strlen) {
        $array[] = mb_substr($string,0,1,"UTF-8");
        $string = mb_substr($string,1,$strlen,"UTF-8");
        $strlen = mb_strlen($string);
    }
    return $array;
}
$checkword = mbStringToArray('программист');
$wordVariants = [];
$inserts = [];

$dbc = new PDO("mysql:host=".HOST.";dbname=".DB_NAME.";charset=UTF8", DB_USER, DB_PASSWORD);
$stmt = $dbc->prepare('SELECT `word`, `description` FROM `new_dictionary`');
$stmt->execute();
while ($word = $stmt->fetch(PDO::FETCH_ASSOC)){
    $matched = $word['word'];
    $description = $word['description'];
    foreach ($checkword as $key => $letter){
        if (preg_match("/.?{$letter}+.?/iu", $matched)){
            $matched = preg_replace("/{$letter}/iu", '', $matched, 1);
            continue;
        }
    }

    if(mb_strlen($matched) === 0 && mb_strlen($word['word']) !== count($checkword)){
        array_push($wordVariants, $word['word']);
        $inserts[$word['word']] = $description;
    }
}
var_dump($wordVariants);
var_dump($inserts);
$requestString = 'INSERT IGNORE INTO `dictionary`(`word`,`definition`) VALUES ';
foreach ($inserts as $word=>$definition){
    $requestString.= " ('$word','$definition'), ";
}
echo $requestString . '<br>';
echo join(',', $wordVariants);
