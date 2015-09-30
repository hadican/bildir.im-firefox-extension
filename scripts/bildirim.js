// load libraries
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var contextMenu = require("sdk/context-menu");
var Request = require("sdk/request").Request;
var ActionButton = require('sdk/ui/button/action').ActionButton;

// create extension action button
var button = ActionButton({
		id : "bildirim-link",
		label : "Bildir.im",
		icon : {
			"16" : "../data/icon-16.png",
			"32" : "../data/icon-32.png",
			"64" : "../data/icon-64.png"
		},
		onClick : function () {
			sendNotification(tabs.activeTab.url);
		}
	});

// create right-click menu for selected text sending
var menuItem = contextMenu.Item({
		label : "Send Bildir.im",
		image : self.data.url("icon-16.png"),
		context : contextMenu.SelectionContext(),
		contentScript : 'self.on("click", function () {' +
		'  var text = window.getSelection().toString();' +
		'  self.postMessage(text);' +
		'});',
		onMessage : function (selectedText) {
			sendNotification(selectedText);
		}
	});

// notification sender
function sendNotification(message) {
	// post to GCM
	Request({
		// TODO - will be replaced with backend URL
		url : "https://android.googleapis.com/gcm/send",
		// TODO - will be replaced with backend token
		headers : {
			"Authorization" : "key=API_KEY",
			"Content-Type" : "application/json"
		},
		content : JSON.stringify({
			"data" : {
				"title" : "Bildir.im",
				"message" : message
			},
			"registration_ids" : ["REGISTRATION_ID"]
		}),
		onComplete : function (response) {
			// for debugging purpose
			console.log(response.text);
		}
	}).post();
}