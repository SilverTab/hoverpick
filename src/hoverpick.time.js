HoverPick.Time = new Class({
	Extends: HoverPick,
	
	options: {
		hours: [1,2,3,4,5,6,7,8,9,10,11,12],
		minutes: [0, 15, 30, 45],
		amPm: ['am', 'pm'],
		seconds: [],
		format: "HH:MM aa",
		imgSrc: 'clock_red.png'
	},
	
	initialize: function(el, options) {
		this.setOptions(options);
		this.options.panels = [this.options.hours, this.options.minutes];
		if(this.options.seconds.length > 0) {this.options.panels.push(this.options.amPm);}
		if(this.options.amPm.length > 0) {this.options.panels.push(this.options.amPm);}
		
		this.parent(el, options);
	},
	
	updateText: function() {
		this.parent();
		var hour = this.panelValues[1] + "";
		var minute = this.panelValues[2] + "";
		var hourPadded = this.panelValues[1] < 10 ? "0" + this.panelValues[1] : this.panelValues[1] + "";
		var minutePadded = this.panelValues[2] < 10 ? "0" + this.panelValues[2] : this.panelValues[2] + "";
		if(this.options.seconds.length > 0) {
			var second = this.panelValues[3];
			var secondPadded = this.panelValues[3] < 10 ? "0" + this.panelValues[3] : this.panelValues[3] + "";
			var amPm =  this.panelValues[4];
		}
		else {
			var amPm =  this.panelValues[3];
		}
		
		var time = this.options.format.replace("HH", hourPadded).replace("H", hour).replace("MM", minutePadded).replace("M", minute).replace("SS", secondPadded).replace("S", second).replace("aa", amPm);
		
		this.el.set('value', time);
	}
});