(function ($) {

    var $t = $.telerik;

    $.extend($t, {
        tabstrip: function (element, options) {
            this.element = element;

            var $element = $(element);
            this.$contentElements = $element.find('> .t-content');

            $.extend(this, options);

            var enabledItems = '.t-tabstrip-items > .t-item:not(.t-state-disabled)';

            $element
                .delegate(enabledItems, 'mouseenter', $t.hover)
				.delegate(enabledItems, 'mouseleave', $t.leave)
				.delegate(enabledItems, options.activateEvent, $t.delegate(this, this._click))
                .delegate('> .t-reset > .t-item.t-state-disabled > .t-link', 'click', $t.preventDefault);

            $t.bind(this, {
                select: $.proxy(function (e) {
                    if (e.target == this.element && this.onSelect) this.onSelect(e);
                }, this),
                error: this.onError,
                load: this.onLoad
            });

            var selectedItems = $element.find('li.t-state-active');
            var $content = $(this.getContentElement(selectedItems.parent().children().index(selectedItems)));
            if ($content.length > 0 && $content.children().length == 0) {
                this.activateTab(selectedItems.eq(0));
            }
        }
    });

    $.extend($t.tabstrip.prototype, {

        select: function (li) {
            $(li).each($.proxy(function (index, item) {
                var $item = $(item);
                if ($item.is('.t-state-disabled,.t-state-active'))
                    return;

                this.activateTab($item);
            }, this));
        },

        enable: function (li) {
            $(li).addClass('t-state-default')
                 .removeClass('t-state-disabled');
        },

        disable: function (li) {
            $(li).removeClass('t-state-default')
                 .removeClass('t-state-active')
				 .addClass('t-state-disabled');
        },

        reload: function (li) {
            var tabstrip = this;

            $(li).each(function () {
                var $item = $(this);
                var contentUrl = $item.find('.t-link').data('ContentUrl');
                if (contentUrl) {
                    tabstrip.ajaxRequest($item, $(tabstrip.getContentElement($item.index())), null, contentUrl);
                }
            });
        },

        _click: function (e, element) {
            var $item = $(element);

            var $link = $item.find('.t-link');
            var href = $link.attr('href');

            var $content = $(this.getContentElement($item.parent().children().index($item)));

            if ($item.is('.t-state-disabled,.t-state-active')) {
                e.preventDefault();
                return;
            }

            if ($t.trigger(this.element, 'select', { item: $item[0], contentElement: $content[0] })) {
                e.preventDefault();
            }

            var isAnchor = (href && (href.charAt(href.length - 1) == '#' || href.indexOf('#' + this.element.id + '-') != -1));

            if (!href || isAnchor || ($content.length > 0 && $content.children().length == 0))
                e.preventDefault();
            else return;

            if (this.activateTab($item))
                e.preventDefault();
        },

        activateTab: function ($item) {
            // deactivate previously active tab
            var itemIndex =
				$item.parent().children()
					.removeClass('t-state-active')
					.addClass('t-state-default')
					.index($item);

            // activate tab
            $item.removeClass('t-state-default').addClass('t-state-active');

            // handle content elements
            var $contentElements = this.$contentElements;
            if ($contentElements.length > 0) {

                var $visibleContentElements = $contentElements.filter('.t-state-active');

                // find associated content element
                var $content = $(this.getContentElement(itemIndex));

                var tabstrip = this;
                if ($content.length == 0) {
                    $visibleContentElements.removeClass('t-state-active');

                    $t.fx.rewind(tabstrip.effects, $visibleContentElements, {});

                    return false;
                }

                var isAjaxContent = $.trim($content.html()).length == 0;

                var showContentElement = function () {
                    $content.addClass('t-state-active');

                    $t.fx.play(tabstrip.effects, $content, {});
                };

                $visibleContentElements.removeClass('t-state-active').stop(false, true);

                $t.fx.rewind(
                    tabstrip.effects,
			        $visibleContentElements, {},
			        function () {
			            if ($item.hasClass('t-state-active')) {
			                if (!isAjaxContent) {
			                    showContentElement();
			                } else if (isAjaxContent) {
			                    tabstrip.ajaxRequest($item, $content, function () {
			                        if ($item.hasClass('t-state-active')) {
			                            showContentElement();
			                        }
			                    });
			                }
			            }
			        });

                return true;
            }
            return false;
        },

        getSelectedTabIndex: function () {
            return $(this.element).find('li.t-state-active').index();
        },

        getContentElement: function (itemIndex) {
            if (isNaN(itemIndex - 0)) return;

            var $contentElements = this.$contentElements;
            var idTest = new RegExp('-' + (itemIndex + 1) + '$');

            for (var i = 0, len = $contentElements.length; i < len; i++) {
                if (idTest.test($contentElements[i].id)) {
                    return $contentElements[i];
                }
            }
        },

        ajaxRequest: function ($element, $content, complete, url) {
            if ($element.find('.t-loading').length)
                return;

            var statusIcon = null;
            var loadingIconTimeout = setTimeout(function () {
                statusIcon = $('<span class="t-icon t-loading"></span>').prependTo($element.find('.t-link'))
            }, 100);

            var data = {};
            $.ajax({
                type: 'GET',
                cache: false,
                url: url || $element.find('.t-link').attr('href'),
                dataType: 'html',
                data: data,

                error: $.proxy(function (xhr, status) {
                    if ($t.ajaxError(this.element, 'error', xhr, status))
                        return;
                }, this),

                complete: function () {
                    clearTimeout(loadingIconTimeout);
                    if (statusIcon !== null)
                        statusIcon.remove();
                },

                success: $.proxy(function (data, textStatus) {
                    $content.html(data);

                    var $link = $element.find('.t-link');
                    var href = $link.attr('href');

                    if (href && href != '#')
                        $link.data('ContentUrl', href).attr('href', '#');

                    if (complete)
                        complete.call(this, $content);
                }, this)
            });
        }
    });

    // Plugin declaration
    $.fn.tTabStrip = function (options) {
        return $t.create(this, {
            name: 'tTabStrip',
            init: function (element, options) {
                return new $t.tabstrip(element, options);
            },
            options: options
        });
    }

    // default options
    $.fn.tTabStrip.defaults = {
        activateEvent: 'click',
        effects: $t.fx.toggle.defaults()
    };
})(jQuery);