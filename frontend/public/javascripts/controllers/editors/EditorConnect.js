define(function(require, exports, module) {
		

	var
		$ = require('jquery'),
		// EntityEditor = require('controllers/editors/EntityEditor'),
		OICProvider = require('models/OICProvider'),
		UserInteractionRule = require('models/UserInteractionRule'),

		Editor = require('./Editor'),
		hogan = require('lib/hogan');

	// UWAP.utils.loadCSS("/stylesheets/textexecdisplay.css");

	var tmpl = require('lib/text!/templates/editor.connect.html');
	var template = hogan.compile(tmpl);

	var tmplui = require('lib/text!/templates/uirule.html');
	var templateui = hogan.compile(tmplui);

	var EditorConnect = Editor.extend({
		init: function(pane, el) {
			this.identifier = 'connect';
			this.item = new OICProvider();
			this._super(pane, el);

			console.log("Initializing EditorConnect");

			this.el.on('click', 'button#userinteraction_reset', this.proxy('resetInteraction'));

			$(this.el).empty().append(template.render(this.item));

			this.update();
	    },
	    
		proxy: function(x) {
			return $.proxy(this[x], this);
		},

		update: function() {
			if (this.item.metadata.provider.dynamic) {
				this.el.find("#discovery_endpoint").val(this.item.metadata.provider.dynamic);
			}

			this.el.find('div#userinteractions').empty();
			if (this.item.metadata.interaction && this.item.metadata.interaction.length > 0) {
				this.el.find('fieldset#userInteractionDisplay').show();
				for(var i = 0; i < this.item.metadata.interaction.length; i++) {
					var uir = new UserInteractionRule(this.item.metadata.interaction[i]);

					this.el.find('div#userinteractions').append(templateui.render(uir));
				}
			} else {
				this.el.find('fieldset#userInteractionDisplay').hide();	
			}
			// Hack to make synaxhightlight work with jquery templates..
			// var template = $("#" + this.templateID).tmpl( this.item );
		},
		remove: function() {
			this.release();
		},
		setEntry: function(item) {
			this.item = item;
		},

		getItem: function() {

			var endpoint = this.el.find("#discovery_endpoint").val();

			this.item.metadata.provider.dynamic = endpoint;

			this.saveMetadata(this.item.metadata);

			return this.item;

		},
		addUserInteraction: function(ia) {
			console.log("Adding user interaction to connect editor item", ia);
			if (!this.item.metadata.interaction) this.item.metadata.interaction = [];
			this.item.metadata.interaction.push(ia);
			this.update();
		},
		resetInteraction: function(e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			
			delete this.item.metadata.interaction;
			this.update();
			// this.item.save();
			// this.item.edit();
				
		}

	});

	return EditorConnect;
	
});