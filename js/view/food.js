/* global Backbone, $, _, console */


/* individual food item */
var FoodView = Backbone.View.extend({

	tagName: 'li',

	className: 'food__food-item',

	template: _.template( $('#food-template').html() ),

	events: {},

	render: function(){
		this.$el.html( this.template( this.model.attributes ) );

		//Add a highlight class to highlighted models
		//This is to indicate newly added foods
		if(this.model.get('highlight') === true){
			this.$el.addClass('highlight');
			this.model.set('highlight', false).save();
		}

		return this;
	}
});

/* list of food items */
var FoodList = Backbone.View.extend({

	tagName: 'ul',

	className: 'food',

	render: function(){

		var lastDate = '';

		this.$el.empty();
		if(this.collection.models.length > 0){
			this.collection.models.forEach(function(food){

				var thisDate = food.get('dateString');

				/*
				* If the date of the next Food in the loop has a new date,
				* make a new date/calorie heading
				*/
				if(thisDate != lastDate){

					var cals = 0;

					//add up all the calories for the current day
					this.collection.where({dateString: thisDate}).forEach(function(f){
						cals += f.get('calories');
					});

					//append simple heading
					this.$el.append('<div class="food__food-item food__food-item__day"><div>' + thisDate + '</div><div>' + cals + ' calories</div>');
				}
				lastDate = thisDate;


				var itemview = new FoodView({model: food});
				this.$el.append(itemview.render().$el);


			}, this);
		} else {
			//if there are no food items in the collection, tell user to add some
			this.$el.append('<div class="food__food-item food__food-item__empty"> Nothing added yet! Click "Add Food" above to start tracking.</div>');
		}
		return this;
	}

});
