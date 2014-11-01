// ==UserScript==
// @name        GlobalOffensiveLiveMatchTicker
// @namespace   globaloffensive-reddit-matchticker
// @description This will make the matchticker more obvious when using the global offensive subreddit. You will also be able to toggle live scores.
// @include     *.reddit.com/r/GlobalOffensive/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     0.1.0
// @grant 		GM_xmlhttpRequest
// @grant		GM_addStyle
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function() {
	GM_addStyle(
		".ticker-match {" +
			"width: 19%;" +
			"height: 80px;" +
			"background-color: #000;" +
			"float: left;" +
			"margin-left: 1px;" +
		"}"
	);
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
	
	createElements();
});

function setLSShowTicker() {
	
}

function createElements() {
	var menudiv = $("<li></li>").append("<a id='showticker' href='#'>Show Matchticker</a>");
	$(menudiv).appendTo('.tabmenu');
	$("#showticker").on("click", function(e) {
		e.preventDefault();
		displayMatchTicker();
		setLSShowTicker();
	});
	
	var savedShowTicker = localStorage.getItem("showTicker");
	if (savedShowTicker !== null) {
		if (savedShowTicker == "true") {
			displayMatchTicker();	
		}
	}
}

function displayMatchTicker() {
	addOptionsButton();
	
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
				
				var title = $(el.find("title")[0]).html();
				var hltvlink = $(el.find("link")[0]).html();
				var time = $(el.find("pubDate")[0]).html();
				
				addMatch(title, hltvlink, time);
			}
		}
	});
}

function addOptionsButton() {
	var tickeroptions = $("<div></div>");
	tickeroptions.addClass("link");
	tickeroptions.addClass("ticker-options");
	
}

function addMatch(title, hltvlink, time) {	
	var tickerdiv = $("<div></div>");
	tickerdiv.addClass("link");
	tickerdiv.addClass("ticker-div");
	tickerdiv.css('height', '');
	tickerdiv.slideUp("fast");
	$(tickerdiv).prependTo('#siteTable');
	
	var a_title = $("<a></a>");
	a_title.addClass("title");
	a_title.text(title);
	a_title.attr("href", hltvlink);
	a_title.appendTo(tickerdiv);
}