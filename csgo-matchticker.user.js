// ==UserScript==
// @name        GlobalOffensiveLiveMatchTicker
// @namespace   globaloffensive-reddit-matchticker
// @description This will make the matchticker more obvious when using the global offensive subreddit. You will also be able to toggle live scores.
// @include     *.reddit.com/r/GlobalOffensive*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     0.2.0
// @grant 		GM_xmlhttpRequest
// @grant		GM_addStyle
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function() {
	// Add css styles
	GM_addStyle(
		".ticker-div {" +
			"width: -webkit-calc(25% - 22px);" +
			"width: calc(25% - 22px);" +
			"float: left;" +
			"position: relative;" +
		"}"
	);
	GM_addStyle(
		".ticker-options {" +
			"height: 100%;" +
			"width: 40px;" +
		"}"
	);
	
	// Start the script
	createElements();
});

function createElements() {
	var menudiv = $("<li></li>").append("<a id='showticker' href='#'>Show Matchticker</a>");
	$(menudiv).appendTo('.tabmenu');
	$("#showticker").on("click", function(e) {
		e.preventDefault();
				
		// Show or hide ticker
		if ($("#showticker").text() === "Hide Matchticker") {
			localStorage.setItem("showTicker", "false");
			$("#showticker").text("Show Matchticker");
			hideMatchTicker();
		} else {
			localStorage.setItem("showTicker", "true");
			$("#showticker").text("Hide Matchticker");
			displayMatchTicker();
		}
	});
	
	// Check whether the user had the matchticker open the last time visiting the page
	// Show ticker if so.
	var savedShowTicker = localStorage.getItem("showTicker");
	if (savedShowTicker !== null) {
		if (savedShowTicker == "true") {
			displayMatchTicker();
			$("#showticker").text("Hide Matchticker");	
		}
	}
}

function hideMatchTicker() {
	$(".ticker-div").remove();
}

function displayMatchTicker() {
	addOptionsButton();
	
	// get hot matches from hltv rss
	var hltvrss = "http://www.hltv.org/hltv.rss.php";
	GM_xmlhttpRequest({
		method: "GET",
		url: hltvrss,
		data: "pri=15",
		headers: {
			"User-Agent": "Mozilla/5.0",  
			"Accept": "text/xml"           
		},
		onload: function(data) {
			var res = data.responseText;
			res = $($.parseXML(res));
			
			$("<div class='clearleft'></div>").prependTo("#siteTable");
			
			var elements = res.find("item");
			for (var i = elements.length-1; i >= 0; i--) {
				var el = $(elements[i]);
				
				var title = $(el.find("title")[0]).text();
				var hltvlink = $(el.find("link")[0]).text();
				var time = $(el.find("pubDate")[0]).text();
				var tournament = $(el.find("description")[0]).text();
				
				addMatch(title, hltvlink, time, tournament);
			}
		}
	});
}

function addOptionsButton() {
	var tickeroptions = $("<div></div>");
	tickeroptions.addClass("link");
	tickeroptions.addClass("ticker-options");
	
}

function getTimeLeft(date1, date2) {
	var minute = 1000 * 60;
	var hour = minute * 60;
	
	var ms1 = date1.getTime();
	var ms2 = date2.getTime();
	
	if (ms1 <= ms2) {
		return "LIVE";
	} else {
		var diff = ms1 - ms2;
		
		var hours = Math.floor(diff / hour);
		diff = diff - (hours * hour);
		var minutes = Math.round(diff / minute);
		
		return hours + "h" + minutes + "m";	
	}
}

function addMatch(title, hltvlink, time, tournament) {
	var today = new Date();
	var date = new Date(time);
	var timetomatch = getTimeLeft(date, today);
		
	var tickerdiv = $("<div id='" + title + time + "'></div>");
	tickerdiv.addClass("link");
	tickerdiv.addClass("ticker-div");
	tickerdiv.css('height', '');
	tickerdiv.slideUp("fast");
	$(tickerdiv).prependTo('#siteTable');
	
	var div_left = $("<div></div>");
	div_left.attr("style", "width: 90%; float:left;");
	div_left.appendTo(tickerdiv);
	
	var div_right = $("<div></div>");
	div_right.attr("style", "width: 10%; float:left;");
	div_right.appendTo(tickerdiv);
	
	var a_title = $("<a></a>");
	a_title.addClass("title");
	a_title.text(title);
	a_title.attr("href", hltvlink);
	a_title.appendTo(div_left);
	
	var lbl_time = $("<p></p>");
	if (timetomatch === "LIVE") {
		lbl_time.attr("style", "color: #00FF00;");
	} else {
		lbl_time.attr("style", "color: #888;");
	}
	lbl_time.text(timetomatch);
	lbl_time.appendTo(div_left);
	
	var lbl_tournament = $("<p></p>");
	lbl_tournament.attr("style", "color: #888;");
	lbl_tournament.text(tournament);
	lbl_tournament.appendTo(div_left);
	
	var div_streams = $("<div streamtag='" + hltvlink + "'></div>");
	
	div_streams.appendTo(div_left);
	
	var div_score = $("<div></div>");
	div_score.appendTo(div_right);
	
	var lbl_score1 = $("<p></p>");
	lbl_score1.addClass("title");
	lbl_score1.attr("style", "color: #0000FF;");
	lbl_score1.text("X");
	lbl_score1.appendTo(div_score);
	
	/*var lbl_scorediv = $("<p></p>");
	lbl_scorediv.addClass("title");
	lbl_scorediv.text("-");
	lbl_scorediv.appendTo(div_score);*/
	
	var lbl_score2 = $("<p></p>");
	lbl_score2.addClass("title");
	lbl_score2.attr("style", "color: #FF0000;");
	lbl_score2.text("X");
	lbl_score2.appendTo(div_score);
	
	// Load matchpage
	GM_xmlhttpRequest({
		method: "POST",
		url: hltvlink,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"          
		},
		onload: function(data) {
			var res = data.responseText;
			var html = $($.parseHTML(res));
			alert(html.find(".headertext").text());
			/*html.find(".headertext").each(function(index, element) {
                alert(element.text());
            });*/
		}
	});
}