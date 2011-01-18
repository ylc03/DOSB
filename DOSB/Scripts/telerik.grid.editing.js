(function ($) {

    var $t = $.telerik;

    var UnobtrusiveValidator = function(formId){	
        this.formId = formId;
        this._isBuild = false;
		var data_validation = "tUnobtrusiveValidation";
        var data_container = "tUnobtrusiveContainer";
		var unobtrusive = this.unobtrusive = {
				adapters: [],
				parseElement: function (element, skipAttach) {           
					var $element = $(element),
						form = $element.parents("form")[0],
						valInfo, rules, messages;

					if (!form) {
						return;
					}

					valInfo = unobtrusive.validationInfo(form);
					valInfo.options.rules[element.name] = rules = {};
					valInfo.options.messages[element.name] = messages = {};

					$.each(this.adapters, function () {
						var prefix = "data-val-" + this.name,
							message = $element.attr(prefix),
							paramValues = {};

						if (message !== undefined) {
							prefix += "-";

							$.each(this.params, function () {
								paramValues[this] = $element.attr(prefix + this);
							});

							this.adapt({
								element: element,
								form: form,
								message: message,
								params: paramValues,
								rules: rules,
								messages: messages
							});
						}
					});

					if (!skipAttach) {
						valInfo.attachValidation();
					}
				},

				parse: function (selector) {            
					$(selector).find(":input[data-val=true]").each(function () {
						unobtrusive.parseElement(this, true);
					});

					$("form").each(function () {
						var info = unobtrusive.validationInfo(this);
						if (info) {
							info.attachValidation();
						}
					});
				},            

				onError: function(error, inputElement) {    
					var container = $(this).find("[data-valmsg-for='" + inputElement[0].name + "']"),
						replace = $.parseJSON(container.attr("data-valmsg-replace")) !== false;

					container.removeClass("field-validation-valid").addClass("field-validation-error");
					error.data(data_container, container);

					if (replace) {
						container.empty();
						error.removeClass("input-validation-error").appendTo(container);
					}
					else {
						error.hide();
					}
				},

				onErrors: function(form, validator) {
					var container = $(this).find("[data-valmsg-summary=true]"),
						list = container.find("ul");

					if (list && list.length && validator.errorList.length) {
						list.empty();
						container.addClass("validation-summary-errors").removeClass("validation-summary-valid");

						$.each(validator.errorList, function () {
							$("<li />").html(this.message).appendTo(list);
						});
					}
				},

				onSuccess: function(error) {
					var container = error.data(data_container),
						replace = $.parseJSON(container.attr("data-valmsg-replace"));

					if (container) {
						container.addClass("field-valiion-valid").removeClass("field-validation-error");
						error.removeData(data_container);

						if (replace) {
							container.empty();
						}
					}
				},

				validationInfo: function(form) {        
					var $form = $(form),
						result = $form.data(data_validation);

					if (!result) {
						result = {
							options: { 
								errorClass: "input-validation-error",
								errorElement: "span",
								errorPlacement: $.proxy(unobtrusive.onError, form),
								invalidHandler: $.proxy(unobtrusive.onErrors, form),
								messages: {},
								rules: {},
								success: $.proxy(unobtrusive.onSuccess, form)
							},
							attachValidation: function () {
								$form.validate(this.options);
							},
							validate: function () {           
								$form.validate();
								return $form.valid();
							}
						};
						$form.data(data_validation, result);
					}

					return result;
				}    
		};            
	};
	
	UnobtrusiveValidator.prototype = {		
		build: function()
		{
            if (this._isBuild)
                return;

            this._isBuild = true;

            var adapters = [];
			function setValidationValues(options, ruleName, value) {
				options.rules[ruleName] = value;
				if (options.message) {
					options.messages[ruleName] = options.message;
				}
			}

			function splitAndTrim(value) {
				return value.replace(/^\s+|\s+$/g, "").split(/\s*,\s*/g);
			}
	
			adapters = this.unobtrusive.adapters;
			adapters.add = function (adapterName, params, fn) {        
				if (!fn) {
					fn = params;
					params = [];
				}
				this.push({ name: adapterName, params: params, adapt: fn });
				return this;
			};

			adapters.addBool = function (adapterName, ruleName) {       
				return this.add(adapterName, function (options) {
					setValidationValues(options, ruleName || adapterName, true);
				});
			};

			adapters.addMinMax = function (adapterName, minRuleName, maxRuleName, minMaxRuleName, minAttribute, maxAttribute) {       
				return this.add(adapterName, [minAttribute || "min", maxAttribute || "max"], function (options) {
					var min = options.params.min,
						max = options.params.max;

					if (min && max) {
						setValidationValues(options, minMaxRuleName, [min, max]);
					}
					else if (min) {
						setValidationValues(options, minRuleName, min);
					}
					else if (max) {
						setValidationValues(options, maxRuleName, max);
					}
				});
			};

			adapters.addSingleVal = function (adapterName, attribute, ruleName) {       
				return this.add(adapterName, [attribute || "val"], function (options) {
					setValidationValues(options, ruleName || adapterName, options.params[attribute]);
				});
			};
			   
			adapters.addSingleVal("accept", "exts").addSingleVal("regex", "pattern");
			adapters.addBool("creditcard").addBool("date").addBool("digits").addBool("email").addBool("number").addBool("url");
			adapters.addMinMax("length", "minlength", "maxlength", "rangelength").addMinMax("range", "min", "max", "range");
			adapters.add("equalto", ["other"], function (options) {
				var element = $(options.form).find(":input[name=" + options.params.other + "]")[0];
				setValidationValues(options, "equalTo", element);
			});
			adapters.add("required", function (options) {                   
				if (options.element.tagName.toUpperCase() !== "INPUT" || options.element.type.toUpperCase() !== "CHECKBOX") {
					setValidationValues(options, "required", true);
				}
			});
			adapters.add("remote", ["url", "type", "fields"], function (options) {
				var value = {
					url: options.params.url,
					type: options.params.type || "GET",
					data: {}
				};
				$.each(splitAndTrim(options.params.fields || options.element.name), function (i, fieldName) {
					value.data[fieldName] = function () {
						return $(options.form).find(":input[name='" + fieldName + "']").val();
					};
				});

				setValidationValues(options, "remote", value);
			});

			if ($.validator.unobtrusive && $.validator.unobtrusive.adapters) 
				$.extend(adapters, $.validator.unobtrusive.adapters);

			$.validator.addMethod("regex", function (value, element, params) {
				if (this.optional(element))
					return true;

				var match = new RegExp(params).exec(value);
				return match && match.index == 0 && match[0].length == value.length;
			});

			$.validator.addMethod('number', function (value, element) {
				var groupSize = $t.cultureInfo.numericgroupsize;
				var builder = new $t.stringBuilder();

				builder.cat('^-?(?:\\d+|\\d{1,')
					   .cat(groupSize)
					   .cat('}(?:')
					   .cat($t.cultureInfo.numericgroupseparator)
					   .cat('\\d{')
					   .cat(groupSize)
					   .cat('})+)(?:\\')
					   .cat($t.cultureInfo.numericdecimalseparator)
					   .cat('\\d+)?$');

				return this.optional(element) || new RegExp(builder.string()).test(value);
			});
		},
        parse: function()
        {
            this.build();
            this.unobtrusive.parse(this.formId);
        }
	};    

    var Mvc2Validator = function(validationMetaData)
	{
        this.validationMetaData = validationMetaData;
	};
	
	Mvc2Validator.prototype = {
		build: function(validationContext){

            $.validator.addMethod("regex", function (value, element, params) {
				if (this.optional(element))
					return true;

				var match = new RegExp(params).exec(value);
				return match && match.index == 0 && match[0].length == value.length;
			});

			$.validator.addMethod('number', function (value, element) {
				var groupSize = $t.cultureInfo.numericgroupsize;
				var builder = new $t.stringBuilder();

				builder.cat('^-?(?:\\d+|\\d{1,')
					   .cat(groupSize)
					   .cat('}(?:')
					   .cat($t.cultureInfo.numericgroupseparator)
					   .cat('\\d{')
					   .cat(groupSize)
					   .cat('})+)(?:\\')
					   .cat($t.cultureInfo.numericdecimalseparator)
					   .cat('\\d+)?$');

				return this.optional(element) || new RegExp(builder.string()).test(value);
			});

			function applyRangeValidator(object, min, max) {
				object["range"] = [min, max];
			};

			function applyRegularExpressionValidator(object, pattern) {
				object["regex"] = pattern;
			};

			function applyRequiredValidator(object) {
				object["required"] = true;
			};

			function applyStringLengthValidator(object, maxLength) {
				object["maxlength"] = maxLength;
			};

			function applyUnknownValidator(object, validationType, validationParameters) {
				object[validationType] = validationParameters;
			};

			function createFieldToValidationMessageMapping(validationFields) {
				var mapping = {};

				for (var i = 0; i < validationFields.length; i++) {
					var thisField = validationFields[i];
					mapping[thisField.FieldName] = "#" + thisField.ValidationMessageId;
				}

				return mapping;
			};

			function createErrorMessagesObject(validationFields) {
				var messagesObj = {};

				for (var i = 0; i < validationFields.length; i++) {
					var thisField = validationFields[i];
					var thisFieldMessages = {};
					messagesObj[thisField.FieldName] = thisFieldMessages;
					var validationRules = thisField.ValidationRules;

					for (var j = 0; j < validationRules.length; j++) {
						var thisRule = validationRules[j];
						if (thisRule.ErrorMessage) {
							var jQueryValidationType = thisRule.ValidationType;
							switch (thisRule.ValidationType) {
								case "regularExpression":
									jQueryValidationType = "regex";
									break;

								case "stringLength":
									jQueryValidationType = "maxlength";
									break;
							}

							thisFieldMessages[jQueryValidationType] = thisRule.ErrorMessage;
						}
					}
				}

				return messagesObj;
			}
			function createRulesForField(validationField) {
				var validationRules = validationField.ValidationRules;

				// hook each rule into jquery
				var rulesObj = {};
				for (var i = 0; i < validationRules.length; i++) {
					var thisRule = validationRules[i];
					switch (thisRule.ValidationType) {
						case "range":                                   
                            var min = !(!!thisRule.ValidationParameters["minimum"]) ? thisRule.ValidationParameters["min"] : thisRule.ValidationParameters["minimum"];
                            var max = !(!!thisRule.ValidationParameters["maximum"]) ? thisRule.ValidationParameters["max"] : thisRule.ValidationParameters["maximum"];
							applyRangeValidator(rulesObj,
								    min, max);
							break;

						case "regularExpression":
						case "regex":
							applyRegularExpressionValidator(rulesObj,
								thisRule.ValidationParameters["pattern"]);
							break;

						case "required":
							applyRequiredValidator(rulesObj);
							break;

						case "stringLength":                
							applyStringLengthValidator(rulesObj,
								thisRule.ValidationParameters["maximumLength"]);
							break;
						case "length":
							applyStringLengthValidator(rulesObj,
								thisRule.ValidationParameters["max"]);
							break;
						default:
							applyUnknownValidator(rulesObj,
								thisRule.ValidationType, thisRule.ValidationParameters);
							break;
					}
				}

				return rulesObj;
			}

			function createValidationOptions(validationFields) {
				var rulesObj = {};
				for (var i = 0; i < validationFields.length; i++) {
					var validationField = validationFields[i];
					var fieldName = validationField.FieldName;
					rulesObj[fieldName] = createRulesForField(validationField);
				}

				return rulesObj;
			}
			
			var theForm = $("#" + validationContext.FormId);

			var fields = validationContext.Fields;
			var rulesObj = createValidationOptions(fields);
			var fieldToMessageMappings = createFieldToValidationMessageMapping(fields);
			var errorMessagesObj = createErrorMessagesObject(fields);

			var options = {
				errorClass: "input-validation-error",
				errorElement: "span",
				errorPlacement: function (error, element) {
					var messageSpan = fieldToMessageMappings[element.attr("name")];
					if (messageSpan) {
						$(messageSpan).empty()
										.removeClass("field-validation-valid")
										.addClass("field-validation-error")

						error.removeClass("input-validation-error")
							 .attr("_for_validation_message", messageSpan)
							 .appendTo(messageSpan);
					}
				},
				messages: errorMessagesObj,
				rules: rulesObj,
				success: function (label) {
					$(label.attr("_for_validation_message"))
						.empty()
						.addClass("field-validation-valid")
						.removeClass("field-validation-error");
				}
			};
			theForm.validate(options);			
		},
		parse: function(){
			this.build(this.validationMetaData);
		}
	};    

    function getCommand(columns, name) {
        for (var i = 0, len = columns.length; i < len; i++) {
            if (columns[i].commands) {
                var commands = columns[i].commands;
                for (var j = 0, length = commands.length; j < length; j++) {
                    if (commands[j].name == name) return commands[j];
                }
            }
        }
        return {};
    }

    $t.editing = {};
    
    function cancelAll() {
        $(document.body).find('div.t-grid')
                        .each(function() {
                            var grid = $(this).data('tGrid');
                            if (grid && grid.cancel)
                                grid.cancel();
                        });
    }

    $t.editing.initialize = function (grid) {
        $.extend(grid, this.implementation);
        var $element = $(grid.element);

        if (grid.isAjax()) {
            $element.delegate('.t-grid-edit', 'click', $t.stopAll(function (e) {
                grid.editRow($(this).closest('tr'));
            }))
            .delegate('.t-grid-cancel', 'click', $t.stopAll(function (e) {
                grid.cancel();
            }))
            .delegate('.t-grid-delete', 'click', $t.stopAll(function (e) {
                grid.deleteRow($(this).closest('tr'));
            }))
            .delegate('.t-grid-update', 'click', $t.stopAll(function (e) {
                grid.save(this, $.proxy(function () {
                    grid.updateRow($(this).closest('form').closest('tr'));
                }, this));
            }))
            .delegate('.t-grid-add', 'click', $t.stopAll(function (e) {
                grid.addRow();
            }))
            .delegate('.t-grid-insert', 'click', $t.stopAll(function (e) {
                grid.save(this, $.proxy(function () {
                    grid.insertRow($(this).closest('form').closest('tr'));
                }, this));
            }))
        } else {
            $element.delegate('.t-grid-delete', 'click', $t.stop(function (e) {
                if (grid.editing.confirmDelete !== false && !confirm(grid.localization.deleteConfirmation))
                    e.preventDefault();
            }));

            grid.validation();
        }

        grid.errorView = new $t.grid.ErrorView();

        grid.modelBinder = new $t.grid.ModelBinder();

        grid.formViewBinder = new $t.grid.FormViewBinder({
            'date': function (name, value) {
                var column = grid.columnFromMember(name);
                var format = column ? column.format : '';
                return $t.formatString(format || '{0:G}', value);
            }
        });

        $element.delegate(':input:not(.t-button)', 'keydown', $t.stop(function (e) {
            var keyMap = { 13: '.t-grid-update, .t-grid-insert', 27: '.t-grid-cancel' };
            $(this).closest('tr').find(keyMap[e.keyCode]).click();
        }));        
    }

    function popup(options) {
        var remove = function () {
            result.data('tWindow').close();
            result.remove();
        }

        var result = $('<div />', { id: options.element.id + 'PopUp' })
                .appendTo(options.element)
                .css({ top: 0, left: '50%', marginLeft: -90 })
                .tWindow(options.settings)
                .delegate('.t-grid-cancel', 'click', $t.stopAll(function () {
                    remove();
                }));

        $(options.element).unbind('dataBound').bind('dataBound', function () {
            $(this).unbind('dataBound', arguments.callee);
            remove();
        });

        $.each(['insert', 'update'], function (index, value) {
            if (options[value])
                result.undelegate('.t-grid-' + value, 'click')
                      .delegate('.t-grid-' + value, 'click', $t.stopAll(function (e) {
                          options[value](e.target, result);
                      }));
        });

        result
            .find('.t-close')
            .bind('click', $t.stopAll(remove))
            .end()
            .data('tWindow')
            .title(options.title)
            .content(options.content)
            .open();

        return result;
    }

    $t.editing.implementation = {
        insertRow: function ($tr) {
            var values = this.extractValues($tr);

            if ($t.trigger(this.element, 'save', { mode: 'insert', values: values, form: $tr.find('form')[0] }))
                return;

            this.sendValues(values, 'insertUrl');
        },

        updateRow: function ($tr) {
            var dataItem = this.dataItem($tr.data('tr') || $tr);
            var values = this.extractValues($tr, true);
            if ($t.trigger(this.element, 'save', { mode: 'edit', dataItem: dataItem, values: values, form: $tr.find('form')[0] }))
                return;

            this.sendValues(values, 'updateUrl');
        },

        deleteRow: function ($tr) {
            if ($t.trigger(this.element, 'delete', { dataItem: this.dataItem($tr) }))
                return;

            if (this.editing.confirmDelete === false || confirm(this.localization.deleteConfirmation))
                this.sendValues(this.extractValues($tr, true), 'deleteUrl');
        },

        editRow: function ($tr) {
            cancelAll();
            var html = new $t.stringBuilder();

            var edit = getCommand(this.columns, 'edit');

            this.form(html,
                      [{ name: 'update', attr: edit.attr, buttonType: edit.buttonType, imageAttr: edit.imageAttr },
                       { name: 'cancel', attr: edit.attr, buttonType: edit.buttonType, imageAttr: edit.imageAttr}],
                      $tr.find('.t-hierarchy-cell').find('.t-icon').hasClass('t-plus'));

            var dataItem = this.dataItem($tr);
            var $td = $(html.string());
            $td.find('form').submit($t.preventDefault);
            $td.children().hide();

            var cells = $td.find('tr:first td:not(.t-group-cell, .t-hierarchy-cell)');

            var mode = this.editing.mode;

            if (mode != 'PopUp') {
                $tr.html($td);
            } else {
                popup({
                    title: this.localization.edit,
                    element: this.element,
                    settings: this.editing.popup,
                    content: $td,
                    update: $.proxy(function (target, $popup) {
                        this.save(target, $.proxy(function () {
                            $popup.data('tr', $tr);
                            this.updateRow($popup);
                        }, this));
                    }, this)
                });
            }

            this.formViewBinder.bind($td, dataItem);

            if (mode == 'InLine')
                $.each(this.columns, function (i) {
                    if (this.readonly)
                        cells.eq(i).html(this.display(dataItem));
                })

            $td.children().show();
            $t.trigger(this.element, 'edit', {
                mode: 'edit',
                form: $td.find('form')[0] || $td[0],
                dataItem: dataItem
            });

            this.validation();
        },

        addRow: function () {
            cancelAll();
            var html = new $t.stringBuilder();
            var mode = this.editing.mode;
            var edit = getCommand(this.columns, 'edit');
            var $td;

            if (mode != 'PopUp') {
                html.cat('<tr class="t-grid-new-row">');
                this.form(html, [{ name: 'insert', attr: edit.attr, buttonType: edit.buttonType, imageAttr: edit.imageAttr },
                                 { name: 'cancel', attr: edit.attr, buttonType: edit.buttonType, imageAttr: edit.imageAttr}]);
                html.cat('</tr>');
                var $frm = $(html.string());
                $frm.find('form').submit($t.preventDefault);
                $td = $frm.prependTo(this.$tbody);
            } else {
                this.form(html, [{ name: 'insert', attr: edit.attr, buttonType: edit.buttonType, imageAttr: edit.imageAttr },
                                 { name: 'cancel', attr: edit.attr, buttonType: edit.buttonType, imageAttr: edit.imageAttr}]);

                $td = $(html.string());
                $td.find('form').submit($t.preventDefault);
                popup({
                    title: this.localization.insert,
                    element: this.element,
                    settings: this.editing.popup,
                    content: $td,
                    insert: $.proxy(function (target, $popup) {
                        this.save(target, $.proxy(function () {
                            this.insertRow($popup);
                        }, this));
                    }, this)
                });
            }

            $t.trigger(this.element, 'edit', { mode: 'insert', form: $td.find('form')[0] || $td[0] })

            this.validation();
        },

        extractValues: function ($tr, extractKeys) {
            var values = this.modelBinder.bind($tr);

            if (extractKeys) {
                var dataItem = this.dataItem($tr.data('tr') || $tr);

                for (var dataKey in this.dataKeys) {
                    var value = this.valueFor({ member: dataKey })(dataItem);
                    if (value instanceof Date)
                        value = $t.formatString('{0:G}', value);
                    
                    values[this.ws ? dataKey : this.dataKeys[dataKey]] = value;
                }
            }
            return values;
        },

        cancelRow: function ($tr) {
            if (!$tr.length)
                return;

            if ($tr.is('.t-grid-new-row')) {
                var $tbody = $tr.closest('tbody');
                $tr.remove();

                if ($.browser.msie)
                    $tbody.hide().show();
                return;
            }

            var dataItem = this.dataItem($tr);
            var html = new $t.stringBuilder();

            var expanding = $tr.find('.t-hierarchy-cell').find('.t-icon').hasClass('t-plus');

            html.rep('<td class="t-group-cell" />', this.groups.length)
                .catIf('<td class="t-hierarchy-cell"><a href="#" class="t-icon ' + (expanding ? 't-plus' : 't-minus') + '"></a></td>', this.detail);

            $.each(this.columns, $.proxy(function (i, c) {
                html.cat('<td')
                  .cat(c.attr)
                  .catIf(' class="t-last"', i == this.columns.length - 1)
                  .cat('>');

                if (c.display)
                    html.cat(c.display(dataItem));

                this.appendCommandHtml(c.commands, html);

                html.cat('</td>');

            }, this));

            $tr.html(html.string());

            $t.trigger(this.element, 'rowDataBound', { row: $tr[0], dataItem: dataItem });
        },

        form: function (html, commands, expanding) {
            var colgroup = this.$tbody.siblings('colgroup');

            var mode = this.editing.mode;

            if (mode != 'PopUp')
                html.cat('<td class="t-edit-container" colspan="')
                    .cat(this.columns.length + this.groups.length + (this.detail ? 1 : 0))
                    .cat('">');

            html.cat('<form class="t-edit-form" action="#" method="post" id="')
                .cat(this.formId())
                .cat('">');

            if (mode == 'InLine') {
                html.cat('<table cellspacing="0"><colgroup>');

                $(this.element).find('colgroup:first').children()
                    .each(function () {
                        var width = this.style.width;

                        if ($(this).hasClass('t-group-col'))
                            html.cat('<col class="t-group-col" />');
                        else if (width != '0px')
                            html.cat('<col style="width:').cat(width).cat('" />');
                        else
                            html.cat('<col />');
                    });

                var hierarchyCellHtml = new $t.stringBuilder();
                hierarchyCellHtml.cat('<td class="t-hierarchy-cell">')
                                 .catIf('<a href="#" class="t-icon ' + (expanding ? 't-plus' : 't-minus') + '"></a>', expanding != undefined)
                                 .cat('</td>');

                html.cat('</colgroup><tbody><tr>')
                    .rep('<td class="t-group-cell" />', this.groups.length)
                    .catIf(hierarchyCellHtml.string(), this.detail);

                $.each(this.columns, $.proxy(function (i, c) {
                    html.cat('<td')
                        .cat(c.attr)
                        .catIf(' class="t-last"', i == this.columns.length - 1)
                        .cat('>')
                        .catIf(unescape(c.editor), c.editor)
                        .catIf('&nbsp;', !c.editor && !c.commands);

                    if (c.commands) {
                        var hasEditCommand = $.grep(c.commands, function (cmd) { return cmd.name == 'edit' })[0];

                        this.appendCommandHtml(hasEditCommand ? commands : c.commands, html);
                    }

                    html.cat('</td>');
                }, this));

                html.cat('</tr></tbody></table>');
            } else {
                html.cat('<div class="t-edit-form-container">')
                    .cat(unescape(this.editing.editor))

                this.appendCommandHtml(commands, html);

                html.cat('</div>');
            }

            html.cat('</form>')
            html.catIf('</td>', mode != 'PopUp');
        },

        save: function (element, callback) {
            $(element).closest('form').validate().form() && callback();
        },

        cancel: function () {
            this.cancelRow($('#' + this.formId()).closest('tr'));
        },

        sendValues: function (values, url) {
            if (this.ws)
                for (var key in values) {
                    var column = this.columnFromMember(key);
                    if (column && column.type == 'Date') {
                        var date = $t.datetime.parse({ value: values[key], format: $t.cultureInfo.shortDate }).toDate();
                        values[key] = '\\/Date(' + date.getTime() + ')\\/';
                    }
                }

            $.ajax(this.ajaxOptions({
                data: this.ws ? { value: values} : values,
                url: this.url(url),
                hasErrors: $.proxy(this.hasErrors, this),
                displayErrors: $.proxy(this.displayErrors, this)
            }));
        },

        displayErrors: function (data) {
            this.errorView.bind($('#' + this.formId()), data.modelState);
        },

        hasErrors: function (data) {
            var modelState = data.modelState;
            var result = false;

            if (modelState) {
                $.each(modelState, function (key, value) {
                    if ('errors' in value) {
                        result = true;
                        return false;
                    }
                });
            }

            return result;
        },

        formId: function () {
            return $(this.element).attr('id') + 'form';
        },

        validation: function () {
            this.validator().parse();
        },

        validator: function(){
            if (!this._validator){
                if (this.validationMetadata){
                   this._validator = new Mvc2Validator(this.validationMetadata);
                } else {
                    this._validator = new UnobtrusiveValidator($("#" + this.formId()));            
                }
            }
            return this._validator;
        }
    }

    $t.grid.ModelBinder = function () {
        this.binders = {
            ':input': function () {
                return $(this).val();
            },
            ':checkbox': function () {
                return $(this).is(':checked');
            }
        };

        this.bind = function ($ui) {
            var model = {};

            $.each(this.binders, function (selector, callback) {
                $ui.find(selector).each(function () {
                    if (!this.disabled) model[this.name] = callback.call(this);
                });
            });

            return model;
        }
    }

    $t.grid.FormViewBinder = function (converters) {
        this.converters = converters || {};
        this.binders = {
            ':input': function (value) {
                $(this).val(value);
            },
            ':checkbox': function (value) {
                $(this).attr('checked', value == true)
            }
        };

        function evaluator(type) {
            return function (value) {
                $(this).parent()
                       .data(type)
                       .value(value);
            };
        }

        this.binders['.t-numerictextbox :input:hidden'] = evaluator('tTextBox');
        this.binders['.t-dropdown :input:hidden'] = evaluator('tDropDownList');
        this.binders['.t-combobox :input:hidden'] = evaluator('tComboBox');

        this.evaluate = function (model, expression) {
            if (expression != null) {
                var value = model, match = false, members = expression.split('.');

                while (members.length) {
                    var member = members.shift();
                    if (value != null && typeof (value[member]) != 'undefined') {
                        value = value[member];
                        match = true;
                    } else if (match) {
                        match = false;
                        break;
                    }
                }

                if (match && !$.isPlainObject(value)) {
                    var date = /^\/Date\((.*?)\)\/$/.exec(value);
                    if (date)
                        value = new Date(parseInt(date[1]));

                    var type = $t.getType(value);

                    if (type in this.converters)
                        value = this.converters[type](expression, value);

                    return value;
                }
            }
        }

        this.bind = function ($ui, model) {
            var undefined;

            $.each(this.binders, $.proxy(function (selector, callback) {
                $ui.find(selector).each($.proxy(function (index, element) {
                    var value = this.evaluate(model, element.name);
                    if (value != undefined)
                        callback.call(element, value);
                }, this));
            }, this));
        }
    }

    $t.grid.ErrorView = function () {
        this.bind = function ($ui, modelState) {
            $ui.find('span[id$=_validationMessage]')
               .removeClass('field-validation-error')
               .addClass('field-validation-valid')
               .html('')
               .end()
               .find('.input-validation-error')
               .removeClass('input-validation-error')
               .addClass('valid');

            $.each(modelState, function (key, value) {
                if ('errors' in value && value.errors[0]) {
                    $ui.find('#' + key + '_validationMessage')
                       .html(value.errors[0])
                       .removeClass('field-validation-valid')
                       .addClass('field-validation-error')
                       .end()
                       .find('#' + key)
                       .removeClass('valid')
                       .addClass('input-validation-error');
                }
            });
        }
    }
})(jQuery);
