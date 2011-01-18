(function ($) {
    var $t = $.telerik;

    $t.reordering = {};

    $t.reordering.initialize = function (grid) {

        grid.$reorderDropCue = $('<div class="t-reorder-cue"><div class="t-icon t-arrow-down"></div><div class="t-icon t-arrow-up"></div></div>');

        var lastColumnIndex = grid.$header.children("th").length - 1;

        var reorderColumn = function (destIndex, column) {
            var sourceIndex = $.inArray(column, grid.columns);
            
            grid.columns.splice(sourceIndex, 1);
            
            grid.columns.splice(destIndex, 0, column);

            reorder(grid.$columns(), sourceIndex, destIndex);

            reorder(grid.$tbody.parent().find('> colgroup > col:not(.t-group-col,.t-hierarchy-col)'), sourceIndex, destIndex);
            
            reorder(grid.$headerWrap.find('table').find('> colgroup > col:not(.t-group-col,.t-hierarchy-col)'), sourceIndex, destIndex);

            var footerWrap = grid.$footerWrap.find('table');
            reorder(footerWrap.find('> colgroup > col:not(.t-group-col,.t-hierarchy-col)'), sourceIndex, destIndex);            
            reorder(footerWrap.find('> tbody > tr.t-footer-template > td:not(.t-group-cell,.t-hierarchy-cell)')
                .add(grid.$footer.find('tr.t-footer-template > td:not(.t-group-cell,.t-hierarchy-cell)')), sourceIndex, destIndex);

            $.each(grid.$tbody.children(), function () {
                reorder($(this).find(' > td:not(.t-group-cell, .t-hierarchy-cell, .t-detail-cell)'), sourceIndex, destIndex);
            });
        }

        grid.reorderColumn = reorderColumn;

        function setLastColumnClass($source, sourceIndex, $dest, destIndex) {
            switchClasses($source, sourceIndex, $dest, destIndex, "th", "t-last-header");
            switchClasses($source, sourceIndex, $dest, destIndex, "td", "t-last");
        }

        function switchClasses($source, sourceIndex, $dest, destIndex, selector, className) {                

            if ($dest.is(selector) && destIndex == lastColumnIndex) {
                $source.addClass(className);
                $dest.removeClass(className);
            }

            if ($source.is(selector) && sourceIndex == lastColumnIndex) {                
                $source.removeClass(className)
                       .prev(selector)
                       .addClass(className);                
            }
        }

        function reorder(selector, sourceIndex, destIndex) {
            var $source = selector.eq(sourceIndex);
            var $dest = selector.eq(destIndex);

            setLastColumnClass($source, sourceIndex, $dest, destIndex);
            
            $source[sourceIndex > destIndex ? 'insertBefore' : 'insertAfter']($dest);
        }

        new $t.draggable({
            owner: grid.$header,
            selector: '.t-header:not(.t-group-cell,.t-hierarchy-cell)',
            scope: grid.element.id + '-reodering',
            cue: function(e) {
                return $t.dragCue(e.$draggable.text());
            },
            destroy: function(e) {
                e.$cue.remove();
            }
        });

        new $t.droppable({
            owner: grid.$header,
            scope: grid.element.id + '-reodering',
            selector: '.t-header:not(.t-group-cell,.t-hierarchy-cell)',
            over: function(e) {
                var same = $.trim(e.$draggable.text()) == $.trim(e.$droppable.text());
                $t.dragCueStatus(e.$cue, same? 't-denied' : 't-add');

                if (!same)
                    grid.$reorderDropCue.css({
                         height: e.$droppable.outerHeight(),
                         top: $('> .t-grid-toolbar', grid.element).outerHeight() + $('> .t-pager-wrapper', grid.element).outerHeight() + $('> .t-grouping-header', grid.element).outerHeight(),
                         left: function() {
                                return e.$droppable.position().left + ((e.$droppable.index() > e.$draggable.index()) ? e.$droppable.outerWidth() : 0)
                            }
                         })
                         .appendTo(grid.element);
            },
            out: function(e) {
                grid.$reorderDropCue.remove();
                $t.dragCueStatus(e.$cue, 't-denied');
            },
            drop: function(e) {
                grid.$reorderDropCue.remove();
                if (e.$cue.find('.t-drag-status').is('.t-add')) {
                    var column = grid.columnFromTitle($.trim(e.$draggable.text()));
                    var position = grid.$columns().index(e.$droppable);                    
                    $t.trigger(grid.element, 'columnReorder', {
                        column: column,
                        oldIndex: $.inArray(column, grid.columns),
                        newIndex: position
                    });
                    reorderColumn(position, column);
                }
            }
        });
    }
})(jQuery);
