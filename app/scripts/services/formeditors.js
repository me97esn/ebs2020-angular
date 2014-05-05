'use strict';

angular.module('ebs2020AngularApp')
	.service('Formeditors', function Formeditors() {

		var Form = Backbone.Form;



		var editors = Backbone.Form.editors;
		// like 'Select' editor, but will always return a boolean (true or false)

		editors.BooleanSelect = editors.Select.extend({
			initialize: function(options) {
				options.schema.options = [{
					val: '1',
					label: 'Yes'
				}, {
					val: '',
					label: 'No'
				}];
				editors.Select.prototype.initialize.call(this, options);
			},
			getValue: function() {
				return !!editors.Select.prototype.getValue.call(this);
			},
			setValue: function(value) {
				value = value ? '1' : '';
				editors.Select.prototype.setValue.call(this, value);
			}
		});

		// like the 'Select' editor, except will always return a number (int or float)
		editors.NumberSelect = editors.Select.extend({
			getValue: function() {
				return parseFloat(editors.Select.prototype.getValue.call(this));
			},
			setValue: function(value) {
				editors.Select.prototype.setValue.call(this, parseFloat(value));
			}
		});

		// https://github.com/eternicode/bootstrap-datepicker/
		editors.HTML5DatePicker = editors.Text.extend({
			initialize: function(options) {
				editors.Text.prototype.initialize.call(this, options);
				this.$el.attr('type', 'date');
			},

			getValue: function() {
				var value = this.$el.val();

				if (value) {
					return new Date(value).getTime();
				} else {
					return '';
				}
			},

			setValue: function(value) {
				if (value) {
					value = new Date(value);
					var formatted = moment(value).utc().format('YYYY-MM-DD');
					this.$el.val(formatted);
				} else {
					this.$el.val('');
				}
			},
		});

		// https://github.com/eternicode/bootstrap-datepicker/
		editors.DatePicker = editors.Text.extend({
			initialize: function(options) {
				editors.Text.prototype.initialize.call(this, options);
				this.$el.addClass('datepicker-input');
			},

			getValue: function() {
				var value = this.$el.val();
				if (value) {
					return moment(value, 'MM/DD/YYYY').format();
				} else {
					return '';
				}
			},

			setValue: function(value) {
				if (value) {
					var formatted = moment(value).utc().format('MM/DD/YYYY');
					this.$el.val(formatted);
				} else {
					this.$el.val('');
				}
			},

			render: function() {
				editors.Text.prototype.render.apply(this, arguments);
				this.$el.datepicker({
					autoclose: true
				});
				return this;
			}
		});

		// https://github.com/jonthornton/jquery-timepicker
		editors.TimePicker = editors.Text.extend({
			initialize: function(options) {
				editors.Text.prototype.initialize.call(this, options);
				this.$el.addClass('timepicker-input');
			},

			render: function() {
				editors.Text.prototype.render.apply(this, arguments);
				this.$el.timepicker({
					minTime: this.options.schema.minTime,
					maxTime: this.options.schema.maxTime
				});
				return this;
			},

			setValue: function(value) {
				if (!value) value = '';
				this.value = value;
				var ret = editors.Text.prototype.setValue.apply(this, arguments);
				return ret;
			}
		});

		// Show both a date and time field
		// https://github.com/eternicode/bootstrap-datepicker/
		// https://github.com/jonthornton/jquery-timepicker
		editors.DateTimePicker = editors.Base.extend({
			events: {
				'changeDate': 'updateHidden',
				'changeTime': 'updateHidden',
				'input input': 'updateHidden' // so that clearing time works
			},
			initialize: function(options) {
				options = options || {};
				editors.Base.prototype.initialize.call(this, options);
				// Option defaults
				this.options = _.extend({
					DateEditor: editors.DatePicker,
					TimeEditor: editors.TimePicker
				}, options);

				// Schema defaults
				this.schema = _.extend({
					minsInterval: 15,
					minTime: '4:00am',
					maxTime: '11:00pm'
				}, options.schema || {});

				this.dateEditor = new this.options.DateEditor(options);
				this.dateEditor.$el.removeAttr('name');

				var timeOptions = _(options).clone();
				timeOptions.schema = _(this.schema).clone();
				timeOptions.schema.editorAttrs.placeholder = 'Any time';
				timeOptions.model = null;
				this.timeEditor = new this.options.TimeEditor(timeOptions);
				this.timeEditor.$el.removeAttr('name');

				this.$hidden = $('<input>', {
					type: 'hidden',
					name: options.key
				});

				this.value = this.dateEditor.value;
				this.setValue(this.value);
			},

			getValue: function() {
				return this.$hidden.val();
			},

			parseTimeValue: function(value) {
				return time;
			},

			setValue: function(value) {
				this.dateEditor.setValue(value);
				// pull the time portion of an ISO formatted string
				var time = '';
				if (_.isString(value) && value.indexOf('T') !== -1) {
					var m = moment(value);
					time = m ? m.format('h:mma') : '';
				}
				this.timeEditor.setValue(time);
			},

			updateHidden: function() {
				// update the hidden input with the value we want the server to see
				// if a date and time were chosen, include ISO formatted datetime with TZ offset
				// if no time was chosen, include only the date
				var date = moment(this.dateEditor.getValue());
				var time = this.timeEditor.getValue() ? this.timeEditor.$el.timepicker('getTime') : null;
				if (date && time) {
					date.hours(time.getHours());
					date.minutes(time.getMinutes());
				}
				var value = date ? date.format() : '';
				if (value && !time) {
					value = value.substr(0, value.indexOf('T'));
				}
				this.$hidden.val(value);
			},

			render: function() {
				editors.Base.prototype.render.apply(this, arguments);

				this.$el.append(this.dateEditor.render().el);
				this.$el.append(this.timeEditor.render().el);
				this.updateHidden();
				this.$el.append(this.$hidden);
				return this;
			}
		});

		editors.Range = editors.Text.extend({
			events: _.extend({}, editors.Text.prototype.events, {
				'change': function(event) {
					this.trigger('change', this);
				}
			}),

			initialize: function(options) {
				editors.Text.prototype.initialize.call(this, options);

				this.$el.attr('type', 'range');
				if (this.schema.appendToLabel) {
					this.updateLabel();
					this.on('change', this.updateLabel, this);
				}
			},
			getValue: function() {
				var val = editors.Text.prototype.getValue.call(this);
				return parseInt(val, 10);
			},

			updateLabel: function() {
				_(_(function() {
					var $label = this.$el.parents('.bbf-field').find('label');
					$label.text(this.schema.title + ': ' + this.getValue() + (this.schema.valueSuffix || ''));
				}).bind(this)).defer();
			}
		});


		Backbone.Form.validators.notEmpty = function(options) {
			return function(value) {
				if (!value.length) {
					return {
						message: options.message
					}
				}

			}
		};


		Backbone.Form.validators.minMax = function(options) {
			return function(value) {
				if (value > options.max || value < options.min) {
					return {
						message: options.message
					}
				}
			}
		};


		Form.editors.TableRadio = Form.editors.Radio.extend({

			tagName: 'div',

			_arrayToHtml: function(array) {
				var html = [];
				var self = this;

				html.push('<td>' + this.schema.title + '</td>');

				_.each(array, function(option, index) {
					var currentItemHtml = '';
					if (_.isObject(option)) {
						var val = (option.val || option.val === 0) ? option.val : '';
						currentItemHtml += ('<td><input type="radio" name="' + self.getName() + '" value="' + val + '" id="' + self.id + '-' + index + '" /></td>');
					} else {
						currentItemHtml += ('<div class="col-md-6"><label class="radio-inline"><input type="radio" name="' + self.getName() + '" value="' + option + '" id="' + self.id + '-' + index + '" /> ' + option + '</label></div>');
					}
					html.push(currentItemHtml);
				});

				return html.join('');
			},

			getValue: function() {
				return $('input[type=radio][name=' + this.getName() + ']:checked').val();
			},
		});


		Form.editors.TableObject = Form.editors.Object.extend({
			render: function() {
				//Get the constructor for creating the nested form; i.e. the same constructor as used by the parent form
				var NestedForm = this.form.constructor;

				//Create the nested form
				this.nestedForm = new NestedForm({
					schema: this.schema.subSchema,
					data: this.value,
					idPrefix: this.id + '_',
					Field: NestedForm.NestedField
				});

				this._observeFormEvents();

				this.$el.html(this.nestedForm.render().el);

				//this.$el.children(':first').wrap('<table></table>');
				var containsRadiobuttons = this.$el.find('input[type="radio"]').length > 0;
				var containsCheckboxes = this.$el.find('input[type="checkbox"]').length > 0;

				if (!(containsCheckboxes && containsRadiobuttons)) {
					var subSchema = this.schema.subSchema;
					var firstProperty = Object.keys(subSchema)[0];
					var alternatives = subSchema[firstProperty].options;

					var thead = '<thead><th>[--Typ av samarbete--]</th>';

					alternatives.forEach(function(alternative) {
						thead += '<th>' + alternative.label + '</th>';
					});

					thead += '</thead>';

					this.$el.find('fieldset:first').wrapInner('<table class="table table-striped table-hover"><tbody></tbody></table>');
					this.$el.find('table:first').prepend(thead);
					this.$el.find('table:first > tbody div > td').parent().wrapInner('<tr></tr>');

					while (true) {
						var tr = this.$el.find('table tbody tr');

						if (tr.parent().is('span') || tr.parent().is('div')) {
							tr.unwrap();
						} else {
							break;
						}
					}
				}

				if (this.hasFocus) {
					this.trigger('blur', this);
				}

				return this;
			}
		});

		Form.template = _.template('<form class="form-horizontal" role="form" data-fieldsets></form>');

		//<label class="col-sm-12 control-label" for="<%= editorId %>"><%= title %></label>\
		Form.Field.template = _.template('\
    <div class="form-group field-<%= key %>">\
    <label class="col-sm-6 control-label" for="<%= editorId %>"><%= title %></label>\
      <div class="col-sm-6">\
        <span data-editor></span>\
        <p class="help-block" data-error></p>\
        <p class="help-block"><%= help %></p>\
      </div>\
    </div>\
  ');

		Form.NestedField.template = _.template('\
    <div class="field-<%= key %>">\
      <div title="<%= title %>" class="input-xlarge">\
        <span data-editor></span>\
        <div class="help-inline" data-error></div>\
      </div>\
      <div class="help-block"><%= help %></div>\
    </div>\
  ');

		Form.Field.errorClassName = 'has-error';

		console.groupCollapsed('Form editors');

		Object.keys(Form.editors).forEach(function(editor) {
			console.log(editor);
		});

		console.groupEnd();


		Form.editors.InlineObject = Form.editors.Object.extend({
			render: function() {
				//Get the constructor for creating the nested form; i.e. the same constructor as used by the parent form
				var NestedForm = this.form.constructor;

				//Create the nested form
				this.nestedForm = new NestedForm({
					schema: this.schema.subSchema,
					data: this.value,
					idPrefix: this.id + '_',
					Field: NestedForm.NestedField
				});

				this._observeFormEvents();

				this.$el.html(this.nestedForm.render().el);
				this.$el.attr('data-modify', 'inline');

				if (this.hasFocus) this.trigger('blur', this);

				return this;
			}
		});


		Form.editors.CheckboxTitle = Form.editors.Checkbox.extend({
			render: function() {
				this.setValue(this.value);
				this.$el.attr('data-label', this.schema.title);
				return this;
			}
		});



		Form.editors.Checkboxes.prototype.tagName = 'div';

		Form.editors.Checkboxes.prototype._arrayToHtml = function(array) {
			var html = [];
			var self = this;

			_.each(array, function(option, index) {
				var itemHtml = '<div class="checkbox">';
				var close = true;
				if (_.isObject(option)) {
					if (option.group) {
						var originalId = self.id;
						self.id += "-" + self.groupNumber++;
						itemHtml = ('<fieldset class="group"> <legend>' + option.group + '</legend>');
						itemHtml += (self._arrayToHtml(option.options));
						itemHtml += ('</fieldset>');
						self.id = originalId;
						close = false;
					} else {
						var val = (option.val || option.val === 0) ? option.val : '';
						itemHtml += ('<label><input type="checkbox" name="' + self.getName() + '" value="' + val + '" id="' + self.id + '-' + index + '" /> ' + option.label + '</label>');
					}
				} else {
					itemHtml += ('<label><input type="checkbox" name="' + self.getName() + '" value="' + option + '" id="' + self.id + '-' + index + '" /> ' + option + '</label>');
				}
				if (close) {
					itemHtml += '</div>';
				}
				html.push(itemHtml);
			});

			return html.join('');
		};


	});