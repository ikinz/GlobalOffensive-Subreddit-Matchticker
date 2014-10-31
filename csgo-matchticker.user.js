// ==UserScript==
// @name        GlobalOffensiveLiveMatchTicker
// @namespace   globaloffensive-reddit-matchticker
// @description This will make the matchticker more obvious when using the global offensive subreddit. You will also be able to toggle live scores.
// @include     *.reddit.com/r/GlobalOffensive/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     0.0.2
// @grant 		GM_xmlhttpRequest
// @grant		GM_addStyle
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var tickerShowing = false;

$(document).ready(function() {
	GM_addStyle(
		".ticker-match {" +
			"width: 10%;" +
		"}"
	);
	
	createElements();
});

function setLSShowTicker() {
	
}

function createElements() {
	var tickerdiv = $("<div id='custommatchticker'></div>");
	tickerdiv.addClass("link");
	//tickerdiv.is(":hidden");
	tickerdiv.slideUp("fast");
	$(tickerdiv).prependTo('#siteTable');
	
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
	var div = $('#siteTable > div').first();
	div.text("test");
	
	if (tickerShowing) {
		div.slideUp("fast");
		tickerShowing = false;
	} else {
		div.slideDown("fast");
		tickerShowing = true;
	}
	
	var hltvrss = "http://www.hltv.org/hltv.rss.php";
	GM_xmlhttpRequest({
		method: "GET",
		url: hltvrss,
		data: "pri=15",
		headers: {
			"User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
			"Accept": "text/xml"            // If not specified, browser defaults will be used.
		},
		onload: function(data) {
			alert(data.responseText);
		}
	});
}