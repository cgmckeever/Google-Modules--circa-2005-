<?php

        header("Content-type: application/x-javascript");

        $id = $action_array['id']['input'];
	$v = $action_array['v']['input'];

	$js = file_get_contents('jgcal.' . $v . '.js');

	$js = str_replace("__MODULE_ID__",$id,$js);
	print $js;	

?>
