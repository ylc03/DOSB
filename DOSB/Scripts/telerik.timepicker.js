(function ($) {

    var $t = $.telerik;

    $t.timeView = function (options) {
        $.extend(this, options);

        var dropDown = this.dropDown = new $t.dropDown({
            attr: this.dropDownAttr,
            effects: this.effects,
            onClick: function (e) {
                var item = e.item;
                options.onChange(item.innerText || item.textContent);
            }
        });

        dropDown.$element
                .addClass('t-time-popup')
                .css('direction', this.isRtl ? 'rtl' : '');
    }

    $t.timeView.prototype = {
        _ensureItems: function () {
            if (!this.dropDown.$items)
                this.bind()
        },

        open: function (position) {
            this._ensureItems();
            this.dropDown.open(position);
        },

        close: function () {
            this.dropDown.close();
        },

        bind: function () {
            var getTimeMilliseconds = $t.timeView.getTimeMilliseconds;

            var availableHours = [];
            var format = this.format;
            var interval = this.interval;
            var tmpDate = this.minValue;
            var msMinTime = getTimeMilliseconds(tmpDate);
            var msMaxTime = getTimeMilliseconds(this.maxValue);
            var msInterval = interval * $t.datetime.msPerMinute;

            var records = parseInt($t.datetime.msPerDay / (interval * $t.datetime.msPerMinute));

            if (msMinTime != msMaxTime) {
                var result = msMinTime < msMaxTime ?
                             msMaxTime - msMinTime :
                             msMaxTime + $t.datetime.msPerDay - msMinTime;

                records = parseInt(result / msInterval) + 1;
            }

            var add = $t.datetime.add;
            var formater = $t.datetime.format;
            for (var i = 0; i < records; i++) {
                availableHours[i] = formater(tmpDate.toDate(), format);
                tmpDate = add(tmpDate, msInterval);
            }

            if (getTimeMilliseconds(tmpDate) - msInterval - msMaxTime != 0 && msMinTime != msMaxTime)
                availableHours[records] = formater(this.maxValue.toDate(), format);

            this.dropDown.dataBind(availableHours);
        },

        isOpened: function () {
            return this.dropDown.isOpened();
        },

        value: function (value) {
            this._ensureItems();
            var dropDown = this.dropDown;

            if (value === undefined)
                return dropDown.$items.filter('.t-state-selected').text();

            var $items = dropDown.$items;
            if (!$items) return;

            $items.removeClass('t-state-selected');
            if (value) {
                dropDown.highlight($.grep($items, function (li) {
                    return (li.innerText || li.textContent) == value;
                }));
            }
        },

        navigate: function (e) {
            var key = e.keyCode || e.which;

            if(key == 38 || key == 40)
                e.preventDefault();

            this._ensureItems();
            var dropDown = this.dropDown;
            var $items = dropDown.$items;
            var $selectedItem = $items.filter('.t-state-selected');

            var $item = $selectedItem.length == 0 || $items.length == 1
                            ? $items.first()
                            : (key == 38) ? $selectedItem.prev() // up
                            : (key == 40) ? $selectedItem.next() // down
                            : [];

            if ($item.length) {
                var text = $item.text();
                dropDown.scrollTo($item[0]);
                dropDown.highlight($item[0]);
                if (!dropDown.isOpened())
                    this.onChange(text);
                else
                    this.onNavigateWithOpenPopup(text);
            }
        }
    }

    $.each(["min", "max"], $.proxy(function (index, method) {
        $t.timeView.prototype[method] =
            function (value) {
                var propertyName = method + 'Value';
                if (value === undefined)
                    return this[propertyName].toDate();

                this[propertyName] = value.value ? value : new $t.datetime(value);
                this.bind();
            };
    }, this));

    $.extend($t.timeView, {
        isInRange: function (value, minValue, maxValue) {
            if (value === null) return true;

            var getTimeMilliseconds = $t.timeView.getTimeMilliseconds;
            var msPerDay = $t.datetime.msPerDay;
            var msValue = getTimeMilliseconds(value);
            var msMinTime = getTimeMilliseconds(minValue);
            var msMaxTime = getTimeMilliseconds(maxValue);

            msValue = msMinTime > msValue
                    ? msValue + msPerDay
                    : msValue;

            msMaxTime = msMinTime > msMaxTime
                        ? msMaxTime + msPerDay
                        : msMaxTime;

            return msMinTime - msMaxTime == 0 || msValue >= msMinTime && msValue <= msMaxTime;
        },

        getTimeMilliseconds: function (value) {
            return ((value.hours() * 60) + value.minutes()) * $t.datetime.msPerMinute + value.seconds() * 1000 + value.milliseconds();
        }
    });

    $t.timepicker = function (element, options) {
        $.extend(this, options);
        this.element = element;
        this.$element = $(element);

        var $input = this.$input = $('.t-input', element)
            .attr('autocomplete', 'off')
            .bind({
                change: function (e) { e.stopPropagation(); },
                keydown: $.proxy(this._keydown, this),
                focus: $.proxy(function (e) {
                    this._change($input.val());
                    this._open();

                    this.$input.removeClass('t-state-error');
                }, this)
            });

        this.inputValue = $input.val();

        this.timeView = new $t.timeView({
            effects: this.effects,
            dropDownAttr: this.dropDownAttr,
            format: this.format,
            interval: this.interval,
            isRtl: $input.closest('.t-rtl').length,
            minValue: this.minValue,
            maxValue: this.maxValue,
            onNavigateWithOpenPopup: $.proxy(function (value) {
                this.$input.val(value);
            }, this),
            onChange: $.proxy(function (value) {
                this._change(value);
                this._close();
            }, this)
        });

        $('.t-icon', element)
            .bind('click', this.enabled
                           ? $.proxy(this._togglePopup, this)
                           : $t.preventDefault);

        $(document.documentElement).bind('mousedown', $.proxy(function (e) {
            var $dropDown = this.timeView.dropDown.$element;
            var isDropDown = $dropDown && $dropDown.parent().length > 0;

            if (!isDropDown
            || $.contains(this.element, e.target)
            || $.contains($dropDown.parent()[0], e.target))
                return;

            this._change(this.$input.val());
            this._close();

        }, this));

        $t.bind(this, {
            open: this.onOpen,
            close: this.onClose,
            change: this.onChange,
            load: this.onLoad
        });
    }

    $t.timepicker.prototype = {
        _close: function () {
            var dropDown = this.timeView.dropDown;
            if (!dropDown.$element.is(':animated') && dropDown.isOpened())
                this._trigger('close');
        },

        _open: function () {
            if (!this.timeView.isOpened())
                this._trigger('open');
        },

        _trigger: function (methodName) {
            if (!$t.trigger(this.element, methodName))
                this[methodName]();
        },

        _togglePopup: function () {
            if (this.timeView.isOpened()) {
                this._change(this.$input.val());
                this._close();
            } else {
                this.$input[0].focus();
            }
        },

        _change: function (newValue) {

            var minValue = this.minValue;
            var maxValue = this.maxValue;
            var parsedValue = this.parse(newValue);
            var selectedValue = this.selectedValue;

            if (!$t.timeView.isInRange(parsedValue, minValue, maxValue)) {
                var getTimeMilliseconds = $t.timeView.getTimeMilliseconds;
                var msValue = getTimeMilliseconds(parsedValue);
                var msMinValue = getTimeMilliseconds(minValue);
                var msMaxValue = getTimeMilliseconds(maxValue);

                var minDiff = Math.abs(msMinValue - msValue);
                var maxDiff = Math.abs(msMaxValue - msValue);

                parsedValue = new $t.datetime(minDiff < maxDiff ? minValue.value : maxValue.value);
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

            if (parsedValue == null || this.inputValue != newValue)
                this._value(parsedValue);
        },

        _value: function (value) {
            var text = this.$input.val();
            var isNull = value === null;

            this.selectedValue = value;
            this.timeView.value(isNull ? null : $t.datetime.format(value.toDate(), this.format));

            if (!isNull)
                text = $t.datetime.format(value.toDate(), this.format);

            this.inputValue = text;
            this.$input.toggleClass('t-state-error', isNull && text != '')
                       .val(text);
        },

        _keydown: function (e) {
            var key = e.keyCode || e.which;
            var inputValue = e.target.value;
            var dropDown = this.timeView.dropDown;

            if (e.altKey) {
                if (key == 40)
                    this._open();
                else if (key == 38)
                    this._close();
            }

            if (!e.shiftKey && key == 38 || key == 40)
                this.timeView.navigate(e);

            if (key == 9 || key == 13 || key == 27) {
                if (dropDown.isOpened() && key != 9)
                    e.preventDefault();

                var text;
                var selectedText = this.timeView.value();
                if (this.inputValue != inputValue || !selectedText)
                    text = inputValue;
                else
                    text = selectedText;

                this._change(text);
                this._close();
            }
        },

        enable: function () {
            this.$input.attr('disabled', false);
            this.$element.removeClass('t-state-disabled')
                         .find('.t-icon')
                         .unbind('click')
                         .bind('click', $.proxy(this._togglePopup, this));
        },

        disable: function (e) {
            this.$input.attr('disabled', true);
            this.$element.addClass('t-state-disabled')
                         .find('.t-icon')
                         .unbind('click')
                         .bind('click', $t.preventDefault);
        },

        value: function (val) {
            if (val === undefined)
                return this.selectedValue === null ? null : this.selectedValue.toDate();

            var parsedValue = this.parse(val);
            parsedValue = $t.timeView.isInRange(parsedValue, this.minValue, this.maxValue) ? parsedValue : null;

            if (parsedValue === null)
                this.$input.removeClass('t-state-error').val('');

            this._value(parsedValue);

            return this;
        },

        parse: function (value) {
            if (value === null || value.value)
                return value;

            return value.getDate
                   ? new $t.datetime(value)
                   : $t.datetime.parse({
                       AM: $t.cultureInfo.AM,
                       PM: $t.cultureInfo.PM,
                       value: value,
                       format: this.format,
                       baseDate: this.selectedValue ? new $t.datetime(this.selectedValue.value) : new $t.datetime()
                   });
        },

        open: function () {
            var $input = this.$input;
            this.timeView.open({
                offset: $input.offset(),
                outerHeight: $input.outerHeight(),
                outerWidth: $input.outerWidth(),
                zIndex: $t.getElementZIndex($input[0])
            });
        },

        close: function () {
            this.timeView.close();
        }
    }

    $.each(["min", "max"], $.proxy(function (index, method) {
        $t.timepicker.prototype[method] =
            function (value) {
                var propertyName = method + 'Value';
                if (value === undefined)
                    return this[propertyName].toDate();

                var parsedValue = this.parse(value);
                if (parsedValue !== null) {
                    this[propertyName] = parsedValue;
                    this.timeView[method](parsedValue);
                    this._change(parsedValue);
                }
            };
    }, this));

    $.fn.tTimePicker = function (options) {
        return $t.create(this, {
            name: 'tTimePicker',
            init: function (element, options) {
                return new $t.timepicker(element, options);
            },
            options: options
        });
    };

    $.fn.tTimePicker.defaults = {
        effects: $t.fx.slide.defaults(),
        selectedValue: null,
        format: $t.cultureInfo.shortTime,
        interval: 30,
        enabled: true
    };

})(jQuery);