<?php
$name = "UBB";
$total = 100;

for ($x = 1; $x <= $total; $x++) {

    $file = $name . $x . ".php";
    $str = "<?php\n\ninclude('func6.php');\nwhile(1){\n" . '$ans=' . "runThread(" . $x . ");\n";
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

//5693604468 