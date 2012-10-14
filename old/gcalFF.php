<?php

header("content-type: text/html");
print ("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");

?>

<HTML>
<HEAD>
<style>
.gcalItem__MODULE_ID__ {color: #000000; font-size: 8pt;}
.HgcalItem__MODULE_ID__ {color: #000000; font-size: 8pt;background-color:#FFFFCC}
.GgcalItem__MODULE_ID__ {color: #000000; font-size: 8pt;background-color:#EBFFCE}
.NgcalItem__MODULE_ID__ {color: #000000; font-size: 8pt;background-color:#FFFF99}
.gcalOverlay__MODULE_ID__ {filter:alpha(opacity=30);-moz-opacity:0.30;margin:2px 2px 2px 2px;-moz-border-radius:6px;}
.rTDleft__MODULE_ID__ {-moz-border-radius-topleft:4px;-moz-border-radius-bottomleft:4px}
.rTDright__MODULE_ID__ {-moz-border-radius-topright:4px;-moz-border-radius-bottomright:4px}
.rTD__MODULE_ID__ {-moz-border-radius:4px}
.ebox__MODULE_ID__ {-moz-border-radius:4px;background-color:#6688aa;overflow:hidden;top:10px;left:10px;position:absolute}
</style>


<script>
  var version__MODULE_ID__ = "EXT2.1.02";
  var prefCount__MODULE_ID__ = 21;  // viewable nodes
  var LSpref__MODULE_ID__ = 12;
  var LDpref__MODULE_ID__ = 19;


/*

Google Module for Google Calendar - backdoor edition
Chris McKeever - 2006 cgmckeever@r2unit.com

inspired by GMail Agenda and Paul Russell's gcal module.
http://www.r2unit.com/greasemonkey/
http://russelldad.googlepages.com/mygooglehomepagemodules

original - more documented version:
http://www.r2unit.com/gmodule/


*/

function _gel(elID){
  return document.getElementById(elID);
}


function initialize__MODULE_ID__(){
  // define global

  _gel("m___MODULE_ID___url").innerHTML = "Google Calendar - " + version__MODULE_ID__;

  IE__MODULE_ID__ = false;
  if (navigator.appName == "Microsoft Internet Explorer") IE__MODULE_ID__ = true;

  domain__MODULE_ID__ = document.domain;
  proto__MODULE_ID__ = location.toString().match(/[^:]*/);
  editLink__MODULE_ID__ = proto__MODULE_ID__ + "://" + domain__MODULE_ID__ + "/calendar/event?eid=";
  iwEV__MODULE_ID__ = -1;  // infowindow in a change state; -1 not loaded
  autoSet__MODULE_ID__ = false; // determines checkbox status of manual or auto
  overlayHeight__MODULE_ID__ = 60;
  reqID__MODULE_ID__ = 0;
  rqTO__MODULE_ID__ = "";
  iwTO__MODULE_ID__ = "";
  modTitle__MODULE_ID__ = "";
  deflen__MODULE_ID__ = 20;
  FeedList__MODULE_ID__ = new Array; // track of feeds
  FeedIndex__MODULE_ID__ = new Array; // track of feeds

  var URL = proto__MODULE_ID__ + "://" + domain__MODULE_ID__  + "/calendar/render?pli=1";
  _gel('authTest__MODULE_ID__').src = URL;  // cookie hack using images

  // user preferences 
  UPFeedView__MODULE_ID__= 1;  // hidden feed selector  TODO EXT var
  UPfeedSelect__MODULE_ID__ = false;
  UPdayForward__MODULE_ID__ = 12;
  UPlocation__MODULE_ID__ = true;
  UPtoday__MODULE_ID__ = true;
  UPclock__MODULE_ID__ = 1;
  UPfutureOnly__MODULE_ID__ = false;
  UPinfoWindow__MODULE_ID__ = true;
  UPdisplayFont__MODULE_ID__ = 8;
  UPheight__MODULE_ID__ = 300;
  UPcolorCode__MODULE_ID__ = true;
  UPtdFormat__MODULE_ID__ = 1;
  UPQevent__MODULE_ID__ = true;

  // object shorthand
  newNode__MODULE_ID__ = getObjMethodClosure__MODULE_ID__(document, "createElement");

  // Month array
  monthA__MODULE_ID__ = new Array;
  monthA__MODULE_ID__[1] = 'January';
  monthA__MODULE_ID__[2] = 'February';
  monthA__MODULE_ID__[3] = 'March';
  monthA__MODULE_ID__[4] = 'April';
  monthA__MODULE_ID__[5] = 'May';
  monthA__MODULE_ID__[6] = 'June';
  monthA__MODULE_ID__[7] = 'July';
  monthA__MODULE_ID__[8] = 'August';
  monthA__MODULE_ID__[9] = 'September';
  monthA__MODULE_ID__[10] = 'October';
  monthA__MODULE_ID__[11] = 'November';
  monthA__MODULE_ID__[12] = 'December';

  // Day array
  dayA__MODULE_ID__ = new Array;
  dayA__MODULE_ID__[0] = 'Sunday';
  dayA__MODULE_ID__[1] = 'Monday';
  dayA__MODULE_ID__[2] = 'Tuesday';
  dayA__MODULE_ID__[3] = 'Wednesday';
  dayA__MODULE_ID__[4] = 'Thursday';
  dayA__MODULE_ID__[5] = 'Friday';
  dayA__MODULE_ID__[6] = 'Saturday';

  colorA__MODULE_ID__ = new Array;
  colorA__MODULE_ID__[1] = 'cc3333';
  colorA__MODULE_ID__[2] = 'dd4477';
  colorA__MODULE_ID__[3] = '994499';
  colorA__MODULE_ID__[4] = '6633cc';
  colorA__MODULE_ID__[5] = '336699';
  colorA__MODULE_ID__[6] = '3366cc';
  colorA__MODULE_ID__[7] = '22aa99';
  colorA__MODULE_ID__[8] = '329262';
  colorA__MODULE_ID__[9] = '109618';
  colorA__MODULE_ID__[10] = '66aa00';
  colorA__MODULE_ID__[11] = 'aaaa11';
  colorA__MODULE_ID__[12] = 'd6ae00';
  colorA__MODULE_ID__[13] = 'ee8800';
  colorA__MODULE_ID__[14] = 'dd5511';
  colorA__MODULE_ID__[15] = '627487';
  colorA__MODULE_ID__[16] = 'a87070';
  colorA__MODULE_ID__[17] = '8c6d8c';
  colorA__MODULE_ID__[18] = '7083a8';
  colorA__MODULE_ID__[19] = '5c8d87';
  colorA__MODULE_ID__[20] = '898951';
  colorA__MODULE_ID__[21] = 'b08b59';

  // current date info
  nowParse__MODULE_ID__ = parseDate__MODULE_ID__(new Date(),false);

  nowDate__MODULE_ID__ = new Date(monthA__MODULE_ID__[nowParse__MODULE_ID__['month']] + " " + nowParse__MODULE_ID__['date'] + " " + nowParse__MODULE_ID__['year']);
  nowTS__MODULE_ID__ = nowDate__MODULE_ID__.getTime();
  rightNowTS__MODULE_ID__ = new Date().getTime(); // the exact time not adjusted for the full day view
  // feed parameters

  var lookBack = 1;
  start_minTS__MODULE_ID__ = nowTS__MODULE_ID__ - (lookBack * 24 * 60 * 60 * 1000) // look back days
  start_min__MODULE_ID__ = parseDate__MODULE_ID__(start_minTS__MODULE_ID__);
  if (start_min__MODULE_ID__['month'] < 10) start_min__MODULE_ID__['month'] = "0" + start_min__MODULE_ID__['month'];
  if (start_min__MODULE_ID__['date'] < 10) start_min__MODULE_ID__['date'] = "0" + start_min__MODULE_ID__['date'];
  start_min__MODULE_ID__ = start_min__MODULE_ID__['year'] + start_min__MODULE_ID__['month'] 
                         + start_min__MODULE_ID__['date'] + "T000000";

  start_maxTS__MODULE_ID__ = nowTS__MODULE_ID__ + (1000 * 60 * 60 * 24) * UPdayForward__MODULE_ID__;
  start_max__MODULE_ID__ = parseDate__MODULE_ID__(start_maxTS__MODULE_ID__);
  if (start_max__MODULE_ID__['month'] < 10) start_max__MODULE_ID__['month'] = "0" + start_max__MODULE_ID__['month'];
  if (start_max__MODULE_ID__['date'] < 10) start_max__MODULE_ID__['date'] = "0" + start_max__MODULE_ID__['date'];
  start_max__MODULE_ID__ = start_max__MODULE_ID__['year'] + start_max__MODULE_ID__['month'] 
                         + start_max__MODULE_ID__['date'] + "T000000";

  // -----> global decs  


  statMessage__MODULE_ID__("",true);
//  formatPrefContent__MODULE_ID__(); // reformat Gmods

  if (false){
    statMessage__MODULE_ID__("Module Disabled <FONT style='font-size:8pt;color:grey'>(v" + version__MODULE_ID__  + ")</FONT>&nbsp;&nbsp;<FONT style='font-size:8pt;text-decoration:underline;color:grey' onclick='javascript: enableModule__MODULE_ID__();'>Enable</FONT>",true)
    return;
  }

  if (parseInt(UPheight__MODULE_ID__) != -1) _gel('calendar_content__MODULE_ID__').style.height = UPheight__MODULE_ID__ + "px";

  if (UPtoday__MODULE_ID__ || UPclock__MODULE_ID__ != 0) datetime__MODULE_ID__();
  if (UPinfoWindow__MODULE_ID__) createWindow__MODULE_ID__();
  createEntryBox__MODULE_ID__();
  createTooltip__MODULE_ID__();

  CalAuth__MODULE_ID__();
}

function enableModule__MODULE_ID__(){
  // quick enable of module - 
  _gel('m___MODULE_ID___form').elements[1].checked = false;
  prefs__MODULE_ID__.set('UPDISABLE',false);
  prefs__MODULE_ID__.getBool('UPDISABLE');
  initialize__MODULE_ID__();
}

function shrink__MODULE_ID__(text,length,append){
  // shrinks text to length and makes undefined = ''
  // appends append to the end
  if (text){
    // fix IE &apos; issue
    text = text.replace("&apos;","'");
    if (text.length > length) text = text.substring(0,length) + append; 
  } else text = "";

  return text;
}

function formatPrefContent__MODULE_ID__(){
  var Ptable =_gel("m___MODULE_ID___form").firstChild.firstChild.firstChild;
  if (!Ptable  || Ptable.childNodes[prefCount__MODULE_ID__ - 1].style.display == 'none') return;
  var prefAdd = 0;

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[prefAdd],"<FONT style='font-weight:bold;font-size:8pt;color:gray'>v" + version__MODULE_ID__ + "</FONT>","<a style='text-decoration:none;color:gray;font-size:8pt' href='http://www.r2unit.com/gmodule/' target=_blank>about&nbsp;&gt;&gt;</a>");
  prefAdd ++;

  var FS = prefAdd + 1;
  var LS = prefAdd + 1 + LSpref__MODULE_ID__;
  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[prefAdd],"<FONT style='font-weight:bold;font-size:10pt;'>Preferences:</FONT>&nbsp;<FONT style='cursor:pointer;font-size:8pt;text-decoration:underline;color:blue' onclick='javascript: toggleNode__MODULE_ID__(" + FS  + "," + LS + ");'>Setup</FONT>",false);
  prefAdd ++;

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LS],"<FONT style='font-weight:bold;font-size:8pt;color:gray'>(Removes events that have ended for today.)</FONT>",false);
  prefAdd ++;

  var FTD = LS + 2;
  var LTD = LDpref__MODULE_ID__ + prefAdd; // number of added TD prefs
  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[FTD - 1],"<BR><FONT style='font-weight:bold;font-size:10pt;'>Time/Date Display:</FONT>&nbsp;<FONT style='cursor:pointer;font-size:8pt;text-decoration:underline;color:blue' onclick='javascript: toggleNode__MODULE_ID__(" + FTD  + "," + LTD + ");'>Setup</FONT>",false);
  prefAdd ++;

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LDpref__MODULE_ID__ + prefAdd],"<BR><FONT style='font-weight:bold;font-size:10pt;'>Calendars:</FONT>&nbsp;<FONT style='cursor:pointer;font-size:8pt;text-decoration:underline;color:blue' onclick='javascript: toggleDIV__MODULE_ID__(\"urlC__MODULE_ID__\");'>Learn More</FONT>",false);
  prefAdd ++;

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LDpref__MODULE_ID__ + prefAdd],"<DIV id='urlC__MODULE_ID__' style='display:none'><FONT style='font-size:8pt;'>This module will find your calendar feeds based on your last logged in session to Google Calendar.  If you have multiple calendars in your profile, it will allow you the choice to use color coded line items as well as the option to choose to add a 'Quick Select' list into the main module window for easy calendar selection.<BR><BR>",false);
  prefAdd ++;

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[prefCount__MODULE_ID__ + prefAdd],"<FONT style='font-weight:bold;font-size:8pt;color:gray'>(Moves feed selection to main window)</FONT>",false);
  prefAdd ++;

  prefCount__MODULE_ID__ = prefAdd + prefCount__MODULE_ID__;
  prefFormat__MODULE_ID__ = true;

  Ptable.childNodes[prefCount__MODULE_ID__ - 1].style.display = 'none'; // show check comment
  Ptable.childNodes[prefCount__MODULE_ID__ - 2].style.display = 'none'; // show check
  Ptable.childNodes[prefCount__MODULE_ID__ - 3].style.display = 'none'; // color code

  toggleNode__MODULE_ID__(FS,LS);
  toggleNode__MODULE_ID__(FTD,LTD);

}

function insertRow__MODULE_ID__(parent,child,td1HTML,td2HTML){
   var tr = newNode__MODULE_ID__("tr");
   if (td2HTML == false){
     var td = newNode__MODULE_ID__("td");
     td.setAttribute("colSpan","2");
     td.innerHTML=td1HTML;
     tr.appendChild(td);
   } else {
     var td1 = newNode__MODULE_ID__("td");
     var td2 = newNode__MODULE_ID__("td");
     td2.setAttribute("align","right");
     td1.innerHTML=td1HTML;
     td2.innerHTML=td2HTML;
     tr.appendChild(td1);
     tr.appendChild(td2);
   }
   parent.insertBefore(tr,child);
}

function toggleDIV__MODULE_ID__(divID){
  var div = _gel(divID);
  div.style.display = (div.style.display == 'none') ? div.style.display = '' : div.style.display = 'none';
}

function toggleNode__MODULE_ID__(firstNode,lastNode){
  var Ptable =_gel("m___MODULE_ID___form").firstChild.firstChild.firstChild;
  var display = (Ptable.childNodes[firstNode].style.display == 'none') ? '' : 'none';
  for (var nodeI = firstNode; nodeI <= lastNode; nodeI++){ Ptable.childNodes[nodeI].style.display = display; } 
}

function getObjMethodClosure__MODULE_ID__(object, method) {
  // shorthand object reference
  return function(arg) {return object[method](arg);}
}

function statMessage__MODULE_ID__(message,reset){
  // updates status message - resets message
  _gel('status_content__MODULE_ID__').style.display = '';
  _gel('status_content__MODULE_ID__').innerHTML  = "<BR>" + _gel('status_content__MODULE_ID__').innerHTML;
  if (reset) _gel('status_content__MODULE_ID__').innerHTML = "";
  _gel('status_content__MODULE_ID__').innerHTML = message + _gel('status_content__MODULE_ID__').innerHTML;
}

function CalAuth__MODULE_ID__(){
  var URL = proto__MODULE_ID__ + "://" + domain__MODULE_ID__  + "/calendar/render?pli=1";
  var httprq = createRequestObject__MODULE_ID__();
  statMessage__MODULE_ID__('Checking Authentication...',true);
  setTimeout(function(){sndAuth__MODULE_ID__(httprq,URL)},500);
}

function parseAuth__MODULE_ID__(ro){

  if (ro.status == 200){
    var auth = new Array;
    auth = ro.getResponseHeader('Set-Cookie').split(";");
    var CALRE = /[^=]*$/;
    CAL__MODULE_ID__ = CALRE.exec(auth[0]);
    statMessage__MODULE_ID__('Authentication Successful.',false);
    var URL = proto__MODULE_ID__ + "://" + domain__MODULE_ID__  + "/calendar/render?pli=1";
    ro.open('get',URL);
    ro.onreadystatechange = function (){ if (ro.readyState == 4) parseCalInfo__MODULE_ID__(ro); }
    ro.send(null);
    statMessage__MODULE_ID__('Retrieving Calendar Info...',false);
  } else {
    statMessage__MODULE_ID__('Authentication Failed',false);
    statMessage__MODULE_ID__('Please First Login To Google Calendar.',false);
    return;
  }
  return;
}

function parseCalInfo__MODULE_ID__(ro){
  var calInfo = false;
  if (ro.status == 200){
    var pageHTML = ro.responseText;
    calInfo = pageHTML.match(/([0-9a-zA-Z])*\/color','([0-9])*/g);
    TZ__MODULE_ID__ = pageHTML.match(/_es_setDisplayTz\("([^"]*)/);
    TZ__MODULE_ID__ = TZ__MODULE_ID__[1];
    statMessage__MODULE_ID__('TimeZone: ' + TZ__MODULE_ID__,false);
  } 

  if (!calInfo) {
    statMessage__MODULE_ID__('Calendar Information not retrieved.',false);
    return;
  } else {
    var calRE = /([0-9a-zA-Z]*)\/color','([0-9]*)/;
    var cal;
    var dtid;
    for (var indexI = 0; indexI < calInfo.length; indexI++){
      cal = calRE.exec(calInfo[indexI]);
      var id = cal[1]; 
      dtid += "&dtid=" + id;
      FeedList__MODULE_ID__[id] = new Array;
      FeedList__MODULE_ID__[id]['color'] = colorA__MODULE_ID__[cal[2]];
      FeedList__MODULE_ID__[id]['cache'] = false;
      FeedList__MODULE_ID__[id]['request'] = false; 
    }
    var URL = proto__MODULE_ID__ + "://" + domain__MODULE_ID__  + "/calendar/caldetails?pli=1" + dtid;
    ro.open('get',URL);
    ro.onreadystatechange = function (){ if (ro.readyState == 4) parseCalDetail__MODULE_ID__(ro); }
    ro.send(null);
  }
}

function parseCalDetail__MODULE_ID__(ro){
  if (ro.status == 200){
    var optionBox = newNode__MODULE_ID__('select');
    optionBox.id = 'feedS__MODULE_ID__';
    optionBox.onchange = selectFeed__MODULE_ID__;
    var checked = "";
    var select = 0;
    var rowOffset = 22;
    UPFeedView = UPFeedView__MODULE_ID__;
    if (UPFeedView == "") UPFeedView = "1";
    UPFeedView = UPFeedView.split('');
    var legendHTML = "<TABLE width='100%'><TR><TD align=right><TABLE cellspacing=0 cellpadding=0 border=0>";

//	prompt("DEBUG MII\nCalendar Info\n",ro.responseText)
    var detail = eval(ro.responseText);
    var multiple = true;
    if (detail.length == 1) {
      multiple = false // default it to not showing selector
      UPFeedView[0] = 1;
    }
    var indexC = 0;
    for (var indexI = 0; indexI < detail.length; indexI++){
      if (detail[indexI][0] == '_DS_put'){
        var id = detail[indexI][1];
        FeedList__MODULE_ID__[id]['title'] = detail[indexI][5];
        FeedList__MODULE_ID__[id]['view'] = detail[indexI][2];
        FeedList__MODULE_ID__[id]['TZ'] = detail[indexI][6];
        FeedList__MODULE_ID__[id]['key'] = detail[indexI][10];
        FeedList__MODULE_ID__[id]['status'] = detail[indexI][12];
        FeedList__MODULE_ID__[id]['path'] = detail[indexI][14]; 

        if ((FeedList__MODULE_ID__[id]['view'] != 0) && 
           (FeedList__MODULE_ID__[id]['status']!= 'FAIL' || FeedList__MODULE_ID__[id]['status'] != 'UNKNOWN')) {
          FeedIndex__MODULE_ID__[indexC] = new Array;
          FeedIndex__MODULE_ID__[indexC]['id'] = id;
          var label = shrink__MODULE_ID__(FeedList__MODULE_ID__[id]['title'],30,"...");
          optionBox[indexC] = new Option(FeedList__MODULE_ID__[id]['title'],id);
          if (!multiple) FeedList__MODULE_ID__[id]['color'] = "FFFFFF";
          var color = FeedList__MODULE_ID__[id]['color'];
          checked = "";
          if (UPFeedView[indexC] == '1'){
            checked = "checked";
            select = indexC;
            FeedList__MODULE_ID__[id]['request'] = true;
          }

          legendHTML += "<TR><TD width=25px class='rTDleft__MODULE_ID__' style='background:#" + color + "' onclick='javascript: legendSelect__MODULE_ID__(\"" + id + "\"," + indexC  + ")'><INPUT type=checkbox " + checked  + " id='" + indexC + "CB__MODULE_ID__'></TD><TD class='rTDright__MODULE_ID__' style='background:#" +  color + ";color:#FFFFFF;font-size:8pt'>" + label  + "&nbsp&nbsp;</TD></TR><TR><TD id='spL" + indexC + "__MODULE_ID__' colspan=2 style='font-size:4' align=center>&nbsp;</TD></TR>";
          overlayHeight__MODULE_ID__ += rowOffset;;

          statMessage__MODULE_ID__('Found: ' + FeedList__MODULE_ID__[id]['title'],false);
          indexC ++;
       }
      } else if (detail[indexI][0] == 'ap') {
        var info = detail[indexI][1];
        info = info.toString().split(',');
        // not sure how this can be built into the details 0 seems to indicate a primary calenar
      }
    }

    if (prefFormat__MODULE_ID__  && multiple == true){
      var Ptable =_gel("m___MODULE_ID___form").firstChild.firstChild.firstChild;
      Ptable.childNodes[prefCount__MODULE_ID__ -1].style.display = ''; // quick select info
      Ptable.childNodes[prefCount__MODULE_ID__ - 2].style.display = '';  // quick select
      Ptable.childNodes[prefCount__MODULE_ID__ - 3].style.display = ''; // color code
    }

    legendHTML += "</TABLE></TD></TR></TABLE>";
    _gel('legendDIV__MODULE_ID__').innerHTML = legendHTML; 

    var feedDiv = _gel("feedDIV__MODULE_ID__");
    feedDiv.appendChild(optionBox);
    optionBox.selectedIndex = select;
    feedDiv.style.display = (UPfeedSelect__MODULE_ID__  && multiple) ? "" : "none";
    _gel("arrowC__MODULE_ID__").style.display = (multiple) ? "" : "none";

    prepareFeed__MODULE_ID__("intial");
 
  } else {
    statMessage__MODULE_ID__('Calendar Information not retrieved.',false);
  }
}

function toggleLegend__MODULE_ID__(){
  var overlayDIV = _gel("overlayDIV__MODULE_ID__");
  var legendDIV = _gel("legendDIV__MODULE_ID__");
  var calDIV = _gel('calendar_content__MODULE_ID__');
 
  if (overlayDIV.style.display == "none") {
    infoClose__MODULE_ID__();
    _gel("arrowC__MODULE_ID__").style.display = "none";
    _gel("arrowO__MODULE_ID__").style.display = "";
    _gel("feedS__MODULE_ID__").style.display = "none";

    var contHeight = overlayHeight__MODULE_ID__ + 5;
    if (contHeight > parseInt(calDIV.style.height) || UPheight__MODULE_ID__ == -1) {
      calDIV.style.display = '';
      calDIV.style.height = contHeight ;
    }
    overlayDIV.style.height = overlayHeight__MODULE_ID__ + 'px';
    overlayDIV.style.display = legendDIV.style.display = "";
  } else {
    _gel("arrowO__MODULE_ID__").style.display = "none";
    _gel("arrowC__MODULE_ID__").style.display = "";
    _gel("feedS__MODULE_ID__").style.display = '';
    calDIV.style.height  = (UPheight__MODULE_ID__ != -1) ? UPheight__MODULE_ID__ + 'px' : "";
    overlayDIV.style.display = legendDIV.style.display = "none";
  }
}

function legendSelect__MODULE_ID__(feedID,index){
  if (autoSet__MODULE_ID__) return;
  reqID__MODULE_ID__++;
  FeedList__MODULE_ID__[feedID]['request'] = (_gel(index + "CB__MODULE_ID__").checked) ? true : false;
  clearTimeout(rqTO__MODULE_ID__);
  rqTO__MODULE_ID__ = setTimeout("checkRequest__MODULE_ID__(" + reqID__MODULE_ID__ + ")",1000);
}

function checkRequest__MODULE_ID__(reqID){
  // make sure that new updates for display haven't been made
  if (reqID == reqID__MODULE_ID__) {
    setFeed__MODULE_ID__(false);
    _gel('status_content__MODULE_ID__').innerHTML = "";
    prepareFeed__MODULE_ID__("Legend - update");
  }
}


function selectFeed__MODULE_ID__(){ 
  if (_gel("feedDIV__MODULE_ID__").style.display == 'none') return; 
  var optionFeed = _gel("feedS__MODULE_ID__");
  _gel('status_content__MODULE_ID__').innerHTML = '';
  setFeed__MODULE_ID__(true);
  prepareFeed__MODULE_ID__("Quick Select");
}

function setFeed__MODULE_ID__(single){
  // determines check state and sets hidden UP
  var optionFeed = _gel("feedS__MODULE_ID__");
  var feedView = "";  
  autoSet__MODULE_ID__ = true;

  for (var feedI = 0; feedI < FeedIndex__MODULE_ID__.length; feedI++){
    if (single && feedI != optionFeed.selectedIndex){
      feedView += '0';
      FeedList__MODULE_ID__[optionFeed[feedI].value]['request'] = false;
      _gel(feedI + "CB__MODULE_ID__").checked = false;      
    } else if (single && feedI == optionFeed.selectedIndex){
      feedView += '1';
      FeedList__MODULE_ID__[optionFeed[feedI].value]['request'] = true;
      _gel(feedI + "CB__MODULE_ID__").checked = true;
    } else {
      feedView += (_gel(feedI + "CB__MODULE_ID__").checked) ? 1 : 0;
    }
  }

  // TODO set ext var
  // prefs__MODULE_ID__.getString('UPFEEDVIEW');
  autoSet__MODULE_ID__ = false; 
}

function prepareFeed__MODULE_ID__(where){
  _gel('status_content__MODULE_ID__').style.display = '';
  infoClose__MODULE_ID__();
  statMessage__MODULE_ID__('Analyzing Calendars.',false);
//	alert(where);
  var modTitle = "";
  var lefp = "";
  var ctz = "ctz=" + escape(TZ__MODULE_ID__);
  var lrt = "lrt=" + start_min__MODULE_ID__  + "Z&";
  var droi = "droi=" + start_min__MODULE_ID__ + "%2F" + start_max__MODULE_ID__ + "&";
  var droip = "droiP=" + start_min__MODULE_ID__ + "%2F" + start_max__MODULE_ID__  + "&";
  for (var feedI = 0; feedI < FeedIndex__MODULE_ID__.length; feedI++){
    // not worrying about caching at this point
    var id = FeedIndex__MODULE_ID__[feedI]['id'];
    if (FeedList__MODULE_ID__[id]['request'] == true && FeedList__MODULE_ID__[id]['view'] != 0){
      lefp += "&lefP=" + id;
      if (modTitle == ''){
        modTitle = "GCal - " + shrink__MODULE_ID__(FeedList__MODULE_ID__[id]['title'],20,'...');
      } else modTitle = 'Google Calendar';
    }
  }
 
  if (modTitle == "") modTitle = 'Google Calendar';
  _gel("m___MODULE_ID___url").innerHTML = modTitle;

  statMessage__MODULE_ID__('Requesting Events.',false);
  var httprq = createRequestObject__MODULE_ID__();
  var URL = proto__MODULE_ID__ + "://" + domain__MODULE_ID__  + "/calendar/load?" + droi + droip + lrt + ctz + lefp;
  httprq.open('get',URL);
  httprq.onreadystatechange = function (){ if (httprq.readyState == 4) {parseEventReq__MODULE_ID__(httprq);} }
  httprq.send(null);

}

function parseEventReq__MODULE_ID__(ro){
  if (ro.status == 200){
    EventList__MODULE_ID__ = new Array;  // Array of events
    var events = eval(ro.responseText);
    for (var I = 0; I < events.length; I++){
      var eID = events[I][1];
      var title = events[I][2];
      var startTS = TSfromISO__MODULE_ID__(events[I][3],0,false);
      var endTS = TSfromISO__MODULE_ID__(events[I][4],0,true);
      var feedID = events[I][5];
      var location = events[I][9];
      if (!location) location = "";
      addEvent__MODULE_ID__(new CalendarEvent__MODULE_ID__(eID,feedID,title,startTS,endTS,location));

    }
  } else {
    statMessage__MODULE_ID__('Event Retrieval Failed.',false);  
  }

  statMessage__MODULE_ID__('Organizing Your Events.',false);
  EventList__MODULE_ID__ = EventList__MODULE_ID__.sort(function(a,b){return cmp__MODULE_ID__(a.startTS,b.startTS);});
  formatEvent__MODULE_ID__(EventList__MODULE_ID__);
  _gel('status_content__MODULE_ID__').style.display = 'none';
  _gel('calendar_content__MODULE_ID__').style.display = '';

}


// infowindow

function createWindow__MODULE_ID__(){
  var infoWindow = newNode__MODULE_ID__('div');
  var imagePath = "http://mailqueue.googlepages.com/";
  var imageA = new Array;
  imageA.push(imagePath + 'iw_n.png');
  imageA.push(imagePath + 'iw_e.png');
  imageA.push(imagePath + 'iw_s.png');
  imageA.push(imagePath + 'iw_w.png');
  imageA.push(imagePath + 'iw_c.png');
  imageA.push(imagePath + 'iw_nw.png');
  imageA.push(imagePath + 'iw_ne.png');
  imageA.push(imagePath + 'iw_sw.png');
  imageA.push(imagePath + 'iw_tap.png');
  imageA.push(imagePath + 'iw_se.png');

  var png = new Array;
  for(var iCount = 0; iCount < 10; iCount++){
    if (IE__MODULE_ID__){
      png[iCount] = "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" 
                  + imageA[iCount] + ",sizingMethod=scale)"
    } else png[iCount] = "background-image:url(" + imageA[iCount] + ")";
  }

  var iw = "";
  iw += "<div onclick='checkClickArea__MODULE_ID__(event);' id='infowindow__MODULE_ID__' ";
  iw += " style='display:none;position:absolute;left:0px;top:0px;z-index:120;'>";
  iw += " <div style='overflow:hidden;position:absolute;width:250px;height:25px;left:25px;top:0px;" + png[0] +"'></div>";
  iw += " <div style='overflow:hidden;position:absolute;width:25px;height:105px;left:275px;top:25px;" + png[1] +"'></div>";
  iw += " <div style='overflow:hidden;position:absolute;width:152px;height:96px;left:25px;top:130px;" + png[2] +"'></div>";
  iw += " <div style='overflow:hidden;position:absolute;width:25px;height:105px;left:0px;top:25px;" + png[3] +"'></div>";
  iw += " <div style='overflow:hidden;position:absolute;width:250px;height:105px;left:25px;top:25px;" + png[4] +"'></div>";
  iw += " <div style='overflow:hidden;position:absolute;width:25px;height:25px;left:0px;top:0px;" + png[5] +"'></div>";
  iw += " <div style='overflow:hidden;position:absolute;width:25px;height:25px;left:275px;top:0px;" + png[6] +"'></div>";
  iw += " <div style='overflow:hidden;position:absolute;width:25px;height:96px;left:0px;top:130px;" + png[7] +"'></div>";
  iw += " <div style='overflow:hidden;position:absolute;left:177px;top:130px;height:96px;width:98px;" + png[8] +"'></div>";
  iw += " <div style='overflow:hidden;position:absolute;width:25px;height:96px;left:275px;top:130px;" + png[9] +"'></div>";
  iw += " <img onclick='javascript: infoClose__MODULE_ID__();' width='14' Height='13'";
  iw += "   src='" + imagePath + "close.gif'";
  iw += "   style='position:absolute;z-index:200;cursor:pointer;left:275px;top:10px;'/>";
  iw += " <div style='overflow:hidden;width:257px;position:absolute;left:15px;top:15px;height:128px;z-index:3;cursor: default;'>";
  iw += "  <div style='width: 255px;'>";
  iw += "  <span id='iwT__MODULE_ID__' style='font-size:100%;'><b>Title</b></span>";
  iw += "  <span id='iwD__MODULE_ID__' style='font-size:80%'>Date</span><br style='line-height: 6px;'/>";
  iw += "  <span id='iwW__MODULE_ID__' style='font-size:80%'><B>Where:</B><br/></span>";
  iw += "  <span id='iwA__MODULE_ID__' style='font-size:65%'><B>Created By:</B></span>";
  iw += "  <div id='iwS__MODULE_ID__' style='border-top:1px solid red;margin-top:5px;height:3px;width:100%;'/>";
  iw += "  <span id='iwI__MODULE_ID__' style='font-size:60%'>Information</span>";
  iw += "</div></div></div>";

  infoWindow.innerHTML = iw;
  iwEV__MODULE_ID__ = false;
  document.body.appendChild(infoWindow);

}

function infoOpen__MODULE_ID__(self,event,evIndex){
  var UPemail = 0;

  if (UPinfoWindow__MODULE_ID__){
    
    clearTimeout(iwTO__MODULE_ID__);
    iwEV__MODULE_ID__ = true;
    _gel('infowindow__MODULE_ID__').style.display = 'none';

    var X = event.clientX - 182;
    if (X > 696) X = 696;
    if (X < 3) X = 3;
   
    var offY = 0;
    if(UPfeedSelect__MODULE_ID__ && IE__MODULE_ID__) _gel("feedS__MODULE_ID__").style.display = 'none';  

    var Y = (IE__MODULE_ID__) ? event.clientY + document.body.scrollTop : event.pageY;
    Y = Y - 221 - offY;
    if (Y < -7) Y = -7;

    _gel('infowindow__MODULE_ID__').style.top = Y  + 'px';
    _gel('infowindow__MODULE_ID__').style.left = X  + 'px';

    linebreak = (UPemail == 0) ? "<BR>" : "\n";

    var eventO = EventList__MODULE_ID__[evIndex];
    var feedID = eventO.feedID;
    var color = FeedList__MODULE_ID__[feedID]['color'];
    if (color == "FFFFFF") color = "627487";

    var editURL = editLink__MODULE_ID__ + eventO.id;

    var httprq = createRequestObject__MODULE_ID__();
    var URL = editURL;
    httprq.open('get',URL);
    httprq.send(null);

    var title = eventO.title;
    var linkTitle = "<A href='" + editURL  + "' target='_blank' style='color:#" + color + ";font-weight:bold'>" 
                  + shrink__MODULE_ID__(title,22,'...') + "</A>";
/*
    var linkTitle += "&nbsp;&nbsp;<FONT style='font-size:8pt;color:blue;cursor:pointer' "
                  + "onclick='javascript: deleteEvent__MODULE_ID__(" 
                  + evIndex + ")' "
                  + ">[<U>Delete</U>]</Font>";
*/

    var location = eventO.location;
    var mapURL = "http://maps.google.com/maps?oi=map&q=" + location;

    var detail = "";

    var td = formatDate__MODULE_ID__(eventO,false);
    var td = td['std'];
    td['day'] = td['day'].replace(/&nbsp;/,'')
    var date = td['day'] + ",&nbsp;" + td['mrange'] + "&nbsp;" 
             + td['drange'] + td['remainDate'] + ", " + td['year'] 
             + "&nbsp;" + td['trange'];

    _gel('iwD__MODULE_ID__').innerHTML = date + "<BR><br style='line-height: 6px;'/>";

    date = date.replace(/&nbsp;/g," ");
    var body = linebreak + linebreak + title + " - " + date + linebreak;
    if (location.length != 0){
      body += "Where: " + location + linebreak + "Map: " + mapURL + linebreak;
      location = "<B>Where:</B>&nbsp;" + shrink__MODULE_ID__(location,22,'...') 
               + "&nbsp;<FONT style='font-size:8pt'>[<A href='" 
               + mapURL + "' target='_blank'>map</A>]</FONT>" + "<BR>";
    } 
    body += linebreak;

    var author = ""; //FeedList__MODULE_ID__[feedID]['author'];
    var email = "";  //FeedList__MODULE_ID__[feedID]['email'];

    var fTitle = "<BR><A href='https://calendar.google.com' target='_blank' style='font-size:10pt;color:#" + color  + "'>" 
               + FeedList__MODULE_ID__[feedID]['title'] + "</A>";

    if (detail.length == 0) {
      detail = fTitle;
    } else {
      body += detail + linebreak + linebreak;
      detail = shrink__MODULE_ID__(eventO.detail,145,'...');
    }

    _gel('iwT__MODULE_ID__').innerHTML = linkTitle + "<BR>";
    _gel('iwW__MODULE_ID__').innerHTML = location;    

    title = escape(title); 
    if (email.length != 0 && author.length != 0) 
        email = "&nbsp;[<A href='https://mail.google.com/mail?view=cm&tf=0&to=" 
              + email  + "&su=RE:%20" + title  
              + "' target='_blank' onclick='return!open(this.href,this.target," 
              + "\"width=600,height=560,scrollbars=no,resizable=yes,toolbar=no,menubar=no\")'>" 
              + shrink__MODULE_ID__(email,18,'...') + "</A>]";

    author = author + email;
    if (author.length != 0) author = "<B>Author:</B>&nbsp;" + author;
    _gel('iwA__MODULE_ID__').innerHTML = author;

    _gel('iwS__MODULE_ID__').style.borderTop = '1px solid #' + color;

    body = escape(body);
    emailTo = "[<A  style='font-size:8pt' href='https://mail.google.com/mail?view=cm&tf=0&su=[GCal Event]%20" 
            + title + "&body=" + body  + "' target='_blank' onclick='return!open(this.href,this.target," 
            + "\"width=600,height=560,scrollbars=no,resizable=yes,toolbar=no,menubar=no\")'>Email</A>]&nbsp;";

    _gel('iwI__MODULE_ID__').innerHTML = emailTo + detail;

    _gel('infowindow__MODULE_ID__').style.display = '';

     iwTO__MODULE_ID__ = setTimeout(function(){iwEV__MODULE_ID__ = false;},500);
  }

}


function checkClickArea__MODULE_ID__(event){
  var windowHeight = 152;
  var tailHeight = 96;
  var windowTop = parseInt(_gel('infowindow__MODULE_ID__').style.top);
  var clearArea = windowTop + windowHeight;

  var Y = (IE__MODULE_ID__) ? event.clientY + document.body.scrollTop : event.pageY;
  if (clearArea < Y) infoClose__MODULE_ID__();

}


function infoClose__MODULE_ID__(){
  if (!UPinfoWindow__MODULE_ID__ || iwEV__MODULE_ID__ == -1) return;
  if (iwEV__MODULE_ID__ || _gel('infowindow__MODULE_ID__').style.display == 'none') return;
  _gel('infowindow__MODULE_ID__').style.display = 'none';
  _gel("feedS__MODULE_ID__").style.display = '';
}

// end info window

// quick delete

function deleteEvent__MODULE_ID__(evIndex){
   infoClose__MODULE_ID__();
   var eventO = EventList__MODULE_ID__[evIndex];
   var eID = eventO.id;
   var feedID = eventO.feedID;
   var feedPATH = FeedList__MODULE_ID__[feedID]['path'];
   var feedKEY = FeedList__MODULE_ID__[feedID]['key'];
   var title = eventO.title;
   var startTS = eventO.startTS;
   var httprq = createRequestObject__MODULE_ID__();
   var URL = proto__MODULE_ID__ + "://" + domain__MODULE_ID__ + "/calendar/feeds/" 
           + feedPATH + "/private"
//           + "-" + feedKEY + "/"
           + "/full/" + "NjB2ZjMxZGRrN3AxcWJua3IzMDhuMmxyYnMgNnRoM3BmaTFtNWNjYWh0OG5ycGY2b2V2MzhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ";
	prompt("",URL); 
   httprq.open('delete', URL);
   httprq.setRequestHeader('Authorization', 'GoogleLogin auth=' + CAL__MODULE_ID__);
//   httprq.setRequestHeader('Content-Length','0');
   httprq.setRequestHeader('Content-type','application/atom+xml');
//   httprq.setRequestHeader('X-HTTP-Method-Override','DELETE');
   httprq.onreadystatechange = function(){alert(httprq.status + "\n" + httprq.getAllResponseHeaders())};
   httprq.send(null);
   var date = parseDate__MODULE_ID__(startTS);
   date = dayA__MODULE_ID__[date['day']] + ", " + monthA__MODULE_ID__[date['month']] 
        + " " + date['date'] + " " + date['year'];
   _gel("EV" + eID + "__MODULE_ID__").style.display = 'none';
   alert(title + "\n" + date + "\n" + "Has Been Deleted");
}

// --> quick delete

// entry box

function createEntryBox__MODULE_ID__(){
  var ebox = newNode__MODULE_ID__('div');

  var eb = "<div id='ebox__MODULE_ID__' class='ebox__MODULE_ID__' style='display:none'>";
  eb += "<IMG onclick='javascript: closeQuickAdd__MODULE_ID__();' style='cursor:pointer;margin:3px' align=right src='http://mailqueue.googlepages.com/close.gif'>";
  eb += "<form onsubmit='javascript: return submitEvent__MODULE_ID__()'>";
  eb += "<div style='margin:3px;color:#FFFFFF;font-size:10pt;overflow:hidden' id='eboxT__MODULE_ID__'>";
  eb += "Quick&nbsp;Add&nbsp;&nbsp;&nbsp;&nbsp;[<A style='color:#FFFFFF' href='https://www.google.com/calendar/event?action=TEMPLATE' target='_blank' " 
     + " onclick='javascript: closeQuickAdd__MODULE_ID__(); return!open(this.href,this.target,\"width=600,height=500,scrollbars=no,resizable=yes,toolbar=no,menubar=no\")'>Detail&nbsp;Add</A>]";
  eb += "<TABLE cellpadding=0 cellspacing=0><TR>";
  eb += "<TD valign=middle><input type='text' id='addEventInfo__MODULE_ID__' name='addEventInfo__MODULE_ID__' onclick='javascript: clearQuickAdd__MODULE_ID__();' style='width:185px' title='Enter New Event'>&nbsp;</TD>";
  eb += "<TD valign=middle><input type='image' title='Add Event' alt='Add Event' src='http://mailqueue.googlepages.com/qa.gif'/></TD>";
  eb += "</TR></TABLE>";
  eb += "<FONT style='font-size:8pt'>&nbsp;&nbsp;e.g.,&nbsp;Lunch&nbsp;with&nbsp;Poobear&nbsp;tomorrow&nbsp;at&nbsp;noon</FONT>";
  eb += "</div>";
  eb += "</form>";
  eb += "<div id='qaStatus__MODULE_ID__' style='height:85px;display:none;margin:5px;color:#FFFFFF;font-size:8pt;overflow:hidden'>Contacting Google.</div>";
  eb += "</div>";


  ebox.innerHTML = eb;
  if (UPQevent__MODULE_ID__) _gel('quickAddI__MODULE_ID__').style.display = '';
  _gel("container__MODULE_ID__").appendChild(ebox);
}

function qastatMessage__MODULE_ID__(message,reset){
  _gel('qaStatus__MODULE_ID__').innerHTML  = _gel('qaStatus__MODULE_ID__').innerHTML + "<BR>";;
  if (reset) _gel('qaStatus__MODULE_ID__').innerHTML = "";
  _gel('qaStatus__MODULE_ID__').innerHTML = _gel('qaStatus__MODULE_ID__').innerHTML + message;
}


function openQuickAdd__MODULE_ID__(){
  var eb = _gel("ebox__MODULE_ID__");
  qastatMessage__MODULE_ID__('',true);
  if (eb.style.display == '') {
    closeQuickAdd__MODULE_ID__();
    return;
  }
  eb.style.width = 1;
  eb.style.height = 1;
  eb.style.display = '';
  _gel('addEventInfo__MODULE_ID__').value = 'Enter new event';
  _gel("feedS__MODULE_ID__").style.display = 'none';
  _gel('qaStatus__MODULE_ID__').style.display = 'none';
  resizeDIV__MODULE_ID__(1,255,1,true,"ebox__MODULE_ID__");
}


function closeQuickAdd__MODULE_ID__(){
  var eb = _gel("ebox__MODULE_ID__");
  _gel("feedS__MODULE_ID__").style.display = '';
  _gel('qaStatus__MODULE_ID__').style.display = 'none';
  var calDIV = _gel('calendar_content__MODULE_ID__');

  if (UPheight__MODULE_ID__ != -1) calDIV.style.height = UPheight__MODULE_ID__ + 'px';
  resizeDIV__MODULE_ID__(parseInt(eb.style.width),400,parseInt(eb.style.height),false,"ebox__MODULE_ID__");
}

function clearQuickAdd__MODULE_ID__(){
  _gel('qaStatus__MODULE_ID__').innerHTML = "";
  if (_gel('addEventInfo__MODULE_ID__').value == 'Enter new event') _gel('addEventInfo__MODULE_ID__').value = "";
}

function resizeDIV__MODULE_ID__(width,widthM,height,grow,DIV){
  _gel(DIV).style.width = width;
  _gel(DIV).style.height = height;
  if (grow){
    width = width + 8;
    height = height + 3;
  } else {
    width = width - 8;
    height = height - 3;
  }
  if (width < 0) width = 0;
  if (width > 0 && width <= widthM){
    if (height > 60) height = 60;
    if (height < 1) height = 1;

    setTimeout('resizeDIV__MODULE_ID__(' + width + ',' + widthM + ',' + height + ',' + grow + ',"' + DIV + '")',1);
    return;
  }

  if (!grow) _gel(DIV).style.display = 'none';

}


function submitEvent__MODULE_ID__(){
  var eventInfo = _gel('addEventInfo__MODULE_ID__').value;
  // Thanks and hats off to Elias for uncovering this gem!
  // http://torrez.us/archives/2006/04/18/433/
  var parseURL = proto__MODULE_ID__ + "://" + domain__MODULE_ID__ + "/calendar/compose?ctext= " + eventInfo;
  eb = _gel('ebox__MODULE_ID__');
  if (_gel('qaStatus__MODULE_ID__').style.display == 'none') {
     eb.style.height = parseInt(eb.style.height) + 80;
     var calDIV = _gel('calendar_content__MODULE_ID__');
     if (parseInt(calDIV.style.height) < 130 && disHeight__MODULE_ID__ != -1) {
       calDIV.style.height = 130;
     }
  }
  _gel('qaStatus__MODULE_ID__').style.display = '';
  qastatMessage__MODULE_ID__('Preparing Event For Google',true);

  var httprq = createRequestObject__MODULE_ID__();
  sndEventReq__MODULE_ID__(httprq,parseURL);
  return false;

}

function parseEvent__MODULE_ID__(ro){
  if (parseInt(ro.status) == 404){
    qastatMessage__MODULE_ID__('Quick Entry at ' + domain__MODULE_ID__ + ' not found',false);
    if (domain__MODULE_ID__ != 'google.com' || domain__MODULE_ID__ != 'www.google.com') {
      qastatMessage__MODULE_ID__("Try Google IG at <A href='http://www.google.com/ig'>http://www.google.com/ig</A>",false);
    }
    return;
  } 

  var response = eval(ro.responseText);
  if(!response || response.length != 1) {
     qastatMessage__MODULE_ID__('Invalid Response from Google',false);
     return;
  }

  qastatMessage__MODULE_ID__('Google Requested Event.',false);

  var title = response[0][1];
  var location = response[0][3];

  var startTS = response[0][4];
  startTS = TSfromISO__MODULE_ID__(startTS,0,false)

  if (!startTS) {
    qastatMessage__MODULE_ID__('>>> Event Format not recognized. <<<',false);
    return
  }

  var endTS = response[0][5];
  endTS = TSfromISO__MODULE_ID__(endTS,0,false)

  if (!endTS) endTS = startTS;

  var startParse = parseDate__MODULE_ID__(startTS); 
  var startTD = parseDateToUTC__MODULE_ID__(startTS);
  if (startTD['month'].toString().length == 1) startTD['month'] = "0" + startTD['month'];
  if (startTD['date'].toString().length == 1) startTD['date'] = "0" + startTD['date'];
  startTD = startTD['year'] + "-" + startTD['month'] + "-" + startTD['date'] + "T"
          + startTD['hour'] + ":" + startTD['minute'] + ":00Z";

  var endTD = parseDateToUTC__MODULE_ID__(endTS);
  if (endTD['month'].toString().length == 1) endTD['month'] = "0" + endTD['month'];
  if (endTD['date'].toString().length == 1) endTD['date'] = "0" + endTD['date'];
  endTD = endTD['year'] + "-" + endTD['month'] + "-" + endTD['date'] + "T" 
        + endTD['hour'] + ":" + endTD['minute'] + ":00Z";

  qastatMessage__MODULE_ID__("Submitting '" + title  + "' To Google.",false);


  var eventXML = "<entry xmlns='http://www.w3.org/2005/Atom' xmlns:gd='http://schemas.google.com/g/2005'>"
               + "<category scheme='http://schemas.google.com/g/2005#kind' "
               + " term='http://schemas.google.com/g/2005#event'></category>"
               + "<title type='text'>" + title + "</title>"
               + "<gd:where valueString='" + location + "'></gd:where>"
               + "<gd:when startTime='" + startTD + "' endTime='" + endTD + "'></gd:when>"
               + "</entry>";

   var httprq = createRequestObject__MODULE_ID__();
   httprq.open('POST', "http://" + domain__MODULE_ID__ + "/calendar/feeds/default/private/full", false);
   httprq.setRequestHeader('Authorization', 'GoogleLogin auth=' + CAL__MODULE_ID__);
   httprq.setRequestHeader('Content-type','application/atom+xml');
   httprq.send(eventXML);

   if (httprq.status == 201){
     _gel('addEventInfo__MODULE_ID__').value = 'Enter new event';
     qastatMessage__MODULE_ID__("Google Submission Successful.",false);
     qastatMessage__MODULE_ID__(">>>> Module update will appear shortly",false);
   } else qastatMessage__MODULE_ID__('Error Submitting Event [' + httprq.status  + ']',false);


}

// --> end entry box

// tooltip

function createTooltip__MODULE_ID__(){
  var tooltip = newNode__MODULE_ID__('div');
  tooltip.id = 'ttCT__MODULE_ID__';
  tooltip.style.position = 'absolute';
  tooltip.style.display = 'none';
  document.body.appendChild(tooltip);
}

function tooltip__MODULE_ID__(feedID,event){
  var ttDIV = _gel('ttCT__MODULE_ID__');

  if (feedID == -1) {
    ttDIV.style.display = 'none';
    return;
  }

  var colorCode = FeedList__MODULE_ID__[feedID]['color'];
  if (ttDIV.style.display == '' || !UPcolorCode__MODULE_ID__ || colorCode == 'FFFFFF') return;

  var X = event.clientX + 10;
  var Y = (IE__MODULE_ID__) ? event.clientY + document.body.scrollTop : event.pageY;
  Y = Y - 15;

  title = FeedList__MODULE_ID__[feedID]['title'];

  ttDIV.style.background = "#" + colorCode;
  ttDIV.style.top = Y  + 'px';
  ttDIV.style.left = X  + 'px';
  ttDIV.innerHTML = "<FONT style='color:#FFFFFF;font-size:8pt;font-weight:bold'>&nbsp;&nbsp;" + title + "&nbsp;&nbsp;</FONT>";
  ttDIV.style.display = '';

}

// --> tooltip

// -- date time functions

function TSfromISO__MODULE_ID__(ISO,offset,isEnd){
  // converts date in the format 20060415T200000.000Z to milliseconds since EPOCH
  var dRE = /([0-9]{4})([0-9]{2})([0-9]{2})/;
  var tRE = /T([0-9]{2})([0-9]{2})/;

  var TS;
  var date  = dRE.exec(ISO);
  var time  = tRE.exec(ISO);

  var timeAdjust = 0;

  if (date){
    if (time){
      time = time[1] + ":" + time[2];
    } else {
      if (isEnd) {
       timeAdjust = -1;
       time =  "23:59";
      } else time =  "00:00";
    }

    TS = new Date(monthA__MODULE_ID__[parseInt(date[2])] + " " + date[3] + " " + date[1] + " " + time);
 
    if (timeAdjust != 0){
      var TTS = TS;
      TS = new Date(TS.getTime() + 24 * 60 * 60 * 1000 * timeAdjust); // add a day based on gmtPosition
      var DSToffset = (TS.getTimezoneOffset() - TTS.getTimezoneOffset()) * 1000 * 60;
      TS = new Date(TS.getTime() - DSToffset);
    }

    TS = (offset == 0) ? TS.getTime() : TS.getTime() - (TS.getTimezoneOffset() * 60 * 1000) - (parseInt(gmtOffset) * 60 * 60 * 1000);

  } else TS = "";

  return TS;
}

function parseDate__MODULE_ID__(TS,debug){
  var parsed = new Array;
  var date = new Date(TS);

  parsed['day'] = date.getDay();
  parsed['month'] = date.getMonth() + 1;
  parsed['date'] = date.getDate();
  parsed['year'] = date.getFullYear();
  parsed['hour'] = date.getHours();
  parsed['minute'] = date.getMinutes();
  parsed['second'] = date.getSeconds();

  if (parsed['hour'] < 10) parsed['hour'] = '0' + parsed['hour'];
  if (parsed['minute'] < 10) parsed['minute'] = '0' + parsed['minute'];
  if (parsed['second'] < 10) parsed['second'] = '0' + parsed['second'];

  if (debug) alert(parsed['day'] + "\n" + parsed['month'] + "\n" + parsed['date'] + "\n" + parsed['year'] + "\n" + parsed['hour'] + "\n" + parsed['minute']);
  return parsed;
}

function parseDateToUTC__MODULE_ID__(TS,debug){
  var parsed = new Array;
  var date = new Date(TS);

  parsed['day'] = date.getUTCDay();
  parsed['month'] = date.getUTCMonth() + 1;
  parsed['date'] = date.getUTCDate();
  parsed['year'] = date.getUTCFullYear();
  parsed['hour'] = date.getUTCHours();
  parsed['minute'] = date.getUTCMinutes();
  parsed['second'] = date.getUTCSeconds();

  if (parsed['hour'].toString().length == 1) parsed['hour'] = '0' + parsed['hour'];
  if (parsed['minute'].toString().length == 1) parsed['minute'] = '0' + parsed['minute'];
  if (parsed['second'].toString().length == 1) parsed['second'] = '0' + parsed['second'];

  if (debug) alert(parsed['day'] + "\n" + parsed['month'] + "\n" + parsed['date'] + "\n" + parsed['year'] + "\n" + parsed['hour'] + "\n" + parsed['minute']);
  return parsed;
}

function datetime__MODULE_ID__(){
  var now = "";
  var nowDate = parseDate__MODULE_ID__(new Date().getTime());
  var refresh = true;

  if (UPclock__MODULE_ID__ == 1 || UPclock__MODULE_ID__ == 3){
    if(nowDate['hour'] > 12){
      nowDate['hour'] = nowDate['hour'] - 12;
    } else if (nowDate['hour'] == 0){
      nowDate['hour'] = "12";
    } else if (nowDate['hour'] == 12){
      AMPM = "p";
    } else if (nowDate['hour'].toString().substring(0,1) == "0"){
      nowDate['hour'] = nowDate['hour'].toString().substring(1,2); 
    }
  }

  nowDate['second'] = ":" + nowDate['second'];
  var refresh = 1000;
  if (UPclock__MODULE_ID__ == 4 || UPclock__MODULE_ID__ == 3) {
    nowDate['second'] = "";
    refresh = 30000;
  }
 
  var month = monthA__MODULE_ID__[nowDate['month']];
  if (UPtoday__MODULE_ID__ && UPclock__MODULE_ID__ != 0){ 
    if (month.length > 5) month = month.substring(0,3);
    now = dayA__MODULE_ID__[nowDate['day']] + ", " + month + " " + nowDate['date'] + ", " + nowDate['year'] + " - " + nowDate['hour'] + ":" + nowDate['minute'] + nowDate['second'];
  } else if (UPtoday__MODULE_ID__ && UPclock__MODULE_ID__ == 0) {
    now = dayA__MODULE_ID__[nowDate['day']] + ", " + month + " " + nowDate['date'] + ", " + nowDate['year'];
    refresh = false;
  } else now =nowDate['hour'] + ":" + nowDate['minute'] + nowDate['second'];

  _gel('date_content__MODULE_ID__').innerHTML = "<CENTER>" + now + "</CENTER>";
  _gel('date_content__MODULE_ID__').style.display = '';

  if (refresh) setTimeout("datetime__MODULE_ID__()", refresh); 

}

function getDate__MODULE_ID__(TS,UP){
  var UPmonth = true;
  var UPdate = true;
  var UPday = true;
  var UPyear = true;

  if (!UP) UPmonth = UPdate = UPday = UPyear = true;  // overide

  var td = parseDate__MODULE_ID__(TS,false);

  td['ts'] = TS;
  td['d'] = monthA__MODULE_ID__[td['month']] + " " + td['date'] + " " + td['year'];
  td['monthName'] = monthA__MODULE_ID__[td['month']];
  td['month'] = monthA__MODULE_ID__[td['month']].substring(0,3) + "&nbsp;";
  td['dayName'] = dayA__MODULE_ID__[td['day']];
  td['day'] = dayA__MODULE_ID__[td['day']] + "&nbsp;";
  td['year'] = "&nbsp;" + td['year'];

  if (!UPday) td['day'] = "";
  if (!UPmonth) td['month'] = td['monthName']  = "";
  if (!UPdate){
    td['date'] = "";
    td['month'] = td['month'].replace(/&nbsp;/,'');
  }
  if (!UPyear) td['year'] = "";

  td['remainDate'] = "";
  td['trange'] = "";
  td['trangeT'] = "";
  td['mrange'] = td['monthName'];
  td['drange'] = td['date'];

  return td;

}

function formatDate__MODULE_ID__(eventO,UP){
 
  var std = formatTime__MODULE_ID__(getDate__MODULE_ID__(eventO.startTS,UP),UP);
  var etd = formatTime__MODULE_ID__(getDate__MODULE_ID__(eventO.endTS,UP),UP);

  if ( (std['t'] == "12:00a" && etd['t'] == "11:59p") ||
       (std['t'] == "00:00" && etd['t'] == "23:59") ){
//       (std['d'] == etd['d'] && (std['t'] == "12:00a" || std['t'] == "00:00")) ){
       std['trangeT'] = "All&nbsp;Day";
       std['t'] = "";
       etd['t'] = "";
  } else if (std['t'] != ''){
    std['trange'] = (std['d'] != etd['d'] || std['t'] != etd['t']) ? std['t'] + "~" + etd['t'] : std['t'];
  }

  if (std['month'] != etd['month'] && std['date'] == '') {
    std['mrange'] = std['month'] + "~" + etd['month'];
    std['trangeT'] = 'Thru&nbsp;' + etd['month']
  } else if (std['month'] == etd['month'] && etd['date'] != std['date'] && std['month'] != ''){
    std['drange'] = std['date'] + "~" + etd['date'];
    std['trangeT'] = 'Thru&nbsp;' +  etd['date'];
  } else if (std['month'] != etd['month']) {
      std['remainDate'] = "~" + etd['month'] + etd['date'];
      std['trangeT'] = 'Thru&nbsp;' + etd['month'] + etd['date'];
  }

  var td = new Array;
  td['std'] = std;
  td['etd'] = etd;

  return td;

}

function formatTime__MODULE_ID__(td,UP){
  var UPtime = 1;
  if (!UP && UPtime == 0) UPtime = 1;

  var AMPM = "";
  var sep = ":";
  var hour = "";
  var minute = "";

  if (UPtime == 1){
    AMPM = "a";
    minute = td['minute'];
    hour = td['hour'];
    if(td['hour'] > 12){
      AMPM = "p";
      hour = td['hour'] - 12;
    } else if (td['hour'] == 0){
      AMPM = "a";
      hour = "12";
    } else if (td['hour'] == 12){
      AMPM = "p";
    } else if (td['hour'].toString().substring(0,1) == "0"){
      hour = td['hour'].toString().substring(1,2);
    }

  } else if (UPtime == 2) {
    hour = td['hour'];
    minute = td['minute'];
  } else sep = ""; 
 
  td['t'] = hour + sep + minute + AMPM;

  return td;
}



// --> end Date Time functions

// cal obj and event

function CalendarEvent__MODULE_ID__(eID,feedID,title,startTS,endTS,location){
  this.id = eID;
  this.feedID = feedID;
  this.title = title;
  this.location = location;
    
  this.startTS = startTS;
  this.endTS = endTS;
  this.duration = parseInt(endTS) - parseInt(startTS);
}


function addEvent__MODULE_ID__(event){
  
  var TS = nowTS__MODULE_ID__;
  if (UPfutureOnly__MODULE_ID__) TS = rightNowTS__MODULE_ID__;
  // add event if it is in the future
  if (event.endTS >= TS) EventList__MODULE_ID__.push(event);

}

function cmp__MODULE_ID__(a,b) { return (a < b) ? -1 :( a > b) ? 1 : 0; }

// --> cal obj and event


// XMLhttpRequest
function createRequestObject__MODULE_ID__() {
  var ro;
  ro = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  return ro;
}

function sndAuth__MODULE_ID__(ro,URL) {
  ro.open('get', URL);
  ro.onreadystatechange = function (){ if (ro.readyState == 4) parseAuth__MODULE_ID__(ro); }
  ro.send(null);
}

function sndEventReq__MODULE_ID__(ro,URL) {
  ro.open('get', URL);
  ro.onreadystatechange = function (){ if (ro.readyState == 4) parseEvent__MODULE_ID__(ro); }
  ro.send(null);
}

// -- XMLhttpRequest

// display formatting

function formatEvent__MODULE_ID__(eventA){
  var max_display = 20;

  var fF = eval('eventFormat_' + UPtdFormat__MODULE_ID__ + __MODULE_ID__);
  var calDIV = _gel('calendar_content__MODULE_ID__');
  var evHTML = "";
  var event; var std; var etd; var ltd = new Array;

  var eCount = 0;
  var events = eventA.length;  
  var eI = 0;

  evHTML = "<TABLE cellspacing=0 cellpadding=0 border=0 width='99%'>";
  ltd['d'] = '';
  while (eCount < max_display && eI < events){
    eventO = eventA[eI];    
    if (FeedList__MODULE_ID__[eventO.feedID]['request'] == true){
      eCount++;

      var td = formatDate__MODULE_ID__(eventO,true);
      std = td['std'];
      etd = td['etd'];

      evHTML += fF(eI,std,etd,ltd);
      ltd = std;
    } // if it is a selected event
    eI++;
  } // while events are available

  evHTML += "</TABLE>";

  if (eCount == 0){
    calDIV.innerHTML = "<B>No Events Found.</B>";
  } else {
    calDIV.innerHTML = evHTML;
  }
 

}

function getClass__MODULE_ID__(eventO,td){
  var UPhighlight = true;
  var now = monthA__MODULE_ID__[nowParse__MODULE_ID__['month']] + " " 
          + nowParse__MODULE_ID__['date'] + " " + nowParse__MODULE_ID__['year'];

  var className;
  if (rightNowTS__MODULE_ID__ > eventO.startTS && rightNowTS__MODULE_ID__ > eventO.endTS && UPhighlight){
    className = (now == td['d']) ? "HgcalItem__MODULE_ID__" : "GgcalItem__MODULE_ID__";
  } else if (now == td['d'] && UPhighlight){
    var NstartTS = eventO.startTS - (60 * 60 * 1000);
    var NendTS = eventO.endTS + (15 * 60 * 1000);
    if (rightNowTS__MODULE_ID__ >= NstartTS && 
        rightNowTS__MODULE_ID__ <= NendTS) {
      // coming up soon
      className = "NgcalItem__MODULE_ID__";
    } else className = "HgcalItem__MODULE_ID__";
  } else className = "gcalItem__MODULE_ID__";

  return className;

}


function eventFormat_0__MODULE_ID__(eI,std,etd,ltd){
  // multi-line
  var evHTML;
  var eventO = EventList__MODULE_ID__[eI];
  var eventID = eventO.id;
  var feedID = eventO.feedID;
  var summary = shrink__MODULE_ID__(eventO.title,deflen__MODULE_ID__,'...');
  summary = "<A onclick='javascript: return !UPinfoWindow__MODULE_ID__' href='"
          + editLink__MODULE_ID__ + eventID  
          + "' target='_blank'><FONT style='text-decoration:underline;color:blue'>"
          + summary + "</FONT></A>";

  if (UPlocation__MODULE_ID__ && eventO.location.toString().length != 0)
     summary += "<BR>" + shrink__MODULE_ID__(eventO.location,deflen__MODULE_ID__,'...');

  var className = getClass__MODULE_ID__(eventO,std);

  var style = "valign=top class='" + className + "' style='font-size:" + UPdisplayFont__MODULE_ID__ + "pt;'";
  var colorCode = (UPcolorCode__MODULE_ID__) ? FeedList__MODULE_ID__[feedID]['color'] : "FFFFFF";
  var evStyle = " style='background:#" + colorCode  + ";font-size:2pt;' ";
  var evTT = " onmouseover='javascript: tooltip__MODULE_ID__(\"" + feedID  + "\",event)' onmouseout='javascript: tooltip__MODULE_ID__(-1,event)' ";

  evHTML = "<TR id='EV" + eventID  + "__MODULE_ID__' style='cursor:pointer;' "
         + " onclick='javascript: var self=this; infoOpen__MODULE_ID__(self,event," + eI + ");'>";

  if (std['d'] != etd['d']){
    evHTML += "<TD " +  evStyle + evTT + ">&nbsp;&nbsp;</TD>"
           + "<TD " +  style + ">&nbsp;" + std['day'] + "</TD>"
           + "<TD " +  style + ">" + std['month'] + "</TD>"
           + "<TD " +  style + " align=right>" + std['date'] + "</TD>"
           + "<TD " +  style + ">" + std['year'] + "</TD>"
           + "<TD " +  style + ">&nbsp;" + std['t'] + "</TD>"
           + "<TD " +  style + " rowspan=2>&nbsp;&nbsp;</TD>"
           + "<TD " +  style + " rowspan=2 width='100%'>"
           + summary + "</TD></TR>";

    evHTML += "<TD " +  evStyle + evTT + ">&nbsp;&nbsp;</TD>"
           + "<TD " +  style + ">&nbsp;" + etd['day'] + "</TD>"
           + "<TD " +  style + ">" + etd['month'] + "</TD>"
           + "<TD " +  style + " align=right>" + etd['date'] + "</TD>"
           + "<TD " +  style + ">" + etd['year'] + "</TD>"
           + "<TD " +  style + ">&nbsp;" + etd['t'] + "</TD></TR>";

  }else{
    evHTML += "<TD " +  evStyle + evTT + ">&nbsp;&nbsp;</TD>"
           + "<TD " +  style + ">&nbsp;" + std['day'] + "</TD>"
           + "<TD " +  style + ">" + std['month'] + "</TD>"
           + "<TD " +  style + " align=right>" + std['date'] + "</TD>"
           + "<TD " +  style + ">" + std['year'] + "</TD>"
           + "<TD " +  style + ">&nbsp;" + std['trange'] + "</TD>"
           + "<TD " +  style + ">&nbsp;&nbsp;</TD>"
           + "<TD width='100%' " +  style + ">"
           + summary + "</TD></TR>";

  }

  style = "valign=top class='" + className + "' style='font-size:2pt'";
  evHTML += "<TR><TD " +  evStyle + evTT + ">&nbsp;&nbsp;&nbsp;&nbsp;</TD><TD "
         + style + " colspan=7>&nbsp;</TD></TR>";

  return evHTML;

}

function eventFormat_1__MODULE_ID__(eI,std,etd,ltd){
  // day summary
  var evHTML = '';
  var UPhighlight = true;
  var now = monthA__MODULE_ID__[nowParse__MODULE_ID__['month']] + " "
          + nowParse__MODULE_ID__['date'] + " " + nowParse__MODULE_ID__['year'];

  var eventO = EventList__MODULE_ID__[eI];
  var feedID = eventO.feedID;
  var eventID = eventO.id;
  var origSize;
  var maxLSize = 12;
  var maxSSize = 24;
  var maxSize = maxSSize + maxLSize;
  var summary = eventO.title;
  var location;
  if (UPlocation__MODULE_ID__ && eventO.location.toString().length != 0){
    location = eventO.location;
    origSize = location.length + summary.length;
    if (origSize > maxSize){
      location = shrink__MODULE_ID__(location,maxLSize,'..');
      var newSize = location.length + summary.length;
      if (newSize > maxSize) summary = shrink__MODULE_ID__(summary,maxSSize,'..');
    }
    location = "(" + location + ")";
  } else {
    location = "";
    summary = shrink__MODULE_ID__(summary,maxSize,'..');
  }

  summary = "<A onclick='javascript: return !UPinfoWindow__MODULE_ID__' href='"
          + editLink__MODULE_ID__ + eventID  
          + "' target='_blank'><FONT style='text-decoration:underline;color:blue'>"
          + summary + "</FONT></A>&nbsp;&nbsp;";

  var className = getClass__MODULE_ID__(eventO,std);

  var style = "valign=top class='" + className + "' style='font-size:" + UPdisplayFont__MODULE_ID__ + "pt;'";
  var colorCode = (UPcolorCode__MODULE_ID__) ? FeedList__MODULE_ID__[feedID]['color'] : "FFFFFF";
  var evStyle = " style='background:#" + colorCode  + ";font-size:2pt;' ";
  var evTT = " onmouseover='javascript: tooltip__MODULE_ID__(\"" + feedID  + "\",event)' onmouseout='javascript: tooltip__MODULE_ID__(-1,event)' ";

  // set up date
  if (std['d'] != ltd['d']){
    if (std['dayName'] != '') std['dayName'] = std['dayName'] + ", ";
    if (std['monthName'] != '') std['monthName'] = std['monthName'] + " ";
    if (std['year'] != '') std['year'] = "," + std['year'];
    var date = std['dayName'] + std['monthName'] + std['date'] + std['year'];
    date = date.replace(", ,","");

    var dateStyle = style;
    if (std['d'] == now){
      date = "<FONT style='color:#3333FF;font-weight:bold'>Today</FONT>&nbsp;"
           + "<B>(" + date  + ")</B>";
      var dateHighlight = (UPhighlight) ? "HgcalItem__MODULE_ID__" : "gcalItem__MODULE_ID__"; 
      dateStyle = "valign=top class='" + dateHighlight  + "' style='font-size:" + UPdisplayFont__MODULE_ID__ + "pt;'";
    } else {
      date = "<B>" + date + "</B>";
    }
    evHTML += "<TR><TD>&nbsp;</TD><TD colspan=3 " + dateStyle + "><BR style='line-height:4px;'>&nbsp;" + date
           + "</TD></TR>";
  }



  evHTML += "<TR id='EV" + eventID  + "__MODULE_ID__' style='cursor:pointer;' "
         + " onclick='javascript: var self=this; infoOpen__MODULE_ID__(self,event," + eI + ");'>";

  var sumloc = "<TABLE width='100%' cellpadding=0 cellspacing=0><TR><TD " +  style +  ">" + summary + "</TD><TD align=right " +  style + ">" + location  + "</TD></TR></TABLE>";

  if (std['trangeT'] != '') std['trange'] = std['trangeT'];
  evHTML += "<TD " +  evStyle + evTT + ">&nbsp;&nbsp;</TD>"
         + "<TD " +  style + ">&nbsp;" + std['trange'] + "</TD>"
         + "<TD " +  style + ">&nbsp;&nbsp;</TD>"
         + "<TD " +  style + " width='100%'>" + sumloc + "</TD></TR>"

  return evHTML;

}

function eventFormat_2__MODULE_ID__(eI,std,etd,ltd){
  // single line
  var evHTML;
 
  var eventO = EventList__MODULE_ID__[eI]; 
  var eventID = eventO.id;
  var feedID = eventO.feedID;
  var summary = shrink__MODULE_ID__(eventO.title,deflen__MODULE_ID__,'...');
  summary = "<A onclick='javascript: return !UPinfoWindow__MODULE_ID__' href='" 
          + editLink__MODULE_ID__ + eventID  
          + "' target='_blank'><FONT style='text-decoration:underline;color:blue'>" 
          + summary + "</FONT></A>";

  if (UPlocation__MODULE_ID__ && eventO.location.toString().length != 0) 
     summary += "<BR>" + shrink__MODULE_ID__(eventO.location,deflen__MODULE_ID__,'...');

  var className = getClass__MODULE_ID__(eventO,std);

  var style = "valign=top class='" + className + "' style='font-size:" + UPdisplayFont__MODULE_ID__ + "pt;'";
  var colorCode = (UPcolorCode__MODULE_ID__) ? FeedList__MODULE_ID__[feedID]['color'] : "FFFFFF";
  var evStyle = " style='background:#" + colorCode  + ";font-size:2pt;' ";
  var evTT = " onmouseover='javascript: tooltip__MODULE_ID__(\"" + feedID  + "\",event)' onmouseout='javascript: tooltip__MODULE_ID__(-1,event)' ";

  evHTML = "<TR id='EV" + eventID  + "__MODULE_ID__' style='cursor:pointer;' "
         + " onclick='javascript: var self=this; infoOpen__MODULE_ID__(self,event," + eI + ");'>";  

  if (std['mrange'] == std['monthName']) std['mrange'] = std['month'];
  evHTML += "<TD " +  evStyle + evTT + ">&nbsp;&nbsp;</TD>"
         + "<TD " +  style + ">&nbsp;" + std['day'] + "</TD>"
         + "<TD " +  style + ">" + std['mrange'] + "</TD>"
         + "<TD " +  style + " align=right>" + std['drange'] + "</TD>"
         + "<TD " +  style + ">" + std['remainDate'] + "</TD>"
         + "<TD " +  style + ">" + std['year'] + "</TD>"
         + "<TD " +  style + ">&nbsp;" + std['trange'] + "</TD>"
         + "<TD " +  style + ">&nbsp;&nbsp;</TD>"
         + "<TD " +  style + " width='100%'>"
         + summary + "</TD></TR>";

  style = "valign=top class='" + className + "' style='font-size:2pt'";
  evHTML += "<TR><TD " +  evStyle + evTT + ">&nbsp;&nbsp;&nbsp;&nbsp;</TD><TD " 
         + style + " colspan=8>&nbsp;</TD></TR>";

  return evHTML;
}


// --> display formating


// --> remote script


</script>

</HEAD>

<TABLE width='35%'><TR><TD id="m___MODULE_ID___url"></TD></TR><TR><TD>

<DIV id="container__MODULE_ID__" style="position:relative;overflow:auto" onmousedown="javascript:infoClose__MODULE_ID__();">

<DIV id="overlayDIV__MODULE_ID__" class="gcalOverlay__MODULE_ID__" style="display:none;position:absolute;top:0px;left:4px;zIndex:40;width:90%;padding:2px;background:#99CCFF;">
<TABLE width="95%" style='position:relative'>
<TR onClick="javascript: toggleLegend__MODULE_ID__()"><TD id='olV__MODULE_ID__' align=right>&nbsp;</TD></TR>
</TABLE>
</DIV>
<DIV id="legendDIV__MODULE_ID__" style="display:none;position:absolute;top:25px;left:29px;zIndex:45;width:80%;padding:2px;text-align:right"></DIV>


<DIV>
<TABLE width="99%"><TR>
<TD width=10px><IMG id='quickAddI__MODULE_ID__' style='display:none;cursor:pointer;' onclick='javascript: openQuickAdd__MODULE_ID__()' src='http://mailqueue.googlepages.com/lcal.gif' alt='Quick Event' title='Quick Event'></TD>
<TD><SPAN id="date_content__MODULE_ID__" style="font-size:.85em;display:none"></SPAN></TD>
<TD width=10px onClick="javascript: toggleLegend__MODULE_ID__()" align=right>
<IMG id="arrowC__MODULE_ID__" src="http://r2unit.com/gmodule/image/closetriangle.gif" width=11 height=11 style="cursor:pointer;display:none" alt='Open Legend' title='Open Legend'>
<IMG id="arrowO__MODULE_ID__" src="http://r2unit.com/gmodule/image/opentriangle.gif" width=11 height=11 style="cursor:pointer;display:none" alt='Close Legend' title='Close Legend'>
</TD>
</TR></TABLE>
</DIV>


<DIV id="feedDIV__MODULE_ID__" style="display:none;text-align:right;height:22px"></DIV>

<DIV id="status_content__MODULE_ID__" style="display:none;font-size:.85em;color:gray;overflow:hidden;height:50"></DIV>
<DIV id="calendar_content__MODULE_ID__" style="display:none;font-size:.85em;overflow:auto;"><IMG id='authTest__MODULE_ID__' src=''></DIV>

</DIV>

</TD></TR></TABLE>

<script>
// delays trigger till content is loaded
  initialize__MODULE_ID__();
</script>

</HTML>

