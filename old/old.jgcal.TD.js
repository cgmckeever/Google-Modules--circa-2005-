/*

Google Module for Google Calendar
Chris McKeever - 2006 cgmckeever@r2unit.com

based of the original work Paul Russell.
http://russelldad.googlepages.com/googlecalendar_v001.xml


*/

function initialize__MODULE_ID__(){
  // define global

  domain__MODULE_ID__ = document.domain;
  feed_change__MODULE_ID__ = false; 
  deflen__MODULE_ID__ = 25; // default length of text units
  EventList__MODULE_ID__ = new Array;  // Array of events
  XmlErrorOccurred__MODULE_ID__ = false;  // tinydom parser
  TO__MODULE_ID__ = "";
  haltScript__MODULE_ID__ = false;

  // user preferences 
  feed_url__MODULE_ID__ = prefs__MODULE_ID__.getString('GCAL_XML_FEED');
  feed_bmk__MODULE_ID__ = prefs__MODULE_ID__.getString('GCAL_FEED_BMK');
  UPbmkFeed__MODULE_ID__= prefs__MODULE_ID__.getString('UPBMKFEED');
  show_feedSelect__MODULE_ID__ = prefs__MODULE_ID__.getBool('SHOW_FEED_SELECT');
  ShowDecline__MODULE_ID__ = prefs__MODULE_ID__.getBool('DDECLINE');
  dayForward__MODULE_ID__ = prefs__MODULE_ID__.getString('DAYFORWARD');
  UPtoday__MODULE_ID__ = prefs__MODULE_ID__.getBool('DTODAY');
  UPclock__MODULE_ID__ = prefs__MODULE_ID__.getInt('DCLOCK');

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
 
  // object shorthand
  newNode__MODULE_ID__ = getObjMethodClosure__MODULE_ID__(document, "createElement");

  // current date info
  nowParse__MODULE_ID__ = parseDate__MODULE_ID__(new Date(),false);
  nowDate__MODULE_ID__ = new Date(monthA__MODULE_ID__[nowParse__MODULE_ID__['month']] + " " + nowParse__MODULE_ID__['date'] + " " + nowParse__MODULE_ID__['year']);
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
    var disMod = prefs__MODULE_ID__.getBool('DDISABLE');
    if (disMod){
      _gel('status_content__MODULE_ID__').innerHTML = "Module Disabled <FONT style='font-size:8pt;color:grey'>(v" + version__MODULE_ID__  + ")</FONT>&nbsp;&nbsp;<FONT style='font-size:8pt;text-decoration:underline;color:grey' onclick='javascript: enableModule__MODULE_ID__();'>Enable</FONT>";
      _gel('status_content__MODULE_ID__').style.display = '';   
      return;
    }

    if(UPtoday__MODULE_ID__ || UPclock__MODULE_ID__ != 0) datetime__MODULE_ID__();

    _gel('status_content__MODULE_ID__').innerHTML = "";

    if (feed_bmk__MODULE_ID__ == ''){
      getFeed__MODULE_ID__();
    } else {
      // get it from bookmarks
      var bmkURL = "http://" + domain__MODULE_ID__  + "/bookmarks/lookup?q=label:" + feed_bmk__MODULE_ID__  + "&sort=title";
      var httprq = createRequestObject__MODULE_ID__();
      _gel('status_content__MODULE_ID__').innerHTML = 'Retrieving Bookmarks...<BR>';
      _gel('status_content__MODULE_ID__').style.display = '';
      sndBMKReq__MODULE_ID__(httprq,bmkURL);
      TO__MODULE_ID__ = setTimeout(function(){bmkFail__MODULE_ID__(bmkURL)},5000);
    }

  }
}

function getFeed__MODULE_ID__(){
  if (feed_url__MODULE_ID__.match(/.*basic$/) && feed_change__MODULE_ID__ == false){
      // first try FULL
      feed_change__MODULE_ID__ = true;
      feed_url__MODULE_ID__ = feed_url__MODULE_ID__.replace(/basic$/,'full');
  } else feed_change__MODULE_ID__ = false;

  var feed_url = feed_url__MODULE_ID__ + "?start-max=" + start_max__MODULE_ID__ + "&start-min=" +  start_min__MODULE_ID__;
  _gel('calendar_content__MODULE_ID__').style.display = 'none';
  _gel('status_content__MODULE_ID__').style.display = '';
  _gel('status_content__MODULE_ID__').innerHTML += 'Requesting Calendar<BR>';
  _IG_FetchContent(feed_url, parseCalendarXML__MODULE_ID__ );
}

function bmkFail__MODULE_ID__(bmkURL){
  _gel('status_content__MODULE_ID__').innerHTML += "Bookmark Request Failed&nbsp;&nbsp;<FONT style='font-size:8pt;text-decoration:underline;color:grey' onclick='javascript: initialize__MODULE_ID__();'>Retry</FONT>";
  _gel('status_content__MODULE_ID__').innerHTML += "<BR>Check Link<BR><A href='" + bmkURL + "' target=_blank style='font-size:8pt;text-decoration:underline;color:grey'>" + bmkURL + "</A>";

  haltScript__MODULE_ID__ = true; 
}

function parseBMK__MODULE_ID__(bmkHTML){
  clearTimeout(TO__MODULE_ID__); //stop timeout
  if (haltScript__MODULE_ID__) return;
  // labels
  var tRE = bmkHTML.match(/bkmk_href[^ >]+>([^<]*)/g);
  // urls
  var uRE = bmkHTML.match(/\.\/url[^ \n\r"]+(?=.*id=bkmk_href)/g);

  var title;
  var url;
  var feedCount = 0;
  var Ptable =_gel("m___MODULE_ID___form").firstChild.firstChild.firstChild;
  if (!Ptable) return;
  if (tRE){
  
    var optionBox = newNode__MODULE_ID__('select');
    optionBox.id = 'feedS__MODULE_ID__';
    optionBox.onchange = selectFeed__MODULE_ID__;
    var DoptionBox = newNode__MODULE_ID__('select');
    DoptionBox.id = 'DfeedS__MODULE_ID__';
    DoptionBox.onchange = function(){set_selectFeed__MODULE_ID__(true)};
    if (feed_url__MODULE_ID__ != ''){
      optionBox[feedCount] = new Option('Input Feed',feed_url__MODULE_ID__); 
      DoptionBox[feedCount] = new Option('Input Feed',feed_url__MODULE_ID__);
      feedCount++;
      _gel('status_content__MODULE_ID__').innerHTML += '<BR>Found: ' + 'Input Feed';
    }
    var selectedI = 0;
    for (var indexB = 0; indexB < tRE.length; indexB++){
      title = tRE[indexB].replace(/bkmk_href[^ >]+>/,'');
      if (title.length > 20) label = shrink__MODULE_ID__(title,20,"...");
      url = uRE[indexB].replace('./url?url=', '');
      url = url.match(/(.+)(basic|full)/);
      if (url[0] == UPbmkFeed__MODULE_ID__){
        selectedI = feedCount; 
        feed_url__MODULE_ID__ = url[0];
      } else selected = false;
      optionBox[feedCount] = new Option(title,url[0]);
      DoptionBox[feedCount] = new Option(title,url[0]);
      feedCount++; 
      _gel('status_content__MODULE_ID__').innerHTML += '<BR>Found: ' + title;
    }
  
    _gel('status_content__MODULE_ID__').innerHTML += "<BR><BR>"; 
    optionBox.selectedIndex = selectedI;
    DoptionBox.selectedIndex = selectedI;

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
      prefCount__MODULE_ID__++;
      Ptable.childNodes[prefCount__MODULE_ID__].style.display = '';
      Ptable.childNodes[prefCount__MODULE_ID__ - 1].style.display = '';
    }

    var feedDiv = _gel("feedDIV__MODULE_ID__");
    feedDiv.appendChild(DoptionBox);
    if(show_feedSelect__MODULE_ID__) feedDiv.style.display = '';

    set_selectFeed__MODULE_ID__(false)

  }else getFeed__MODULE_ID__();

}

function set_selectFeed__MODULE_ID__(reset){ 
  var DoptionFeed = _gel("DfeedS__MODULE_ID__");
  var optionFeed = _gel("feedS__MODULE_ID__");
  optionFeed.selectedIndex = DoptionFeed.selectedIndex;
  feed_url__MODULE_ID__ = DoptionFeed[DoptionFeed.selectedIndex].value;
  prefs__MODULE_ID__.set('UPBMKFEED',feed_url__MODULE_ID__);
  prefs__MODULE_ID__.getString('UPBMKFEED');
  if (reset) _gel('status_content__MODULE_ID__').innerHTML = "";
  getFeed__MODULE_ID__();
}


function selectFeed__MODULE_ID__(){ 
  var optionFeed = _gel("feedS__MODULE_ID__");
  var feed_url = optionFeed[optionFeed.selectedIndex].value;
  prefs__MODULE_ID__.set('UPBMKFEED',feed_url);
  prefs__MODULE_ID__.getString('UPBMKFEED');
}

function parseCalendarXML__MODULE_ID__(feedXML){
  var responseDOM = new XMLDoc(feedXML, function(error){if(XmlErrorOccurred__MODULE_ID__ == false) XmlErrorOccurred__MODULE_ID__ = true;});
 
  if ( responseDOM == null || responseDOM.docNode == null){
    
    if (feed_change__MODULE_ID__ == true){
      feed_url__MODULE_ID__ = feed_url__MODULE_ID__.replace(/full$/,'basic');
      // resend it
      getFeed__MODULE_ID__();
      return; 
    }

    var spHTML = "<FONT style='color:red;font-size:.8em;'>The response from Google contained invalid XML.</FONT><BR><BR>";
    _gel('status_content__MODULE_ID__').innerHTML = spHTML;
    _gel('start_content__MODULE_ID__').style.display = '';
    return;
  } else feed_change__MODULE_ID__ = false;

  _gel('status_content__MODULE_ID__').innerHTML += 'Loading Calendar...';
  _gel('status_content__MODULE_ID__').style.display = '';
 
  var disHeight = prefs__MODULE_ID__.getString('DISPLAY_HEIGHT');
  if (parseInt(disHeight) != -1) _gel('calendar_content__MODULE_ID__').style.height = disHeight + "px";

  var calTitle = shrink__MODULE_ID__(responseDOM.docNode.getElements("title")[0].getText(),20,'');
  _gel("m___MODULE_ID___url").innerHTML = 'GCal - ' + calTitle;

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
  EventList__MODULE_ID__ = new Array();
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
      aParent[originalID] = true;
    }

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
        // type was null - can't determine recurrence elsewise
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

    if(!evCancelled && !aParent[evId]){ 
      if (aEvent.length == 0){
        if (new Date(evEndTS).getTime() != evEndTS) evEndTS = evStartTS;
        addEvent__MODULE_ID__(new CalendarEvent__MODULE_ID__(evId,evTitle,evStartTS,evEndTS,evURL,evLocation,evRepeatTS,evRepeatType,evRepeatInt,evRepeatByDay));  
      } else { 
        // loop the when node results and add
        for (var aWheni = 0; aWheni < aEvent.length; aWheni++){ 
          if (new Date(aEvent[aWheni]['evEndTS']).getTime() != aEvent[aWheni]['evEndTS']) aEvent[aWheni]['evEndTS'] = aEvent[aWheni]['evstartTS'];
          addEvent__MODULE_ID__(new CalendarEvent__MODULE_ID__(evId,evTitle,aEvent[aWheni]['evStartTS'],aEvent[aWheni]['evEndTS'],evURL,evLocation,evRepeatTS,evRepeatType,evRepeatInt,evRepeatByDay));
        }
      }
    } 

  } // event loops  

  EventList__MODULE_ID__ = EventList__MODULE_ID__.sort(function(a,b){return cmp__MODULE_ID__(a.startTS,b.startTS);});
  renderCalendar__MODULE_ID__(EventList__MODULE_ID__); 

}


function CalendarEvent__MODULE_ID__(id,title,startTS,endTS,URL,location,repeatTS,repeatType,repeatInt,repeatByDay){
  this.id = id;
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

  var calDIV = _gel('calendar_content__MODULE_ID__');
  var evDIV;
  var evHTML = "";
  var event; var summary; var tT; var std; var etd;

  var now = monthA__MODULE_ID__[nowParse__MODULE_ID__['month']] + " " + nowParse__MODULE_ID__['date'] + " " + nowParse__MODULE_ID__['year']; 
  var highlight;

  var eCount = eventA.length;  
  if (eCount > parseInt(max_display)) eCount = parseInt(max_display); // set max display

  evHTML = "<TABLE cellspacing=0 cellpadding=0 border=0 width='99%'>";
  var colspan;
  for (var eI = 0; eI < eCount; eI++){
    event = eventA[eI];
   
    summary = event.title;
    summary = "<A class='gcalItem' href='" + event.URL  + "' target='_blank'>" + summary + "</A>";
    if (Dlocation) summary = summary + "<BR>" + event.location;

    std = parseDate__MODULE_ID__(event.startTS);
    etd = parseDate__MODULE_ID__(event.endTS);

    std['d'] = monthA__MODULE_ID__[std['month']] + " " + std['date'] + " " + std['year'];
    etd['d'] = monthA__MODULE_ID__[etd['month']] + " " + etd['date'] + " " + etd['year'];

    if (nowDate__MODULE_ID__ > new Date(std['d']) && Uhighlight){
      highlight = "GgcalItem__MODULE_ID__";
    } else if (now == std['d'] && Uhighlight){
      highlight = "HgcalItem__MODULE_ID__";
    } else highlight = "gcalItem__MODULE_ID__";

    var style = "valign=top class='" + highlight + "' style='font-size:" + displayFont + "pt'";

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

        colspan = 8;
      }else colspan = 7;

      evHTML += "<TR>" 
             + "<TD " +  style + ">" + std['day'] + "</TD>" 
             + "<TD " +  style + ">" + std['month'] + "</TD>" 
             + "<TD " +  style + " align=right>" + std['date'] + "</TD>";
      if (Dsingle) evHTML += "<TD " +  style + ">" + std['remainDate'] + "</TD>";
      evHTML += "<TD " +  style + ">" + std['year'] + "</TD>" 
             + "<TD " +  style + ">&nbsp;" + std['t'] + "</TD>" 
             + "<TD " +  style + " rowspan=2>&nbsp;&nbsp;</TD>" 
             + "<TD " +  style + " rowspan=2 width='100%'>" + summary + "</TD></TR>";

      if (!Dsingle)
        evHTML += "<TR>" 
               + "<TD " +  style + ">" + etd['day'] + "</TD>" 
               + "<TD " +  style + ">" + etd['month'] + "</TD>" 
               + "<TD " +  style + " align=right>" + etd['date'] + "</TD>" 
               + "<TD " +  style + ">" + etd['year'] + "</TD>" 
               + "<TD " +  style + ">&nbsp;" + etd['t'] + "</TD></TR>";

    }else{
      if ((std['t'] != '12:00a' && etd['t'] != '11:59p')
           && (std['t'] != '00:00' && etd['t'] != '23:59') && std['t'] != '' && etd['t'] != '') std['t'] = std['t'] + "~" + etd['t'];
      if (std['t'] == "12:00a" || std['t'] == '00:00') std['t'] = "";
      evHTML += "<TR>" 
             + "<TD " +  style + ">" + std['day'] + "</TD>" 
             + "<TD " +  style + ">" + std['month'] + "</TD>" 
             + "<TD " +  style + " align=right>" + std['date'] + "</TD>";
      if (Dsingle) evHTML += "<TD " +  style + "></TD>";
      evHTML += "<TD " +  style + ">" + std['year'] + "</TD>" 
             + "<TD " +  style + ">&nbsp;" + std['t'] + "</TD>" 
             + "<TD " +  style + ">&nbsp;&nbsp;</TD>"
             + "<TD width='100%' " +  style + ">" + summary + "</TD></TR>";
      
    }

    style = "valign=top class='" + highlight + "' style='font-size:2pt'";
    evHTML += "<TR><TD " +  style + " colspan=" + colspan  + ">&nbsp;</TD></TR>";

  }

  evHTML += "</TABLE>";

  if (eCount == 0){
    calDIV.innerHTML = "<B>No Events Found.</B>";
  } else {
    calDIV.innerHTML = evHTML;
  } 
 
  if (feed_url__MODULE_ID__.match(/.*basic$/)){
      _gel('status_content__MODULE_ID__').innerHTML = "<CENTER><FONT style='color:gray;font-size:.8em;'>Feed seems to be 'basic'. Change to <A href='http://code.google.com/apis/gdata/calendar.html#Projection' target=_blank>'full'</A> for best results.<FONT></CENTER>";
  } else {
    _gel('status_content__MODULE_ID__').style.display = 'none';
    _gel('start_content__MODULE_ID__').style.display = 'none';
  }

  calDIV.style.display = '';


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
  var gmtPosition = nowParse__MODULE_ID__['gmtPosition'];

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
  var LS = prefAdd + 1 + LSpref__MODULE_ID__;
  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[prefAdd],"<FONT style='font-weight:bold;font-size:10pt;'>Preferences:</FONT>&nbsp;<FONT style='font-size:8pt;text-decoration:underline;color:blue' onclick='javascript: toggleNode__MODULE_ID__(" + FS  + "," + LS + ");'>Setup</FONT>",false);
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

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LDpref__MODULE_ID__ + 3],"<DIV id='urlSF__MODULE_ID__' style='display:none'><FONT style='font-size:8pt;'>You can simply specify a <A href='http://www.google.com/support/calendar/bin/answer.py?answer=37648&topic=8566' target='_blank' style='font-size:8pt;'>Calendar Feed</A> in the 'Default Feed' input area.  This will be the calendar which is loaded with each page reload.  If you want multiple calendars, please see the instructions below.<BR><BR>",false);
  prefAdd ++;

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LDpref__MODULE_ID__ + 5],"<FONT style='font-weight:bold;font-size:8pt;'>Multiple:</FONT>&nbsp;<FONT style='font-size:8pt;text-decoration:underline;color:blue' onclick='javascript: toggleDIV__MODULE_ID__(\"urlMF__MODULE_ID__\");'>Learn More</FONT>",false);
  prefAdd ++;

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[LDpref__MODULE_ID__ + 6],"<DIV id='urlMF__MODULE_ID__' style='display:none'><FONT style='font-size:8pt;'>You can setup an unlimited number of calendars by storing the feed url's in <A href='http://google.com/bookmarks' target=_blank>Google&nbsp;Bookmarks</A>. Each of the stored feeds must have the same user defined label associated with them (e.g. IGgcal).  The label can not contain spaces and must match the one you specify in the 'Label' input area.  They will be displayed in a drop down list ordered by the title which you gave each in <A href='http://google.com/bookmarks' target=_blank>Google&nbsp;Bookmarks</A>.  Additionally, you can choose to move the drop down list into the main module window for easy calendar selection.<BR><BR>",false);
  prefAdd ++;

  insertRow__MODULE_ID__(Ptable,Ptable.childNodes[prefCount__MODULE_ID__ + prefAdd + 1],"<FONT style='font-weight:bold;font-size:8pt;color:gray'>(Moves feed selection to main window)</FONT>",false);
  prefAdd ++;

  prefCount__MODULE_ID__ = prefAdd + prefCount__MODULE_ID__;
  prefFormat__MODULE_ID__ = true;

  Ptable.childNodes[prefCount__MODULE_ID__].style.display = 'none'; // show check comment
  Ptable.childNodes[prefCount__MODULE_ID__ - 1].style.display = 'none'; // show check

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

