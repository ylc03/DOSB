(function ($) {

    var $t = $.telerik;

    var sharedCalendar = null;

    $t.datetime.parseByToken = function (value, today) {
        if (value === null || value === '') return null;

        today = today || new $t.datetime(); // required for unit tests
        var firstToken = null;
        var secondToken = null;
        var tokenType = null;
        var pos = 0;

        var Matches = function (name) {
            var token = null;
            if (name && value.substring(pos, pos + name.length).toLowerCase() == name.toLowerCase()) {
                token = name;
            }
            return token;
        }

        var searchForDayMonth = function () {
            var token = null;
            $.each(['days', 'abbrDays', 'months', 'abbrMonths'], function (index, key) {
                if (token !== null) return;

                $.each($t.cultureInfo[key], function (index, name) {
                    if (token !== null) return;
                    token = Matches(name);
                });

                tokenType = key;
            });
            return token;
        }

        var adjustDate = function () {
            var gap;
            var modifyDate = function (mod, isday) {
                today[isday ? 'date' : 'month']
                    (today[isday ? 'date' : 'month']()
                     + (gap != 0 ? ((gap + ((gap > 0 ? 1 : -1) * mod)) % mod) : 0)
                        + (secondToken ?
                            (firstToken == $t.cultureInfo['next'] ? 1 : -1) * mod : 0));
            }
            var arrayPosition = $.inArray(secondToken || firstToken, $t.cultureInfo[tokenType]);
            if (tokenType.toLowerCase().indexOf('day') > -1) {
                gap = (arrayPosition == 0 ? 7 : arrayPosition) - today.day();
                modifyDate(7, true)
            } else {
                gap = arrayPosition - today.month();
                modifyDate(12, false)
            }
        }

        var adjustDateBySecondToken = function () {
            var gapDiff = function (possition) {
                var gap;
                switch (secondToken) {
                    case 'year': gap = possition == 1 ? 1 : 0; break;
                    case 'month': gap = possition == 2 ? 1 : 0; break;
                    case 'week': gap = possition == 3 ? 7 : 0; break;
                    case 'day': gap = possition == 3 ? 1 : 0; break;
                }
                return gap;
            }
            var direction = (firstToken == $t.cultureInfo['next'] ? 1 : -1);
            today.year(
                    today.year() + gapDiff(1) * direction,
                    today.month() + gapDiff(2) * direction,
                    today.date() + gapDiff(3) * direction
                );
        }

        // search for first token
        $.each(['today', 'tomorrow', 'yesterday', 'next', 'last'], function (index, name) {
            if (firstToken !== null) return;
            firstToken = Matches($t.cultureInfo[name]);
        })

        if (firstToken !== null) {
            pos += firstToken.length;

            if (/[^\s\d]\s+[^\s\d]/i.test(value)) {
                pos++;
                $.each(['year', 'month', 'week', 'day'], function (index, name) {
                    if (secondToken !== null) return;
                    secondToken = Matches($t.cultureInfo[name]);
                })
                tokenType = null;

                if (secondToken === null) {
                    secondToken = searchForDayMonth();
                }
                if (secondToken === null)
                    return null; // invalid date.
            } else {
                switch (firstToken) {
                    case $t.cultureInfo['today']: break;
                    case $t.cultureInfo['tomorrow']:
                        today.date(today.date() + 1);
                        break;
                    case $t.cultureInfo['yesterday']:
                        today.date(today.date() - 1);
                        break;
                    default:
                        today = null; // incorrect token
                        break;
                }

                return today;
            }

        } else {
            firstToken = searchForDayMonth();
            if (firstToken != null) {
                adjustDate();
                return today;
            } else {
                return null;
            }
        }

        // first and second tokens are not null
        if (tokenType !== null)
            adjustDate();
        else // second token is year, month, week, day
            adjustDateBySecondToken();

        return today;
    };

    function defineFocusedDate(focusedValue, selectedValue, minValue, maxValue) {
        if (!focusedValue)
            focusedValue = new $t.datetime();

        if (selectedValue)
            focusedValue = new $t.datetime(selectedValue.toDate());
        else
            focusedValue = $t.calendar.isInRange(focusedValue, minValue, maxValue)
                        ? focusedValue
                        : new $t.datetime(minValue.value);

        return focusedValue;
    }

    /*
    options.minValue
    options.maxValue
    options.selectedValue
    options.effects
    options.onChange
    options.isRtl
    options.zIndex
    */

    $t.dateView = function (options) {
        $.extend(this, options);
        this.isValueChanged = false;

        this.focusedValue = defineFocusedDate(null, this.selectedValue, this.minValue, this.maxValue);

        this.$calendar = this._createSharedCalendar();
    }

    $t.dateView.prototype = {
        _createSharedCalendar: function () {
            if (!sharedCalendar) {
                sharedCalendar = $($t.calendar.html(this.focusedValue, this.selectedValue, this.minValue, this.maxValue))
                                .hide()
                                .addClass('t-datepicker-calendar')
                                .bind('click', function (e) { e.stopPropagation(); })
                                .appendTo(document.body)
                                .tCalendar({
                                    selectedValue: this.selectedValue,
                                    minDate: this.minValue,
                                    maxDate: this.maxValue
                                });

                $t.fx._wrap(sharedCalendar);

                if ($.browser.msie && $.browser.version <= 6)
                    $('<iframe class="t-iframe-overlay" src="javascript:false;"></iframe>')
                    .prependTo(sharedCalendar)
                    .height(sharedCalendar.height());
            }

            return sharedCalendar;
        },

        _getCalendar: function () {
            return sharedCalendar.data('tCalendar');
        },

        _reassignSharedCalendar: function () {
            var calendar = this._getCalendar();

            if (sharedCalendar.data('associatedDateView') != this) {
                sharedCalendar.stop(true, true);

                this.focusedValue = defineFocusedDate(this.focusedValue, this.selectedValue, this.minValue, this.maxValue);

                calendar.minDate = this.minValue;
                calendar.maxDate = this.maxValue;
                calendar.selectedValue = this.selectedValue;
                calendar.goToView(0, this.focusedValue);

                sharedCalendar
                    .unbind('change')
                    .bind('change', $.proxy(function (e) {
                        var selectedValue = this.selectedValue;
                        var newValue = new $t.datetime(e.date);
                        if (selectedValue !== null)
                            newValue.hours(selectedValue.hours())
                                    .minutes(selectedValue.minutes())
                                    .seconds(selectedValue.seconds())
                                    .milliseconds(selectedValue.milliseconds());
                        this.onChange(newValue);
                    }, this))
                    .unbind('navigate')
                    .bind('navigate', $.proxy(function (e) {
                        var focusedValue = this.focusedValue;
                        var viewedMonth = calendar.viewedMonth;
                        var viewIndex = calendar.currentView.index;

                        if (viewIndex == 0)
                            focusedValue = this.selectedValue ? new $t.datetime(this.selectedValue.toDate()) : focusedValue;
                        else
                            focusedValue.year(viewedMonth.year(), viewedMonth.month(), focusedValue.date());

                        $t.calendar.focusDate(focusedValue, viewIndex, sharedCalendar, e.direction);

                    }, this))
                    .data('associatedDateView', this);

                if (this.selectedValue)
                    calendar.value(this.selectedValue);

                $t.calendar.focusDate(this.focusedValue, calendar.currentView.index, sharedCalendar);
            }
        },

        open: function (position) {
            if (this.isOpened())
                return;

            this._reassignSharedCalendar();

            var isRtl = this.isRtl;
            var $calendar = this.$calendar;

            // reposition & rewire the shared calendar
            elementPosition = position.offset;
            elementPosition.top += position.outerHeight;

            if (isRtl)
                elementPosition.left -= (sharedCalendar.outerWidth() || sharedCalendar.parent().outerWidth()) - position.outerWidth;

            $t.fx._wrap(sharedCalendar).css($.extend({
                position: 'absolute',
                direction: isRtl ? 'rtl' : '',
                display: sharedCalendar.is(':visible') ? '' : 'none'
            }, elementPosition));

            var calendar = this._getCalendar();
            var viewIndex = calendar.currentView.index;

            if (!sharedCalendar.is(':visible') && calendar.viewedMonth.value - this.focusedValue.value != 0) {
                calendar.goToView(viewIndex, this.focusedValue)
                        .value(this.selectedValue);
            }

            $t.calendar.focusDate(this.focusedValue, calendar.currentView.index, sharedCalendar);

            $t.fx._wrap($calendar).css('zIndex', position.zIndex).show();

            $t.fx.play(this.effects, $calendar, { direction: 'bottom' });
        },

        close: function () {
            if (this.isOpened())
                $t.fx.rewind(this.effects, this.$calendar, { direction: 'bottom' }, function () {
                    if (sharedCalendar)
                        $t.fx._wrap(sharedCalendar).hide();
                });
        },

        isOpened: function () {
            return sharedCalendar && sharedCalendar.data('associatedDateView') == this && sharedCalendar.is(':visible');
        },

        value: function (value) {
            if (value === undefined)
                return this.selectedValue.toDate();

            var isNull = value === null;
            var calendar = this._getCalendar();

            //set selected date
            if (!isNull)
                value = value.value ? value : new $t.datetime(value);

            calendar.value(value);
            this.selectedValue = value;

            //update focused date;
            if (isNull)
                value = new $t.datetime();

            this.focusedValue = new $t.datetime(value.toDate());
            $t.calendar.focusDate(value, calendar.currentView.index, sharedCalendar);
        },

        navigate: function (e) {
            if (this.isOpened() && $('.t-overlay', sharedCalendar).length > 0)
                return;

            var isFuture;
            var isNavProcessed = false;
            var $calendar = this.$calendar;
            var calendar = this._getCalendar();
            var viewedMonth = calendar.viewedMonth;
            var currentView = calendar.currentView;
            var viewIndex = currentView.index;
            var date = new $t.datetime(this.focusedValue.value)

            var navigate = function (className, method, futureNav) {
                if (!$(className, $calendar).hasClass('t-state-disabled')) {
                    if ('navigateUp' == method) viewIndex += 1;
                    isFuture = futureNav || false;
                    calendar[method]();
                    return true;
                }
                else return false;
            }

            var navigateDown = function () {
                var target = $t.calendar.findTarget(date, viewIndex, $calendar, false)[0];
                calendar.navigateDown(e, target, viewIndex);
                viewIndex = viewIndex == 0 ? 0 : viewIndex - 1;
                isFuture = true;
            }

            var navPrevNext = function (className, method, futureNav) {
                var diff = !futureNav ? -1 : 1;
                if (!navigate(className, method, futureNav)) return false;
                if (viewIndex == 0)
                    date.addMonth(diff);
                else
                    date.addYear(diff * (viewIndex == 1 ? 1 : viewIndex == 2 ? 10 : 100));
                return true;
            }

            var adjustDate = $t.datepicker.adjustDate;

            if ($calendar.is(':visible') && !e.shiftKey) {
                isNavProcessed = true;
                switch (e.keyCode) {
                    case 37: // left arrow
                        if (e.ctrlKey) {
                            if (!navPrevNext('.t-nav-prev', 'navigateToPast')) return;
                        } else {
                            adjustDate(viewIndex, date, -1, -1); // date modified by reference
                            if (currentView.navCheck(date, viewedMonth, false))
                                if (!navigate('.t-nav-prev', 'navigateToPast')) return;
                        }
                        break;
                    case 38: // up arrow
                        if (e.ctrlKey) {
                            navigate('.t-nav-fast', 'navigateUp');
                        } else {
                            adjustDate(viewIndex, date, -7, -4); // date modified by reference
                            if (currentView.navCheck(date, viewedMonth, false))
                                if (!navigate('.t-nav-prev', 'navigateToPast')) return;
                        }
                        break;
                    case 39: // right arrow
                        if (e.ctrlKey) {
                            if (!navPrevNext('.t-nav-next', 'navigateToFuture', true)) return;
                        } else {
                            adjustDate(viewIndex, date, 1, 1); // date modified by reference
                            if (currentView.navCheck(date, viewedMonth, true))
                                if (!navigate('.t-nav-next', 'navigateToFuture', true)) return;
                        }
                        break;
                    case 40: //down arrow
                        if (e.ctrlKey) {
                            navigateDown();
                        } else {
                            adjustDate(viewIndex, date, 7, 4); // date modified by reference
                            if (currentView.navCheck(date, viewedMonth, true))
                                if (!navigate('.t-nav-next', 'navigateToFuture', true)) return;
                        }
                        break;
                    case 33: // page up
                        if (!navPrevNext('.t-nav-prev', 'navigateToPast')) return;
                        break;
                    case 34: //page down
                        if (!navPrevNext('.t-nav-next', 'navigateToFuture', true)) return;
                        break;
                    case 35: //end
                        date = $t.calendar.views[viewIndex].firstLastDay(date, false, calendar);
                        break;
                    case 36: //home
                        date = $t.calendar.views[viewIndex].firstLastDay(date, true, calendar);
                        break;
                    case 13: // enter
                        e.stopPropagation();

                        if (viewIndex == 0)
                            this.onChange(this.focusedValue);
                        else
                            navigateDown();
                        break;
                    default:
                        isNavProcessed = false;
                        break;
                }
            }

            if (isNavProcessed) {
                e.preventDefault();
                date = $t.calendar.fitDateToRange(date, this.minValue, this.maxValue);

                $t.calendar.focusDate(date, viewIndex, $calendar, isFuture);
                this.focusedValue = date;
            }
        }
    }

    $.each(['min', 'max'], $.proxy(function (index, method) {
        $t.dateView.prototype[method] =
            function (value) {
                var propertyName = method + 'Value';
                if (value === undefined)
                    return this[propertyName].toDate();

                this[propertyName] = value.value ? value : new $t.datetime(value);
                sharedCalendar.data("associatedDateView", null);
                this._reassignSharedCalendar();
            };
    }, this));

    $t.datepicker = function (element, options) {
        this.element = element;

        $.extend(this, options);

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

        this.dateView = new $t.dateView({
            selectedValue: this.selectedValue,
            minValue: this.minDate,
            maxValue: this.maxDate,
            effects: this.effects,
            isRtl: $input.closest('.t-rtl').length,
            onChange: $.proxy(function (value) {
                this._change(value);
                this._close();
            }, this)
        });

        $('.t-icon-calendar', element)
            .bind('click', this.enabled
                           ? $.proxy(this._togglePopup, this)
                           : $t.preventDefault);

        $(document.documentElement).bind('mousedown', $.proxy(function (e) {
            if (!sharedCalendar) return;

            var associatedDateView = sharedCalendar.data('associatedDateView');
            if (associatedDateView && associatedDateView == this.dateView) {
                if ($.contains(element, e.target)
                || $.contains(sharedCalendar[0], e.target))
                    return;

                this._change(this.$input.val());
                this._close();
            }
        }, this));

        $t.bind(this, {
            open: this.onOpen,
            close: this.onClose,
            change: this.onChange,
            load: this.onLoad
        });
    }

    $t.datepicker.prototype = {
        _togglePopup: function () {
            var $input = this.$input;

            if (this.dateView.isOpened()) {
                this._change($input.val());
                this._close();
            } else {
                $input[0].focus();
            }
        },

        _close: function () {
            if (!sharedCalendar.is(':animated') && this.dateView.isOpened())
                this._trigger('close');
        },

        _open: function () {
            if (!this.dateView.isOpened())
                this._trigger('open');
        },

        _trigger: function (methodName) {
            if (!$t.trigger(this.element, methodName))
                this[methodName]();
        },

        _change: function (newValue) {
            var selectedValue = this.selectedValue;
            var parsedValue = this.parse(newValue);

            if (parsedValue != null) {
                if (parsedValue.value - this.minDate.value <= 0) {
                    parsedValue = this.minDate;
                }
                else if (parsedValue.value - this.maxDate.value >= 0) {
                    parsedValue = this.maxDate;
                }
            }

            if ((selectedValue === null && parsedValue !== null)
            || (selectedValue !== null && parsedValue === null)
            || (selectedValue && parsedValue && (selectedValue.value > parsedValue.value
                                                || parsedValue.value > selectedValue.value))) {

                $t.trigger(this.element, 'change', {
                    previousValue: selectedValue === null ? null : selectedValue.toDate(),
                    value: parsedValue === null ? null : parsedValue.toDate(),
                    previousDate: selectedValue === null ? null : selectedValue.toDate(),
                    date: parsedValue === null ? null : parsedValue.toDate()
                });
            }

            if (parsedValue == null || this.inputValue != newValue)
                this._value(parsedValue);
        },

        _keydown: function (e) {
            var keyCode = e.keyCode;
            var inputValue = e.target.value;

            if (keyCode == 9) { // tab button
                this._change(inputValue);
                this._close();
            } else if (keyCode == 27) {//escape button
                this._close();
            } else if (keyCode == 13 && (this.inputValue != inputValue || !this.dateView.isOpened())) {
                this._change(inputValue);
                this._close();
            } else if (e.altKey) {
                if (keyCode == 40)
                    this._open();
                else if (keyCode == 38)
                    this._close();
            } else {
                this.dateView.navigate(e);
            }
        },

        enable: function () {
            this.$input.attr('disabled', false);
            $(this.element).removeClass('t-state-disabled')
                  .find('.t-icon')
                  .unbind('click')
                  .bind('click', $.proxy(this._togglePopup, this));
        },

        disable: function (e) {
            this.$input.attr('disabled', true);
            $(this.element).addClass('t-state-disabled')
                .find('.t-icon')
                .unbind('click')
                .bind('click', $t.preventDefault);
        },

        _value: function (value) {
            var text = this.$input.val();
            var isNull = value === null;

            this.selectedValue = value;

            this.dateView.value(value);

            if (!isNull)
                text = $t.datetime.format(value.toDate(), this.format);

            this.inputValue = text;
            this.$input.toggleClass('t-state-error', isNull && text != '')
                       .val(text);
        },

        value: function (val) {
            if (val === undefined)
                return this.selectedValue === null ? null : this.selectedValue.toDate();

            var parsedValue = this.parse(val);
            parsedValue = $t.calendar.isInRange(parsedValue, this.minDate, this.maxDate) ? parsedValue : null;

            if (parsedValue === null)
                this.$input.removeClass('t-state-error').val('');

            this._value(parsedValue);

            return this;
        },

        //obsolete
        showPopup: function () {
            this.open();
        },

        //obsolete
        hidePopup: function () {
            this.close();
        },

        open: function () {
            var $input = this.$input;

            this.dateView.open({
                offset: $input.offset(),
                outerHeight: $input.outerHeight(),
                outerWidth: $input.outerWidth(),
                zIndex: $t.getElementZIndex($input[0])
            });
        },

        close: function () {
            this.dateView.close();
        },

        parse: function (value, format) {
            if (value === null || value.value)
                return value;

            return value.getDate
                   ? new $t.datetime(value)
                   : $t.datetime.parse({
                       value: value,
                       format: format || this.format,
                       shortYearCutOff: this.shortYearCutOff
                   });
        }
    }

    $.each(["min", "max"], $.proxy(function (index, method) {
        $t.datepicker.prototype[method] =
        function (value) {
            var propertyName = method + 'Date';
            if (value === undefined)
                return this[propertyName].toDate();

            var parsedValue = this.parse(value);
            if (parsedValue !== null) {
                this[propertyName] = parsedValue;
                this.dateView[method](parsedValue);
                this._change(parsedValue);
            }
        };
    }, this));

    $.extend($t.datepicker, {
        adjustDate: function (viewIndex, date, monthValue, otherViewValue) {
            if (viewIndex == 0)
                $t.datetime.modify(date, $t.datetime.msPerDay * monthValue);
            else if (viewIndex == 1)
                date.addMonth(otherViewValue);
            else
                date.addYear((viewIndex == 2 ? otherViewValue : 10 * otherViewValue));
        }
    });

    $.fn.tDatePicker = function (options) {
        return $t.create(this, {
            name: 'tDatePicker',
            init: function (element, options) {
                return new $t.datepicker(element, options);
            },
            options: options
        });
    };

    $.fn.tDatePicker.defaults = {
        effects: $t.fx.slide.defaults(),
        selectedValue: null,
        format: $t.cultureInfo.shortDate,
        minDate: new $t.datetime(1899, 11, 31),
        maxDate: new $t.datetime(2100, 0, 1),
        shortYearCutOff: 30,
        enabled: true
    };

})(jQuery);
