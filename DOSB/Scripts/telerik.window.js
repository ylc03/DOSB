(function ($) {

    var $t = $.telerik;

    function isLocalUrl(url) {
        var loweredUrl = url ? url.toLowerCase() : '';
        return loweredUrl && loweredUrl.indexOf('http') !== 0 && loweredUrl.indexOf('https') !== 0;
    }

    function fixIE6Sizing($element) {
        if ($.browser.msie && $.browser.version < 7) {
            $element
                .find('.t-resize-e,.t-resize-w').css('height', $element.height()).end()
                .find('.t-resize-n,.t-resize-s').css('width', $element.width()).end()
                .find('.t-overlay').css({ width: $element.width(), height: $element.height() });
        }
    }

    // zoom animation

    $t.fx.zoom = function (element) {
        this.element = element;
    };

    $t.fx.zoom.prototype = {
        play: function (options, end) {            
            var $element = this.element.show();

            var resizeElement = $element.find('> .t-window-content');

            var endValues = {
                width: resizeElement.width(),
                height: resizeElement.height(),
                left: parseInt($element.css('left')),
                top: parseInt($element.css('top'))
            };

            $element
                .css({
                    left: endValues.left + 20,
                    top: endValues.top + 20
                })
                .animate({
                    left: endValues.left,
                    top: endValues.top
                }, options.openDuration);

            resizeElement
                .css({
                    width: endValues.width - 40,
                    height: endValues.height - 40
                })
                .animate({
                    width: endValues.width,
                    height: endValues.height
                }, options.openDuration, function () {
                    if (end) end();
                });
        },

        rewind: function (options, end) {            
            var $element = this.element;

            var resizeElement = $element.find('> .t-window-content');
            var endValues = {
                width: resizeElement.width(),
                height: resizeElement.height(),
                left: parseInt($element.css('left')),
                top: parseInt($element.css('top'))
            };

            resizeElement.animate({
                width: endValues.width - 40,
                height: endValues.height - 40
            }, options.closeDuration);

            $element.animate({
                left: endValues.left + 20,
                top: endValues.top + 20
            }, options.closeDuration, function () {
                $element.css({
                    left: endValues.left,
                    top: endValues.top
                }).hide();

                resizeElement.css({
                    width: endValues.width,
                    height: endValues.height
                });

                if (end) end();
            });
        }
    }

    $t.fx.zoom.defaults = function () {
        return { list: [{ name: 'zoom'}], openDuration: 'fast', closeDuration: 'fast' };
    };

    $t.window = function (element, options) {
        this.element = element;
        var $element = $(element);

        if (!$element.is('.t-window')) {
            $element.addClass('t-widget t-window');
            $t.window.create(element, options);
        }

        $.extend(this, options);

        var windowActions = '.t-window-titlebar .t-window-action';

        $element
            .delegate(windowActions, 'mouseenter', $t.hover)
            .delegate(windowActions, 'mouseleave', $t.leave)
            .delegate(windowActions, 'click', $.proxy(this.windowActionHandler, this));

        if (this.resizable) {
            $element
                .delegate('.t-window-titlebar', 'dblclick', $.proxy(this.toggleMaximization, this))
                .append($t.window.getResizeHandlesHtml());

            fixIE6Sizing($element);

            (function(wnd) {
                
                function start(e) {
                    var $element = $(wnd.element);

                    wnd.initialCursorPosition = $element.offset();

                    wnd.resizeDirection = e.$draggable.attr('className').replace('t-resize-handle t-resize-', '').split('');

                    wnd.resizeElement = $element.find('> .t-window-content');

                    wnd.initialSize = {
                        width: wnd.resizeElement.width(),
                        height: wnd.resizeElement.height()
                    };

                    wnd.outlineSize = {
                        left: wnd.resizeElement.outerWidth() - wnd.resizeElement.width()
                            + $element.outerWidth() - $element.width(),
                        top: wnd.resizeElement.outerHeight() - wnd.resizeElement.height()
                            + $element.outerHeight() - $element.height()
                            + $element.find('> .t-window-titlebar').outerHeight()
                    }

                    $('<div class="t-overlay" />').appendTo(wnd.element);

                    $element.find('.t-resize-handle').not(e.$draggable).hide();

                    $(document.body).css('cursor', e.$draggable.css('cursor'));                    
                }

                function drag(e) {
                    var $element = $(wnd.element);

                    var resizeHandlers = {
                        'e': function () {
                            var width = e.pageX - wnd.initialCursorPosition.left - wnd.outlineSize.left;
                            wnd.resizeElement.width((width < wnd.minWidth
                                                        ? wnd.minWidth
                                                        : (wnd.maxWidth && width > wnd.maxWidth)
                                                        ? wnd.maxWidth
                                                        : width));
                        },
                        's': function () {
                            var height = e.pageY - wnd.initialCursorPosition.top - wnd.outlineSize.top;
                            wnd.resizeElement
                                    .height((height < wnd.minHeight ? wnd.minHeight
                                            : (wnd.maxHeight && height > wnd.maxHeight) ? wnd.maxHeight
                                            : height));
                        },
                        'w': function () {
                            var windowRight = wnd.initialCursorPosition.left + wnd.initialSize.width;

                            $element.css('left', e.pageX > (windowRight - wnd.minWidth) ? windowRight - wnd.minWidth
                                                : e.pageX < (windowRight - wnd.maxWidth) ? windowRight - wnd.maxWidth
                                                : e.pageX);

                            var width = windowRight - e.pageX;
                            wnd.resizeElement.width((width < wnd.minWidth ? wnd.minWidth
                                                    : (wnd.maxWidth && width > wnd.maxWidth) ? wnd.maxWidth
                                                    : width));

                        },
                        'n': function () {
                            var windowBottom = wnd.initialCursorPosition.top + wnd.initialSize.height;

                            $element.css('top', e.pageY > (windowBottom - wnd.minHeight) ? windowBottom - wnd.minHeight
                                                : e.pageY < (windowBottom - wnd.maxHeight) ? windowBottom - wnd.maxHeight
                                                : e.pageY);

                            var height = windowBottom - e.pageY;
                            wnd.resizeElement
                                    .height((height < wnd.minHeight ? wnd.minHeight
                                            : (wnd.maxHeight && height > wnd.maxHeight) ? wnd.maxHeight
                                            : height));
                        }
                    };

                    $.each(wnd.resizeDirection, function () {
                        resizeHandlers[this]();
                    });

                    fixIE6Sizing($element);

                    $t.trigger(wnd.element, 'resize');
                }

                function stop(e) {
                    $(wnd.element).find('.t-overlay')
                                  .remove()
                                  .end()
                                  .find('.t-resize-handle')
                                  .not(e.$draggable)
                                  .show();
                    
                    $(document.body).css('cursor', '');

                    if (e.keyCode == 27) {
                        fixIE6Sizing($(wnd.element));
                        wnd.resizeElement.css(wnd.initialSize);
                    }
                    
                    return false;
                }

                new $t.draggable({
                    owner: wnd.element,
                    selector: '.t-resize-handle',
                    scope: wnd.element.id + '-resizing',
                    distance: 0,
                    start: start,
                    drag: drag,
                    stop: stop
                });
            })(this);
        }

        if (this.draggable) {
            (function(wnd){
                function start(e) {
                    wnd.initialWindowPosition = $(wnd.element).position();

                    wnd.startPosition = {
                        left: e.pageX - wnd.initialWindowPosition.left,
                        top: e.pageY - wnd.initialWindowPosition.top
                    };

                    $('.t-resize-handle', wnd.element).hide();

                    $('<div class="t-overlay" />').appendTo(wnd.element);

                    $(document.body).css('cursor', e.$draggable.css('cursor'));
                }
                
                function drag(e) {
                    var coordinates = {
                        left: e.pageX - wnd.startPosition.left,
                        top: Math.max(e.pageY - wnd.startPosition.top, 0)
                    };

                    $(wnd.element).css(coordinates);
                }

                function stop(e) {
                    $(wnd.element).find('.t-resize-handle')
                                  .show()
                                  .end()
                                  .find('.t-overlay')
                                  .remove();

                    $(document.body).css('cursor', '');

                    if (e.keyCode == 27)
                        e.$draggable.closest('.t-window').css(wnd.initialWindowPosition);

                    return false;
                }
                new $t.draggable({
                    owner: wnd.element,
                    selector: '.t-window-titlebar',
                    scope: wnd.element.id + '-moving',
                    start: start,
                    drag: drag,
                    stop: stop
                })
            })(this);
        }

        $t.bind(this, {
            open: this.onOpen,
            activated: this.onActivate,
            close: this.onClose,
            refresh: this.onRefresh,
            resize: this.onResize,
            error: this.onError,
            load: this.onLoad,
            move: this.onMove
        });

        if (!$element.parent().is('body')) {
            if ($element.is(':visible'))
                $element.css($element.offset());

            $element
                .toggleClass('t-rtl', $element.closest('.t-rtl').length > 0)
                .appendTo(document.body);
        }

        if (this.modal)
            this.overlay($element.is(':visible'));

        $(window).resize($.proxy(this.onDocumentResize, this));

        if (isLocalUrl(this.contentUrl)) this.ajaxRequest();
    };

    $t.window.prototype = {
        overlay: function (visible) {
            var overlay = $('body > .t-overlay');
            if (overlay.length == 0)
                overlay = $('<div class="t-overlay" />')
                                .toggle(visible)
                                .appendTo(this.element.ownerDocument.body);
            var $doc = $(document);
            if ($.browser.msie && $.browser.version < 7)
                overlay.css({
                    width: $doc.width() - 21,
                    height: $doc.height(),
                    position: 'absolute'
                });

            return overlay;
        },

        windowActionHandler: function (e) {
            var $target = $(e.target).closest('.t-window-action').find('.t-icon');
            var contextWindow = this;

            $.each({
                't-close': this.close,
                't-maximize': this.maximize,
                't-restore': this.restore,
                't-refresh': this.refresh
            }, function (commandName, handler) {
                if ($target.hasClass(commandName)) {
                    e.preventDefault();
                    handler.call(contextWindow);
                    return false;
                }
            });
        },

        center: function () {                       
            var $element = $(this.element);
            var $window = $(window);

            $element.css({
                left: $window.scrollLeft() + ($window.width() - $element.width()) / 2,
                top: $window.scrollTop() + ($window.height() - $element.height()) / 2
            });

            return this;
        },

        title: function (text) {
            var $title = $('.t-window-titlebar > .t-window-title', this.element);

            if (!text)
                return $title.text();

            $title.text(text);
            return this;
        },

        content: function (html) {
            var $content = $('> .t-window-content', this.element);

            if (!html)
                return $content.html();

            $content.html(html);
            return this;
        },

        open: function (e) {
            var $element = $(this.element);

            if (!$t.trigger(this.element, 'open')) {
                if (this.modal) {

                    var overlay = this.overlay(false);

                    if (this.effects.list.length > 0 && this.effects.list[0].name != 'toggle')
                        overlay.css('opacity', 0).show().animate({ opacity: 0.5 }, this.effects.openDuration);
                    else
                        overlay.css('opacity', 0.5).show();
                }
                
                if (!$element.is(':visible'))
                    $t.fx.play(this.effects, $element, {}, function() {
                        $t.trigger($element[0], 'activated');
                    });
            }

           if (this.isMaximized)
               $('html, body').css('overflow', 'hidden');

            return this;
        },

        close: function (e) {
            var $element = $(this.element);
            if ($element.is(':visible')) {
                if (!$t.trigger(this.element, 'close')) {
                    var overlay = this.modal ? this.overlay(true) : $(undefined);

                    overlay.animate({ opacity: 0 }, this.effects.closeDuration);

                    $t.fx.rewind(this.effects, $element, null, function () {
                        overlay.add($element[0]).hide();
                    });
                }
            }

            if (this.isMaximized)
                $('html, body').css('overflow', '');

            return this;
        },

        toggleMaximization: function (e) {
            if (e && $(e.target).closest('.t-window-action').length > 0) return;
            this[this.isMaximized ? 'restore' : 'maximize']();
        },

        restore: function () {
            if (!this.isMaximized)
                return;

            $(this.element)
                .css({
                    position: 'absolute',
                    left: this.restorationSettings.left,
                    top: this.restorationSettings.top
                })
                .find('> .t-window-content')
                    .css({
                        width: this.restorationSettings.width,
                        height: this.restorationSettings.height
                    }).end()
                .find('.t-resize-handle').show().end()
                .find('.t-window-titlebar .t-restore').addClass('t-maximize').removeClass('t-restore');

            $('html, body').css('overflow', '');

            this.isMaximized = false;

            $t.trigger(this.element, 'resize');

            return this;
        },

        maximize: function (e) {
            if (this.isMaximized)
                return;

            var $element = $(this.element);
            var resizeElement = $element.find('> .t-window-content');

            this.restorationSettings = {
                left: $element.position().left,
                top: $element.position().top,
                width: resizeElement.width(),
                height: resizeElement.height()
            };

            $element
                .css({ left: 0, top: 0, position: 'fixed' })
                .find('.t-resize-handle').hide().end()
                .find('.t-window-titlebar .t-maximize').addClass('t-restore').removeClass('t-maximize');

            $('html, body').css('overflow', 'hidden');

            this.isMaximized = true;

            this.onDocumentResize();

            return this;
        },

        onDocumentResize: function () {
            if (!this.isMaximized)
                return;

            var $element = $(this.element);
            var resizeElement = $element.find('> .t-window-content');

            resizeElement
                .css({
                    width: $(window).width()
                        - (resizeElement.outerWidth() - resizeElement.width()
                        + $element.outerWidth() - $element.width()),
                    height: $(window).height()
                        - (resizeElement.outerHeight() - resizeElement.height()
                        + $element.outerHeight() - $element.height()
                        + $element.find('> .t-window-titlebar').outerHeight())
                });

            fixIE6Sizing($element);

            $t.trigger($element, 'resize');
        },

        refresh: function () {
            if (isLocalUrl(this.contentUrl)) this.ajaxRequest();

            return this;
        },

        ajaxRequest: function (url) {
            var loadingIconTimeout = setTimeout(function () {
                $('.t-refresh', this.element).addClass('t-loading');
            }, 100);

            var data = {};

            $.ajax({
                type: 'GET',
                url: url || this.contentUrl,
                dataType: 'html',
                data: data,

                error: $.proxy(function (xhr, status) {
                    if ($t.ajaxError(this.element, 'error', xhr, status))
                        return;
                }, this),

                complete: function () {
                    clearTimeout(loadingIconTimeout);
                    $('.t-refresh', this.element).removeClass('t-loading');
                },

                success: $.proxy(function (data, textStatus) {
                    $('.t-window-content', this.element).html(data);

                    $t.trigger(this.element, 'refresh');
                }, this)
            });
        },

        destroy: function () {
            $(this.element).remove();
            if (this.modal) this.overlay(false).remove();
        }
    };

    // client-side rendering
    $.extend($t.window, {
        create: function (element, options) {
            if (!element.nodeType) {
                options = element;
                element = null;
            } else {
                options.html = element.innerHTML;
            }

            options = $.extend({
                title: "",
                html: "",
                actions: ['Close']
            }, options);

            var windowHtml = new $t.stringBuilder()
                .catIf('<div class="t-widget t-window">', !element)
                    .cat('<div class="t-window-titlebar t-header">')
                        .cat('&nbsp;<span class="t-window-title">').cat(options.title).cat('</span>')
                        .cat('<div class="t-window-actions t-header">');

            $.map(options.actions, function (command) {
                windowHtml.cat('<a href="#" class="t-window-action t-link">')
                        .cat('<span class="t-icon t-').cat(command.toLowerCase()).cat('">')
                            .cat(command)
                        .cat('</span></a>');
            });

            windowHtml.cat('</div></div>')
                .cat('<div class="t-window-content t-content" style="');

            if (options.width) windowHtml.cat('width:').cat(options.width).cat('px;');
            if (options.height) windowHtml.cat('height:').cat(options.height).cat('px;');

            windowHtml.cat('">').cat(options.html).cat('</div>')
                .catIf('</div>', !element);

            if (element)
                $(element).html(windowHtml.string());
            else
                return $(windowHtml.string()).tWindow(options);
        },

        getResizeHandlesHtml: function () {
            var html = new $t.stringBuilder();

            $.each('n e s w se sw ne nw'.split(' '), function (i, item) {
                html.cat('<div class="t-resize-handle t-resize-').cat(item).cat('"></div>');
            });

            return html.string();
        }
    });

    // jQuery extender
    $.fn.tWindow = function (options) {
        return $t.create(this, {
            name: 'tWindow',
            init: function (element, options) {
                return new $t.window(element, options);
            },
            success: function(component) {
                var element = component.element,
                    $element = $(element);

                if ($element.is(':visible')) {
                    $t.trigger(element, 'open')
                    $t.trigger(element, 'activated');
                }
            },
            options: options
        });
    };

    // default options
    $.fn.tWindow.defaults = {
        effects: { list: [{ name: 'zoom' }, { name: 'property', properties: ['opacity']}], openDuration: 'fast', closeDuration: 'fast' },
        modal: false,
        resizable: true,
        draggable: true,
        minWidth: 50,
        minHeight: 50
    };
})(jQuery);