// ==UserScript==
// @name        GlobalOffensiveLiveMatchTicker
// @namespace   globaloffensive-reddit-matchticker
// @description This will make the matchticker more obvious when using the global offensive subreddit. You will also be able to toggle live scores.
// @include     *.reddit.com/r/GlobalOffensive/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     0.0.1
// @grant       none
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function() {
    var newdiv = $("<li></li>").append("<a id='showticker' href='#'>Show Matchticker</a>");
	$('.tabmenu').append(newdiv);
	$("#showticker").click(function(e) {
		e.preventDefault();
		displayTicker();
		setLSShowTicker();
	});
	
	var savedShowTicker = localStorage.getItem("showTicker");
	if (savedShowTicker !== null) {
		if (savedShowTicker == "true") {
			displayTicker();	
		}
	}
});

function setLSShowTicker() {
	
}

function displayTicker() {
	var div = $("<div></div>");
	div.width("100%");
	div.text("No matches available");
	
	$('.content').append(div);
}