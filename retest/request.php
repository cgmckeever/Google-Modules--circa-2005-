<?php

set_time_limit(0);

$search = $_REQUEST['search'];
$radius = $_REQUEST['radius'];

if (strlen($radius) == 0) $radius = 1;


$location = geocode($search);
$results = request_results($location,$radius);

print 'Request: ' . $location;

// FUNCTIONS


function geocode($search){
  $api_key = "ABQIAAAAocjzbdv8J7kIcqnxO2pYCBT2yXp_ZAY8_ufC3CFXhHIE1NvwkxTpHBgcNYJL_9n6Mni_R-BhUQR8JA";
  $url = "http://maps.google.com/maps/geo?output=xml&key={$api_key}&q=".rawurlencode($search);

  $xml = simplexml_load_file($url);

  if (!is_object($xml->Response)) return $search;

  $status = $xml->Response->Status->code;
  if ($status != 200) return 0;

  $location = strval($xml->Response->Placemark->address);

  return $location;
}

function request_results($location,$radius){
	
  $param = "[item type:housing] [location: @\"{$location}\" + {$radius}mi] [bedrooms > 0]";
  // $param = "[item type:housing] [location: @{$lat}{$lon} + {$distance}mi]";
  // $param = "[item type:housing] [location: @+37.795-122.395 + 3mi]";
  
  $param = urlencode($param);
  $url = "http://base.google.com/base/feeds/snippets?max-results=1&bq=" . $param;
  // print $url;
  
  $xml = simplexml_load_file($url);

  if (!is_object($xml->Response)) return 0;
  
  xml_to_result($xml);

}
//---------------------------------------
// XML Parsing
//
//---------------------------------------
function object2array($object){
  $return = NULL;
    
  if(is_array($object)){
    foreach($object as $key => $value) $return[$key] = object2array($value);
   }else{
    $var = get_object_vars($object);
       
    if($var){
      foreach($var as $key => $value) $return[$key] = object2array($value);
    }else return strval($object); // strval and everything is fine
   }

   return $return;
}


function xml_to_result($xml){
  global $res;
    
  $entries  = $xml->entry;
  foreach($entries as $entry){
    // get the Google Namespace
    $google = $entry->children('http://base.google.com/ns/1.0');
    $gbase = array();
    $gbase = object2array($google);
    
    $base = array();
    $base = object2array($entry);
    
    $res[] = array_merge($base,$gbase);
    
  }
  
  // print dump_array($res);
}

?>