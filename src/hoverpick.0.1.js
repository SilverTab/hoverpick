Element.implement({
	// Calculate an element's width using only its style...
	computeWidth: function() {
		return this.getStyle('width').toInt() + this.getStyle('margin-left').toInt() + this.getStyle('margin-right').toInt() + this.getStyle('border-left').toInt() + this.getStyle('border-right').toInt() + this.getStyle('padding-left').toInt() + this.getStyle('padding-right').toInt();
	}
});

var HoverPick = new Class({
	Implements: Options,
	
	options: {
		panels: [],
		resetOnHide: true
	},
	
	initialize: function(el, options) {
		// initialize all properties...
		this.el = $(el);
		this.setOptions(options);
		// Used later to prevent switching the choice when the panel is fading
		this.panelVisible = false;
		this.panelsUl = [];
		this.panelValues = new Hash({});
		// build everything...
		
		this.buildElements();
	},
	
	buildElements: function() {
		document.body.addEvent('click', function(e) {
			if(this.panelVisible && e.target != this.el) {
				if(e.target.getParent().hasClass('moo-pick-ul')) {
					this.hidePanel();
				}
				else {
					this.cancelPanel();
				}
			}
		}.bind(this));
		this.el.addEvent('click', this.showPanel.bind(this));
		this.el.addEvent('keydown', function(e){
			if(e.key === 'esc') {
				this.cancelPanel();
			}
		}.bind(this));
		var coords = this.el.getCoordinates();
		// The main DIV 
		this.mainDiv = new Element('div', {
			'styles' : {
				'position': 'absolute',
				'margin': 0,
				'padding': 0,
				'left': coords.left,
				'top': coords.bottom
			}
		});
		this.mainDiv.inject(this.el, 'after');
		this.fadeFx = new Fx.Tween(this.mainDiv, {
			duration: 300
		});
		this.fadeFx.set('opacity', 0);
		// The timepicker itself
		this.timePicker = new Element('img', {
			'src': 'clock_red.png',
			'styles': {
				'position': 'absolute',
				'margin': '3px 0 0 3px',
				'cursor': 'pointer'
			},
			'events': {
				'click': this.showPanel.bind(this)
			}
		});
		this.timePicker.inject(this.mainDiv, 'after');
		
		// The panels...
		var itemCount = 0;
		this.options.panels.each(function(panel, index) {
			itemCount = itemCount + panel.length;
			var margin = index * 26;
			var panelType = $type(panel[0]);
			this['panel' + (index + 1)] = new Element('ul', {
				'class': 'moo-pick-ul',
				'styles' : {
					'margin': margin + "px 0 0 0",
					'display': 'none'
				}
			});
			this.panelsUl.push(this['panel' + (index + 1)]);
			this.panelValues[index + 1] = panel[0];
			this['panel' + (index + 1)].inject(this.mainDiv);

			panel.each(function(item, index2) {
				
				var itemEl = new Element('li', {
					'html': item + "",
					'events': {
						'mouseover': function() {
							this.itemOver(itemEl);
						}.bind(this),
						'click': function() {
							
							this.hidePanel();
						}.bind(this)
					}
				});
				itemEl.store('level', (index + 1));
				itemEl.store('value', item);
				itemEl.inject(this['panel' + (index + 1)]);
			}, this);
			
			//clearer
			var clearer = new Element('div', {
				'styles': {
					'clear': 'both'
				}
			});
			clearer.inject(this.mainDiv);
		}, this);
		var divWidth = (itemCount * this.panel1.getChildren('li')[0].computeWidth());
		this.mainDiv.setStyle('width', divWidth);
		
	},
	
	showPanel: function() {
		
		this.fadeFx.start('opacity', 0, 1);
		this.panelsUl[0].setStyle('display', 'block');
		
		this.currentValue = this.el.value;
		this.panelVisible = true;
	},
	
	itemOver: function(el) {
		if(this.panelVisible) {
			var level = el.retrieve('level');
			// update the values...
			this.panelValues[level] = el.retrieve('value');

			this.updateText();
			// highlight selected item
			this['panel' + level].getChildren('li').removeClass('hover');
			el.addClass('hover');
			
			// display panel under it if it exists and it is not displayed...
			if(this['panel' + (level + 1)] && this['panel' + (level + 1)].getStyle('display') === 'none') {
				this['panel' + (level + 1)].setStyle('display', 'block');
			}
			
			// move panels under it...
			if(this['panel' + (level + 1)]) {
				this.movePanel(level + 1);
			}
		}
	},
	
	movePanel: function(level) {
		// find item highlighted at previous level & move panel!
		var currentItem = this['panel' + (level - 1)].getElements('li.hover')[0];
		this['panel' + level].setStyle('left', currentItem.getCoordinates(this.mainDiv).left);
		
		// reccursively move panels under it... if they exist, and are displayed...
		if(this['panel' + (level + 1)] && this['panel' + (level + 1)].getStyle('display') === 'block') {
			this.movePanel(level + 1);
		}
	},
	
	cancelPanel: function() {
		this.el.value = this.currentValue;
		this.hidePanel();
		
	},
	
	hidePanel: function() {
		this.panelVisible = false;
		
		this.fadeFx.start('opacity', 1, 0).chain(function() {
			if(this.options.resetOnHide) {
				this.panelsUl.each(function(el) {
					el.setStyle('display', 'none');
					el.getChildren('li').removeClass('hover');
				});
			}
		}.bind(this));
	
	 },
	 
	concatenateValues: function() {
		var finalValue = "";
		this.panelValues.each(function(value, key) {
			finalValue = finalValue + value + "";
		});
		return finalValue;
	},
	 
	updateText: function() {
		this.el.set('value', this.concatenateValues());
		
	}
});

