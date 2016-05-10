/* global Backbone, $, _ , console */
'use strict';

var Food = Backbone.Model.extend({

	defaults: {
		name: 'Food',
		unit: 'tbsp',
		calories: 100,
		createDate: new Date(Date.now()).valueOf(),
		date: new Date(Date.now()).valueOf(),
		dateString: new Date(Date.now()).toDateString(),
		servings: 1,
		serving_size: 1,
		calories_per_serving_size: 100,
		brand: '',
		highlight: false
	}

});

var MenuItem = Backbone.Model.extend({

	getApp: function(){
		return this.get('app');
	},

	getView: function(){
		return this.get('view');
	}

});

var SearchResult = Backbone.Model.extend({
	getIndex: function(){
		return this.get('index');
	}
});
