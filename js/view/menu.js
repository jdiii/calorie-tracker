/* global app, _, $, Backbone*/


var MenuItemView = Backbone.View.extend({

	tagName: 'a',

	className: 'menu__menu-item',

	template: _.template( $('#menu-item-template').html() ),

	events: {
		'click': 'showItem'
	},

	render: function(){
		this.$el.html(this.template(this.model.attributes));
		return this;
	},

	showItem: function(){
		var newView = this.model.getView();
		app.setView(newView);
	}

});

/* full menu */
var MenuView = Backbone.View.extend({

	render: function(){

		this.$el.append('<span class="menu__menu-item menu__menu-item__title">Health Track</span>');

		this.collection.models.forEach(function(menuItem){
			var menuButton = new MenuItemView({model: menuItem});
			this.$el.append(menuButton.render().el);
		}, this);

		return this;
	}

});
