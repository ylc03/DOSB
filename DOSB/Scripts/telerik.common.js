(function ($) {
    // fix background flickering under IE6
    try {
        if (document.execCommand)
            document.execCommand('BackgroundImageCache', false, true);
    } catch (e) { }

    var dateCheck = /\d/;
    var version = parseInt($.browser.version.substring(0, 5).replace('.', ''));
    var geckoFlicker = $.browser.mozilla && version >= 180 && version <= 191;
    var dateFormatTokenRegExp = /d{1,4}|M{1,4}|yy(?:yy)?|([Hhmstf])\1*|"[^"]*"|'[^']*'/g;

    var $t = $.telerik = {

        create: function (query, settings) {
            var name = settings.name;
            var options = $.extend({}, $.fn[name].defaults, settings.options);

            return query.each(function () {
                var $$ = $(this);
                options = $.meta ? $.extend({}, options, $$.data()) : options;

                if (!$$.data(name)) {
                    var component = settings.init(this, options);

                    $$.data(name, component);

                    $t.trigger(this, 'load');

                    if (settings.success) settings.success(component);
                }
            });
        },

        toJson: function (o) {
            var result = [];
            for (var key in o) {
                var value = o[key];
                if (typeof value != 'object')
                    result.push('"' + key + '":"' + value + '"');
                else
                    result.push('"' + key + '":' + this.toJson(value));
            }
            return '{' + result.join(',') + '}';
        },

        delegate: function (context, handler) {
            return function (e) {
                handler.apply(context, [e, this]);
            };
        },

        stop: function (handler, context) {
            return function (e) {
                e.stopPropagation();
                handler.apply(context || this, arguments);
            };
        },

        stopAll: function (handler, context) {
            return function (e) {
                e.preventDefault();
                e.stopPropagation();
                handler.apply(context || this, arguments);
            }
        },

        bind: function (context, events) {
            var $element = $(context.element);
            $.each(events, function (eventName) {
                if ($.isFunction(this)) $element.bind(eventName, this);
            });
        },

        preventDefault: function (e) {
            e.preventDefault();
        },

        hover: function () {
            $(this).addClass('t-state-hover');
        },

        leave: function () {
            $(this).removeClass('t-state-hover');
        },

        buttonHover: function () {
            $(this).addClass('t-button-hover');
        },

        buttonLeave: function () {
            $(this).removeClass('t-button-hover');
        },

        stringBuilder: function () {
            this.buffer = [];
        },

        ajaxError: function (element, eventName, xhr, status) {
            var prevented = this.trigger(element, eventName,
                {
                    XMLHttpRequest: xhr,
                    textStatus: status
                });

            if (!prevented) {
                if (status == 'error' && xhr.status != '0')
                    alert('Error! The requested URL returned ' + xhr.status + ' - ' + xhr.statusText);
                if (status == 'timeout')
                    alert('Error! Server timeout.');
            }

            return prevented;
        },

        trigger: function (element, eventName, e) {
            e = $.extend(e || {}, new $.Event(eventName));
            e.stopPropagation();
            $(element).trigger(e);
            return e.isDefaultPrevented();
        },

        // Returns the type as a string. Not full. Used in string formatting
        getType: function (obj) {
            if (obj instanceof Date)
                return 'date';
            if (!isNaN(obj))
                return 'number';
            return 'object';
        },

        formatString: function () {
            var s = arguments[0];

            for (var i = 0, l = arguments.length - 1; i < l; i++) {
                var reg = new RegExp('\\{' + i + '(:([^\\}]+))?\\}', 'gm');

                var argument = arguments[i + 1];

                var formatter = this.formatters[this.getType(argument)];
                if (formatter) {
                    var match = reg.exec(s);
                    if (match)
                        argument = formatter(argument, match[2]);
                }

                s = s.replace(reg, function () {
                    return argument;
                });
            }
            return s;
        },

        getElementZIndex: function (element) {
            var zIndex = 'auto';
            $(element).parents().andSelf().each(function () {
                zIndex = $(this).css('zIndex');
                if (Number(zIndex)) {
                    zIndex = Number(zIndex) + 1;
                    return false;
                }
            });

            return zIndex;
        },

        lastIndexOf: function (value, character) {
            var characterLength = character.length;
            for (var i = value.length - 1; i > -1; i--)
                if (value.substr(i, characterLength) == character) return i;
            return -1;
        },

        caretPos: function (element) {
            var pos = -1;

            if (document.selection)
                pos = Math.abs(element.document.selection.createRange().moveStart('character', -element.value.length));
            else if (element.selectionStart !== undefined)
                pos = element.selectionStart;

            return pos;
        },

        formatters: {},

        fx: {},

        cultureInfo: {
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            abbrDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            abbrMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            longTime: 'h:mm:ss tt',
            longDate: 'dddd, MMMM dd, yyyy',
            shortDate: 'M/d/yyyy',
            shortTime: 'h:mm tt',
            fullDateTime: 'dddd, MMMM dd, yyyy h:mm:ss tt',
            generalDateShortTime: 'M/d/yyyy h:mm tt',
            generalDateTime: 'M/d/yyyy h:mm:ss tt',
            sortableDateTime: "yyyy'-'MM'-'ddTHH':'mm':'ss",
            universalSortableDateTime: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
            monthYear: 'MMMM, yyyy',
            monthDay: 'MMMM dd',
            today: 'today',
            tomorrow: 'tomorrow',
            yesterday: 'yesterday',
            next: 'next',
            last: 'last',
            year: 'year',
            month: 'month',
            week: 'week',
            day: 'day',
            am: 'AM',
            pm: 'PM',
            dateSeparator: '/',
            timeSeparator: ':'
        }
    };

    /*
    options = {
    attr: component.dropDownAttr,
    effects: component.effects,
    onClick: function,
    onItemCreate: function
    }
    */

    $t.dropDown = function (options) {
        $.extend(this, options);

        this.$element = $(new $t.stringBuilder().cat('<div ')
                                 .catIf(options.attr, options.attr)
                                 .cat('><ul class="t-reset"></ul></div>')
                                 .string())
                                 .addClass("t-popup t-group")
                                 .hide();
    }

    $t.dropDown.prototype = {
        _html: function (data) {
            var html = new $t.stringBuilder();
            if (data) {
                for (var i = 0, length = data.length; i < length; i++) {

                    var dataItem = data[i];

                    var e = {
                        html: dataItem.Text || dataItem,
                        dataItem: dataItem
                    };

                    if (this.onItemCreate) this.onItemCreate(e);

                    html.cat('<li class="t-item">').cat(e.html).cat('</li>');
                }
            }
            return html.string();
        },

        open: function (position) {
            if (this.onOpen) this.onOpen();

            if (this.isOpened() || !this.$items) return;

            var $element = this.$element;
            var selector = '.t-reset > .t-item';

            $element.css('overflowY', 'auto');
            $element.css('width', position.outerWidth ? position.outerWidth - 2 : 0);

            $element.delegate(selector, 'mouseenter', $t.hover)
                    .delegate(selector, 'mouseleave', $t.leave)
                    .delegate(selector, 'click',
                        $.proxy(function (e) {
                            if (this.onClick)
                                this.onClick($.extend(e, { item: $(e.target).closest('.t-item')[0] }));
                        }, this))
                        .appendTo(document.body);

            var elementPosition = position.offset;
            elementPosition.top += position.outerHeight;

            $t.fx._wrap($element).css($.extend({
                position: 'absolute',
                zIndex: position.zIndex
            }, elementPosition));

            if (geckoFlicker)
                $element.css('overflow', 'hidden');

            $t.fx.play(this.effects, $element, { direction: 'bottom' }, $.proxy(function () {
                if (geckoFlicker)
                    $element.css('overflow', 'auto');

                var $selectedItems = this.$items.filter('.t-state-selected')
                if ($selectedItems.length) this.scrollTo($selectedItems[0]);
            }, this));
        },

        close: function () {
            if (!this.isOpened()) return;

            var $element = this.$element;

            if (geckoFlicker)
                $element.css('overflow', 'hidden');

            $t.fx.rewind(this.effects, $element, { direction: 'bottom' }, function () {
                if (geckoFlicker)
                    $element.css('overflow', 'auto')

                $element.parent().remove();
            });
        },

        dataBind: function (data) {
            data = data || [];

            var $element = this.$element;
            var elementHeight = $element[0].style.height;
            var height = elementHeight && elementHeight != 'auto' ? $element[0].style.height : '200px';

            var $items = this.$items = $(this._html(data));
            $element.find('> ul').html($items);
            $element.css('height', $items.length > 10 ? height : 'auto');
        },

        highlight: function (li) {
            return $(li).addClass('t-state-selected')
                        .siblings()
                        .removeClass('t-state-selected')
                        .end()
                        .index();
        },

        isOpened: function () {
            return this.$element.is(':visible');
        },

        scrollTo: function (item) {

            if (!item) return;

            var itemOffsetTop = item.offsetTop;
            var itemOffsetHeight = item.offsetHeight;

            var dropDown = this.$element[0];
            var dropDownScrollTop = dropDown.scrollTop;
            var dropDownOffsetHeight = dropDown.clientHeight;
            var bottomDistance = itemOffsetTop + itemOffsetHeight;

            dropDown.scrollTop = dropDownScrollTop > itemOffsetTop
                                    ? itemOffsetTop
                                    : bottomDistance > (dropDownScrollTop + dropDownOffsetHeight)
                                    ? bottomDistance - dropDownOffsetHeight
                                    : dropDownScrollTop;
        }
    }

    $t.datetime = function () {
        if (arguments.length == 0)
            this.value = new Date();
        else if (arguments.length == 1)
            this.value = new Date(arguments[0]);
        else if (arguments.length == 3)
            this.value = new Date(arguments[0], arguments[1], arguments[2]);
        else if (arguments.length == 6)
            this.value = new Date(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        else
            this.value = new Date(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);

        return this;
    }

    $.extend($t.datetime, {
        msPerMinute: 60000,
        msPerDay: 86400000,
        add: function (date, valueToAdd) {
            var tzOffsetBefore = date.timeOffset();
            var resultDate = new $t.datetime(date.time() + valueToAdd);
            var tzOffsetDiff = resultDate.timeOffset() - tzOffsetBefore;
            return new $t.datetime(resultDate.time() + tzOffsetDiff * $t.datetime.msPerMinute);
        },

        subtract: function (date, dateToSubtract) {
            dateToSubtract = new $t.datetime(dateToSubtract).toDate();
            var diff = date.time() - dateToSubtract;
            var tzOffsetDiff = date.timeOffset() - dateToSubtract.timeOffset();
            return diff - (tzOffsetDiff * $t.datetime.msPerMinute);
        },

        firstDayOfMonth: function (date) {
            return new $t.datetime(0)
                        .hours(date.hours())
                        .minutes(date.minutes())
                        .seconds(date.seconds())
                        .milliseconds(date.milliseconds())
                        .year(date.year(), date.month(), 1);
        },

        firstVisibleDay: function (date) {
            var firstVisibleDay = new $t.datetime(date.year(), date.month(), 0, date.hours(), date.minutes(), date.seconds(), date.milliseconds());
            while (firstVisibleDay.day() != 0) {
                $t.datetime.modify(firstVisibleDay, -1 * $t.datetime.msPerDay)
            }
            return firstVisibleDay;
        },

        modify: function (date, value) {
            var tzOffsetBefore = date.timeOffset();
            var resultDate = new $t.datetime(date.time() + value);
            var tzOffsetDiff = resultDate.timeOffset() - tzOffsetBefore;
            date.time(resultDate.time() + tzOffsetDiff * $t.datetime.msPerMinute);
        },

        pad: function (value) {
            if (value < 10)
                return '0' + value;
            return value;
        },

        standardFormat: function (format) {
            var l = $t.cultureInfo;

            var standardFormats = {
                d: l.shortDate,
                D: l.longDate,
                F: l.fullDateTime,
                g: l.generalDateShortTime,
                G: l.generalDateTime,
                m: l.monthDay,
                M: l.monthDay,
                s: l.sortableDateTime,
                t: l.shortTime,
                T: l.longTime,
                u: l.universalSortableDateTime,
                y: l.monthYear,
                Y: l.monthYear
            };

            return standardFormats[format];
        },

        format: function (date, format) {
            var l = $t.cultureInfo;

            var d = date.getDate();
            var day = date.getDay();
            var M = date.getMonth();
            var y = date.getFullYear();
            var h = date.getHours();
            var m = date.getMinutes();
            var s = date.getSeconds();
            var f = date.getMilliseconds();
            var pad = $t.datetime.pad;

            var dateFormatters = {
                d: d,
                dd: pad(d),
                ddd: l.abbrDays[day],
                dddd: l.days[day],

                M: M + 1,
                MM: pad(M + 1),
                MMM: l.abbrMonths[M],
                MMMM: l.months[M],

                yy: pad(y % 100),
                yyyy: y,

                h: h % 12 || 12,
                hh: pad(h % 12 || 12),
                H: h,
                HH: pad(h),

                m: m,
                mm: pad(m),

                s: s,
                ss: pad(s),

                f: Math.floor(f / 100),
                ff: Math.floor(f / 10),
                fff: f,

                tt: h < 12 ? l.am : l.pm
            };

            format = format || 'G';
            format = $t.datetime.standardFormat(format) ? $t.datetime.standardFormat(format) : format;

            return format.replace(dateFormatTokenRegExp, function (match) {
                return match in dateFormatters ? dateFormatters[match] : match.slice(1, match.length - 1);
            });
        },

        parse: function (options) {
            var value = options.value;
            var format = options.format;


            format = $t.datetime.standardFormat(format) ? $t.datetime.standardFormat(format) : format;
            if (dateCheck.test(value))
                return $t.datetime.parseMachineDate({
                    value: value,
                    format: format,
                    shortYearCutOff: options.shortYearCutOff,
                    baseDate: options.baseDate,
                    AM: $t.cultureInfo.am,
                    PM: $t.cultureInfo.pm
                });

            return $t.datetime.parseByToken ? $t.datetime.parseByToken(value, options.today) : null;
        },

        parseMachineDate: function (options) {

            var AM = options.AM;
            var PM = options.PM;
            var value = options.value;
            var format = options.format;
            var baseDate = options.baseDate;
            var shortYearCutOff = options.shortYearCutOff || 30;

            var year = -1;
            var month = -1;
            var day = -1;
            var hours = 0;
            var minutes = 0;
            var seconds = 0;
            var milliseconds = 0;
            var isAM;
            var isPM;
            var literal = false;

            // Returns count of the format character in the date format string
            var lookAhead = function (match) {
                var index = 0;
                while (Matches(match)) {
                    index++;
                    formatPosition++
                }
                return index;
            };
            var lookForLiteral = function () {
                var matches = Matches("'");
                if (matches)
                    formatPosition++;
                return matches;
            };
            var Matches = function (match) {
                return (formatPosition + 1 < format.length && format.charAt(formatPosition + 1) == match);
            }
            // Extract a number from the string value
            var getNumber = function (size) {
                var digits = new RegExp('^\\d{1,' + size + '}');
                var num = value.substr(currentTokenIndex).match(digits);
                if (num) {
                    currentTokenIndex += num[0].length;
                    return parseInt(num[0], 10);
                } else {
                    return -1;
                }
            };
            // Extract a name from the string value and convert to an index
            var getName = function (names) {
                for (var i = 0; i < names.length; i++) {
                    if (value.substr(currentTokenIndex, names[i].length) == names[i]) {
                        currentTokenIndex += names[i].length;
                        return i + 1;
                    }
                }
                return -1;
            };

            var checkLiteral = function () {
                if (value.charAt(currentTokenIndex) == format.charAt(formatPosition)) {
                    currentTokenIndex++;
                }
            };

            var normalizeTime = function (value) {
                return value === -1 ? 0 : value;
            }

            var count = 0;
            var currentTokenIndex = 0;
            var valueLength = value.length;

            for (var formatPosition = 0, flength = format.length; formatPosition < flength; formatPosition++) {
                if (currentTokenIndex == valueLength) break;
                if (literal) {
                    checkLiteral();
                    if (format.charAt(formatPosition) == "'")
                        literal = false;
                } else {
                    switch (format.charAt(formatPosition)) {
                        case 'd':
                            count = lookAhead('d');
                            day = count <= 1 ? getNumber(2) : getName($t.cultureInfo[count == 3 ? 'days' : 'abbrDays']);
                            break;
                        case 'M':
                            count = lookAhead('M');
                            month = count <= 1 ? getNumber(2) : getName($t.cultureInfo[count == 3 ? 'months' : 'abbrMonths']);
                            break;
                        case 'y':
                            count = lookAhead('y');
                            year = getNumber(count <= 1 ? 2 : 4);
                            break;
                        case 'H': // 0-24 hours
                            count = lookAhead('H');
                            hours = normalizeTime(getNumber(2));
                            break;
                        case 'h': // 0-12 hours
                            lookAhead('h')
                            hours = normalizeTime(getNumber(2));
                            break;
                        case 'm':
                            lookAhead('m');
                            minutes = normalizeTime(getNumber(2));
                            break;
                        case 's':
                            lookAhead('s');
                            seconds = normalizeTime(getNumber(2));
                            break;
                        case 'f':
                            count = lookAhead('f');
                            milliseconds = normalizeTime(getNumber(count <= 0 ? 1 : count + 1));
                            break;
                        case 't': // AM/PM or A/P
                            count = lookAhead('t');
                            AM = count > 0 ? AM : 'a';
                            PM = count > 0 ? PM : 'p';

                            var subValue = value.substr(currentTokenIndex).toLowerCase();
                            isAM = subValue.indexOf(AM.toLowerCase()) != -1;
                            isPM = subValue.indexOf(PM.toLowerCase()) != -1;

                            currentTokenIndex += isPM ? PM.length : isAM ? AM.length : 0;
                            break;
                        case "'":
                            checkLiteral();
                            literal = true;
                            break;
                        default:
                            checkLiteral();
                    }
                }
            }

            var date = new $t.datetime();

            if (year != -1 && year < 100)
                year += date.year() - date.year() % 100 +
                                (year <= shortYearCutOff ? 0 : -100);

            hours = (isPM && hours < 12)
                  ? hours + 12
                  : hours == 12 && isAM
                  ? 0
                  : hours;

            if (baseDate == undefined) {
                if (year == -1) year = date.year();

                date = new $t.datetime(year, month - 1, day, hours, minutes, seconds, milliseconds);

                if (date.year() != year || date.month() != (month - 1) || date.date() != day)
                    return null;

            } else {
                date = baseDate.year(year != -1 ? year : baseDate.year())
                               .month(month != -1 ? month - 1 : baseDate.month())
                               .date(day != -1 ? day : baseDate.date())
                               .hours(hours)
                               .minutes(minutes)
                               .seconds(seconds)
                               .milliseconds(milliseconds);



                if ((year != -1 && date.year() != year)
                 || (month != -1 && date.month() != (month - 1))
                 || (day != -1 && date.date() != day)
                 || (hours != -1 && date.hours() != hours)
                 || (minutes != -1 && date.minutes() != minutes)
                 || (seconds != -1 && date.seconds() != seconds)
                 || (milliseconds != -1 && date.milliseconds() != milliseconds))
                    return null;
            }
            return date;
        }
    });

    $t.datetime.prototype = {

        year: function () {
            if (arguments.length == 0)
                return this.value.getFullYear();
            else if (arguments.length == 1)
                this.value.setFullYear(arguments[0]);
            else
                this.value.setFullYear(arguments[0], arguments[1], arguments[2]);

            return this;
        },

        timeOffset: function () {
            return this.value.getTimezoneOffset();
        },

        day: function () {
            return this.value.getDay();
        },

        toDate: function () {
            return this.value;
        },

        addMonth: function (value) {
            this.month(this.month() + value);
        },

        addYear: function (value) {
            this.year(this.year() + value);
        }
    };

    $.each(["Month", "Date", "Hours", "Minutes", "Seconds", "Milliseconds", "Time"], function (index, timeComponent) {
        $t.datetime.prototype[timeComponent.toLowerCase()] =
            function () {
                if (arguments.length == 1)
                    this.value["set" + timeComponent](arguments[0]);
                else
                    return this.value["get" + timeComponent]();

                return this;
            };
    });

    $t.stringBuilder.prototype = {

        cat: function (what) {
            this.buffer.push(what);
            return this;
        },

        rep: function (what, howManyTimes) {
            for (var i = 0; i < howManyTimes; i++)
                this.cat(what);
            return this;
        },

        catIf: function (what, condition) {
            if (condition)
                this.cat(what);
            return this;
        },

        string: function () {
            return this.buffer.join('');
        }
    }

    // Effects ($t.fx)

    var prepareAnimations = function (effects, target, end) {
        if (target.length == 0 && end) {
            end();
            return null;
        }

        var animationsToPlay = effects.list.length;

        return function () {
            if (--animationsToPlay == 0 && end)
                end();
        };
    };

    $.extend($t.fx, {
        _wrap: function (element) {
            if (!element.parent().hasClass('t-animation-container')) {
                element.wrap(
                             $('<div/>')
                             .addClass('t-animation-container')
                             .css({
                                 width: element.outerWidth(),
                                 height: element.outerHeight()
                             }));
            }

            return element.parent();
        },

        play: function (effects, target, options, end) {
            var afterAnimation = prepareAnimations(effects, target, end);

            if (afterAnimation === null) return;

            target.stop(false, true);

            for (var i = 0, len = effects.list.length; i < len; i++) {

                var effect = new $t.fx[effects.list[i].name](target);

                if (!target.data('effect-' + i)) {
                    effect.play(
                    $.extend(
                        effects.list[i], {
                            openDuration: effects.openDuration,
                            closeDuration: effects.closeDuration
                        },
                        options), afterAnimation);

                    target.data('effect-' + i, effect);
                }
            }
        },

        rewind: function (effects, target, options, end) {
            var afterAnimation = prepareAnimations(effects, target, end);

            if (afterAnimation === null) return;

            for (var i = effects.list.length - 1; i >= 0; i--) {

                var effect = target.data('effect-' + i) || new $t.fx[effects.list[i].name](target);

                effect.rewind(
                    $.extend(
                        effects.list[i], {
                            openDuration: effects.openDuration,
                            closeDuration: effects.closeDuration
                        },
                        options), afterAnimation);

                target.data('effect-' + i, null);
            }
        }
    });

    // simple show/hide toggle

    $t.fx.toggle = function (element) {
        this.element = element.stop(false, true);
    };

    $t.fx.toggle.prototype = {
        play: function (options, end) {
            this.element.show();
            if (end) end();
        },
        rewind: function (options, end) {
            this.element.hide();
            if (end) end();
        }
    }

    $t.fx.toggle.defaults = function () {
        return { list: [{ name: 'toggle'}] };
    };

    // slide animation

    $t.fx.slide = function (element) {
        this.element = element;

        this.animationContainer = $t.fx._wrap(element);
    };

    $t.fx.slide.prototype = {
        play: function (options, end) {

            var animationContainer = this.animationContainer;

            this.element.css('display', 'block').stop();

            animationContainer
                .css({
                    display: 'block',
                    overflow: 'hidden'
                });

            var width = this.element.outerWidth();
            var height = this.element.outerHeight();
            var animatedProperty = options.direction == 'bottom' ? 'marginTop' : 'marginLeft';
            var animatedStartValue = options.direction == 'bottom' ? -height : -width;

            animationContainer
                .css({
                    width: width,
                    height: height
                });

            var animationEnd = {};
            animationEnd[animatedProperty] = 0;

            this.element
                .css('width', this.element.width())
                .each(function () { this.style.cssText = this.style.cssText; })
                .css(animatedProperty, animatedStartValue)
                .animate(animationEnd, {
                    queue: false,
                    duration: options.openDuration,
                    easing: 'linear',
                    complete: function () {
                        animationContainer.css('overflow', '');

                        if (end) end();
                    }
                });
        },

        rewind: function (options, end) {
            var animationContainer = this.animationContainer;

            this.element.stop();

            animationContainer.css({
                overflow: 'hidden'
            });

            var animatedProperty;

            switch (options.direction) {
                case 'bottom': animatedProperty = { marginTop: -this.element.outerHeight() };
                    break;
                case 'right': animatedProperty = { marginLeft: -this.element.outerWidth() }; break;
            }

            this.element
                .animate(animatedProperty, {
                    queue: false,
                    duration: options.closeDuration,
                    easing: 'linear',
                    complete: function () {
                        animationContainer
                            .css({
                                display: 'none',
                                overflow: ''
                            });

                        if (end) end();
                    }
                });
        }
    }

    $t.fx.slide.defaults = function () {
        return { list: [{ name: 'slide'}], openDuration: 'fast', closeDuration: 'fast' };
    };

    // property animation

    $t.fx.property = function (element) {
        this.element = element;
    };

    $t.fx.property.prototype = {
        _animate: function (properties, duration, reverse, end) {
            var startValues = { overflow: 'hidden' },
                endValues = {},
                $element = this.element;

            $.each(properties, function (i, prop) {
                var value;

                switch (prop) {
                    case 'height':
                    case 'width': value = $element[prop](); break;

                    case 'opacity': value = 1; break;

                    default: value = $element.css(prop); break;
                }

                startValues[prop] = reverse ? value : 0;
                endValues[prop] = reverse ? 0 : value;
            });

            $element.css(startValues)
                    .show()
                    .animate(endValues, {
                        queue: false,
                        duration: duration,
                        easing: 'linear',
                        complete: function () {
                            if (reverse)
                                $element.hide();

                            $.each(endValues, function (property) {
                                endValues[property] = '';
                            });

                            $element.css($.extend({ overflow: '' }, endValues));

                            if (end) end();
                        }
                    });
        },

        play: function (options, complete) {
            this._animate(options.properties, options.openDuration, false, complete);
        },

        rewind: function (options, complete) {
            this._animate(options.properties, options.closeDuration, true, complete);
        }
    }

    $t.fx.property.defaults = function () {
        return { list: [{ name: 'property', properties: arguments}], openDuration: 'fast', closeDuration: 'fast' };
    };

    // fix the MVC validation code for IE (document.getElementsByName matches `id` and `name` instead of just `name`). http://www.w3.org/TR/REC-DOM-Level-1/level-one-html.html#ID-71555259
    $(document).ready(function () {
        if ($.browser.msie && typeof (Sys) != 'undefined' && typeof (Sys.Mvc) != 'undefined' && typeof (Sys.Mvc.FormContext) != 'undefined') {
            var patch = function (formElement, name) {
                return $.grep(formElement.getElementsByTagName('*'), function (element) {
                    return element.name == name;
                });
            };

            Sys.Mvc.FormContext.$F = Sys.Mvc.FormContext._getFormElementsWithName = patch;
        }

    });
})(jQuery);
