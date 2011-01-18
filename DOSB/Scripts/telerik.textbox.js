(function ($) {

    var $t = $.telerik,
        keycodes = [8, // backspace
                    9, // tab
                    37, // left arrow
                    38, // up arrow
                    39, // right arrow
                    40, // down arrow
                    46, // delete
                    35, // end
                    36, // home
                    44]; //","

    $t.textbox = function (element, options) {
        this.element = element;
        $.extend(this, options);

        var input = $('.t-input', element);

        this.enabled = !input.is('[disabled]');

        var builder = new $t.stringBuilder();
        builder.cat('[ |')
               .cat(this.groupSeparator)
               .catIf('|' + this.symbol, this.symbol)
               .cat(']');
        this.replaceRegExp = new RegExp(builder.string(), 'g');

        var pasteMethod = $.browser.msie ? 'paste' : 'input';

        var inputValue = input.attr('value');
        var inputText = $('<input />', $.extend({
            id: input.attr('id') + "-text",
            name: input.attr('name') + "-text",
            value: (inputValue || this.enabled ? this.text : ''),
            'class': input.attr('class'),
            style: input.attr('style')
        }, this.inputAttributes));

        if (this.enabled)
            inputText.attr('disabled', true);

        inputText
            .bind({
                blur: $.proxy(this.blur, this),
                focus: $.proxy(this.focus, this),
                keydown: $.proxy(this.keydown, this),
                keypress: $.proxy(this.keypress, this),
                change: function (e) { e.stopPropagation(); }
            })
            .bind(pasteMethod, $.proxy(this[pasteMethod], this))
            .insertBefore(input);

        input.hide().appendTo(element);

        var buttons =
                $('.t-arrow-up, .t-arrow-down', element)
                    .bind({
                        click: $t.preventDefault,
                        dragstart: $t.preventDefault
                    });

        this[this.enabled ? 'enable' : 'disable']();

        this.numFormat = this.numFormat === undefined ? this.type.charAt(0) : this.numFormat;
        var separator = this.separator;
        this.step = this.parse(this.step, separator);
        this.val = this.parse(this.val, separator);
        this.minValue = this.parse(this.minValue, separator);
        this.maxValue = this.parse(this.maxValue, separator);
        this.decimals = { '190': '.', '188': ',', '110': separator };

        if (inputValue != '') //format the input value if it exists.
            this.value(inputValue);

        $t.bind(this, {
            change: this.onChange,
            load: this.onLoad
        });
    }

    $t.textbox.prototype = {
        enable: function () {
            var $element = $(this.element),
                $input = $element.find('.t-input'),
                buttons = $element.find('.t-arrow-up, .t-arrow-down'),
                clearTimerProxy = $.proxy(this.clearTimer, this);

            this.enabled = true;

            $element.removeClass('t-state-disabled');
            $input.removeAttr("disabled");

            if (!this.val && this.val != 0)
                $input.eq(0).val(this.text);

            buttons.unbind('mouseup').unbind('mouseout').unbind('dblclick')
                   .bind({
                       mouseup: clearTimerProxy,
                       mouseout: clearTimerProxy,
                       dblclick: clearTimerProxy
                   });

            $(buttons[0]).unbind('mousedown').mousedown($.proxy(function (e) {
                this.updateState();
                this.stepper(e, 1);
            }, this));

            $(buttons[1]).unbind('mousedown').mousedown($.proxy(function (e) {
                this.updateState();
                this.stepper(e, -1);
            }, this));
        },

        disable: function () {
            var $element = $(this.element);

            this.enabled = false;

            $element
                .addClass('t-state-disabled')
                .find('.t-input')
                    .attr('disabled', 'disabled')
                .end()
                .find('.t-icon')
                    .unbind('mousedown')
                    .bind('mousedown', $t.preventDefault);

            if (!this.val && this.val != 0)
                $element.find('.t-input:first').val('');
        },

        updateState: function () {
            var value = $('> .t-input:first', this.element).val();

            if (this.val != this.parse(value, this.separator))
                this.parseTrigger(value)
        },

        input: function (e, element) {

            var val = $(element).val();

            if (val == '-') return true;

            var parsedValue = this.parse(val, this.separator);

            if (parsedValue || parsedValue == 0)
                this.trigger(this.round(parsedValue, this.digits));
        },

        paste: function (e, element) {

            var $input = $(element);
            var val = $input.val();

            var selectedText = element.document.selection.createRange().text;
            var text = window.clipboardData.getData("Text");

            if (selectedText > 0) val = val.replace(selectedText, text);
            else val += text;


            var parsedValue = this.parse(val, this.separator);
            if (parsedValue || parsedValue == 0)
                this.trigger(this.round(parsedValue, this.digits));
        },

        focus: function (e) {
            this.focused = true;
            this.updateState();

            var value = this.formatEdit(this.val);
            $(e.target).val(value || (value == 0 ? 0 : ''));

            if (!$.browser.safari) e.target.select();
        },

        blur: function (e) {
            this.focused = false;

            var min = this.minValue;
            var max = this.maxValue;
            var $input = $(e.target);
            var inputValue = this.parse($input.val(), this.separator);

            if (inputValue != null) {
                if (min != null && inputValue < min)
                    inputValue = min
                else if (max != null && inputValue > max)
                    inputValue = max
            }

            $input.removeClass('t-state-error');
            this.parseTrigger(inputValue);
            this.value(inputValue);
        },

        keydown: function (e) {
            var key = e.keyCode,
                $input = $(e.target),
                separator = this.separator;

            setTimeout($.proxy(function () {
                $input.toggleClass('t-state-error', !this.inRange(this.parse($input.val(), this.separator), this.minValue, this.maxValue));
            }, this));

            // Allow decimal
            var decimalSeparator = this.decimals[key];
            if (decimalSeparator) {
                if (decimalSeparator == separator && this.digits > 0
                    && $t.caretPos($input[0]) != 0 && $input.val().indexOf(separator) == -1) {
                    return true;
                } else {
                    e.preventDefault();
                }
            }

            if (key == 8 || key == 46) { //backspace and delete
                setTimeout($.proxy(function () {
                    this.parseTrigger($input.val())
                }, this));
                return true;
            }

            if (key == 38 || key == 40) {
                this.modifyInput($input, this.step * (key == 38 ? 1 : -1));
                return true;
            }

            if (key == 222) e.preventDefault();
        },

        keypress: function (e) {
            var $input = $(e.target),
                key = e.keyCode || e.which;

            if (key == 0 || $.inArray(key, keycodes) != -1 || e.ctrlKey || (e.shiftKey && key == 45))
                return true;

            if (((this.minValue !== null ? this.minValue < 0 : true)
                    && String.fromCharCode(key) == "-"
                    && $t.caretPos($input[0]) == 0
                    && $input.val().indexOf("-") == -1)
                || this.inRange(key, 48, 57)) {
                setTimeout($.proxy(function () {
                    this.parseTrigger($input.val());
                }, this));
                return true;
            }

            e.preventDefault();
        },

        clearTimer: function (e) {
            clearTimeout(this.timeout);
            clearInterval(this.timer);
            clearInterval(this.acceleration);
        },

        stepper: function (e, stepMod) {
            if (e.which == 1) {

                var input = $('.t-input:first', this.element),
                    step = this.step;

                this.modifyInput(input, stepMod * step);

                this.timeout = setTimeout($.proxy(function () {
                    this.timer = setInterval($.proxy(function () {
                        this.modifyInput(input, stepMod * step);
                    }, this), 80);

                    this.acceleration = setInterval(function () { step += 1; }, 1000);
                }, this), 200);
            }
        },

        value: function (value) {
            if (arguments.length == 0) return this.val;

            var parsedValue = (typeof value === typeof 1) ? value : this.parse(value, this.separator);
            if (!this.inRange(parsedValue, this.minValue, this.maxValue))
                parsedValue = null;

            var isNull = parsedValue === null;

            var text = this.enabled ? this.text : '';
            this.val = parsedValue;
            $(this.element)
                .find('.t-input:last').val(isNull ? '' : this.formatEdit(parsedValue)).end()
                .find('.t-input:first').val(isNull ? text : this.format(parsedValue));
            return this;
        },

        modifyInput: function ($input, step) {
            var value = this.val,
                min = this.minValue,
                max = this.maxValue;

            value = value ? value + step : step;
            value = (min !== null && value < min) ? min : (max !== null && value > max) ? max : value;

            var fixedValue = this.round(value, this.digits);

            this.trigger(fixedValue);

            var formatedValue = this.focused ? this.formatEdit(fixedValue) : this.format(fixedValue);

            $input.removeClass('t-state-error').val(formatedValue);
        },

        formatEdit: function (value) {
            var separator = this.separator;
            if (value && separator != '.')
                value = value.toString().replace('.', separator);
            return value;
        },

        format: function (value) {
            return $t.textbox.formatNumber(value,
                                           this.numFormat,
                                           this.digits,
                                           this.separator,
                                           this.groupSeparator,
                                           this.groupSize,
                                           this.positive,
                                           this.negative,
                                           this.symbol,
                                           true);
        },

        trigger: function (newValue) {
            if (this.val != newValue) {
                if ($t.trigger(this.element, 'change', { oldValue: this.val, newValue: newValue })) return;
                $('.t-input:last', this.element).val(this.formatEdit(newValue));
                this.val = newValue;
            }
        },

        parseTrigger: function (value) {
            this.trigger(this.round(this.parse(value, this.separator), this.digits));
        },

        inRange: function (key, min, max) {
            return key === null || ((min !== null ? key >= min : true) && (max !== null ? key <= max : true));
        },

        parse: function (value, separator) {
            var result = null;
            if (value || value == "0") {
                if (typeof value == typeof 1) return value;

                value = value.replace(this.replaceRegExp, '');
                if (separator && separator != '.')
                    value = value.replace(separator, '.');

                var negativeFormatPattern = $.fn.tTextBox.patterns[this.type].negative[this.negative]
                        .replace(/(\(|\))/g, '\\$1').replace('*', '').replace('n', '([\\d|\\.]*)'),
                    negativeFormatRegEx = new RegExp(negativeFormatPattern);

                if (negativeFormatRegEx.test(value))
                    result = -parseFloat(negativeFormatRegEx.exec(value)[1]);
                else
                    result = parseFloat(value);
            }
            return isNaN(result) ? null : result;
        },

        round: function (value, digits) {
            if (value || value == 0)
                return parseFloat(value.toFixed(digits || 2));
            return null;
        }
    }

    $.fn.tTextBox = function (options) {
        var type = options.type,
            defaults = $.fn.tTextBox.defaults[type];

        defaults.digits = $t.cultureInfo[type + 'decimaldigits'];
        defaults.separator = $t.cultureInfo[type + 'decimalseparator'];
        defaults.groupSeparator = $t.cultureInfo[type + 'groupseparator'];
        defaults.groupSize = $t.cultureInfo[type + 'groupsize'];
        defaults.positive = $t.cultureInfo[type + 'positive'];
        defaults.negative = $t.cultureInfo[type + 'negative'];
        defaults.symbol = $t.cultureInfo[type + 'symbol'];

        options = $.extend({}, defaults, options);

        return this.each(function () {
            var $element = $(this);
            options = $.meta ? $.extend({}, options, $element.data()) : options;

            if (!$element.data('tTextBox')) {
                $element.data('tTextBox', new $t.textbox(this, options));
                $t.trigger(this, 'load');
            }
        });
    };

    var commonDefaults = {
        val: null,
        text: '',
        step: 1,
        inputAttributes: ''
    };

    $.fn.tTextBox.defaults = {
        numeric: $.extend(commonDefaults, {
            minValue: -100,
            maxValue: 100
        }),
        currency: $.extend(commonDefaults, {
            minValue: 0,
            maxValue: 1000
        }),
        percent: $.extend(commonDefaults, {
            minValue: 0,
            maxValue: 100
        })
    };

    // * - placeholder for the symbol
    // n - placeholder for the number
    $.fn.tTextBox.patterns = {
        numeric: {
            negative: ['(n)', '-n', '- n', 'n-', 'n -']
        },
        currency: {
            positive: ['*n', 'n*', '* n', 'n *'],
            negative: ['(*n)', '-*n', '*-n', '*n-', '(n*)', '-n*', 'n-*', 'n*-', '-n *', '-* n', 'n *-', '* n-', '* -n', 'n- *', '(* n)', '(n *)']
        },
        percent: {
            positive: ['n *', 'n*', '*n'],
            negative: ['-n *', '-n*', '-*n']
        }
    };

    if (!$t.cultureInfo.numericnegative)
        $.extend($t.cultureInfo, { //default en-US settings
            currencydecimaldigits: 2,
            currencydecimalseparator: '.',
            currencygroupseparator: ',',
            currencygroupsize: 3,
            currencynegative: 0,
            currencypositive: 0,
            currencysymbol: '$',
            numericdecimaldigits: 2,
            numericdecimalseparator: '.',
            numericgroupseparator: ',',
            numericgroupsize: 3,
            numericnegative: 1,
            percentdecimaldigits: 2,
            percentdecimalseparator: '.',
            percentgroupseparator: ',',
            percentgroupsize: 3,
            percentnegative: 0,
            percentpositive: 0,
            percentsymbol: '%'
        });

    var customFormatRegEx = /[0#?]/;

    function reverse(str) {
        return str.split('').reverse().join('');
    }

    function injectInFormat(val, format, appendExtras) {
        var i = 0, j = 0,
            fLength = format.length,
            vLength = val.length,
            builder = new $t.stringBuilder();

        while (i < fLength && j < vLength && format.substring(i).search(customFormatRegEx) >= 0) {

            if (format.charAt(i).match(customFormatRegEx))
                builder.cat(val.charAt(j++));
            else
                builder.cat(format.charAt(i));

            i++;
        }

        builder.catIf(val.substring(j), j < vLength && appendExtras)
               .catIf(format.substring(i), i < fLength);

        var result = reverse(builder.string()),
            zeroIndex;

        if (result.indexOf('#') > -1)
            zeroIndex = result.indexOf('0');

        if (zeroIndex > -1) {
            var first = result.slice(0, zeroIndex),
                second = result.slice(zeroIndex, result.length);
            result = first.replace(/#/g, '') + second.replace(/#/g, '0');
        } else {
            result = result.replace(/#/g, '');
        }

        if (result.indexOf(',') == 0)
            result = result.replace(/,/g, '');

        return appendExtras ? result : reverse(result);
    }

    $t.textbox.formatNumber = function (number,
                                        format,
                                        digits,
                                        separator,
                                        groupSeparator,
                                        groupSize,
                                        positive,
                                        negative,
                                        symbol,
                                        isTextBox) {

        if (!format) return number;

        var type, customFormat, negativeFormat, zeroFormat, sign = number < 0;

        format = format.split(':');
        format = format.length > 1 ? format[1].replace('}', '') : format[0];

        var isCustomFormat = format.search(customFormatRegEx) != -1;

        if (isCustomFormat) {
            format = format.split(';');
            customFormat = format[0];
            negativeFormat = format[1];
            zeroFormat = format[2];
            format = (sign && negativeFormat ? negativeFormat : customFormat).indexOf('%') != -1 ? 'p' : 'n';
        }

        switch (format.toLowerCase()) {
            case 'd':
                return Math.round(number).toString();
            case 'c':
                type = 'currency'; break;
            case 'n':
                type = 'numeric'; break;
            case 'p':
                type = 'percent';
                if (!isTextBox) number = Math.abs(number) * 100;
                break;
            default:
                return number.toString();
        }

        var zeroPad = function (str, count, left) {
            for (var l = str.length; l < count; l++)
                str = left ? ('0' + str) : (str + '0');

            return str;
        }

        var addGroupSeparator = function (number, groupSeperator, groupSize) {
            if (groupSeparator) {
                var regExp = new RegExp('(-?[0-9]+)([0-9]{' + groupSize + '})');
                while (regExp.test(number)) {
                    number = number.replace(regExp, '$1' + groupSeperator + '$2');
                }
            }
            return number;
        }

        var cultureInfo = cultureInfo || $t.cultureInfo,
            patterns = $.fn.tTextBox.patterns,
            undefined;

        //define Number Formating info.
        digits = digits || digits === 0 ? digits : cultureInfo[type + 'decimaldigits'];
        separator = separator !== undefined ? separator : cultureInfo[type + 'decimalseparator'];
        groupSeparator = groupSeparator !== undefined ? groupSeparator : cultureInfo[type + 'groupseparator'];
        groupSize = groupSize || groupSize == 0 ? groupSize : cultureInfo[type + 'groupsize'];
        negative = negative || negative === 0 ? negative : cultureInfo[type + 'negative'];
        positive = positive || positive === 0 ? positive : cultureInfo[type + 'positive'];
        symbol = symbol || cultureInfo[type + 'symbol'];

        var exponent, left, right;

        if (isCustomFormat) {
            var splits = (sign && negativeFormat ? negativeFormat : customFormat).split('.');
            var leftF = splits[0];
            var rightF = splits.length > 1 ? splits[1] : '';
            var lastIndexZero = $t.lastIndexOf(rightF, '0');
            var lastIndexSharp = $t.lastIndexOf(rightF, '#');
            var digits = (lastIndexSharp > lastIndexZero ? lastIndexSharp : lastIndexZero) + 1;
        }

        var factor = Math.pow(10, digits);
        var rounded = (Math.round(number * factor) / factor);
        number = isFinite(rounded) ? rounded : number;

        var split = number.toString().split(/e/i);
        exponent = split.length > 1 ? parseInt(split[1]) : 0;
        split = split[0].split('.');

        left = split[0];
        left = sign ? left.replace('-', '') : left;

        right = split.length > 1 ? split[1] : '';

        if (exponent) {
            if (!sign) {
                right = zeroPad(right, exponent, false);
                left += right.slice(0, exponent);
                right = right.substr(exponent);
            } else {
                left = zeroPad(left, exponent + 1, true);
                right = left.slice(exponent, left.length) + right;
                left = left.slice(0, exponent);
            }
        }

        var rightLength = right.length;
        if (digits < 1 || (isCustomFormat && lastIndexZero == -1 && rightLength === 0))
            right = ''
        else
            right = rightLength > digits ? right.slice(0, digits) : zeroPad(right, digits, false);

        var result;
        if (isCustomFormat) {
            if (left == 0) left = '';

            left = injectInFormat(reverse(left), reverse(leftF), true);
            left = leftF.indexOf(',') != -1 ? addGroupSeparator(left, groupSeparator, groupSize) : left;

            right = right && rightF ? injectInFormat(right, rightF) : '';

            result = number === 0 && zeroFormat ? zeroFormat
                : (sign && !negativeFormat ? '-' : '') + left + (right.length > 0 ? separator + right : '');

        } else {

            left = addGroupSeparator(left, groupSeparator, groupSize)
            patterns = patterns[type];
            var pattern = sign ? patterns['negative'][negative]
                        : symbol ? patterns['positive'][positive]
                        : null;

            var numberString = left + (right.length > 0 ? separator + right : '');

            result = pattern ? pattern.replace('n', numberString).replace('*', symbol) : numberString;
        }
        return result;
    }

    $.extend($t.formatters, {
        number: $t.textbox.formatNumber
    });
})(jQuery);
