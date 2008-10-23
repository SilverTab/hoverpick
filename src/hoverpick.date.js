HoverPick.Date = new Class({
	Extends: HoverPick,
	
	options: {
		months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		years: [2004, 2005, 2006, 2007, 2008, 2009]
	},
	
	initialize: function(el, options) {
		// What the fuck
		this.setOptions(options);
		//if no years are set, set some default ones...
		var currentYear = new Date().getFullYear();
		this.options.years = this.options.years.length > 0 ? this.options.years : [currentYear - 1, currentYear, currentYear + 1];
		
		this.currentDate = {year: this.options.years[0], month: 1, day: 1};
		this.options.panels = [this.options.years, this.options.months];
		this.parent(el, options);
		
	},
	
	updateText: function(el) {
		this.currentDate = {year: this.panelValues[1], month: this.options.months.indexOf(this.panelValues[2]) + 1, day: 1}
		console.log(this.currentDate);
		this.el.set('value', this.concatenateValues());
		
	}
	
});