<?php

$m = $action_array['m']['input'];
$ip = $session_array['remote_ip'];

if ($m != ""){
  $now = sql_input(db_now());
  $sql = "UPDATE gmodule SET date_used = {$now} WHERE ip " 
       . sql_where($ip) . " AND module " . sql_where($m);  
  $return = query($sql);
  if ($return == 0){
    $ip = sql_input($ip);
    $m =  sql_input($m);
    $sql = "INSERT INTO gmodule (ip,module,date_created) " 
         . " VALUES({$ip},{$m},{$now})";
    query($sql);
  }
}
print ("Thank you for using an R2 Unit Module");


?>
