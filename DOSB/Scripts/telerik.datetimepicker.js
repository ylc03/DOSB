(function ($) {

    var $t = $.telerik;

    $t.datetimepicker = function (element, options) {
        $.extend(this, options);
        this.element = element;
        var $element = this.$element = $(element);
        var $input = this.$input = $element.find('.t-input')
                                    .bind({
                                        change: function (e) { e.stopPropagation(); },
                                        keydown: $.proxy(this._keydown, this),
                                        focus: $.proxy(function (e) {
                                            this._change($input.val());
                                            this.$input.removeClass('t-state-error');
                                        }, this)
                                    });

        this.inputValue = $input.val();

        $element.find('.t-icon-clock')
                .bind('click', $.proxy(this._toggleTimeView, this))
                .end()
                .find('.t-icon-calendar')
                .bind('click', $.proxy(this._toggleDateView, this));

        this.timeView = new $t.timeView({
            effects: this.effects,
            dropDownAttr: this.dropDownAttr,
            format: this.timeFormat,
            interval: this.interval,
            isRtl: $input.closest('.t-rtl').length,
            minValue: this.startTimeValue,
            maxValue: this.endTimeValue,
            onNavigateWithOpenPopup: $.proxy(function (value) {
                var date = this.parse(value, this.timeFormat);
                this.$input.val($t.datetime.format(date.toDate(), this.format));
            }, this),
            onChange: $.proxy(function (value) {
                this._change(this.parse(value, this.timeFormat));
                this._close('time');
            }, this)
        });

        this.dateView = new $t.dateView({
            selectedValue: this.selectedValue,
            minValue: this.minValue,
            maxValue: this.maxValue,
            effects: this.effects,
            isRtl: $input.closest('.t-rtl').length,
            onChange: $.proxy(function (value) {
                this._change(value);
                this._close('date');
            }, this)
        });

        $(document.documentElement).bind('mousedown', $.proxy(function (e) {
            var $calendar = this.dateView.$calendar;
            if (!$calendar) return;

            var $dropDown = this.timeView.dropDown.$element;
            var isDropDown = $dropDown && $dropDown.parent().length > 0;
            var associatedDateView = $calendar.data('associatedDateView');

            var target = e.target;
            if ($.contains(this.element, target)
            || (associatedDateView && associatedDateView == this.dateView && $.contains($calendar[0], target))
            || (isDropDown && $.contains($dropDown.parent()[0], target)))
                return;

            this._change(this.$input.val());
            this._close('date');
            this._close('time');

        }, this));

        $t.bind(this, {
            open: this.onOpen,
            close: this.onClose,
            change: this.onChange,
            load: this.onLoad
        });
    }

    $t.datetimepicker.prototype = {
        _change: function (newValue) {
            var minValue = this.minValue;
            var maxValue = this.maxValue;
            var parsedValue = this.parse(newValue);
            var selectedValue = this.selectedValue;

            if (parsedValue != null) {
                if (parsedValue.value - minValue.value <= 0)
                    parsedValue = minValue;
                else if (parsedValue.value - maxValue.value >= 0)
                    parsedValue = maxValue;
            }

            if ((selectedValue === null && parsedValue !== null)
            || (selectedValue !== null && parsedValue === null)
            || (selectedValue && parsedValue && (selectedValue.value > parsedValue.value
                                                || parsedValue.value > selectedValue.value))) {

                $t.trigger(this.element, 'change', {
                    previousValue: selectedValue === null ? null : selectedValue.toDate(),
                    value: parsedValue === null ? null : parsedValue.toDate()
                });
            }

            this._value(parsedValue);
        },

        _value: function (value) {
            var text = this.$input.val();
            var isNull = value === null;
            var dateView = this.dateView;
            var associatedDateView = dateView.$calendar.data('associatedDateView');

            this.selectedValue = value;
            this.timeView.value(isNull ? null : $t.datetime.format(value.toDate(), this.timeFormat));
            if (associatedDateView && associatedDateView == dateView)
                dateView.value(value);

            if (!isNull)
                text = $t.datetime.format(value.toDate(), this.format);

            this.inputValue = text;
            this.$input.toggleClass('t-state-error', isNull && text != '')
                       .val(text);
        },

        _open: function (popup) {
            if (!this[popup == "time" ? 'timeView' : 'dateView'].isOpened())
                this._trigger(popup, 'open');
        },

        _close: function (popup) {
            var dateView = this.dateView;
            var dropDown = this.timeView.dropDown;

            if ((popup == "time" && !dropDown.$element.is(':animated') && dropDown.isOpened())
            || (!dateView.$calendar.is(':animated') && dateView.isOpened()))
                this._trigger(popup, 'close');
        },

        _trigger: function (popup, methodName) {
            if (!$t.trigger(this.element, methodName, { popup: popup }))
                this[methodName](popup)
        },

        _keydown: function (e) {
            var keyCode = e.keyCode;
            var inputValue = e.target.value;

            if (keyCode == 9 || keyCode == 27 || (keyCode == 13 && this.inputValue != inputValue)) {
                this._change(inputValue);
                this._close('date');
                this._close('time');

                return;
            }
            if (e.altKey) {
                if (keyCode == 40)
                    this._open('date');
                else if (keyCode == 38)
                    this._close('date');
                return;
            }

            if (this.dateView.isOpened())
                this.dateView.navigate(e);

            if (this.timeView.isOpened())
                this.timeView.navigate(e);
        },

        _toggleDateView: function () {
            if (this.dateView.isOpened()) {
                this._close('date')
            } else {
                this.$input[0].focus();
                this._change(this.parse(this.$input.val()));
                this._open('date')
                this._close('time')
            }
        },

        _toggleTimeView: function () {
            if (this.timeView.isOpened()) {
                this._close('time')
            } else {
                this.$input[0].focus();
                this._change(this.parse(this.$input.val()));
                this._open('time');
                this._close('date');
            }
        },

        enable: function () {
            this.$input.attr('disabled', false);
            this.$element.removeClass('t-state-disabled')
                .find('.t-icon-clock')
                .unbind('click')
                .bind('click', $.proxy(this._toggleTimeView, this))
                .end()
                .find('.t-icon-calendar')
                .unbind('click')
                .bind('click', $.proxy(this._toggleDateView, this));
        },

        disable: function (e) {
            this.$input.attr('disabled', true);
            this.$element.addClass('t-state-disabled')
                .find('.t-icon')
                .unbind('click')
                .bind('click', $t.preventDefault);
        },

        open: function (popup) {
            var $input = this.$input;
            var position = {
                offset: $input.offset(),
                outerHeight: $input.outerHeight(),
                outerWidth: $input.outerWidth(),
                zIndex: $t.getElementZIndex($input[0])
            }

            this[popup == "time" ? 'timeView' : 'dateView'].open(position);
        },

        close: function (popup) {
            this[popup == "time" ? 'timeView' : 'dateView'].close();
        },

        value: function (val) {
            if (val === undefined)
                return this.selectedValue === null ? null : this.selectedValue.toDate();

            var parsedValue = this.parse(val);
            parsedValue = $t.calendar.isInRange(parsedValue, this.minValue, this.maxValue) ? parsedValue : null;

            if (parsedValue === null)
                this.$input.removeClass('t-state-error').val('');

            this._value(parsedValue);

            return this;
        },

        parse: function (value, format) {
            if (value === null || value.value)
                return value;

            format = format || this.format;

            return value.getDate
                   ? new $t.datetime(value)
                   : $t.datetime.parse({
                       AM: $t.cultureInfo.AM,
                       PM: $t.cultureInfo.PM,
                       value: value,
                       format: format,
                       baseDate: this.selectedValue ? new $t.datetime(this.selectedValue.value) : new $t.datetime()
                   });
        }
    }

    $.each(["min", "max"], $.proxy(function (index, method) {
        $t.datetimepicker.prototype[method] =
        function (value) {
            var propertyName = method + 'Value';
            if (value === undefined)
                return this[propertyName].toDate();

            var parsedValue = this.parse(value);
            if (parsedValue !== null) {
                this[propertyName] = parsedValue;
                this.dateView[method](parsedValue);
                this.timeView[method](parsedValue);
            }
        };
    }, this));

    $.each(["startTime", "endTime"], $.proxy(function (index, method) {
        $t.datetimepicker.prototype[method] =
            function (value) {
                var propertyName = method + 'Value';
                if (value === undefined)
                    return this[propertyName].toDate();

                var parsedValue = this.parse(value, $t.cultureInfo.shortTime);
                if (parsedValue !== null) {
                    this[propertyName] = parsedValue;
                    method == 'startTime' ? this.timeView.min(parsedValue) : this.timeView.max(parsedValue)
                }
            };
    }, this));

    $.fn.tDateTimePicker = function (options) {
        return $t.create(this, {
            name: 'tDateTimePicker',
            init: function (element, options) {
                return new $t.datetimepicker(element, options);
            },
            options: options
        });
    };

    $.fn.tDateTimePicker.defaults = {
        effects: $t.fx.slide.defaults(),
        selectedValue: null,
        format: $t.cultureInfo.generalDateShortTime,
        timeFormat: $t.cultureInfo.shortTime,
        focusedDate: new $t.datetime(),
        minValue: new $t.datetime(1899, 11, 31),
        maxValue: new $t.datetime(2100, 0, 1),
        shortYearCutOff: 30,
        enabled: true,
        interval: 30
    };

})(jQuery);