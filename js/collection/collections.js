/* global Backbone, Food, MenuItem, SearchResult */

var Foods = Backbone.Collection.extend({
	model: Food,
	comparator: function(m){
		return -1 * m.get('date'); //date, descending
	},
	localStorage: new Backbone.LocalStorage("health-tracker-foods")
});

var MenuItems = Backbone.Collection.extend({
	model: MenuItem
});

var SearchResults = Backbone.Collection.extend({
	model: SearchResult
});
