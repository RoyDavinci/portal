<?php
$name = "UBA";
$total = 500;

for ($x = 401; $x <= $total; $x++) {

    $file = $name . $x . ".php";
    $str = "<?php\n\ninclude('func5.php');\nwhile(1){\n" . '$ans=' . "runThread(" . $x . ");\n";
    $str .= "\n}\n";
    log_action($str, $file);
}


function log_action($msg, $logFile)
{
    $fp = @fopen($logFile, 'a+');
    @fputs($fp, $msg . "\n");
    @fclose($fp);
    return TRUE;
}