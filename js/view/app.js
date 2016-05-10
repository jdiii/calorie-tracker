/* global Backbone, $, _, console */

/* AppView allows the content of main section of the app (.app) to be set */
var AppView = Backbone.View.extend({

	view: null,

	render: function(){
		this.$el.html(this.view.render().el);
		return this;
	},

	getView: function(){
		return this.view;
	},

	setView: function(view){
		if(this.view && view !== this.view){
			this.view.close();
		}
		this.view = view;
		this.render();
		this.view.delegateEvents(this.view.events);
	}

});

/*
* define a close method for all Views.
* See: https://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/
*/
Backbone.View.prototype.close = function(){
  this.remove();
  this.unbind();
};
