<?php

$param1 = 'MAthias';
$param2 = 'Roy';
$param3 = '09159403602';
$param4 = 'defbau';
$param5  = 'dd@gmail.com';

$text = 'Hi   [last_name] [first_name] your  [otp] has been sent to your  [email]';
$keys = "PHONE_NO,first_name,last_name";

preg_match_all('/\[(.*?)\]/', $text, $matches);
$placeholders = $matches[0];

// Step 2: Explode the keys
$keyParts = explode(',', $keys);

$values = [];
foreach ($keyParts as $index => $key) {
    $varName = 'param' . ($index + 1);
    $values[] = $$varName;
}

$text = str_replace($placeholders, $values, $text);

echo $text;