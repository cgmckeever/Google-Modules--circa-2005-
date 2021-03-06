/*

Google Module for Google Calendar
Chris McKeever - 2006 cgmckeever@r2unit.com

inspired by GMail Agenda and Paul Russell's gcal module.
http://www.r2unit.com/greasemonkey/
http://russelldad.googlepages.com/mygooglehomepagemodules


*/

function initialize__MODULE_ID__(){
  // define global

  domain__MODULE_ID__ = document.domain;
  feed_change__MODULE_ID__ = false; 
  deflen__MODULE_ID__ = 25; // default length of text units
  EventList__MODULE_ID__ = new Array;  // Array of events
  FeedList__MODULE_ID__ = new Array; // track of feed pulls
  XmlErrorOccurred__MODULE_ID__ = false;  // tinydom parser
  TO__MODULE_ID__ = "";
  haltScript__MODULE_ID__ = false;
  overlayHeight__MODULE_ID__ = 60;
  defColor__MODULE_ID__ = '627487';
  reqID__MODULE_ID__ = 0;
  feedID__MODULE_ID__ = 0;
  autoSet__MODULE_ID__ = false;

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
  // feed parameters

  start_maxTS__MODULE_ID__ = nowTS__MODULE_ID__ + (1000 * 60 * 60 * 24) * dayForward__MODULE_ID__;
  start_max__MODULE_ID__ = parseDate__MODULE_ID__(start_maxTS__MODULE_ID__);
  if (start_max__MODULE_ID__['month'].toString().length == 1) start_max__MODULE_ID__['month'] = "0" + start_max__MODULE_ID__['month'];
  if (start_max__MODULE_ID__['date'].toString().length == 1) start_max__MODULE_ID__['date'] = "0" + start_max__MODULE_ID__['date'];
  start_max__MODULE_ID__ = start_max__MODULE_ID__['year'] + "-" + start_max__MODULE_ID__['month'] + "-" + start_max__MODULE_ID__['date']

  start_minTS__MODULE_ID__ = nowTS__MODULE_ID__ - (45 * 24 * 60 * 60 * 1000) // look back days
  start_min__MODULE_ID__ = parseDate__MODULE_ID__(start_minTS__MODULE_ID__);
  if (start_min__MODULE_ID__['month'].toString().length == 1) start_min__MODULE_ID__['month'] = "0" + start_min__MODULE_ID__['month'];
  if (start_min__MODULE_ID__['date'].toString().length == 1) start_min__MODULE_ID__['date'] = "0" + start_min__MODULE_ID__['date'];
  start_min__MODULE_ID__ = start_min__MODULE_ID__['year'] + "-" + start_min__MODULE_ID__['month'] + "-" + start_min__MODULE_ID__['date']

  // end global declarations 

  formatPrefContent__MODULE_ID__(); // reformat Gmods

  if(feed_url__MODULE_ID__ == '' && feed_bmk__MODULE_ID__ == ''){
    _gel('start_content__MODULE_ID__').style.display = '';
    return;
  }else{
    _gel('start_content__MODULE_ID__').style.display = 'none';

    if (prefs__MODULE_ID__.getBool('DDISABLE')){
      statMessage__MODULE_ID__("Module Disabled <FONT style='font-size:8pt;color:grey'>(v" + version__MODULE_ID__  + ")</FONT>&nbsp;&nbsp;<FONT style='font-size:8pt;text-decoration:underline;color:grey' onclick='javascript: enableModule__MODULE_ID__();'>Enable</FONT>",true)
      _gel('status_content__MODULE_ID__').style.display = '';   
      return;
    }

    if(UPtoday__MODULE_ID__ || UPclock__MODULE_ID__ != 0) datetime__MODULE_ID__();
    _gel('status_content__MODULE_ID__').style.display = '';
    _gel('status_content__MODULE_ID__').innerHTML = "";

    if (feed_bmk__MODULE_ID__ == ''){
      parseBMK__MODULE_ID__('')
    } else {
      // get it from bookmarks
      var bmkURL = "http://" + domain__MODULE_ID__  + "/bookmarks/lookup?q=label:" + feed_bmk__MODULE_ID__  + "&sort=title";
      var httprq = createRequestObject__MODULE_ID__();
      statMessage__MODULE_ID__('Retrieving Bookmarks...',true);
      sndBMKReq__MODULE_ID__(httprq,bmkURL);
      TO__MODULE_ID__ = setTimeout(function(){bmkFail__MODULE_ID__(bmkURL)},5000);
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

  var feed_url = feed_url + "?start-max=" + start_max__MODULE_ID__ + "&start-min=" +  start_min__MODULE_ID__;
  feed_url = feed_url.replace(' ','');

//   FeedList__MODULE_ID__[feedID]['cache'] = 1;
//   processFeed__MODULE_ID__("",feedID);
//   return;
  _IG_FetchContent(feed_url,processFeed__MODULE_ID__);
}

function prepareFeed__MODULE_ID__(feedID,where){
  _gel('status_content__MODULE_ID__').style.display = '';
//	alert(feedID + "\n" + where);
  feed_change__MODULE_ID__ = false;

  if (feedID > FeedList__MODULE_ID__.length - 1){
    feedID__MODULE_ID__ = 0;
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
        FeedList__MODULE_ID__[feedID]['cache'] == true) statMessage__MODULE_ID__('Cached Calendar: ' + FeedList__MODULE_ID__[feedID]['label'],false);
    feedID__MODULE_ID__ = feedID + 1
    prepareFeed__MODULE_ID__(feedID__MODULE_ID__,"prepare - next");
  }

}

function processFeed__MODULE_ID__(feedXML){
  var responseDOM = new XMLDoc(feedXML, function(error){if(XmlErrorOccurred__MODULE_ID__ == false) XmlErrorOccurred__MODULE_ID__ = true;});

  if ( responseDOM == null || responseDOM.docNode == null){
    // if it was a rewrite try sending original
    if (feed_change__MODULE_ID__ == true){
      // resend it
       statMessage__MODULE_ID__("<FONT style='color:gray;font-size:.8em;'>Full Feed Unsuccssful. Attempting Basic.</FONT>",false);
      getFeed__MODULE_ID__(feedID__MODULE_ID__);
      return;
    }
    // otherwise status fail and move on
    statMessage__MODULE_ID__("<FONT style='color:gray;font-size:.8em;'>The response from Google contained invalid XML.</FONT>",false);
    feedID__MODULE_ID__++;
    prepareFeed__MODULE_ID__(feedID__MODULE_ID__ + 1,"process - fail - next");
    return;
  } 

  calTitle = shrink__MODULE_ID__(responseDOM.docNode.getElements("title")[0].getText(),20,'');
  FeedList__MODULE_ID__[feedID__MODULE_ID__]['title'] = 'GCal - ' + calTitle;
  parseCalendarXML__MODULE_ID__(responseDOM,feedID__MODULE_ID__)
  FeedList__MODULE_ID__[feedID__MODULE_ID__]['cache'] = true;

  feedID__MODULE_ID__++
  prepareFeed__MODULE_ID__(feedID__MODULE_ID__,"process - next");

}

function parseBMK__MODULE_ID__(bmkHTML){
  clearTimeout(TO__MODULE_ID__); //stop timeout
  if (haltScript__MODULE_ID__) return;
  var Ptable =_gel("m___MODULE_ID___form").firstChild.firstChild.firstChild;
  if (!Ptable) return;

  // labels
  var tRE = bmkHTML.match(/bkmk_href[^ >]+>([^<]*)/g);
  // urls
  var uRE = bmkHTML.match(/\.\/url[^ \n\r"]+(?=.*id=bkmk_href)/g);
  var cRE = /(.+)(#)(.*)/;

  var title;
  var url;
  var color;
  var feedCount = 0;
  var rowOffset = 22;

  // dropdown creation
  var selectedI = 0;
  var checked = "";
  var optionBox = newNode__MODULE_ID__('select');
  optionBox.id = 'feedS__MODULE_ID__';
  optionBox.onchange = setFeed__MODULE_ID__;
  var DoptionBox = newNode__MODULE_ID__('select');
  DoptionBox.id = 'DfeedS__MODULE_ID__';
  DoptionBox.onchange = selectFeed__MODULE_ID__;

  UPFeedView = UPFeedView__MODULE_ID__.split('');

  var legendHTML = "<TABLE width='100%'><TR><TD align=right><TABLE cellspacing=0 cellpadding=0 border=0>";

  if (feed_url__MODULE_ID__ != ''){ 
    colorA__MODULE_ID__[defColor__MODULE_ID__] = 1;
    color = defColor__MODULE_ID__;
    optionBox[feedCount] = new Option('Single Feed',feed_url__MODULE_ID__);
    DoptionBox[feedCount] = new Option('Single Feed',feed_url__MODULE_ID__);
    FeedList__MODULE_ID__[feedCount] = new Array;
    FeedList__MODULE_ID__[feedCount]['label'] = 'Single Feed';
    FeedList__MODULE_ID__[feedCount]['url'] = feed_url__MODULE_ID__;
    FeedList__MODULE_ID__[feedCount]['color'] = color;
    FeedList__MODULE_ID__[feedCount]['cache'] = false;
    FeedList__MODULE_ID__[feedCount]['request'] = false;
    checked = "";
    if (UPFeedView[feedCount] == '1'){
      selectedI = feedCount;
      checked = "checked";
      FeedList__MODULE_ID__[feedCount]['request'] = true;
    } 
    legendHTML += "<TR><TD width=25px class='rTDleft__MODULE_ID__' style='background:#" + color + "'><INPUT type=checkbox " + checked  + " id='" + feedCount + "CB__MODULE_ID__' onclick='javascript: legendSelect__MODULE_ID__(" + feedCount + ")'></TD><TD class='rTDright__MODULE_ID__' style='background:#" +  color + ";color:#FFFFFF;font-size:8pt'>Single Feed&nbsp</TD></TR><TR><TD colspan=2 style='font-size:4'>&nbsp;</TD></TR>";
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
      optionBox[feedCount] = new Option(title,url[0]);
      DoptionBox[feedCount] = new Option(title,url[0]);
      FeedList__MODULE_ID__[feedCount] = new Array;
      FeedList__MODULE_ID__[feedCount]['label'] = title;
      FeedList__MODULE_ID__[feedCount]['url'] = url[0];
      FeedList__MODULE_ID__[feedCount]['color'] = color;
      FeedList__MODULE_ID__[feedCount]['cache'] = false;
      FeedList__MODULE_ID__[feedCount]['request'] = false; 
      checked = "";
      if (UPFeedView[feedCount] == '1'){
        selectedI = feedCount;
        checked = "checked";
        FeedList__MODULE_ID__[feedCount]['request'] = true;
      }
      legendHTML += "<TR><TD width=25px class='rTDleft__MODULE_ID__' style='background:#" + color + "' onclick='javascript: legendSelect__MODULE_ID__(" + feedCount + ")'><INPUT type=checkbox " + checked  + " id='" + feedCount + "CB__MODULE_ID__'></TD><TD class='rTDright__MODULE_ID__' style='background:#" +  color + ";color:#FFFFFF;font-size:8pt'>" + title  + "&nbsp</TD></TR><TR><TD colspan=2 style='font-size:4'>&nbsp;</TD></TR>";
      overlayHeight__MODULE_ID__ += rowOffset;;
      feedCount++;
      statMessage__MODULE_ID__('Found: ' + title,false); 
    }
  
    // EDIT dropdown
    var tr = newNode__MODULE_ID__("tr");
    var td = newNode__MODULE_ID__("td");
    td.innerHTML = "<FONT style='font-size:10pt;'>Default</FONT>";
    td.setAttribute("align","right");
    tr.appendChild(td);
    td = newNode__MODULE_ID__("td");
    td.innerHTML = "&nbsp;";
    td.appendChild(optionBox);
    tr.appendChild(td);

    if (prefFormat__MODULE_ID__){
      Ptable.insertBefore(tr,Ptable.childNodes[prefCount__MODULE_ID__ - 2])
      Ptable.childNodes[prefCount__MODULE_ID__ - 2].style.display = 'none';  // UI change
      prefCount__MODULE_ID__++;
      Ptable.childNodes[prefCount__MODULE_ID__].style.display = ''; // quick select info
      Ptable.childNodes[prefCount__MODULE_ID__ - 1].style.display = '';  // quick select
      Ptable.childNodes[prefCount__MODULE_ID__ - 2].style.display = ''; // color code
    }

    var feedDiv = _gel("feedDIV__MODULE_ID__");
    feedDiv.appendChild(DoptionBox);
    if(show_feedSelect__MODULE_ID__) feedDiv.style.display = '';

  } else show_feedSelect__MODULE_ID__ = false;  // since it defaults to true in the edit area

  legendHTML += "</TABLE></TD></TR></TABLE>";
  _gel('legendDIV__MODULE_ID__').innerHTML = legendHTML; 

  optionBox.selectedIndex = selectedI;
  DoptionBox.selectedIndex = selectedI;
  if (feedCount == 1) {
    // no arrow, no color code, set 0 as requested and checked
    _gel("0CB__MODULE_ID__").checked = true;
    FeedList__MODULE_ID__[0]['request'] = true;
    FeedList__MODULE_ID__[0]['color'] = "FFFFFF";
  } else if (selectedI == 0) {
   // make sure that 0 is selected
    _gel("0CB__MODULE_ID__").checked = true;
    FeedList__MODULE_ID__[0]['request'] = true;
    _gel("arrowC__MODULE_ID__").style.display = "";
  } else _gel("arrowC__MODULE_ID__").style.display = "";

  prepareFeed__MODULE_ID__(0,"intial");

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
    _gel("feedDIV__MODULE_ID__").style.display = "none";

    var contHeight = overlayHeight__MODULE_ID__ + 5;
    if (contHeight > parseInt(calDIV.style.height) || disHeight__MODULE_ID__ == -1) {
      calDIV.style.height = contHeight ;
    }
    overlayDIV.style.display = legendDIV.style.display = "";
    overlayDIV.style.height = overlayHeight__MODULE_ID__ + 'px';
  } else {
    _gel("arrowO__MODULE_ID__").style.display = "none";
    _gel("arrowC__MODULE_ID__").style.display = "";
    if(show_feedSelect__MODULE_ID__) _gel("feedDIV__MODULE_ID__").style.display = '';
    if (disHeight__MODULE_ID__ == -1){
      calDIV.style.height = "";
    } else calDIV.style.height = disHeight__MODULE_ID__ + 'px';;
    overlayDIV.style.display = legendDIV.style.display = "none";
  }
}

function legendSelect__MODULE_ID__(feedID){
  if (autoSet__MODULE_ID__) return;
  reqID__MODULE_ID__++;
  FeedList__MODULE_ID__[feedID]['request'] = (_gel(feedID + "CB__MODULE_ID__").checked) ? true : false;
  clearTimeout(TO__MODULE_ID__);
  TO__MODULE_ID__ = setTimeout("checkRequest__MODULE_ID__(" + reqID__MODULE_ID__ + ")",1000);
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
  if (_gel("feedDIV__MODULE_ID__").style.display == 'none') return; 
  var DoptionFeed = _gel("DfeedS__MODULE_ID__");
  var optionFeed = _gel("feedS__MODULE_ID__");
  optionFeed.selectedIndex = DoptionFeed.selectedIndex;
  _gel('status_content__MODULE_ID__').innerHTML = '';
  setFeed__MODULE_ID__(true);
  prepareFeed__MODULE_ID__(0,"Select - First");
}


function setFeed__MODULE_ID__(single){
// determines check state and sets hidden UP
  var optionFeed = _gel("feedS__MODULE_ID__");
  var feedView = "";  
  autoSet__MODULE_ID__ = true;
 
  for (var feedI = 0; feedI < FeedList__MODULE_ID__.length; feedI++){
    if (single && feedI != optionFeed.selectedIndex){
      feedView += '0';
      FeedList__MODULE_ID__[feedI]['request'] = false;
      _gel(feedI + "CB__MODULE_ID__").checked = false;      
    } else if (single && feedI == optionFeed.selectedIndex){
      feedView += '1';
      FeedList__MODULE_ID__[feedI]['request'] = true;
      _gel(feedI + "CB__MODULE_ID__").checked = true;
    } else {
      feedView += (_gel(feedI + "CB__MODULE_ID__").checked) ? 1 : 0;
    }
  }

  prefs__MODULE_ID__.set('UPFEEDVIEW',feedView);
  prefs__MODULE_ID__.getString('UPFEEDVIEW');

  autoSet__MODULE_ID__ = false; 
}

function parseCalendarXML__MODULE_ID__(responseDOM,evFeedID){
  statMessage__MODULE_ID__('Loading ' + FeedList__MODULE_ID__[evFeedID]['label'],false);
 
  calTitle__MODULE_ID__ = 'GCal - ' + shrink__MODULE_ID__(responseDOM.docNode.getElements("title")[0].getText(),20,'');

  var feedAuthor = responseDOM.docNode.getElements("author")[0];
  if (feedAuthor.length != 0) {
    feedAuthor = feedAuthor.getElements("email")[0];
    if (feedAuthor) feedAuthor = feedAuthor.getText();
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
  var evAuthor;
  var evTitle;
  var evStartTS;
  var evEndTs;
  var evURL;
  var evLocation;
  var evRepeatTS;
  var evRepeatInt;
  var evRepeatType;
  var evRepeatByDay;

  var idRE = /[^\/]*$/;

  for (var eventNode = 0; eventNode < eventNodes.length; ++eventNode){
    aEvent = new Array;
    evId = idRE.exec(eventNodes[eventNode].getElements("id")[0].getText());

    evTitle = shrink__MODULE_ID__(eventNodes[eventNode].getElements("title")[0].getText(),deflen__MODULE_ID__,"...");
    evURL = eventNodes[eventNode].getElements("link")[0].getAttribute('href');

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
      evAuthor = evAuthor.getElements("email")[0];
      if (evAuthor) evAuthor = evAuthor.getText(); 
    }

    whoNodes = eventNodes[eventNode].getElements("gd:who");  
    for (var whoI = 0; whoI < whoNodes.length; ++whoI){
      attd = whoNodes[whoI].getAttribute('valueString');
      if (whoNodes[whoI].getElements("gd:attendeeStatus")[0].getAttribute('value').match(/.declined/)
         && attd == feedAuthor && evAuthor != feedAuthor && !ShowDecline__MODULE_ID__) evCancelled = true;
    }


    evRepeatTS = "";
    evRepeatInt = "";
    evRepeatType = "";
    evRepeatByDay = "";

    if (whenNodes.length > 0){  
      // normal event node
      aEvent = new Array;
      evLocation = shrink__MODULE_ID__(eventNodes[eventNode].getElements('gd:where')[0].getAttribute('valueString'),deflen__MODULE_ID__,"...");

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
      evLocation = shrink__MODULE_ID__(eventNodes[eventNode].getElements('gd:where')[0].getAttribute('valueString'),deflen__MODULE_ID__,"...");
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
        evLocation = shrink__MODULE_ID__(evLocation[1],deflen__MODULE_ID__,"...")
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
        evStartTS = TSfromString__MODULE_ID__(startPrefix,sumText,1,"+07:00",false);
        evEndTS = TSfromString__MODULE_ID__("to",sumText,1,"+07:00",true);
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
        addEvent__MODULE_ID__(new CalendarEvent__MODULE_ID__(evId,evTitle,evStartTS,evEndTS,evURL,evLocation,evRepeatTS,evRepeatType,evRepeatInt,evRepeatByDay));  
      } else { 
        // loop the when node results and add
        for (var aWheni = 0; aWheni < aEvent.length; aWheni++){ 
          TSx = parseInt(aEvent[aWheni]['evStartTS']); // shorthand
          if (new Date(aEvent[aWheni]['evEndTS']).getTime() != aEvent[aWheni]['evEndTS']) aEvent[aWheni]['evEndTS'] = TSx;
          if (!aParent[originalID][TSx]['cancelled'] && !aParent[originalID][TSx]['added']){
            // check that the eventtime isnt a cancelled child
            aParent[originalID][parseInt(TSx)]['added'] = true;
            addEvent__MODULE_ID__(new CalendarEvent__MODULE_ID__(evId,evFeedID,evTitle,aEvent[aWheni]['evStartTS'],aEvent[aWheni]['evEndTS'],evURL,evLocation,evRepeatTS,evRepeatType,evRepeatInt,evRepeatByDay));
          } 
        }
      }
    } 

  } // event loops  

}


function CalendarEvent__MODULE_ID__(id,feedID,title,startTS,endTS,URL,location,repeatTS,repeatType,repeatInt,repeatByDay){
  this.id = id;
  this.feedID = feedID;
  this.title = title;
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
  var Uhighlight = prefs__MODULE_ID__.getBool('HIGHLIGHT_TODAY');
  var displayFont = prefs__MODULE_ID__.getString('DISPLAY_FONT'); 
  var Dmonth = prefs__MODULE_ID__.getBool('DMONTH');
  var Ddate = prefs__MODULE_ID__.getBool('DDATE');
  var Dday_of_week = prefs__MODULE_ID__.getBool('DDAY_OF_WEEK');
  var Dyear = prefs__MODULE_ID__.getBool('DYEAR');
  var Dtime = prefs__MODULE_ID__.getInt('DTIME');
  var Dlocation = prefs__MODULE_ID__.getBool('DLOCATION');
  var Dsingle = prefs__MODULE_ID__.getBool('DSINGLE');
  var UPcolorCode = prefs__MODULE_ID__.getBool('UPCOLORCODE');

  var calDIV = _gel('calendar_content__MODULE_ID__');
  var evDIV;
  var evHTML = "";
  var event; var summary; var tT; var std; var etd;

  var now = monthA__MODULE_ID__[nowParse__MODULE_ID__['month']] + " " + nowParse__MODULE_ID__['date'] + " " + nowParse__MODULE_ID__['year']; 
  var rightNow = new Date().getTime();
  var highlight;

  var eCount = 0;
  var events = eventA.length;  
  var eI = 0;

  evHTML = "<TABLE cellspacing=0 cellpadding=0 border=0 width='99%'>";
  var colspan;
  var modTitle = "";
  while (eCount < max_display && eI < events){
    event = eventA[eI];    
    eI++;
    if (FeedList__MODULE_ID__[event.feedID]['request'] == true){
      eCount++;

      if (modTitle != "" && modTitle != FeedList__MODULE_ID__[event.feedID]['title']){
        // different event titles
        modTitle = "GCal - Multi-view";
      } else modTitle = FeedList__MODULE_ID__[event.feedID]['title'];

      summary = event.title;
      summary = "<A class='gcalItem' href='" + event.URL  + "' target='_blank'>" + summary + "</A>";
      if (Dlocation) summary = summary + "<BR>" + event.location;

      std = parseDate__MODULE_ID__(event.startTS);
      etd = parseDate__MODULE_ID__(event.endTS);

      std['d'] = monthA__MODULE_ID__[std['month']] + " " + std['date'] + " " + std['year'];
      etd['d'] = monthA__MODULE_ID__[etd['month']] + " " + etd['date'] + " " + etd['year'];

      if (nowDate__MODULE_ID__ > new Date(event.startTS) && Uhighlight){
        highlight = "GgcalItem__MODULE_ID__";
      } else if (now == std['d'] && Uhighlight){
        var NstartTS = event.startTS - (60 * 60 * 1000); 
        var NendTS = event.endTS + (30 * 60 * 1000); 
        if (rightNow >= NstartTS && rightNow <= NendTS) {
          // coming up soon
          highlight = "NgcalItem__MODULE_ID__";
        } else highlight = "HgcalItem__MODULE_ID__";
      } else highlight = "gcalItem__MODULE_ID__";

      var style = "valign=top class='" + highlight + "' style='font-size:" + displayFont + "pt'";
      var colorCode = "FFFFFF";
      if (UPcolorCode) colorCode = FeedList__MODULE_ID__[event.feedID]['color'];
      var evStyle = "style='background:#" + colorCode  + ";font-size:2pt;'";   

      // try to remove some of the dead space in the table
      std['month'] = monthA__MODULE_ID__[std['month']].substring(0,3) + "&nbsp;";
      std['day'] = dayA__MODULE_ID__[std['day']] + "&nbsp;";
      std['year'] = "&nbsp;" + std['year'];
      std['remainDate'] = "";

      etd['month'] = monthA__MODULE_ID__[etd['month']].substring(0,3) + "&nbsp;";
      etd['day'] = dayA__MODULE_ID__[etd['day']] + "&nbsp;";
      etd['year'] = "&nbsp;" + etd['year'];

      if (!Dday_of_week){
        std['day'] = "";
        etd['day'] = "";
      }

      if (!Dmonth){
        std['month'] = "";
        etd['month'] = "";
      }

      if (!Ddate){
        std['date'] = "";
        etd['date'] = "";
        std['month'] = std['month'].replace(/&nbsp;/,'');
        etd['month'] = etd['month'].replace(/&nbsp;/,'');
      }

      if (!Dyear) {
        std['year'] = "";
        etd['year'] = "";
      }

      std['t'] = "";
      etd['t'] = "";

      if (Dtime == 1){
        var AMPM = "a";

        if(std['hour'] > 12){
          AMPM = "p";
          std['hour'] = std['hour'] - 12;
        } else if (std['hour'] == 0){
          AMPM = "a";
          std['hour'] = "12";
        } else if (std['hour'] == 12){
          AMPM = "p"; 
        } else if (std['hour'].toString().substring(0,1) == "0"){
          std['hour'] = std['hour'].toString().substring(1,2);
        }

        std['t'] = std['hour'] + ":" + std['minute'] + AMPM;

        if(etd['hour'] > 12){
          AMPM = "p";
          etd['hour'] = etd['hour'] - 12;
        } else if (etd['hour'] == 0){
          AMPM = "a";
          etd['hour'] = "12";
        } else if (etd['hour'] == 12){
          AMPM = "p";
        } else if (etd['hour'].toString().substring(0,1) == "0"){
           etd['hour'] = etd['hour'].toString().substring(1,2);
        }

        etd['t'] = etd['hour'] + ":" + etd['minute'] + AMPM;

      } else if (Dtime == 2) {
        std['t'] = std['hour'] + ":" + std['minute'];
        etd['t'] = etd['hour'] + ":" + etd['minute'];
      }

      if (Dsingle){
       colspan = 8;
      }else colspan = 7;
 
      if (std['d'] != etd['d']){
        if ( (std['t'] == "12:00a" && etd['t'] == "11:59p") || (std['t'] == "00:00" && etd['t'] == "23:59") ){
          std['t'] = "";
          etd['t'] = "";
        }

        if(Dsingle){
          // force single line format
          if (std['date'] == ""){
            if (std['month'] != etd['month']) std['month'] = std['month'] + "~" + etd['month'];
          } else {
            if (std['month'] == etd['month']){
              std['remainDate'] = "~" + etd['date'];
            } else {
              std['remainDate'] = "~" + etd['month'] + etd['date'];
            }          
          }

          if (etd['t'] != ""){
            std['t'] = std['t'] + "~" + etd['t'];
          }
        }
 
        evHTML += "<TR>" 
               + "<TD " +  evStyle + ">&nbsp;&nbsp;</TD>"
               + "<TD " +  style + ">&nbsp;" + std['day'] + "</TD>" 
               + "<TD " +  style + ">" + std['month'] + "</TD>" 
               + "<TD " +  style + " align=right>" + std['date'] + "</TD>";
        if (Dsingle) evHTML += "<TD " +  style + ">" + std['remainDate'] + "</TD>";
        evHTML += "<TD " +  style + ">" + std['year'] + "</TD>" 
               + "<TD " +  style + ">&nbsp;" + std['t'] + "</TD>" 
               + "<TD " +  style + " rowspan=2>&nbsp;&nbsp;</TD>" 
               + "<TD " +  style + " rowspan=2 width='100%'>" + summary + "</TD></TR>";

        if (!Dsingle)
          evHTML += "<TR>" 
                 + "<TD " +  evStyle + ">&nbsp;&nbsp;</TD>"
                 + "<TD " +  style + ">&nbsp;" + etd['day'] + "</TD>" 
                 + "<TD " +  style + ">" + etd['month'] + "</TD>" 
                 + "<TD " +  style + " align=right>" + etd['date'] + "</TD>" 
                 + "<TD " +  style + ">" + etd['year'] + "</TD>" 
                 + "<TD " +  style + ">&nbsp;" + etd['t'] + "</TD></TR>";

      }else{
        if ((std['t'] != '12:00a' && etd['t'] != '11:59p')
             && (std['t'] != '00:00' && etd['t'] != '23:59') && std['t'] != '' && etd['t'] != '') std['t'] = std['t'] + "~" + etd['t'];
        if (std['t'] == "12:00a" || std['t'] == '00:00') std['t'] = "";
        evHTML += "<TR>" 
               + "<TD " +  evStyle + ">&nbsp;&nbsp;</TD>"
               + "<TD " +  style + ">&nbsp;" + std['day'] + "</TD>" 
               + "<TD " +  style + ">" + std['month'] + "</TD>" 
               + "<TD " +  style + " align=right>" + std['date'] + "</TD>";
        if (Dsingle) evHTML += "<TD " +  style + "></TD>";
        evHTML += "<TD " +  style + ">" + std['year'] + "</TD>" 
               + "<TD " +  style + ">&nbsp;" + std['t'] + "</TD>" 
               + "<TD " +  style + ">&nbsp;&nbsp;</TD>"
               + "<TD width='100%' " +  style + ">" + summary + "</TD></TR>";
      
      }

      style = "valign=top class='" + highlight + "' style='font-size:2pt'";
      evHTML += "<TR><TD " +  evStyle + ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</TD><TD " +  style + " colspan=" + colspan  + ">&nbsp;</TD></TR>";
    } // if it is a selected event
  } // while events are available

  evHTML += "</TABLE>";

  if (eCount == 0){
    if (modTitle == '') modTitle = "Google Calendar";
    calDIV.innerHTML = "<B>No Events Found.</B>";
  } else {
    calDIV.innerHTML = evHTML;
  }
 
  _gel("m___MODULE_ID___url").innerHTML = modTitle; 

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
  var gmtPosition = nowParse__MODULE_ID__['gmtPosition'];
  var gmtPosition = "-";

  /* really strange
  var gmtPosition = "+";
  var gmtOffset = oRE.exec(ISO);
  if (gmtOffset && ISO.length > 10) gmtPosition = gmtOffset[1];
  */

  var timeAdjust = 0;

  if (date){
    if (time){
      time = time[2];
    } else {
      gmtOffset = false;
      offset = 0;
      if (gmtPosition == "+"){
         if (isEnd) {
           timeAdjust = -1;
           time =  "23:59";
         } else time =  "00:00";
      } else {
         if (!isEnd) {
           timeAdjust = 1;
           time =  "00:00";
         } else time =  "23:59";
      }  
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

function datetime__MODULE_ID__(){
  var now = "";
  var nowDate = parseDate__MODULE_ID__(new Date().getTime());
  var refresh = true;

  if (UPclock__MODULE_ID__ == 1){
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

  
  if (UPtoday__MODULE_ID__ && UPclock__MODULE_ID__ != 0){ 
    now = dayLA__MODULE_ID__[dayA__MODULE_ID__[nowDate['day']]] + " " + monthA__MODULE_ID__[nowDate['month']] + " " + nowDate['date'] + ", " + nowDate['year'] + " - " + nowDate['hour'] + ":" + nowDate['minute'] + ":" + nowDate['second'];
  } else if (UPtoday__MODULE_ID__ && UPclock__MODULE_ID__ == 0) {
    now = dayLA__MODULE_ID__[dayA__MODULE_ID__[nowDate['day']]] + " " + monthA__MODULE_ID__[nowDate['month']] + " " + nowDate['date'] + ", " + nowDate['year'];
    refresh = false;
  } else now =nowDate['hour'] + ":" + nowDate['minute'] + ":" + nowDate['second'];

  _gel('date_content__MODULE_ID__').innerHTML = "<CENTER>" + now + "</CENTER>";
  _gel('date_content__MODULE_ID__').style.display = '';

  if (refresh) setTimeout("datetime__MODULE_ID__()", 1000); 


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
  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[prefAdd],"<FONT style='font-weight:bold;font-size:10pt;'>Preferences:</FONT>&nbsp;<FONT style='font-size:8pt;text-decoration:underline;color:blue' onclick='javascript: toggleNode__MODULE_ID__(" + FS  + "," + LS + ");'>Setup</FONT>",false);
  prefAdd ++;

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LS],"<FONT style='font-weight:bold;font-size:8pt;color:gray'>(Removes events that have ended for today.)</FONT>",false);
  prefAdd ++;

  var FTD = LS + 2;
  LDpref__MODULE_ID__ =  LDpref__MODULE_ID__ + prefAdd;
  LSpref__MODULE_ID__ = LSpref__MODULE_ID__ + prefAdd;
  var LTD = LDpref__MODULE_ID__ + 2; // number of added TD prefs
  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LSpref__MODULE_ID__ + 1],"<BR><FONT style='font-weight:bold;font-size:10pt;'>Time/Date Display:</FONT>&nbsp;<FONT style='font-size:8pt;text-decoration:underline;color:blue' onclick='javascript: toggleNode__MODULE_ID__(" + FTD  + "," + LTD + ");'>Setup</FONT>",false);
  prefAdd ++;
  LDpref__MODULE_ID__ ++;

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LDpref__MODULE_ID__ + 1],"<FONT style='font-weight:bold;font-size:8pt;color:gray'>(sets&nbsp;multiple&nbsp;dates&nbsp;to&nbsp;single&nbsp;line&nbsp;'Apr&nbsp;20-22')</FONT>",false);
  prefAdd ++;
  LDpref__MODULE_ID__ ++;

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LDpref__MODULE_ID__ + 1],"<BR><FONT style='font-weight:bold;font-size:10pt;'>Calendar&nbsp;Feed:</FONT>&nbsp;<A href='http://www.google.com/support/calendar/bin/answer.py?answer=37648&topic=8566' target='_blank' style='font-size:8pt;'>Find Your Feed</A>",false);
  prefAdd ++;

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LDpref__MODULE_ID__ + 2],"<FONT style='font-weight:bold;font-size:8pt;'>Single:</FONT>&nbsp;<FONT style='font-size:8pt;text-decoration:underline;color:blue' onclick='javascript: toggleDIV__MODULE_ID__(\"urlSF__MODULE_ID__\");'>Learn More</FONT>",false);
  prefAdd ++;

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LDpref__MODULE_ID__ + 3],"<DIV id='urlSF__MODULE_ID__' style='display:none'><FONT style='font-size:8pt;'>You can simply specify a <A href='http://www.google.com/support/calendar/bin/answer.py?answer=37648&topic=8566' target='_blank' style='font-size:8pt;'>Calendar Feed</A> in the 'Input Feed' input area.  This will be the calendar which is loaded with each page reload.  If you want multiple calendars, please see the instructions below.<BR><BR>",false);
  prefAdd ++;

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LDpref__MODULE_ID__ + 5],"<FONT style='font-weight:bold;font-size:8pt;'>Multiple:</FONT>&nbsp;<FONT style='font-size:8pt;text-decoration:underline;color:blue' onclick='javascript: toggleDIV__MODULE_ID__(\"urlMF__MODULE_ID__\");'>Learn More</FONT>",false);
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

function enableModule__MODULE_ID__(){
  prefs__MODULE_ID__.set('DDISABLE',false);
  prefs__MODULE_ID__.getBool('DDISABLE');
  _gel('m___MODULE_ID___form').elements[1].checked = false;
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
  ro.open('get', URL);
  ro.onreadystatechange = function (){ if (ro.readyState == 4) parseBMK__MODULE_ID__(ro.responseText); }
  ro.send(null);
}
// -- XMLhttpRequest

