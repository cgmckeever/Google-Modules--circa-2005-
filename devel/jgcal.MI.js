/*

Google Module for Google Calendar
Chris McKeever - 2006 cgmckeever@r2unit.com

inspired by GMail Agenda and Paul Russell's gcal module.
http://www.r2unit.com/greasemonkey/
http://russelldad.googlepages.com/mygooglehomepagemodules


*/

function initialize__MODULE_ID__(){
  // define global

  IE__MODULE_ID__ = false;
  OPERA__MODULE_ID__ = false;
  if (navigator.appName == "Microsoft Internet Explorer") {
    IE__MODULE_ID__ = true;
  } else if (navigator.appName == "Opera") {
    OPERA__MODULE_ID__ = true;
  }

  domain__MODULE_ID__ = document.domain;
  proto__MODULE_ID__ = document.location.toString().match(/[^:]*/);
  feed_change__MODULE_ID__ = false;
  deflen__MODULE_ID__ = 20; // default length of text units
  EventList__MODULE_ID__ = new Array;  // Array of events
  FeedList__MODULE_ID__ = new Array; // track of feed pulls
  XmlErrorOccurred__MODULE_ID__ = false;  // tinydom parser
  imagePath__MODULE_ID__ = "http://www.r2unit.com/gmodule/image/gcal/";
  bmkTO__MODULE_ID__ = "";
  rqTO__MODULE_ID__ = "";
  iwTO__MODULE_ID__ = ""
  haltScript__MODULE_ID__ = false;
  overlayHeight__MODULE_ID__ = 60;
  defColor__MODULE_ID__ = '627487';
  reqID__MODULE_ID__ = 0;
  modTitle__MODULE_ID__ = "";
  feedID__MODULE_ID__ = 0;
  autoSet__MODULE_ID__ = false;
  iwEV__MODULE_ID__ = -1;  // infowindow in a change state; -1 not loaded

  // user preferences
  feed_url__MODULE_ID__ = prefs__MODULE_ID__.getString('GCAL_XML_FEED');
  feed_bmk__MODULE_ID__ = prefs__MODULE_ID__.getString('GCAL_FEED_BMK');
  UPFeedView__MODULE_ID__= prefs__MODULE_ID__.getString('UPFEEDVIEW');
  show_feedSelect__MODULE_ID__ = prefs__MODULE_ID__.getBool('SHOW_FEED_SELECT');
  ShowDecline__MODULE_ID__ = prefs__MODULE_ID__.getBool('DDECLINE');
  dayForward__MODULE_ID__ = prefs__MODULE_ID__.getString('DAYFORWARD');
  UPtoday__MODULE_ID__ = prefs__MODULE_ID__.getBool('DTODAY');
  UPclock__MODULE_ID__ = prefs__MODULE_ID__.getInt('DCLOCK');
  UPfutureOnly__MODULE_ID__ = prefs__MODULE_ID__.getBool('UPFUTUREONLY');
  UPinfoWindow__MODULE_ID__ = prefs__MODULE_ID__.getBool('UPIWINDOW');
  Dlocation__MODULE_ID__ = prefs__MODULE_ID__.getBool('DLOCATION');
  UPdisplayFont__MODULE_ID__ = prefs__MODULE_ID__.getString('DISPLAY_FONT');
  UPcolorCode__MODULE_ID__ = prefs__MODULE_ID__.getInt('UPCOLORCODE');
  UPtdFormat__MODULE_ID__ = prefs__MODULE_ID__.getString('UPTDFORMAT');
  UPQevent__MODULE_ID__ = prefs__MODULE_ID__.getBool('UPQEVENT');

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

  // Long Day array
  dayLA__MODULE_ID__ = new Array;
  dayLA__MODULE_ID__['Sun'] = 'Sunday';
  dayLA__MODULE_ID__['Mon'] = 'Monday';
  dayLA__MODULE_ID__['Tue'] = 'Tuesday';
  dayLA__MODULE_ID__['Wed'] = 'Wednesday';
  dayLA__MODULE_ID__['Thu'] = 'Thursday';
  dayLA__MODULE_ID__['Fri'] = 'Friday';
  dayLA__MODULE_ID__['Sat'] = 'Saturday';

  // Short Day array
  dayA__MODULE_ID__ = new Array;
  dayA__MODULE_ID__[0] = 'Sun';
  dayA__MODULE_ID__[1] = 'Mon';
  dayA__MODULE_ID__[2] = 'Tue';
  dayA__MODULE_ID__[3] = 'Wed';
  dayA__MODULE_ID__[4] = 'Thu';
  dayA__MODULE_ID__[5] = 'Fri';
  dayA__MODULE_ID__[6] = 'Sat';

  // DAY reverse Lookup Array for BYDAY recurrence
  revDay__MODULE_ID__ = new Array;
  revDay__MODULE_ID__['SU'] = 0;
  revDay__MODULE_ID__['MO'] = 1;
  revDay__MODULE_ID__['TU'] = 2;
  revDay__MODULE_ID__['WE'] = 3;
  revDay__MODULE_ID__['TH'] = 4;
  revDay__MODULE_ID__['FR'] = 5;
  revDay__MODULE_ID__['SA'] = 6;

  colorA__MODULE_ID__ = new Array;
  colorA__MODULE_ID__['627487'] = 0;
  colorA__MODULE_ID__['cc3333'] = 0;
  colorA__MODULE_ID__['dd4477'] = 0;
  colorA__MODULE_ID__['994499'] = 0;
  colorA__MODULE_ID__['6633cc'] = 0;
  colorA__MODULE_ID__['336699'] = 0;
  colorA__MODULE_ID__['3366cc'] = 0;
  colorA__MODULE_ID__['22aa99'] = 0;
  colorA__MODULE_ID__['329262'] = 0;
  colorA__MODULE_ID__['109618'] = 0;
  colorA__MODULE_ID__['66aa00'] = 0;
  colorA__MODULE_ID__['aaaa11'] = 0;
  colorA__MODULE_ID__['d6ae00'] = 0;
  colorA__MODULE_ID__['ee8800'] = 0;
  colorA__MODULE_ID__['dd5511'] = 0;
  colorA__MODULE_ID__['a87070'] = 0;
  colorA__MODULE_ID__['8c6d8c'] = 0;
  colorA__MODULE_ID__['7083a8'] = 0;
  colorA__MODULE_ID__['5c8d87'] = 0;
  colorA__MODULE_ID__['898951'] = 0;
  colorA__MODULE_ID__['b08b59'] = 0;


  // object shorthand
  newNode__MODULE_ID__ = getObjMethodClosure__MODULE_ID__(document, "createElement");

  // setup UP height
  disHeight__MODULE_ID__ = prefs__MODULE_ID__.getString('DISPLAY_HEIGHT');
  if (parseInt(disHeight__MODULE_ID__) != -1) _gel('calendar_content__MODULE_ID__').style.height = disHeight__MODULE_ID__ + "px";

  // current date info
  nowParse__MODULE_ID__ = parseDate__MODULE_ID__(new Date(),false);

  if (!UPfutureOnly__MODULE_ID__){
    nowDate__MODULE_ID__ = new Date(monthA__MODULE_ID__[nowParse__MODULE_ID__['month']] + " " + nowParse__MODULE_ID__['date'] + " " + nowParse__MODULE_ID__['year']);
  } else nowDate__MODULE_ID__ = new Date(monthA__MODULE_ID__[nowParse__MODULE_ID__['month']] + " " + nowParse__MODULE_ID__['date'] + " " + nowParse__MODULE_ID__['year'] + " " + nowParse__MODULE_ID__['hour'] + ":" + nowParse__MODULE_ID__['minute']);

  nowTS__MODULE_ID__ = nowDate__MODULE_ID__.getTime();
  rightNowTS__MODULE_ID__ = new Date().getTime(); // the exact time not adjusted for the full day view
  // feed parameters

  start_maxTS__MODULE_ID__ = nowTS__MODULE_ID__ + (1000 * 60 * 60 * 24) * dayForward__MODULE_ID__;
  start_max__MODULE_ID__ = parseDate__MODULE_ID__(start_maxTS__MODULE_ID__);
  if (start_max__MODULE_ID__['month'].toString().length == 1) start_max__MODULE_ID__['month'] = "0" + start_max__MODULE_ID__['month'];
  if (start_max__MODULE_ID__['date'].toString().length == 1) start_max__MODULE_ID__['date'] = "0" + start_max__MODULE_ID__['date'];
  start_max__MODULE_ID__ = start_max__MODULE_ID__['year'] + "-" + start_max__MODULE_ID__['month'] + "-" + start_max__MODULE_ID__['date']

  var lookBack = 1;
  start_minTS__MODULE_ID__ = nowTS__MODULE_ID__ - (lookBack * 24 * 60 * 60 * 1000) // look back days
  start_min__MODULE_ID__ = parseDate__MODULE_ID__(start_minTS__MODULE_ID__);
  if (start_min__MODULE_ID__['month'].toString().length == 1) start_min__MODULE_ID__['month'] = "0" + start_min__MODULE_ID__['month'];
  if (start_min__MODULE_ID__['date'].toString().length == 1) start_min__MODULE_ID__['date'] = "0" + start_min__MODULE_ID__['date'];
  start_min__MODULE_ID__ = start_min__MODULE_ID__['year'] + "-" + start_min__MODULE_ID__['month'] + "-" + start_min__MODULE_ID__['date']

  // end global declarations

  _gel("m___MODULE_ID___url").innerHTML = "Google Calendar - " + version__MODULE_ID__;

  // set the images [bandwidth!]
  _gel("quickAddI__MODULE_ID__").src = imagePath__MODULE_ID__ + "lcal.gif";
  _gel("arrowC__MODULE_ID__").src = imagePath__MODULE_ID__ + "closetriangle.gif";
  _gel("arrowO__MODULE_ID__").src = imagePath__MODULE_ID__ + "opentriangle.gif";

  formatPrefContent__MODULE_ID__(); // reformat Gmods

  if(feed_url__MODULE_ID__ == '' && feed_bmk__MODULE_ID__ == ''){
    _gel('start_content__MODULE_ID__').style.display = '';
    return;
  }else{
    if (prefs__MODULE_ID__.getBool('DDISABLE')){
      statMessage__MODULE_ID__("Module Disabled <FONT style='font-size:8pt;color:grey'>(v" + version__MODULE_ID__  + ")</FONT>&nbsp;&nbsp;<FONT style='font-size:8pt;text-decoration:underline;color:grey;cursor:pointer' onclick='javascript: enableModule__MODULE_ID__();'>Enable</FONT>",true)
      _gel('status_content__MODULE_ID__').style.display = '';
      _gel('quickAddI__MODULE_ID__').style.display = 'none';
      return;
    }

    _gel('start_content__MODULE_ID__').style.display = 'none';
    if (UPinfoWindow__MODULE_ID__) createWindow__MODULE_ID__();
    createEntryBox__MODULE_ID__();
    createTooltip__MODULE_ID__();

    if(UPtoday__MODULE_ID__ || UPclock__MODULE_ID__ != 0) datetime__MODULE_ID__();
    _gel('status_content__MODULE_ID__').style.display = '';
    _gel('status_content__MODULE_ID__').innerHTML = "";

    if (OPERA__MODULE_ID__){
      var NL = _gel('eboxNL__MODULE_ID__');
      NL.innerHTML = "Quick&nbsp;Events&nbsp;not&nbsp;supported&nbsp;by&nbsp;Opera";
      NL.style.display = "";
      _gel('overlayDIV__MODULE_ID__').style.background = "";
    } else CalAuth__MODULE_ID__();
    if (feed_bmk__MODULE_ID__ == ''){
      parseBMK__MODULE_ID__('');
    } else {
      // get it from bookmarks
      var bmkURL = proto__MODULE_ID__ + "://" + domain__MODULE_ID__  + "/bookmarks/lookup?q=label%3A" + feed_bmk__MODULE_ID__  + "&sort=title&" + rightNowTS__MODULE_ID__;
      var httpBrq = createRequestObject__MODULE_ID__();
      statMessage__MODULE_ID__('Retrieving Bookmarks...',false);
      sndBMKReq__MODULE_ID__(httpBrq,bmkURL);
      bmkTO__MODULE_ID__ = setTimeout(function(){bmkFail__MODULE_ID__(bmkURL)},5000);
    }
  }
}


function getFeed__MODULE_ID__(feedID){
  var feed_url = FeedList__MODULE_ID__[feedID]['url'].toString();
  _gel('status_content__MODULE_ID__').innerHTML += 'Requesting Calendar: ' + FeedList__MODULE_ID__[feedID]['label']  + '<BR>';

  if (feed_url.match(/.*basic$/) && feed_change__MODULE_ID__ == false){
      // first try FULL
      feed_change__MODULE_ID__ = true;
      statMessage__MODULE_ID__("<FONT style='color:gray;font-size:.8em;'>Basic feed found. Attempting full</FONT>",false);
      feed_url = feed_url.replace(/basic$/,'full');
  } else feed_change__MODULE_ID__ = false;

  var feed_url = feed_url + "?start-max=" + start_max__MODULE_ID__ + "&start-min=" +  start_min__MODULE_ID__ + "&max-results=115";
  feed_url = feed_url.replace(' ','');
//  prompt('',feed_url);
  _IG_FetchContent(feed_url,processFeed__MODULE_ID__);
}

function prepareFeed__MODULE_ID__(feedID,where){
  _gel('status_content__MODULE_ID__').style.display = '';
//  alert(feedID + "\n" + where);
  feed_change__MODULE_ID__ = false;
  if (feedID > FeedList__MODULE_ID__.length - 1){
    feedID__MODULE_ID__ = 0;
    if (modTitle__MODULE_ID__ == "") modTitle__MODULE_ID__ = "Google Calendar";
    _gel("m___MODULE_ID___url").innerHTML = modTitle__MODULE_ID__;
    modTitle__MODULE_ID__ = "";
    infoClose__MODULE_ID__();
    // sort and render
    statMessage__MODULE_ID__('Organizing Yours Events.',false);
    EventList__MODULE_ID__ = EventList__MODULE_ID__.sort(function(a,b){return cmp__MODULE_ID__(a.startTS,b.startTS);});
    renderCalendar__MODULE_ID__(EventList__MODULE_ID__);
    _gel('status_content__MODULE_ID__').style.display = 'none';
    _gel('calendar_content__MODULE_ID__').style.display = '';
  } else if (FeedList__MODULE_ID__[feedID]['request'] == true &&
             FeedList__MODULE_ID__[feedID]['cache'] == false) {
    getFeed__MODULE_ID__(feedID);
  } else {
    if (FeedList__MODULE_ID__[feedID]['request'] == true &&
        FeedList__MODULE_ID__[feedID]['cache'] == true) {
          statMessage__MODULE_ID__('Cached Calendar: ' + FeedList__MODULE_ID__[feedID]['label'],false);
          if (modTitle__MODULE_ID__ == ''){
            modTitle__MODULE_ID__ = "GCal - " + shrink__MODULE_ID__(FeedList__MODULE_ID__[feedID__MODULE_ID__]['title'],deflen__MODULE_ID__,'...');
          } else modTitle__MODULE_ID__ = 'Google Calendar';
    }
    feedID__MODULE_ID__ = feedID + 1;
    prepareFeed__MODULE_ID__(feedID__MODULE_ID__,"prepare - next");
  }

}

function processFeed__MODULE_ID__(feedXML){
  var responseDOM = new XMLDoc(feedXML, function(error){if(XmlErrorOccurred__MODULE_ID__ == false) XmlErrorOccurred__MODULE_ID__ = true;});

  if ( responseDOM == null || responseDOM.docNode == null){
    // if it was a rewrite try sending original
    if (feed_change__MODULE_ID__ == true){
      // resend it
       statMessage__MODULE_ID__("<FONT style='color:gray;font-size:.8em;'>Full Feed Unsuccessful. Attempting Basic.</FONT>",false);
      getFeed__MODULE_ID__(feedID__MODULE_ID__);
      return;
    }
    // otherwise status fail and move on
    statMessage__MODULE_ID__("<FONT style='color:gray;font-size:.8em;'>The response from Google contained invalid XML.</FONT>",false);
    feedID__MODULE_ID__++;
    prepareFeed__MODULE_ID__(feedID__MODULE_ID__ + 1,"process - fail - next");
    return;
  }

  FeedList__MODULE_ID__[feedID__MODULE_ID__]['title']  = responseDOM.docNode.getElements("title")[0].getText();
  parseCalendarXML__MODULE_ID__(responseDOM,feedID__MODULE_ID__)
  FeedList__MODULE_ID__[feedID__MODULE_ID__]['cache'] = true;

  if (modTitle__MODULE_ID__ == ''){
    modTitle__MODULE_ID__ = "GCal - " + shrink__MODULE_ID__(FeedList__MODULE_ID__[feedID__MODULE_ID__]['title'],deflen__MODULE_ID__,'...');
  } else modTitle__MODULE_ID__ = 'Google Calendar';

  feedID__MODULE_ID__++
  prepareFeed__MODULE_ID__(feedID__MODULE_ID__,"process - next");

}

function parseBMK__MODULE_ID__(bmkHTML){
  clearTimeout(bmkTO__MODULE_ID__); //stop timeout
  if (haltScript__MODULE_ID__) return;
  var Ptable =_gel("m___MODULE_ID___form").firstChild.firstChild.firstChild;
  if (!Ptable) return;

  // labels
  var tRE = bmkHTML.match(/bkmk_href[^>]+>([^<]*)/g);
  // urls
  var uRE = bmkHTML.match(/\.\/url[^ \n\r"]+(?=.*id=bkmk_href)/g);
  var cRE = /(.+)(#)(.*)/;

  var title;
  var url;
  var color;
  var feedCount = 0;
  var rowOffset = 22;

  // dropdown creation
  var checked = "";
  var DoptionBox = newNode__MODULE_ID__('select');
  DoptionBox.id = 'DfeedS__MODULE_ID__';
  DoptionBox.onchange = selectFeed__MODULE_ID__;
  DoptionBox[feedCount] = new Option('Default Module View',"dv");

  UPFeedView = UPFeedView__MODULE_ID__.split('');
  if (UPFeedView == "") UPFeedView = "1";

  var legendHTML = "<TABLE width='100%'><TR><TD align=right><TABLE cellspacing=0 cellpadding=0 border=0>";

  if (feed_url__MODULE_ID__ != ''){
    colorA__MODULE_ID__[defColor__MODULE_ID__] = 1;
    color = defColor__MODULE_ID__;
    DoptionBox[feedCount + 1] = new Option('Single Feed',feed_url__MODULE_ID__);
    FeedList__MODULE_ID__[feedCount] = new Array;
    FeedList__MODULE_ID__[feedCount]['label'] = 'Single Feed';
    FeedList__MODULE_ID__[feedCount]['url'] = feed_url__MODULE_ID__;
    FeedList__MODULE_ID__[feedCount]['color'] = color;
    FeedList__MODULE_ID__[feedCount]['cache'] = false;
    FeedList__MODULE_ID__[feedCount]['request'] = false;
    checked = "";
    if (UPFeedView[feedCount] == '1'){
      checked = "checked";
      FeedList__MODULE_ID__[feedCount]['request'] = true;
    }
    legendHTML += "<TR><TD width=25px class='rTDleft__MODULE_ID__' style='background:#" + color + "'><INPUT type=checkbox " + checked  + " id='" + feedCount + "CB__MODULE_ID__' onclick='javascript: legendSelect__MODULE_ID__(" + feedCount + ")'></TD><TD class='rTDright__MODULE_ID__' style='background:#" +  color + ";color:#FFFFFF;font-size:8pt'>Single Feed&nbsp&nbsp;</TD></TR><TR><TD id='spL" + feedCount + "__MODULE_ID__' colspan=2 style='font-size:4'>&nbsp;</TD></TR>";
    overlayHeight__MODULE_ID__ += rowOffset;
    feedCount++;
    statMessage__MODULE_ID__('Found: ' + 'Your Calendar - Single Feed',false);
  }
  if (tRE){
    for (var indexB = 0; indexB < tRE.length; indexB++){
      title = tRE[indexB].replace(/bkmk_href[^ >]+>/,'');
      color = cRE.exec(title);
      if (color){
        title = color[1];
        color = color[3];
        colorA__MODULE_ID__[color] = 1;
      } else {
        for (color in colorA__MODULE_ID__){
          if (colorA__MODULE_ID__[color] == 0){
            colorA__MODULE_ID__[color] = 1;
      break;
          }
        }
      }

      if (title.length > 20) label = shrink__MODULE_ID__(title,20,"...");
      url = uRE[indexB].replace('./url?url=', '');
      url = url.match(/(.+)(basic|full)/);
      DoptionBox[feedCount + 1] = new Option(title,url[0]);
      FeedList__MODULE_ID__[feedCount] = new Array;
      FeedList__MODULE_ID__[feedCount]['label'] = title;
      FeedList__MODULE_ID__[feedCount]['url'] = url[0];
      FeedList__MODULE_ID__[feedCount]['color'] = color;
      FeedList__MODULE_ID__[feedCount]['cache'] = false;
      FeedList__MODULE_ID__[feedCount]['request'] = false;
      checked = "";
      if (UPFeedView[feedCount] == '1'){
        checked = "checked";
        FeedList__MODULE_ID__[feedCount]['request'] = true;
      }
      legendHTML += "<TR><TD width=25px class='rTDleft__MODULE_ID__' style='background:#" + color + "' onclick='javascript: legendSelect__MODULE_ID__(" + feedCount + ")'><INPUT type=checkbox " + checked  + " id='" + feedCount + "CB__MODULE_ID__'></TD><TD class='rTDright__MODULE_ID__' style='background:#" +  color + ";color:#FFFFFF;font-size:8pt'>" + title  + "&nbsp&nbsp;</TD></TR><TR><TD id='spL" + feedCount + "__MODULE_ID__' colspan=2 style='font-size:4' align=center>&nbsp;</TD></TR>";
      overlayHeight__MODULE_ID__ += rowOffset;;
      feedCount++;
      statMessage__MODULE_ID__('Found: ' + title,false);
    }

    if (prefFormat__MODULE_ID__){
      Ptable.childNodes[prefCount__MODULE_ID__].style.display = ''; // quick select info
      Ptable.childNodes[prefCount__MODULE_ID__ - 1].style.display = '';  // quick select
      Ptable.childNodes[prefCount__MODULE_ID__ - 2].style.display = ''; // color code
    }

  } else show_feedSelect__MODULE_ID__ = false;  // since it defaults to true in the edit area

  legendHTML += "</TABLE></TD></TR></TABLE>";
  _gel('legendDIV__MODULE_ID__').innerHTML = legendHTML;

  _gel("spL" + (feedCount - 1) + "__MODULE_ID__").style.background = "#E5ECF9";
  _gel("spL" + (feedCount - 1) + "__MODULE_ID__").innerHTML = "<BR><FONT style='cursor:pointer;font-size:8pt;text-decoration:underline;color:#7777CC' onclick='javascript: clearCache__MODULE_ID__();'>Refresh Calendars</FONT>";
  overlayHeight__MODULE_ID__ += 15;

  DoptionBox.selectedIndex = 0;

  var feedDiv = _gel("feedDIV__MODULE_ID__");
  feedDiv.appendChild(DoptionBox);
  if(show_feedSelect__MODULE_ID__  && tRE) feedDiv.style.display = '';

  if (feedCount == 1) {
    // no arrow, no color code, set 0 as requested and checked
    _gel("0CB__MODULE_ID__").checked = true;
    FeedList__MODULE_ID__[0]['request'] = true;
    FeedList__MODULE_ID__[0]['color'] = "FFFFFF";
  } else _gel("arrowC__MODULE_ID__").style.display = "";


  selectFeed__MODULE_ID__()

}

function bmkFail__MODULE_ID__(bmkURL){
  statMessage__MODULE_ID__("Bookmark Request Failed&nbsp;&nbsp;<FONT style='font-size:8pt;text-decoration:underline;color:grey' onclick='javascript: initialize__MODULE_ID__();'>Retry</FONT><BR>Check Link<BR><A href='" + bmkURL + "' target=_blank style='font-size:8pt;text-decoration:underline;color:grey'>" + bmkURL + "</A>",false);
  haltScript__MODULE_ID__ = true;
}


function toggleLegend__MODULE_ID__(){
  var overlayDIV = _gel("overlayDIV__MODULE_ID__");
  var legendDIV = _gel("legendDIV__MODULE_ID__");
  var calDIV = _gel('calendar_content__MODULE_ID__');

  if (overlayDIV.style.display == "none") {
    _gel("arrowC__MODULE_ID__").style.display = "none";
    _gel("arrowO__MODULE_ID__").style.display = "";
    _gel("DfeedS__MODULE_ID__").style.display = "none";

    var contHeight = overlayHeight__MODULE_ID__ + 5;
    if (contHeight > parseInt(calDIV.style.height) || disHeight__MODULE_ID__ == -1) {
      calDIV.style.height = contHeight ;
    }
    overlayDIV.style.display = legendDIV.style.display = "";
    overlayDIV.style.height = overlayHeight__MODULE_ID__ + 'px';
  } else {
    _gel("arrowO__MODULE_ID__").style.display = "none";
    _gel("arrowC__MODULE_ID__").style.display = "";
    _gel("DfeedS__MODULE_ID__").style.display = '';
    calDIV.style.height  = (disHeight__MODULE_ID__ != -1) ? disHeight__MODULE_ID__ + 'px' : "";
    overlayDIV.style.display = legendDIV.style.display = "none";
  }
}

function legendSelect__MODULE_ID__(feedID){
  if (autoSet__MODULE_ID__) return;
  reqID__MODULE_ID__++;
  FeedList__MODULE_ID__[feedID]['request'] = (_gel(feedID + "CB__MODULE_ID__").checked) ? true : false;
  clearTimeout(rqTO__MODULE_ID__);
  rqTO__MODULE_ID__ = setTimeout("checkRequest__MODULE_ID__(" + reqID__MODULE_ID__ + ")",1000);
}

function checkRequest__MODULE_ID__(reqID){
  // make sure that new updates for display haven't been made
  if (reqID == reqID__MODULE_ID__) {
    setFeed__MODULE_ID__(false);
    _gel('status_content__MODULE_ID__').innerHTML = "";
    prepareFeed__MODULE_ID__(0,"Legend - first");
  }
}

function selectFeed__MODULE_ID__(){
  var optionFeed = _gel("DfeedS__MODULE_ID__");
  _gel('status_content__MODULE_ID__').innerHTML = '';
  var single = (optionFeed[optionFeed.selectedIndex].value == "dv") ? false : true;
  setFeed__MODULE_ID__(single);
  prepareFeed__MODULE_ID__(0,"Select - First");
}


function setFeed__MODULE_ID__(single){
// determines check state and sets hidden UP
  var optionFeed = _gel("DfeedS__MODULE_ID__");
  var feedView = "";
  autoSet__MODULE_ID__ = true;

  for (var feedI = 0; feedI < FeedList__MODULE_ID__.length; feedI++){
    if (single && feedI != optionFeed.selectedIndex - 1){
      FeedList__MODULE_ID__[feedI]['request'] = false;
    } else if (single && feedI == optionFeed.selectedIndex - 1){
      FeedList__MODULE_ID__[feedI]['request'] = true;
    } else {
      if (_gel(feedI + "CB__MODULE_ID__").checked) {
        feedView += "1";
        FeedList__MODULE_ID__[feedI]['request'] = true;
      } else {
        feedView += "0";
        FeedList__MODULE_ID__[feedI]['request'] = false;
      }
    }
  }

  if (!single) {
    prefs__MODULE_ID__.set('UPFEEDVIEW',feedView);
    prefs__MODULE_ID__.getString('UPFEEDVIEW');
  }

  autoSet__MODULE_ID__ = false;
}

function clearCache__MODULE_ID__(){
  for (var feedI = 0; feedI < FeedList__MODULE_ID__.length; feedI++){
    FeedList__MODULE_ID__[feedI]['cache'] = false;
  }
  EventList__MODULE_ID__ = new Array;
  prepareFeed__MODULE_ID__(0,"clear cache");
}

function parseCalendarXML__MODULE_ID__(responseDOM,evFeedID){
  var eventBreakOut = false;
  if (UPtdFormat__MODULE_ID__ == 1) eventBreakOut = true;
  statMessage__MODULE_ID__('Loading ' + FeedList__MODULE_ID__[evFeedID]['label'],false);

  FeedList__MODULE_ID__[evFeedID]['email'] = "";
  FeedList__MODULE_ID__[evFeedID]['author'] = "";
  var feedAuthorEmail = "";
  var feedAuthor = responseDOM.docNode.getElements("author")[0];
  if (feedAuthor.length != 0) {
    feedAuthorEmail = feedAuthor.getElements("email")[0];
    if (feedAuthorEmail) {
      feedAuthorEmail = feedAuthorEmail.getText();
      FeedList__MODULE_ID__[evFeedID]['email'] = feedAuthorEmail;
    }
    feedAuthor = feedAuthor.getElements("name")[0];
    if (feedAuthor) {
      feedAuthor = feedAuthor.getText();
      FeedList__MODULE_ID__[evFeedID]['author'] = feedAuthor;
    }
  }

  var eventNodes = responseDOM.docNode.getElements("entry");
  var summaryNode;
  var recurrenceNode;
  var whenNodes;
  var originalID;
  var statusNodes;
  var whoNodes;
  var attd;
  var evCancelled;
  var aParent = new Array;
  var aEvent = new Array;

  var evId;
  var evAuthorEmail;
  var evAuthor;
  var evTitle;
  var evStartTS;
  var evEndTs;
  var evURL;
  var evDetail;
  var evLocation;
  var evRepeatTS;
  var evRepeatInt;
  var evRepeatType;
  var evRepeatByDay;

  var idRE = /[^\/]*$/;

  for (var eventNode = 0; eventNode < eventNodes.length; ++eventNode){
    aEvent = new Array;
    evId = idRE.exec(eventNodes[eventNode].getElements("id")[0].getText());

    evTitle = eventNodes[eventNode].getElements("title")[0].getText();
    evURL = eventNodes[eventNode].getElements("link")[0].getAttribute('href');

    evDetail = eventNodes[eventNode].getElements("content")[0].getText();

    summaryNode = eventNodes[eventNode].getElements('summary')[0];
    recurrenceNode = eventNodes[eventNode].getElements('gd:recurrence')[0];
    whenNodes = eventNodes[eventNode].getElements("gd:when");

    originalID = eventNodes[eventNode].getElements("gd:originalEvent");
    if (originalID[0]){
      originalID = originalID[0].getAttribute('id');
    } else originalID = evId;
    if (!aParent[originalID]) aParent[originalID] = new Array;

    statusNodes = eventNodes[eventNode].getElements("gd:eventStatus");

    evCancelled = false;
    for (var statusI = 0; statusI < statusNodes.length; ++statusI){
      if(statusNodes[statusI].getAttribute('value').match(/.canceled/)) evCancelled = true;
    }

    evAuthor = eventNodes[eventNode].getElements("author")[0];
    if (evAuthor.length != 0){
      evAuthorEmail = evAuthor.getElements("email")[0];
      if (evAuthorEmail) evAuthorEmail = evAuthorEmail.getText();
      evAuthor = evAuthor.getElements("name")[0];
      if (evAuthor) evAuthor = evAuthor.getText();
    }

    whoNodes = eventNodes[eventNode].getElements("gd:who");
    for (var whoI = 0; whoI < whoNodes.length; ++whoI){
      attd = whoNodes[whoI].getAttribute('valueString');
      if (whoNodes[whoI].getElements("gd:attendeeStatus")[0].getAttribute('value').match(/.declined/)
         && attd == feedAuthorEmail && evAuthorEmail != feedAuthorEmail && !ShowDecline__MODULE_ID__) evCancelled = true;
    }

    evRepeatTS = "";
    evRepeatInt = "";
    evRepeatType = "";
    evRepeatByDay = "";

    if (whenNodes.length > 0){
      // normal event node
      aEvent = new Array;
      evLocation = eventNodes[eventNode].getElements('gd:where')[0].getAttribute('valueString');
      if (!evLocation) evLocation = "";

      for (var whenNode = 0; whenNode < whenNodes.length; ++whenNode){

        aEvent[whenNode] = new Array;
        aEvent[whenNode]['evStartTS'] = TSfromISO__MODULE_ID__(whenNodes[whenNode].getAttribute('startTime'),1,false);
        aEvent[whenNode]['evEndTS'] = TSfromISO__MODULE_ID__(whenNodes[whenNode].getAttribute('endTime'),1,true);
        var TSx = parseInt(aEvent[whenNode]['evStartTS']);  // shorthand var
        if (!aParent[originalID][TSx]) aParent[originalID][TSx] = new Array;
        if (evCancelled) aParent[originalID][TSx]['cancelled'] = true;
      }
    } else if (recurrenceNode){
      var sdRRE = /:([^\s]+)/; // recurring event date time
      var dsRRE = /DURATION:PT([0-9]+)/; // duration in seconds
      var rRRE = /RRULE:[^\s]+/; // recurrence rule
      var untilRRE = /UNTIL=([0-9]{4}[0-9]{2}[0-9]{2})/;
      var intRRE = /INTERVAL=([^;]+)/;
      var freqRRE = /FREQ=([^;]+)/;
      var dayRRE = /BYDAY=([^;]+)/;
      var recParam; // recurrence parameters
      evLocation = eventNodes[eventNode].getElements('gd:where')[0].getAttribute('valueString');
      if (!evLocation) evLocation = "";
      recParam = recurrenceNode.getText();

      evStartTS = sdRRE.exec(recParam);
      // currently assumes repeating events are defined in LOCAL TZ
      evStartTS = TSfromLocal__MODULE_ID__(evStartTS[1],false);
      var duration = dsRRE.exec(recParam); // duration in seconds
      if (parseInt(duration[1]) == 86400){ // all day event
        var evEndTS = evStartTS
      } else {
        var evEndTS = parseInt(evStartTS) + parseInt(duration[1]) * 1000; // end date
      }
      // parse recurrence rules
      var rule = rRRE.exec(recParam);

      evRepeatType = freqRRE.exec(rule);
      if (evRepeatType){
        // type was null - cant determine recurrence elsewise
        evRepeatType = evRepeatType[1];

        var byday = dayRRE.exec(rule);
  if (byday && evRepeatType == 'WEEKLY') {
          evRepeatByDay = new Array;
          for (var iDay = 0; iDay < 7; ++iDay){evRepeatByDay[iDay] = 0;}
    byday = byday[1].split(",");
          for (iDay = 0; iDay < byday.length; ++iDay){evRepeatByDay[revDay__MODULE_ID__[byday[iDay]]] = 1;}
  }else if(byday && evRepeatType == 'MONTHLY'){
          evRepeatByDay = byday[1];
  }

        evRepeatTS = untilRRE.exec(rule);
        if (evRepeatTS) {
          evRepeatTS = TSfromLocal__MODULE_ID__(evRepeatTS[1],false);
          if (evRepeatTS > start_maxTS__MODULE_ID__) evRepeatTS = start_maxTS__MODULE_ID__;
        } else evRepeatTS = start_maxTS__MODULE_ID__;  // no ednd was set/found - default to max

        evRepeatInt = intRRE.exec(rule);
        evRepeatInt = (evRepeatInt) ? evRepeatInt[1] : "1";

      } else evRepeatType = "";

    }else if(summaryNode){
      var wSRE = /Where:\s+([^<]+)/; // RE for summary Location information
      evLocation = wSRE.exec(summaryNode.getText());
      if(evLocation) {
        evLocation = evLocation[1];
      } else evLocation = "";
      var sumText = summaryNode.getText();
      var startPrefix = 'When:';

      if (sumText.match(/First start:/)){
        // recurrence in summary
        var dSRE = /Duration:[\s]*(.*)/;
        startPrefix = 'First start:';
        evStartTS = TSfromString__MODULE_ID__(startPrefix,sumText,0,"",false);
        evStartTS = parseDate__MODULE_ID__(evStartTS);
        evStartTS = new Date(monthA__MODULE_ID__[evStartTS['month']] + " " + evStartTS['date'] + " " + nowParse__MODULE_ID__['year'] + " " + evStartTS['hour'] + ":" + evStartTS['minute']).getTime();
        var duration = dSRE.exec(sumText); // duration in seconds
        if (parseInt(duration[1]) == 86400){ // all day event
          evEndTS = evStartTS;
        } else {
          evEndTS = parseInt(evStartTS) + parseInt(duration[1]) * 1000; // end date
        }
      } else {
  // daylight savings - -maybe option when it becomes issue)
        evStartTS = TSfromString__MODULE_ID__(startPrefix,sumText,1,"-07:00",false);
        evEndTS = TSfromString__MODULE_ID__("to",sumText,1,"-07:00",true);
  if (!evEndTS){
          // checks for DT sent as date time to time
          var tSRE = /to[\s]+([0-9]{2}:[0-9]{2})/;
          var t = tSRE.exec(sumText);
          evEndTS = parseDate__MODULE_ID__(evStartTS);
          evEndTS = new Date(monthA__MODULE_ID__[evEndTS['month']] + " " + evEndTS['date'] + " " + evEndTS['year'] + " " + t[1]).getTime();
        }
      }

    }
// if(!evCancelled && !aParent[evId]){ // removed to test cancel logic
    if(!evCancelled){
      if (aEvent.length == 0){
        if (new Date(evEndTS).getTime() != evEndTS) evEndTS = evStartTS;
        addEvent__MODULE_ID__(new CalendarEvent__MODULE_ID__(evId,evFeedID,evTitle,evDetail,evStartTS,evEndTS,evURL,evLocation,evRepeatTS,evRepeatType,evRepeatInt,evRepeatByDay));
      } else {
        // loop the when node results and add
        for (var aWheni = 0; aWheni < aEvent.length; aWheni++){
          TSx = parseInt(aEvent[aWheni]['evStartTS']); // shorthand
          if (new Date(aEvent[aWheni]['evEndTS']).getTime() != aEvent[aWheni]['evEndTS']) aEvent[aWheni]['evEndTS'] = TSx;
          if (!aParent[originalID][TSx]['cancelled'] && !aParent[originalID][TSx]['added']){
            // check that the eventtime isnt a cancelled child
            aParent[originalID][parseInt(TSx)]['added'] = true;
            addEvent__MODULE_ID__(new CalendarEvent__MODULE_ID__(evId,evFeedID,evTitle,evDetail,aEvent[aWheni]['evStartTS'],aEvent[aWheni]['evEndTS'],evURL,evLocation,evRepeatTS,evRepeatType,evRepeatInt,evRepeatByDay));
          }
        }
      }
    }

  } // event loops

}


function CalendarEvent__MODULE_ID__(id,feedID,title,detail,startTS,endTS,URL,location,repeatTS,repeatType,repeatInt,repeatByDay){
  this.id = id;
  this.feedID = feedID;
  this.title = title;
  this.detail = detail;
  this.URL = URL;
  this.location = location;

  this.startTS = startTS;
  this.endTS = endTS;
  this.duration = parseInt(endTS) - parseInt(startTS);

  this.repeatTS = repeatTS;
  this.repeatType = repeatType;
  this.repeatInt = repeatInt;
  this.repeatByDay = repeatByDay;
}


function addEvent__MODULE_ID__(event){

  // add event if it is in the future
  if (event.endTS >= nowTS__MODULE_ID__) {
  EventList__MODULE_ID__.push(event);
  }

  if (event.repeatTS >= nowTS__MODULE_ID__){
    if (event.repeatType=='WEEKLY') {
      addRecurringWeeklyEvent__MODULE_ID__(event)
    } else if (event.repeatType=='MONTHLY') {
      addRecurringMonthlyEvent__MODULE_ID__(event);
    } else if (event.repeatType=='YEARLY') {
      addRecurringYearlyEvent__MODULE_ID__(event);
    }
  }
}

function addRecurringWeeklyEvent__MODULE_ID__(event){

  var repeatDay = new Array;
  var startTS;
  var newDay;
  var offset;
  if (event.repeatByDay != ''){
    var dow = new Date(event.startTS).getDay();
    for (iday = 0; iday < event.repeatByDay.length; ++iday){
      if (event.repeatByDay[iday] == 1){
        var addDay = iday - parseInt(dow);
        if (addDay <= 0)  addDay = (7 + addDay) + (parseInt(event.repeatInt) - 1) * 7; // offset
        startTS = parseInt(event.startTS)
                  + ( 60 * 60 * 24 * 1000 * addDay );
        offset = (new Date(event.startTS).getTimezoneOffset() - new Date(startTS).getTimezoneOffset()) * 1000 * 60;
        // this _should_ handle crossing the DST
        startTS = parseInt(startTS) - parseInt(offset);
        repeatDay.push(startTS);
      }
    }
  }else{
    startTS = parseInt(event.startTS) + (parseInt(event.repeatInt) * 7 * 60 * 60 * 24 * 1000);
    offset = (new Date(event.startTS).getTimezoneOffset() - new Date(startTS).getTimezoneOffset()) * 1000 * 60;
    // this _should_ handle crossing the DST
    startTS = parseInt(startTS) - parseInt(offset);
    repeatDay.push(startTS);
  }

  for (var irepeat = 0; irepeat < repeatDay.length; ++irepeat){
    startTS = repeatDay[irepeat];
    var endTS = parseInt(startTS) + parseInt(event.duration);
    if (event.repeatTS >= startTS)
      addEvent__MODULE_ID__(new CalendarEvent__MODULE_ID__(event.id,event.title,startTS,endTS,event.URL,event.location,event.repeatTS,event.repeatType,event.repeatInt,""));   // if
  }

}

function addRecurringMonthlyEvent__MODULE_ID__(event){

  var repeatDay = new Array;
  var startTS;
  var newMonth;
  var offset;
  if (event.repeatByDay != ''){
  // how to hanlde first of tuesday of the month etc??
  }else{
    startTS = parseDate__MODULE_ID__(event.startTS);
    newMonth = startTS['month'] + parseInt(event.repeatInt) + 1;
    if (newMonth > 12) {
      newMonth = newMonth - 12;
      startTS['year'] = startTS['year'] + 1;
    }
    startTS = new Date(monthA__MODULE_ID__[newMonth] + " " + startTS['date'] + " " + startTS['year'] + " " + startTS['hour'] + ":" + startTS['minute']).getTime();
    offset = (new Date(event.startTS).getTimezoneOffset() - new Date(startTS).getTimezoneOffset()) * 1000 * 60;
    // this _should_ handle crossing the DST
    startTS = parseInt(startTS) - parseInt(offset);
    repeatDay.push(startTS);
  }

  for (var irepeat = 0; irepeat < repeatDay.length; ++irepeat){
    startTS = repeatDay[irepeat];
    var endTS = parseInt(startTS) + parseInt(event.duration);
    if (event.repeatTS >= startTS)
      addEvent__MODULE_ID__(new CalendarEvent__MODULE_ID__(event.id,event.title,startTS,endTS,event.URL,event.location,event.repeatTS,event.repeatType,event.repeatInt,""));   // if
  }

}

function addRecurringYearlyEvent__MODULE_ID__(event){
  var dateParse = parseDate__MODULE_ID__(event.startTS);
  var newYear = dateParse['year'] + parseInt(event.repeatInt);
  var startTS = new Date(monthA__MODULE_ID__[dateParse['month']] + " " + dateParse['date'] + " " + newYear + " " + dateParse['hour'] + ":" + dateParse['minute']).getTime();
  var endTS = parseInt(startTS) + parseInt(event.duration);
  if (event.repeatTS >= startTS)
    addEvent__MODULE_ID__(new CalendarEvent__MODULE_ID__(event.id,event.title,startTS,endTS,event.URL,event.location,event.repeatTS,event.repeatType,event.repeatInt,""));
}

function renderCalendar__MODULE_ID__(eventA){
  var max_display = prefs__MODULE_ID__.getString('EVENTS_TO_SHOW');

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
  var UPhighlight = prefs__MODULE_ID__.getBool('HIGHLIGHT_TODAY');
  var now = monthA__MODULE_ID__[nowParse__MODULE_ID__['month']] + " "
          + nowParse__MODULE_ID__['date'] + " " + nowParse__MODULE_ID__['year'];

  var className = "gcalItem__MODULE_ID__";

  if (UPhighlight){
    if(rightNowTS__MODULE_ID__ > eventO.startTS &&
       rightNowTS__MODULE_ID__ < eventO.endTS &&
       now != td['d']){
      className = "GgcalItem__MODULE_ID__";
    }else if (now == td['d']){
      var NstartTS = eventO.startTS - (60 * 60 * 1000);
      var NendTS = eventO.endTS + (15 * 60 * 1000);
      if (rightNowTS__MODULE_ID__ >= NstartTS &&
        rightNowTS__MODULE_ID__ <= NendTS) {
        // coming up soon
        className = "NgcalItem__MODULE_ID__";
      } else className = "HgcalItem__MODULE_ID__";
    }
  }

  return className;

}


function eventFormat_0__MODULE_ID__(eI,std,etd,ltd){
  // multi-line
  var evHTML;
  var eventO = EventList__MODULE_ID__[eI];
  var feedID = eventO.feedID;
  var summary = shrink__MODULE_ID__(eventO.title,deflen__MODULE_ID__,'...');
  summary = "<A onclick='javascript: return !UPinfoWindow__MODULE_ID__' href='"
          + eventO.URL  + "' target='_blank'><FONT style='text-decoration:underline;color:blue'>"
          + summary + "</FONT></A>";

  if (Dlocation__MODULE_ID__ && eventO.location.toString().length != 0)
     summary += "<BR>" + shrink__MODULE_ID__(eventO.location,deflen__MODULE_ID__,'...');

  var className = getClass__MODULE_ID__(eventO,std);

  var style = " valign=top class='" + className + "' style='font-size:" + UPdisplayFont__MODULE_ID__ + "pt;'";

  var evStyle = "";
  spStyle = " style='font-size:2pt;' ";
  var feedSym = "&nbsp;&nbsp;&nbsp;&nbsp;";
  if (OPERA__MODULE_ID__) feedSym = "&nbsp;&nbsp;";
  if (UPcolorCode__MODULE_ID__ == 1){
    evStyle = " valign=top style='background:#" + FeedList__MODULE_ID__[feedID]['color']  + ";font-size:2pt;' ";
    spStyle = " style='background:#" + FeedList__MODULE_ID__[feedID]['color']  + ";font-size:2pt;' ";
  } else if(UPcolorCode__MODULE_ID__ == 2) {
    evStyle = " valign=top style='color:#" + FeedList__MODULE_ID__[feedID]['color']  + ";font-size:" + UPdisplayFont__MODULE_ID__  + "pt'";
    feedSym = "&bull;";
  }
  var evTT = " onmouseover='javascript: tooltip__MODULE_ID__(" + feedID  + ",event)' onmouseout='javascript: tooltip__MODULE_ID__(-1,event)' ";

  evHTML = "<TR style='cursor:pointer;' "
         + " onclick='javascript: var self=this; infoOpen__MODULE_ID__(self,event,EventList__MODULE_ID__[" + eI + "]);'>";

  if (std['d'] != etd['d']){
    evHTML += "<TD " +  evStyle + evTT + ">" + feedSym  + "</TD>"
           + "<TD " +  style + ">&nbsp;" + std['day'] + "</TD>"
           + "<TD " +  style + ">" + std['month'] + "</TD>"
           + "<TD " +  style + " align=right>" + std['date'] + "</TD>"
           + "<TD " +  style + ">" + std['year'] + "</TD>"
           + "<TD " +  style + ">&nbsp;" + std['t'] + "</TD>"
           + "<TD " +  style + " rowspan=2>&nbsp;&nbsp;</TD>"
           + "<TD " +  style + " rowspan=2 width='100%'>"
           + summary + "</TD></TR>";

    evHTML += "<TD " +  evStyle + evTT + ">&nbsp;</TD>"
           + "<TD " +  style + ">&nbsp;" + etd['day'] + "</TD>"
           + "<TD " +  style + ">" + etd['month'] + "</TD>"
           + "<TD " +  style + " align=right>" + etd['date'] + "</TD>"
           + "<TD " +  style + ">" + etd['year'] + "</TD>"
           + "<TD " +  style + ">&nbsp;" + etd['t'] + "</TD></TR>";

  }else{
    evHTML += "<TD " +  evStyle + evTT + ">" + feedSym + "</TD>"
           + "<TD " +  style + ">&nbsp;" + std['day'] + "</TD>"
           + "<TD " +  style + ">" + std['month'] + "</TD>"
           + "<TD " +  style + " align=right>" + std['date'] + "</TD>"
           + "<TD " +  style + ">" + std['year'] + "</TD>"
           + "<TD " +  style + ">&nbsp;" + std['trange'] + "</TD>"
           + "<TD " +  style + ">&nbsp;&nbsp;</TD>"
           + "<TD width='100%' " +  style + ">"
           + summary + "</TD></TR>";

  }

  feedSym = "&nbsp;&nbsp;&nbsp;&nbsp;";
  if (OPERA__MODULE_ID__) feedSym = "&nbsp;&nbsp;";
  style = " class='" + className + "' style='font-size:2pt'";
  evHTML += "<TR><TD " +  spStyle + evTT + ">" + feedSym  + "</TD><TD "
         + style + " colspan=7>&nbsp;</TD></TR>";

  return evHTML;

}

function eventFormat_1__MODULE_ID__(eI,std,etd,ltd){
  // day summary
  var evHTML = '';
  var UPhighlight = prefs__MODULE_ID__.getBool('HIGHLIGHT_TODAY');
  var now = monthA__MODULE_ID__[nowParse__MODULE_ID__['month']] + " "
          + nowParse__MODULE_ID__['date'] + " " + nowParse__MODULE_ID__['year'];

  var eventO = EventList__MODULE_ID__[eI];
  var feedID = eventO.feedID;
  var origSize;
  var maxLSize = 12;
  var maxSSize = 24;
  var maxSize = maxSSize + maxLSize;
  var summary = eventO.title;
  var location;
  if (Dlocation__MODULE_ID__ && eventO.location.toString().length != 0){
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
          + eventO.URL  + "' target='_blank'><FONT style='text-decoration:underline;color:blue'>"
          + summary + "</FONT></A>&nbsp;&nbsp;";

  var className = getClass__MODULE_ID__(eventO,std);

  var style = " valign=top class='" + className + "' style='font-size:" + UPdisplayFont__MODULE_ID__ + "pt;'";

  var evStyle = "";
  var feedSym = "&nbsp;&nbsp;&nbsp;&nbsp;";
  if (OPERA__MODULE_ID__) feedSym = "&nbsp;&nbsp;";
  if (UPcolorCode__MODULE_ID__ == 1){
    evStyle = " valign=top style='background:#" + FeedList__MODULE_ID__[feedID]['color']  + ";font-size:2pt;' ";
  } else if(UPcolorCode__MODULE_ID__ == 2) {
    evStyle = " valign=top style='color:#" + FeedList__MODULE_ID__[feedID]['color']  + ";font-size:" + UPdisplayFont__MODULE_ID__  + "pt'";
    feedSym = "&bull;";
  }
  var evTT = " onmouseover='javascript: tooltip__MODULE_ID__(" + feedID  + ",event)' onmouseout='javascript: tooltip__MODULE_ID__(-1,event)' ";

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



  evHTML += "<TR style='cursor:pointer;' "
         + " onclick='javascript: var self=this; infoOpen__MODULE_ID__(self,event,EventList__MODULE_ID__[" + eI + "]);'>";

  var sumloc = "<TABLE width='100%' cellpadding=0 cellspacing=0><TR><TD " +  style +  ">" + summary + "</TD><TD align=right " +  style + ">" + location  + "</TD></TR></TABLE>";

  if (std['trangeT'] != '') std['trange'] = std['trangeT'];
  evHTML += "<TD " +  evStyle + evTT + ">" + feedSym  + "</TD>"
         + "<TD " +  style + ">&nbsp;" + std['trange'] + "</TD>"
         + "<TD " +  style + ">&nbsp;&nbsp;</TD>"
         + "<TD " +  style + " width='100%'>" + sumloc + "</TD></TR>"

  return evHTML;

}

function eventFormat_2__MODULE_ID__(eI,std,etd,ltd){
  // single line
  var evHTML;

  var eventO = EventList__MODULE_ID__[eI];
  var feedID = eventO.feedID;
  var summary = shrink__MODULE_ID__(eventO.title,deflen__MODULE_ID__,'...');
  summary = "<A onclick='javascript: return !UPinfoWindow__MODULE_ID__' href='"
          + eventO.URL  + "' target='_blank'><FONT style='text-decoration:underline;color:blue'>"
          + summary + "</FONT></A>";

  if (Dlocation__MODULE_ID__ && eventO.location.toString().length != 0)
     summary += "<BR>" + shrink__MODULE_ID__(eventO.location,deflen__MODULE_ID__,'...');

  var className = getClass__MODULE_ID__(eventO,std);

  var style = " valign=top class='" + className + "' style='font-size:" + UPdisplayFont__MODULE_ID__ + "pt;'";

  var evStyle = "";
  spStyle = " style='font-size:2pt;' ";
  var feedSym = "&nbsp;&nbsp;&nbsp;&nbsp;";
  if (OPERA__MODULE_ID__) feedSym = "&nbsp;&nbsp;";
  if (UPcolorCode__MODULE_ID__ == 1){
    evStyle = " valign=top style='background:#" + FeedList__MODULE_ID__[feedID]['color']  + ";font-size:2pt;' ";
    spStyle = " style='background:#" + FeedList__MODULE_ID__[feedID]['color']  + ";font-size:2pt;' ";
  } else if(UPcolorCode__MODULE_ID__ == 2) {
    evStyle = " valign=top style='color:#" + FeedList__MODULE_ID__[feedID]['color']  + ";font-size:" + UPdisplayFont__MODULE_ID__  + "pt'";
    feedSym = "&bull;";
  }
  var evTT = " onmouseover='javascript: tooltip__MODULE_ID__(" + feedID  + ",event)' onmouseout='javascript: tooltip__MODULE_ID__(-1,event)' ";

  evHTML = "<TR style='cursor:pointer;' "
         + " onclick='javascript: var self=this; infoOpen__MODULE_ID__(self,event,EventList__MODULE_ID__[" + eI + "]);'>";

  evHTML += "<TD " +  evStyle + evTT + ">" + feedSym  + "</TD>"
         + "<TD " +  style + ">&nbsp;" + std['day'] + "</TD>"
         + "<TD " +  style + ">" + std['mrange'] + "</TD>"
         + "<TD " +  style + " align=right>" + std['drange'] + "</TD>"
         + "<TD " +  style + ">" + std['remainDate'] + "</TD>"
         + "<TD " +  style + ">" + std['year'] + "</TD>"
         + "<TD " +  style + ">&nbsp;" + std['trange'] + "</TD>"
         + "<TD " +  style + ">&nbsp;&nbsp;</TD>"
         + "<TD " +  style + " width='100%'>"
         + summary + "</TD></TR>";

  style = " valign=top class='" + className + "' style='font-size:2pt'";
  feedSym = "&nbsp;&nbsp;&nbsp;&nbsp;";
  if (OPERA__MODULE_ID__) feedSym = "&nbsp;&nbsp;";
  evHTML += "<TR><TD " +  spStyle + evTT + ">" + feedSym  + "</TD><TD "
         + style + " colspan=8>&nbsp;</TD></TR>";

  return evHTML;
}


function cmp__MODULE_ID__(a,b) {
  return (a < b) ? -1 :( a > b) ? 1 : 0;
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


function TSfromLocal__MODULE_ID__(string,isEnd){
  var dRE = /([0-9]{4})([0-9]{2})([0-9]{2})/;
  var tRE = /T([0-9]{2})([0-9]{2})/;

  var date = dRE.exec(string);
  var time = tRE.exec(string);

  if (date) date = date[1] + "-" + date[2] + "-" + date[3];
  time = (time) ? time = time[1] + ":" + time[2] : "00:00";

  return TSfromISO__MODULE_ID__(date + " " + time,0,isEnd);
}

function TSfromString__MODULE_ID__(prefix,string,offset,GMToffset,isEnd){
  // returns a TS from a google XML feed date time
  var dtRE = new RegExp(prefix + "[\\s]+([^\\s]+)[\\s]([^\\s]+)");
  var dt = dtRE.exec(string);
  if (dt) {
    if (!dt[2].match(/[0-9]{2}:*./)) {
      dt[2] = "";
      offset = 0;
    }
    dt = dt[1] + " " + dt[2] + GMToffset;
  } else dt = "";
  return TSfromISO__MODULE_ID__(dt,offset,isEnd);

}

function TSfromISO__MODULE_ID__(ISO,offset,isEnd){
  // converts date in the format 2006-04-15T20:00:00.000Z to milliseconds since EPOCH
  // works with 2006-04-15 20:00
  var tRE = /(\s|T)([0-9]{2}:[0-9]{2})/;
  var dRE = /([0-9]+)-([0-9]+)-([0-9]+)/;
  var oRE = /(\+|-){1}(.){5}$/;

  var TS;
  var date  = dRE.exec(ISO);
  var time  = tRE.exec(ISO);
  var gmtOffset = oRE.exec(ISO);

  // still working on this fix of the all day offset
  //var gmtPosition = nowParse__MODULE_ID__['gmtPosition'];
  //var gmtPosition = "-";

//  really strange
//  var gmtPosition = "+";
//  var gmtOffset = oRE.exec(ISO);
//  if (gmtOffset && ISO.length > 10) gmtPosition = gmtOffset[1];

  var timeAdjust = 0;

  if (date){
    if (time){
      time = time[2];
    } else {
      gmtOffset = false;
      offset = 0;
       if (isEnd) {
         timeAdjust = -1;
         time =  "23:59";
       } else time =  "00:00";
    }

    if (gmtOffset){
      gmtOffset = gmtOffset[0];
      offset = 1;
    } else gmtOffset = 0;

    if(date[2].substring(0,1) == "0") date[2] = date[2].substring(1,2);
//    if(date[3].substring(0,1) == "0") date[3] = date[3].substring(1,2);

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
  parsed['gmtOffset'] = date.getTimezoneOffset();
  parsed['gmtPosition'] = (parsed['gmtOffset'] > 0) ? "-" : "+";

  if (parsed['hour'].toString().length == 1) parsed['hour'] = '0' + parsed['hour'];
  if (parsed['minute'].toString().length == 1) parsed['minute'] = '0' + parsed['minute'];
  if (parsed['second'].toString().length == 1) parsed['second'] = '0' + parsed['second'];

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


function getDate__MODULE_ID__(TS,UP){
  var Dmonth = prefs__MODULE_ID__.getBool('DMONTH');
  var Ddate = prefs__MODULE_ID__.getBool('DDATE');
  var Dday_of_week = prefs__MODULE_ID__.getBool('DDAY_OF_WEEK');
  var Dyear = prefs__MODULE_ID__.getBool('DYEAR');

  if (!UP) Dmonth = Ddate = Dday_of_week = Dyear = true;  // overide

  var td = parseDate__MODULE_ID__(TS,false);

  td['ts'] = TS;
  td['d'] = monthA__MODULE_ID__[td['month']] + " " + td['date'] + " " + td['year'];
  td['monthName'] = monthA__MODULE_ID__[td['month']];
  td['month'] = monthA__MODULE_ID__[td['month']].substring(0,3) + "&nbsp;";
  td['dayName'] = dayLA__MODULE_ID__[dayA__MODULE_ID__[td['day']]];
  td['day'] = dayA__MODULE_ID__[td['day']] + "&nbsp;";
  td['year'] = "&nbsp;" + td['year'];

  if (!Dday_of_week) td['day'] = "";
  if (!Dmonth) td['month'] = td['monthName']  = "";
  if (!Ddate){
    td['date'] = "";
    td['month'] = td['month'].replace(/&nbsp;/,'');
  }
  if (!Dyear) td['year'] = "";

  td['remainDate'] = "";
  td['trange'] = "";
  td['trangeT'] = "";
  td['mrange'] = td['month'];
  td['drange'] = td['date'];

  return td;

}

function formatDate__MODULE_ID__(eventO,UP){
  var UPtime = prefs__MODULE_ID__.getInt('DTIME');
  if (!UP && UPtime == 0) UPtime = 1;

  var std = formatTime__MODULE_ID__(getDate__MODULE_ID__(eventO.startTS,UP),UP);
  var etd = formatTime__MODULE_ID__(getDate__MODULE_ID__(eventO.endTS,UP),UP);

  if ( (std['t'] == "12:00a" && etd['t'] == "11:59p") ||
       (std['t'] == "00:00" && etd['t'] == "23:59") ){
//       (std['d'] == etd['d'] && (std['t'] == "12:00a" || std['t'] == "00:00")) ){
       std['trangeT'] = "All&nbsp;Day";
       std['t'] = "";
       etd['t'] = "";
  } else if (std['t'] != ''){

    if ( (std['d'] != etd['d'] || std['t'] != etd['t']) &&
         (UPtime == 1 || UPtime == 2 || !UP) ){
      std['trange'] = std['t'] + "~" + etd['t'];
    } else std['trange'] = std['t'];

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
  var Dtime = prefs__MODULE_ID__.getInt('DTIME');
  if (!UP && Dtime == 0) Dtime = 1;

  var AMPM = "";
  var sep = ":";
  var hour = "";
  var minute = "";

  if (Dtime == 1 || Dtime == 3){
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

  } else if (Dtime == 2 || Dtime == 4) {
    hour = td['hour'];
    minute = td['minute'];
  } else sep = "";

  td['t'] = hour + sep + minute + AMPM;

  return td;
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
    now = dayLA__MODULE_ID__[dayA__MODULE_ID__[nowDate['day']]] + ", " + month + " " + nowDate['date'] + ", " + nowDate['year'] + " - " + nowDate['hour'] + ":" + nowDate['minute'] + nowDate['second'];
  } else if (UPtoday__MODULE_ID__ && UPclock__MODULE_ID__ == 0) {
    now = dayLA__MODULE_ID__[dayA__MODULE_ID__[nowDate['day']]] + ", " + month + " " + nowDate['date'] + ", " + nowDate['year'];
    refresh = false;
  } else now =nowDate['hour'] + ":" + nowDate['minute'] + nowDate['second'];

  _gel('date_content__MODULE_ID__').innerHTML = "<CENTER>" + now + "</CENTER>";
  _gel('date_content__MODULE_ID__').style.display = '';

  if (refresh) setTimeout("datetime__MODULE_ID__()", refresh);


}

function getObjMethodClosure__MODULE_ID__(object, method) {
  // shorthand object reference
  return function(arg) {
    return object[method](arg);
  }
}

function formatPrefContent__MODULE_ID__(){
  var Ptable =_gel("m___MODULE_ID___form").firstChild.firstChild.firstChild;
  if (!Ptable  || Ptable.childNodes[prefCount__MODULE_ID__ - 1].style.display == 'none') return;
  var prefAdd = 0;


  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[prefAdd],"<FONT style='font-weight:bold;font-size:8pt;color:gray'>v" + version__MODULE_ID__ + "</FONT>","<a style='text-decoration:none;color:gray;font-size:8pt' href='http://www.r2unit.com/gmodule/' target=_blank>about&nbsp;&gt;&gt;</a>");
  prefAdd ++;

  var FS = prefAdd + 1;
  var LS = prefAdd + 2 + LSpref__MODULE_ID__;
  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[prefAdd],"<FONT style='font-weight:bold;font-size:10pt;'>Preferences:</FONT>&nbsp;<FONT style='cursor:pointer;font-size:8pt;text-decoration:underline;color:blue' onclick='javascript: toggleNode__MODULE_ID__(" + FS  + "," + LS + ");'>Setup</FONT>",false);
  prefAdd ++;

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LS],"<FONT style='font-weight:bold;font-size:8pt;color:gray'>(Removes events that have ended for today.)</FONT>",false);
  prefAdd ++;

  var FTD = LS + 2;
  LDpref__MODULE_ID__ =  LDpref__MODULE_ID__ + prefAdd;
  LSpref__MODULE_ID__ = LSpref__MODULE_ID__ + prefAdd;
  var LTD = LDpref__MODULE_ID__ + 1; // number of added TD prefs
  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LSpref__MODULE_ID__ + 1],"<BR><FONT style='font-weight:bold;font-size:10pt;'>Time/Date Display:</FONT>&nbsp;<FONT style='cursor:pointer;font-size:8pt;text-decoration:underline;color:blue' onclick='javascript: toggleNode__MODULE_ID__(" + FTD  + "," + LTD + ");'>Setup</FONT>",false);
  prefAdd ++;
  LDpref__MODULE_ID__ ++;

/*
  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LDpref__MODULE_ID__ + 1],"<FONT style='font-weight:bold;font-size:8pt;color:gray'>(sets&nbsp;multiple&nbsp;dates&nbsp;to&nbsp;single&nbsp;line&nbsp;'Apr&nbsp;20-22')</FONT>",false);
  prefAdd ++;
  LDpref__MODULE_ID__ ++;
*/

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LDpref__MODULE_ID__ + 1],"<BR><FONT style='font-weight:bold;font-size:10pt;'>Calendar&nbsp;Feed:</FONT>&nbsp;<A href='http://www.google.com/support/calendar/bin/answer.py?answer=37648&topic=8566' target='_blank' style='font-size:8pt;'>Find Your Feed</A>",false);
  prefAdd ++;

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LDpref__MODULE_ID__ + 2],"<FONT style='font-weight:bold;font-size:8pt;'>Single:</FONT>&nbsp;<FONT style='cursor:pointer;font-size:8pt;text-decoration:underline;color:blue' onclick='javascript: toggleDIV__MODULE_ID__(\"urlSF__MODULE_ID__\");'>Learn More</FONT>",false);
  prefAdd ++;


  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LDpref__MODULE_ID__ + 3],"<DIV id='urlSF__MODULE_ID__' style='display:none'><FONT style='font-size:8pt;'>You can simply specify an <A href='http://www.google.com/support/calendar/bin/answer.py?answer=37648&topic=8566' target='_blank' style='font-size:8pt;'>XML Calendar Feed</A> in the 'XML Feed' input area.  This will be the calendar which is loaded with each page reload.  If you want multiple calendars, please see the instructions below.<BR><BR>",false);
  prefAdd ++;

  // fix module grow issue
  _gel("m___MODULE_ID___20").style.width = "180px";
  _gel("m___MODULE_ID___21").style.width = "180px";

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LDpref__MODULE_ID__ + 5],"<FONT style='font-weight:bold;font-size:8pt;'>Multiple:</FONT>&nbsp;<FONT style='cursor:pointer;font-size:8pt;text-decoration:underline;color:blue' onclick='javascript: toggleDIV__MODULE_ID__(\"urlMF__MODULE_ID__\");'>Learn More</FONT>",false);
  prefAdd ++;

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LDpref__MODULE_ID__ + 6],"<DIV id='urlMF__MODULE_ID__' style='display:none'><FONT style='font-size:8pt;'>You can setup an unlimited number of calendars by storing the feed url's in <A href='http://google.com/bookmarks' target=_blank>Google&nbsp;Bookmarks</A>. Each of the stored feeds must have the same user defined label associated with them (e.g. IGgcal).  The label can not contain spaces and must match the one you specify in the 'Label' input area.  They will be displayed in a color coded legend ordered by the title which you gave each in <A href='http://google.com/bookmarks' target=_blank>Google&nbsp;Bookmarks</A>.  If you create the title in the format 'Your Title#cc33cc', you can customize the colors of <FONT color=#cc33cc>Your Title</FONT>.  Additionally, you can choose to add a 'Quick Select' list into the main module window for easy calendar selection.<BR><BR>",false);
  prefAdd ++;

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[prefCount__MODULE_ID__ + prefAdd + 1],"<FONT style='font-weight:bold;font-size:8pt;color:gray'>(Moves feed selection to main window)</FONT>",false);
  prefAdd ++;

  prefCount__MODULE_ID__ = prefAdd + prefCount__MODULE_ID__;
  prefFormat__MODULE_ID__ = true;

  Ptable.childNodes[prefCount__MODULE_ID__].style.display = 'none'; // show check comment
  Ptable.childNodes[prefCount__MODULE_ID__ - 1].style.display = 'none'; // show check
  Ptable.childNodes[prefCount__MODULE_ID__ - 2].style.display = 'none'; // color code

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

   // 20060915 sebdotv: required for IE (which fails otherwise)
   if (child) {
    parent.insertBefore(tr,child);
   } else {
    parent.appendChild(tr);
   }

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

function enableModule__MODULE_ID__(){
  _gel('m___MODULE_ID___form').elements[1].checked = false;
  prefs__MODULE_ID__.set('DDISABLE',false);
  prefs__MODULE_ID__.getBool('DDISABLE');
  initialize__MODULE_ID__();
}

function statMessage__MODULE_ID__(message,reset){
  _gel('status_content__MODULE_ID__').innerHTML  = "<BR>" + _gel('status_content__MODULE_ID__').innerHTML;
  if (reset) _gel('status_content__MODULE_ID__').innerHTML = "";
  _gel('status_content__MODULE_ID__').innerHTML = message + _gel('status_content__MODULE_ID__').innerHTML;
}

// XMLhttpRequest
function createRequestObject__MODULE_ID__() {
  var ro;
  ro = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  return ro;
}

function sndBMKReq__MODULE_ID__(ro,URL) {
  ro.open('GET',URL,true);
  ro.onreadystatechange = function (){
    if (ro.readyState == 4) {
      parseBMK__MODULE_ID__(ro.responseText);
    }
  }
  ro.send(null);
}

function sndEventReq__MODULE_ID__(ro,URL) {
  ro.open('get',URL);
  ro.onreadystatechange = function (){ if (ro.readyState == 4) parseEvent__MODULE_ID__(ro); }
  ro.send(null);
}

function sndCalAuth__MODULE_ID__(ro,URL) {
  ro.open('GET',URL,true);
  ro.onreadystatechange = function (){ if (ro.readyState == 4) parseCal__MODULE_ID__(ro); }
  ro.send(null);
}

// -- XMLhttpRequest

function CalAuth__MODULE_ID__(){
  var httpArq = createRequestObject__MODULE_ID__();
  statMessage__MODULE_ID__('Checking Authentication...',true);

  var eb = _gel("ebox__MODULE_ID__");
  if (_gel('qaStatus__MODULE_ID__').style.display == 'none' && eb.style.display == '') {
     eb.style.height = parseInt(eb.style.height) + 80;
     var calDIV = _gel('calendar_content__MODULE_ID__');
     if (parseInt(calDIV.style.height) < 130 && disHeight__MODULE_ID__ != -1) {
       calDIV.style.height = 130;
     }
  }
  _gel('qaStatus__MODULE_ID__').style.display = '';
  qastatMessage__MODULE_ID__('Checking Authorization',true);

  sndCalAuth__MODULE_ID__(httpArq,proto__MODULE_ID__ + "://" + domain__MODULE_ID__  + "/calendar");

}

function parseCal__MODULE_ID__(ro){
  var NL = _gel('eboxNL__MODULE_ID__');
  var T = _gel('eboxT__MODULE_ID__');

  if (ro.status == 200){
    var auth = new Array;
    auth = ro.getResponseHeader('Set-Cookie').split(";");
    CALRE = /[^=]*$/;
    CAL__MODULE_ID__ = CALRE.exec(auth[0]);
    T.style.display = '';
    NL.style.display = "none";
    qastatMessage__MODULE_ID__('Authentication Successful.',false);
  } else {
    CAL__MODULE_ID__ = "";
    T.style.display = 'none';
    NL.style.display = "";
    qastatMessage__MODULE_ID__('Authentication Failed',false);
    qastatMessage__MODULE_ID__('Please First Login To Google Calendar.',false);
  }
}

function deleteEvent(eID,title){

   var httprq = createRequestObject__MODULE_ID__();
   httprq.open('get', "http://" + domain__MODULE_ID__ + "/calendar/deleteevent?eid" + eID);
   httprq.send(null);
}


function createEntryBox__MODULE_ID__(){
  var eb = "";
  var ebox = newNode__MODULE_ID__('div');

  var eb = "<div id='ebox__MODULE_ID__' class='ebox__MODULE_ID__' style='display:none'>";
  eb += "<IMG onclick='javascript: closeQuickAdd__MODULE_ID__();' style='cursor:pointer;margin:3px' align=right src='" + imagePath__MODULE_ID__  + "close.gif'>";
  eb += "<form onsubmit='javascript: return submitEvent__MODULE_ID__()'>";
  eb += "<div style='margin:3px;color:#FFFFFF;font-size:10pt;overflow:hidden;display:none' id='eboxT__MODULE_ID__'>";
  eb += "Quick&nbsp;Add&nbsp;&nbsp;&nbsp;&nbsp;[<A style='color:#FFFFFF' href='https://www.google.com/calendar/event?action=TEMPLATE' target='_blank' "
     + " onclick='javascript: closeQuickAdd__MODULE_ID__(); return!open(this.href,this.target,\"width=600,height=500,scrollbars=no,resizable=yes,toolbar=no,menubar=no\")'>Detail&nbsp;Add</A>]";
  eb += "<TABLE cellpadding=0 cellspacing=0><TR>";
  eb += "<TD valign=middle><input type='text' id='addEventInfo__MODULE_ID__' name='addEventInfo__MODULE_ID__' onclick='javascript: clearQuickAdd__MODULE_ID__();' onkeypress='javascript: clearQuickAdd__MODULE_ID__();' style='width:185px' title='Enter New Event'>&nbsp;</TD>";
  eb += "<TD valign=middle><input type='image' title='Add Event' alt='Add Event' src='" + imagePath__MODULE_ID__  + "qa.gif'/></TD>";
  eb += "</TR></TABLE>";
  eb += "<FONT style='font-size:8pt'>&nbsp;&nbsp;e.g.,&nbsp;Lunch&nbsp;with&nbsp;Poobear&nbsp;tomorrow&nbsp;at&nbsp;noon</FONT>";
  eb += "</div>";
  eb += "</form>";
  eb += "<DIV id='eboxNL__MODULE_ID__' style='margin:3px;color:#FFFFFF;font-size:10pt;'>";
  eb += "Not Logged in.<BR>Attempt Authentication - <A onclick='javascript: newwin__MODULE_ID__ = open(this.href,this.target,\"width=1,height=1,scrollbars=no,resizable=yes,toolbar=no,menubar=no\"); setTimeout(function(){newwin__MODULE_ID__.close(); CalAuth__MODULE_ID__()} ,1000); return false;' href='https://www.google.com/calendar/event?action=TEMPLATE' target='_blank'>Click Here.</A>";
  eb += "</DIV>";
  eb += "<div id='qaStatus__MODULE_ID__' style='height:85px;display:none;margin:5px;color:#FFFFFF;font-size:8pt;overflow:hidden'>Contacting Google.</div>";
  eb += "</div>";


  ebox.innerHTML = eb;
  if (UPQevent__MODULE_ID__) _gel('quickAddI__MODULE_ID__').style.display = '';
  _gel("container__MODULE_ID__").appendChild(ebox);
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

function qastatMessage__MODULE_ID__(message,reset){
  _gel('qaStatus__MODULE_ID__').innerHTML  = _gel('qaStatus__MODULE_ID__').innerHTML + "<BR>";;
  if (reset) _gel('qaStatus__MODULE_ID__').innerHTML = "";
  _gel('qaStatus__MODULE_ID__').innerHTML = _gel('qaStatus__MODULE_ID__').innerHTML + message;
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

  var TDRE = /(.{4})(.{2})(.{2})T(.{2})(.{2})/;
  var startTS = TDRE.exec(response[0][4]);
  startTS = startTS[1] + "-" + startTS[2] + "-" +  startTS[3] + "T" + startTS[4] + ":" + startTS[5];
  startTS = TSfromISO__MODULE_ID__(startTS,0,false)

  if (!startTS) {
    qastatMessage__MODULE_ID__('>>> Event Format not recognized. <<<',false);
    return
  }

  var endTS = TDRE.exec(response[0][5]);
  endTS = endTS[1] + "-" + endTS[2] + "-" +  endTS[3] + "T" + endTS[4] + ":" + endTS[5];
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
   var URL = "http://" + domain__MODULE_ID__ + "/calendar/feeds/default/private/full";
   httprq.open('POST', URL, true);
   httprq.setRequestHeader('Authorization', 'GoogleLogin auth=' + CAL__MODULE_ID__);
   httprq.setRequestHeader('Content-type','application/atom+xml');

   httprq.onreadystatechange = function (){
     if (httprq.readyState == 4){
       if (httprq.status == 201){
         _gel('addEventInfo__MODULE_ID__').value = 'Enter new event |';
         _gel('addEventInfo__MODULE_ID__').focus();
         qastatMessage__MODULE_ID__("Google Submission Successful.",false);
         qastatMessage__MODULE_ID__(">>>> Module update will appear shortly",false);
       } else qastatMessage__MODULE_ID__('Error Submitting Event [' + httprq.status  + ']',false);
     }
   }
   httprq.send(eventXML);

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
  _gel('addEventInfo__MODULE_ID__').value = 'Enter new event |';
  _gel("DfeedS__MODULE_ID__").style.display = 'none';
  _gel('qaStatus__MODULE_ID__').style.display = 'none';
  resizeDIV__MODULE_ID__(1,260,1,true,"ebox__MODULE_ID__");
}

function closeQuickAdd__MODULE_ID__(){
  var eb = _gel("ebox__MODULE_ID__");
  _gel("DfeedS__MODULE_ID__").style.display = '';
  _gel('qaStatus__MODULE_ID__').style.display = 'none';
  var calDIV = _gel('calendar_content__MODULE_ID__');

  if (disHeight__MODULE_ID__ != -1) calDIV.style.height = disHeight__MODULE_ID__ + 'px';
  resizeDIV__MODULE_ID__(parseInt(eb.style.width),400,parseInt(eb.style.height),false,"ebox__MODULE_ID__");
}

function clearQuickAdd__MODULE_ID__(){
  _gel('qaStatus__MODULE_ID__').innerHTML = "";
  if (_gel('addEventInfo__MODULE_ID__').value == 'Enter new event |') _gel('addEventInfo__MODULE_ID__').value = "";
}

function resizeDIV__MODULE_ID__(width,widthM,height,grow,DIV){
  _gel(DIV).style.width = width;
  _gel(DIV).style.height = height;
  var wg = 25;
  var hg = 8;
  if (grow){
    width = width + wg;
    height = height + hg;
  } else {
    width = width - wg;
    height = height - hg;
  }
  if (width < 0) width = 0;
  if (width > 0 && width <= widthM){
    if (height > 60) height = 60;
    if (height < 1) height = 1;

    setTimeout('resizeDIV__MODULE_ID__(' + width + ',' + widthM + ',' + height + ',' + grow + ',"' + DIV + '")',1);
    return;
  }

  if (!grow) {
    _gel(DIV).style.display = 'none';
  } else postResize__MODULE_ID__(DIV);

}

function postResize__MODULE_ID__(DIV){
  if (DIV == "ebox__MODULE_ID__") _gel('addEventInfo__MODULE_ID__').focus();
}

//  -- infowindow

function createWindow__MODULE_ID__(){
  var infoWindow = newNode__MODULE_ID__('div');
  var imageA = new Array;
  imageA.push(imagePath__MODULE_ID__ + 'iw_n.png');
  imageA.push(imagePath__MODULE_ID__ + 'iw_e.png');
  imageA.push(imagePath__MODULE_ID__ + 'iw_s.png');
  imageA.push(imagePath__MODULE_ID__ + 'iw_w.png');
  imageA.push(imagePath__MODULE_ID__ + 'iw_c.png');
  imageA.push(imagePath__MODULE_ID__ + 'iw_nw.png');
  imageA.push(imagePath__MODULE_ID__ + 'iw_ne.png');
  imageA.push(imagePath__MODULE_ID__ + 'iw_sw.png');
  imageA.push(imagePath__MODULE_ID__ + 'iw_tap.png');
  imageA.push(imagePath__MODULE_ID__ + 'iw_se.png');

  var png = new Array;
  for(var iCount = 0; iCount < 10; iCount++){
    if (IE__MODULE_ID__){
      png[iCount] = "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + imageA[iCount] + ",sizingMethod=scale)"
    } else {
      png[iCount] = "background-image:url(" + imageA[iCount] + ")";
    }
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
  iw += "   src='" + imagePath__MODULE_ID__ + "close.gif'";
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

function checkClickArea__MODULE_ID__(event){
  var windowHeight = 152;
  var tailHeight = 96;
  var windowTop = parseInt(_gel('infowindow__MODULE_ID__').style.top);
  var clearArea = windowTop + windowHeight;

  var Y = (IE__MODULE_ID__) ? event.clientY + document.body.scrollTop : event.pageY;
  if (clearArea < Y) infoClose__MODULE_ID__();

}

function infoOpen__MODULE_ID__(self,event,eventO){
  var UPemail = prefs__MODULE_ID__.getInt('UPEMAIL');

  if (UPinfoWindow__MODULE_ID__){
    clearTimeout(iwTO__MODULE_ID__);
    iwEV__MODULE_ID__ = true;
    _gel('infowindow__MODULE_ID__').style.display = 'none';

    var X = event.clientX - 182;
    if (X > 696) X = 696;
    if (X < 3) X = 3;

    var offY = 0;
    if(show_feedSelect__MODULE_ID__ && IE__MODULE_ID__) _gel("DfeedS__MODULE_ID__").style.display = 'none';

    var Y = (IE__MODULE_ID__) ? event.clientY + document.body.scrollTop : event.pageY;
    Y = Y - 221 - offY;
    if (Y < -7) Y = -7;

/*
    var X = event.clientX - 182;
    if (X > 696) X = 696;
    if (X < 3) X = 3;
    var Y = event.clientY - 221;
    if (Y < -7) Y = -7;
*/

    _gel('infowindow__MODULE_ID__').style.top = Y  + 'px';
    _gel('infowindow__MODULE_ID__').style.left = X  + 'px';

    linebreak = (UPemail == 0) ? "<BR>" : "\n";

    var eID = eventO.feedID;
    var color = FeedList__MODULE_ID__[eID]['color'];
    if (color == "FFFFFF") color = defColor__MODULE_ID__;

    var URL = eventO.URL;
    var title = eventO.title;
    var linkTitle = "<A href='" + URL  + "' target='_blank' style='color:#" + color + ";font-weight:bold'>" + shrink__MODULE_ID__(title,22,'...') + "</A>";

    // linkTitle += "&nbsp;&nbsp;<FONT style='font-size:8pt;color:blue'>[<U>Delete</U>]</Font>";

    var location = eventO.location;
    var mapURL = "http://maps.google.com/maps?oi=map&q=" + location;
    var detail = eventO.detail;

    var td = formatDate__MODULE_ID__(eventO,false);
    var td = td['std'];
    td['day'] = td['day'].replace(/&nbsp;/,'')
    var date = dayLA__MODULE_ID__[td['day']] + ",&nbsp;" + td['mrange'] + td['drange'] + td['remainDate'] + ",&nbsp;" + td['year'] + " " + td['trange'];
    _gel('iwD__MODULE_ID__').innerHTML = date + "<BR><br style='line-height: 6px;'/>";

    date = date.replace(/&nbsp;/g," ");
    var body = linebreak + linebreak + title + " - " + date + linebreak;
    if (location.length != 0){
      body += "Where: " + location + linebreak + "Map: " + mapURL + linebreak;
      location = "<B>Where:</B>&nbsp;" + shrink__MODULE_ID__(location,22,'...') + "&nbsp;<FONT style='font-size:8pt'>[<A href='" + mapURL + "' target='_blank'>map</A>]</FONT>" + "<BR>";
    }
    body += linebreak;

    var author = FeedList__MODULE_ID__[eID]['author'];
    var email = FeedList__MODULE_ID__[eID]['email'];

    var fTitle = "<BR><A href='https://calendar.google.com' target='_blank' style='font-size:10pt;color:#" + color  + "'>" + FeedList__MODULE_ID__[eID]['title'] + "</A>";
    if (detail.length == 0) {
      detail = fTitle;
    } else {
      body += detail + linebreak + linebreak;
      detail = shrink__MODULE_ID__(eventO.detail,145,'...');
    }

    _gel('iwT__MODULE_ID__').innerHTML = linkTitle + "<BR>";
    _gel('iwW__MODULE_ID__').innerHTML = location;

    title = escape(title);
    if (email.length != 0 && author.length != 0) email = "&nbsp;[<A href='https://mail.google.com/mail?view=cm&tf=0&to=" + email  + "&su=RE:%20" + title  + "' target='_blank' onclick='return!open(this.href,this.target,\"width=600,height=560,scrollbars=no,resizable=yes,toolbar=no,menubar=no\")'>" + shrink__MODULE_ID__(email,18,'...') + "</A>]";
    author = author + email;
    if (author.length != 0) author = "<B>Author:</B>&nbsp;" + author;
    _gel('iwA__MODULE_ID__').innerHTML = author;

    _gel('iwS__MODULE_ID__').style.borderTop = '1px solid #' + color;

    body = escape(body);
    emailTo = "[<A  style='font-size:8pt' href='https://mail.google.com/mail?view=cm&tf=0&su=[GCal Event]%20" + title  + "&body=" + body  + "' target='_blank' onclick='return!open(this.href,this.target,\"width=600,height=560,scrollbars=no,resizable=yes,toolbar=no,menubar=no\")'>Email</A>]&nbsp;";
    _gel('iwI__MODULE_ID__').innerHTML = emailTo + detail;

    _gel('infowindow__MODULE_ID__').style.display = '';

     iwTO__MODULE_ID__ = setTimeout(function(){iwEV__MODULE_ID__ = false;},500);
  }

}

function infoClose__MODULE_ID__(){
  if (!UPinfoWindow__MODULE_ID__ || iwEV__MODULE_ID__ == -1) return;
  if (iwEV__MODULE_ID__ || _gel('infowindow__MODULE_ID__').style.display == 'none') return;
  _gel('infowindow__MODULE_ID__').style.display = 'none';
  _gel("DfeedS__MODULE_ID__").style.display = '';
}

// -- end infowindow

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
  if (ttDIV.style.display == '' || UPcolorCode__MODULE_ID__ == 0 || colorCode == 'FFFFFF') return;

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


// -- end remote script
