/* global Food, FoodView, Foods, console, MenuItem, FoodList, SearchView, AppView, MenuItems, MenuView */
'use strict';

/*
* format a date to yyyy/mm/dd
* slightly modified from source: http://stackoverflow.com/questions/3066586/get-string-in-yyyymmdd-format-from-js-date-object
*/
Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = this.getDate().toString();
	return yyyy + '/' + (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]);
};


/* instantiate collection and get saved items from localStorage */
var foods = new Foods();
foods.fetch();


/* instantiate Food history view and Search view */
var foodList = new FoodList({collection: foods});
var searchView = new SearchView({collection: foods});
/* instantiate AppView, which controls whether you're on the search or history view */
var app = new AppView({el: '.app'});
app.setView(searchView); //set initial view. This also calls render() on the view.


//instantiate menu items
var menuItems = new MenuItems();
menuItems.add([
	new MenuItem({content: 'Track Food', view: searchView}),
	new MenuItem({content: 'History', view: foodList})
]);
var menu = new MenuView({collection: menuItems, el: '.menu'});
menu.render();
