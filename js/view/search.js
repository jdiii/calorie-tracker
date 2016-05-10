/* global Backbone, _, $, SearchResults, SearchResult, app, foods, foodList, searchView */

/* Main add a new food view */
var SearchView = Backbone.View.extend({

	tagName: 'section',

	className: 'search-view',

	template: _.template( $('#search-view-template').html() ),

	events: {
		'click :input': 'clearInput',
		'keyup :input': 'search'
	},

	render: function(){
		this.delegateEvents(this.events);
		this.$el.html( this.template() );
		return this;
	},

	//clears out filler text from input if input is put in focus
	clearInput: function(){
		var input = $('.search__input');
		var inputVal = input.val();
		if(inputVal == 'Search for a food...'){
			input.val('');
		}
	},

	//store last query to prevent making extraneous requests to the auto-complete API
	lastQuery: '',

	search: function(){
		var appId = '59d81168', appKey = '9713d53ca656ac6e359e8f20ce17c0c4';
		var self = this;
		var query = $('.search__input').val();
		if(query.length > 0 && query != self.lastQuery){

			self.lastQuery = query;

			self.$('.search__status').html('Loading...');

			var results = new SearchResults();

			var params = {
				url: 'https://api.nutritionix.com/v1_1/search/'
				+ query
				+ '?results=0%3A15&fields=item_name%2Cbrand_name%2Citem_description%2Cnf_calories%2Cnf_serving_size_qty%2Cnf_serving_size_unit&appId='
				+ appId + '&appKey=' + appKey
			};

			$.ajax(params).fail(function(){
				self.$('.search__status').html('Error getting results...');
			}).done(function(data){
				if(data.total_hits > 0){
					self.$('.search__status').html('');
					data.hits.forEach(function(result, idx){
						var r = result.fields;
						var fields = {
							index: idx,
							name: r.item_name,
							brand: r.brand_name,
							desc: r.item_description,
							calories: r.nf_calories,
							serving_size: r.nf_serving_size_qty,
							serving_size_units: r.nf_serving_size_unit
						};
						results.add(new SearchResult(fields));
					});
				} else {
					self.$('.search__status').html('No results');
				}
			}).always(function(){

				self.popup = new SearchPopup({collection: results});
				self.$('.search__auto-complete').html(self.popup.render().$el);

			});
		} else if (query == ''){ //don't query API with an empty string
			$('.search__popup').html('');
			self.lastQuery = '';
		}
	}

});



/* individual search result view */
var SearchResultView = Backbone.View.extend({

	tagName: 'li',

	className: 'search__result',

	events: {
		'click': 'selectResult'
	},

	selectResult: function(){
		var save = new SaveView({model: this.model});
		app.setView(save);
	},

	attributes: function(){
		return {
			'data-index': this.model.getIndex()
		};
	},

	template: _.template( $('#search-result-template').html()),

	render: function(){
		this.$el.html( this.template( this.model.attributes ) );
		return this;
	}

});

/* search popup that contains all search results */
var SearchPopup = Backbone.View.extend({

	tagName: 'ul',

	className: 'search__popup',

	render: function(){
		this.collection.models.forEach(function( result ){
			var resultView = new SearchResultView({model: result});
			this.$el.append(resultView.render().el);
		}, this);
		return this;

	}

});

/*
* after clicking a search result,
* give user the opportunity to enter servings eaten
* and save the food to history
*/
var SaveView = Backbone.View.extend({

	tagName: 'div',

	className: 'add',

	template: _.template( $('#confirm-view-template').html() ),

	events: {
		'click .add__save-button': 'save',
		'click .add__reset-button': 'reset',
		'keyup .add__input__servings-input': 'updateCalories'
	},

	render: function(){
		this.$el.html(this.template(this.model.attributes));
		this.updateCalories(); //write calorie value. It is 0 in the template.
		return this;
	},

	updateCalories: function(){
		this.$('.add__total-cals__value')
			.html(this.calculateCalories());
	},

	/*
	* Calculate total calories as servings times calories per serving
	*/
	calculateCalories: function(){
		var cals = this.model.get('calories'),
			servings = Number(this.$('.add__input__servings-input').val());

		return cals*servings || 0;
	},

	/* saves a new entry to the collection of foods */
	save: function(){

		var date = this.$('.add__input__date-input').val();
		var servings = Number(this.$('.add__input__servings-input').val());
		var validDate = this.validateDate(date); //boolean for whether inputted date is valid
		var validServings = this.validateServings(servings); //boolean for valid serving input
		this.$('.add__save-message').empty(); //empty save feedback container

		/* alert user if the date entered is in wrong format */
		if(!validDate){
			this.$('.add__input__date-input').addClass('error');
			this.$('.add__save-message').append('<div>Invalid date. Use the format YYYY/MM/DD.</div>');
		}
		/* alert user if servings enter is NaN */
		if(!validServings){
			this.$('.add__input__servings-input').addClass('error');
			this.$('.add__save-message').append('<div>Invalid # of servings. Use a number.</div>');
		}
		/* if entry is valid create a new Food in the Foods collection */
		if(validDate && validServings){
			var dateArray = date.split('/');
			var formattedDate = new Date(dateArray[0], dateArray[1]-1, dateArray[2]);

			foods.create(
				{
					calories: Math.round(this.calculateCalories()),
					calories_per_serving_size: this.model.get('calories'),
					serving_size: this.model.get('serving_size'),
					servings: servings,
					name: this.model.get('name'),
					brand: this.model.get('brand'),
					date: formattedDate.valueOf(),
					dateString: formattedDate.toDateString(),
					unit: this.model.get('serving_size_units'),
					highlight: true
				}
			);
			app.setView(foodList); //switch app view to food list

		}
	},

	validateDate(date){
		var format = /^(19|20)\d\d\/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])$/;
		return date.match(format) ? true : false;
	},

	validateServings(servings){
		return servings >= 0 ? true : false;
	},

	//reset button goes back to search page
	reset: function(){
		app.setView(searchView);
	}

});
