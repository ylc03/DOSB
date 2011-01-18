(function($) {
    var $t = $.telerik;

    $t.resizing = {};

    $t.resizing.initialize = function(grid) {

        var $col, $indicator = $('<div class="t-grid-resize-indicator" />'),
            gridWidth, columnWidth, columnStart, indicatorWidth = 3;

        function cursor(context, value) {
            $('th, th .t-grid-filter, th .t-link', context)
                .add(document.body)
                .css('cursor', value);
        }

        function heightAboveHeader(context) {
            var top = 0;
            $('.t-grouping-header, .t-grid-toolbar,  > .t-pager-wrapper', context).each(function() {
                top += this.offsetHeight;
            });
            return top;
        }

        function positionResizeHandle($th) {
            var left = 0;

            $('.t-resize-handle', grid.element).each(function() {
                left += $(this).data('th').outerWidth();
                $(this).css('left', left - indicatorWidth);
            });

            left = -grid.$tbody.closest('.t-grid-content').scrollLeft();

            $th.prevAll('th').add($th).each(function() {
                left += this.offsetWidth;
            });

            var $body = grid.scrollable ? $('.t-grid-content', grid.element) : $('tbody', grid.element);

            // using "clientWidth" and "clientHeight" to exclude the scrollbar
            var width = $body.attr(grid.scrollable ? 'clientWidth' : 'offsetWidth');

            if (left >= width) {
                $indicator.remove();
            } else {
                $indicator.css({
                    left: left,
                    top: heightAboveHeader(grid.element),
                    height: $th.outerHeight() + $body.attr(grid.scrollable ? 'clientHeight' : 'offsetHeight')
                });
                if (!$indicator.parent().length)
                    $indicator.appendTo(grid.element);
            }
        }

        function start(e) {
            var $th = e.$draggable.data('th');

            $col = $('colgroup', grid.element).find('col:eq(' + $th.index() + ')');

            columnStart = e.pageX;
            columnWidth = $th.outerWidth();
            gridWidth = grid.$tbody.outerWidth();
        }

        function drag(e) {
            var width = columnWidth + e.pageX - columnStart;
            if (width > 10) {
                $col.css('width', width);
                if (grid.scrollable)
                    grid.$tbody.parent()
                        .add(grid.$headerWrap.find('table'))
                        .add(grid.$footerWrap.find('table'))
                        .css('width', gridWidth + e.pageX - columnStart);

                positionResizeHandle(e.$draggable.data('th'));
            }
        }

        function stop(e) {
            $indicator.remove();
            cursor(grid.element, '');

            var $th = e.$draggable.data('th');
            
            var newWidth = $th.outerWidth();

            if (grid.onColumnResize && newWidth != columnWidth)
                $t.trigger(grid.element, "columnResize", {
                    column: grid.columns[grid.$columns().index($th)],
                    oldWidth: columnWidth,
                    newWidth: newWidth
                });
        
            return false;
        }

        var left = 0;
        
       $(grid.element).bind('mouseenter', function() {
            $(this)
                .unbind('mouseenter', arguments.callee)
                .find('.t-header')
                .each(function() {
                    left += this.offsetWidth;
                    var $th = $(this);
                    if (!$th.hasClass('t-group-cell')) {
                        $('<div class="t-resize-handle" />')
                        .css({
                            left: left - indicatorWidth,
                            top: grid.scrollable ? 0 : heightAboveHeader(grid.element),
                            width: indicatorWidth * 2
                        })
                        .appendTo(grid.scrollable ? grid.$headerWrap : grid.element)
                        .data('th', $th)
                        .mousedown(function() {
                            positionResizeHandle($th);
                            cursor(grid.element, $(this).css('cursor'));
                        })
                        .mouseup(function() {
                            cursor(grid.element, '');
                        });
                    }
               });

            new $t.draggable({
                owner: grid.element,
                selector: '.t-resize-handle',
                scope: grid.element.id + '-column-resizing',
                distance: 0,
                start: start,
                drag: drag,
                stop: stop
            });
        });
    }
})(jQuery);
