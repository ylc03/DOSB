(function ($) {
    var $t = $.telerik;

    var dropCueOffsetTop = 3;
    var dropCueOffsetLeft = 0;

    $t.grouping = {};

    $t.grouping.initialize = function (grid) {
        $.extend(grid, $t.grouping.implementation);

        grid.$groupDropCue = $('<div class="t-grouping-dropclue"/>');
        grid.$groupHeader = $('> .t-grouping-header', grid.element);
        
        function groups() {
            var all = $.map(grid.$groupHeader.find('.t-group-indicator'), function (group) {
                var $group = $(group);
                var left = $group.offset().left;
                var width = $group.outerWidth();
                return { left: left, right: left + width, width: width, $group: $group };
            });

            return {
                first: all[0],
                all: all,
                last: all[all.length - 1]
            };
        }

        function drag(e) {
            var title = e.$cue.text();
            
            if (!$.contains(grid.element, e.target) 
                || !$(e.target).closest('.t-grouping-header').length
                || (grid.groupFromTitle(title) && e.$draggable.closest('.t-header').length)) {
                grid.$groupDropCue.remove();
                return;
            }
            
            var top = $('> .t-grid-toolbar', grid.element).outerHeight() + dropCueOffsetTop;
                
            var state = groups();
                
            if (!state.all.length) {
                grid.$groupDropCue.css({ top: top, left: dropCueOffsetLeft }).appendTo(grid.$groupHeader);
                return;
            }

            var firstGroupIndicator = state.first;
            var lastGroupIndicator = state.last;
            var leftMargin = parseInt(firstGroupIndicator.$group.css('marginLeft'));
            var rightMargin = parseInt(firstGroupIndicator.$group.css('marginRight'));

            var currentGroupIndicator = $.grep(state.all, function (g) {
                return e.pageX >= g.left - leftMargin - rightMargin && e.pageX <= g.right;
            })[0];

            if (!currentGroupIndicator && firstGroupIndicator && e.pageX < firstGroupIndicator.left) {
                currentGroupIndicator = firstGroupIndicator;
            }

            if (currentGroupIndicator)
                grid.$groupDropCue.css({ top: top, left: currentGroupIndicator.$group.position().left - leftMargin + dropCueOffsetLeft })
                    .insertBefore(currentGroupIndicator.$group);
            else
                grid.$groupDropCue.css({ top: top, left: lastGroupIndicator.$group.position().left + lastGroupIndicator.$group.outerWidth() + rightMargin + dropCueOffsetLeft })
                                .appendTo(grid.$groupHeader);
        }

        function cue(e) {
            var column = grid.columnFromTitle(e.$draggable.text());
            return $t.dragCue(column.title);
        }
        
        function stop(e) {
            var title = e.$cue.text();
            
            grid.$groupDropCue.remove();

            if (e.$draggable.is('.t-group-indicator') && e.keyCode != 27) {
                grid.unGroup(title);
                return false;
            }
        }

        function destroy(e) {
            e.$cue.remove();
        }

        new $t.draggable({
            owner: grid.$header,
            selector: '.t-header:not(.t-group-cell,.t-hierarchy-cell)',
            scope: grid.element.id + '-grouping',
            cue: cue,
            start: function(e) {
                var column = grid.columnFromTitle(e.$draggable.text());
                return !!column.member && column.groupable !== false;
            },
            stop: stop,
            drag: drag,
            destroy: destroy
        });
        
        new $t.draggable({
            owner: grid.$groupingHeader,
            selector: '.t-group-indicator',
            scope: grid.element.id + '-grouping',
            cue: cue,
            stop: stop,
            drag: drag,
            destroy: destroy
        });        
        
        new $t.droppable({
            owner: grid.element,
            selector: '.t-grouping-header',
            scope: grid.element.id + '-grouping',
            over: function(e) {
                $t.dragCueStatus(e.$cue, 't-add');
            },
            out: function(e) {
                $t.dragCueStatus(e.$cue, 't-denied');
            },
            drop: function(e) {
                var title = e.$cue.text();
                var group = grid.groupFromTitle(title);

                var groupIndex = $.inArray(group, grid.groups);

                var position = grid.$groupHeader.find('div').index(grid.$groupDropCue);
                var delta = groupIndex - position;
                if (!group || (grid.$groupDropCue.is(':visible') && delta != 0 && delta != -1))
                    grid.group(title, position);
                 
                grid.$groupDropCue.remove();
            }
        });

        if (grid.isAjax()) {
            grid.$groupHeader
                .delegate('.t-button', 'click', function (e) {
                    e.preventDefault();
                    grid.unGroup($(this).parent().text());
                })
                .delegate('.t-link', 'click', function (e) {
                    e.preventDefault();
                    var group = grid.groupFromTitle($(this).parent().text());
                    group.order = group.order == 'asc' ? 'desc' : 'asc';
                    grid.group(group.title);
                });
        }

        grid.$groupHeader.delegate('.t-group-indicator', 'mouseenter', function () {
                grid.$currentGroupItem = $(this);
            })
            .delegate('.t-group-indicator', 'mouseleave', function () {
                grid.$currentGroupItem = null;
            });

        grid.$tbody.delegate('.t-grouping-row .t-collapse, .t-grouping-row .t-expand', 'click', $t.stop(function (e) {
            e.preventDefault();
            var $this = $(this), $tr = $this.closest('tr');
            if ($this.hasClass('t-collapse'))
                grid.collapseGroup($tr);
            else
                grid.expandGroup($tr);
        }));

        grid.groupFromTitle = function (title) {
            return $.grep(grid.groups, function (g) { return g.title == title; })[0];
        }

        grid.expandGroup = function (group) {
            var $group = $(group);
            var depth = $group.find('.t-group-cell').length;
            
            $group.nextAll('tr').each(function (i, tr) {
                var $tr = $(tr);
                var offset = $tr.find('.t-group-cell').length;
                if (offset <= depth)
                    return false;

                if (offset == depth + 1 && !$tr.hasClass('t-detail-row')) {
                    $tr.show();

                    if ($tr.hasClass('t-grouping-row') && $tr.find('.t-icon').hasClass('t-collapse'))
                        grid.expandGroup($tr);
                    if ($tr.hasClass('t-master-row') && $tr.find('.t-icon').hasClass('t-minus'))
                        $tr.next().show();
                }
            });

            $group.find('.t-icon').addClass('t-collapse').removeClass('t-expand');
        }

        grid.collapseGroup = function (group) {
            var $group = $(group);
            var depth = $group.find('.t-group-cell').length;
            $group.nextAll('tr').each(function () {
                var $tr = $(this);
                var offset = $tr.find('.t-group-cell').length;
                if (offset <= depth)
                    return false;

                $tr.hide();
            });
            $group.find('.t-icon').addClass('t-expand').removeClass('t-collapse');
        }

        grid.group = function (title, position) {
            if (this.groups.length == 0 && this.isAjax())
                grid.$groupHeader.empty();

            var group = $.grep(grid.groups, function (group) {
                return group.title == title;
            })[0];

            if (!group) {
                var column = grid.columnFromTitle(title);
                group = { order: 'asc', member: column.member, title: title };
                grid.groups.push(group);
            }

            if (position >= 0) {
                grid.groups.splice($.inArray(group, grid.groups), 1);
                grid.groups.splice(position, 0, group);
            }

            grid.groupBy = $.map(grid.groups, function (g) { return g.member + '-' + g.order; }).join('~')

            if (this.isAjax()) {
                var $groupItem = this.$groupHeader.find('div:contains("' + title + '")');
                if ($groupItem.length == 0) {
                    var html = new $.telerik.stringBuilder()
                        .cat('<div class="t-group-indicator">')
                            .cat('<a href="#" class="t-link"><span class="t-icon" />').cat(title).cat('</a>')
                            .cat('<a class="t-button t-state-default"><span class="t-icon t-group-delete" /></a>')
                        .cat('</div>')
                    .string();
                    $groupItem = $(html).appendTo(this.$groupHeader);
                }

                if (this.$groupDropCue.is(':visible'))
                    $groupItem.insertBefore(this.$groupDropCue);

                $groupItem.find('.t-link .t-icon')
                          .toggleClass('t-arrow-up-small', group.order == 'asc')
                          .toggleClass('t-arrow-down-small', group.order == 'desc');

                this.ajaxRequest();
            } else {
                this.serverRequest();
            }
        }

        grid.unGroup = function (title) {
            var group = grid.groupFromTitle(title);
            grid.groups.splice($.inArray(group, grid.groups), 1);

            if (grid.groups.length == 0)
                grid.$groupHeader.html(grid.localization.groupHint);

            grid.groupBy = $.map(grid.groups, function (g) { return g.member + '-' + g.order; }).join('~');

            if (grid.isAjax()) {
                grid.$groupHeader.find('div:contains("' + group.title + '")').remove();
                grid.ajaxRequest();
            } else {
                grid.serverRequest();
            }
        },

        grid.normalizeColumns = function(colspan) {
            var groups = grid.groups.length;
            var diff = colspan - grid.$tbody.parent().find(' > colgroup > col').length;
            if (diff == 0) return;
            
            var $tables = grid.$tbody.parent().add(grid.$headerWrap.find('table')).add(grid.$footerWrap.find("table"));
            if ($.browser.msie) {
                // ie8 goes into compatibility mode if the columns get removed
                if (diff > 0) {
                    $(new $t.stringBuilder().rep('<col class="t-group-col" />', diff).string())
                        .prependTo($tables.find('colgroup'))
                    $(new $t.stringBuilder().rep('<th class="t-group-cell t-header">&nbsp;</th>', diff).string())
                        .insertBefore($tables.find('th.t-header:first'));
                    $(new $t.stringBuilder().rep('<td class="t-group-cell">&nbsp;</td>', diff).string())
                        .insertBefore($tables.find('tr.t-footer-template > td:first'));

                } else {
                    $tables.find('th:lt(' + Math.abs(diff) + '), tr.t-footer-template > td:lt(' + Math.abs(diff) + ')')
                           .remove()
                           .end()
                           .find('col:lt(' + Math.abs(diff) + ')')
                           .remove();
                }
                
                // take the tables out for a walk. ie8 does not recalculate table layout properly.
                var containers = [];
                var i = 0;

                $('table', grid.element)
                    .each(function() { containers.push(this.parentNode); })
                    .appendTo($('<div />'))
                    .each(function() { containers[i++].appendChild(this); });
            } else {
                $tables.find('col.t-group-col').remove();

                $(new $t.stringBuilder().rep('<col class="t-group-col" />', groups).string())
                        .prependTo($tables.find('colgroup'));

                $tables.find('th.t-group-cell').remove();
                $tables.find('tr.t-footer-template > td.t-group-cell').remove();

                $(new $t.stringBuilder().rep('<th class="t-group-cell t-header">&nbsp;</th>', groups).string())
                        .insertBefore($tables.find('th.t-header:first'));
                
                $(new $t.stringBuilder().rep('<td class="t-group-cell">&nbsp;</td>', groups).string())
                        .insertBefore($tables.find('tr.t-footer-template > td:first'));
            }            
            
            grid.$footer.find(".t-pager-wrapper").attr('colspan', colspan);
        },

        grid.bindGroup = function (dataItem, colspan, html, level) {
            var group = grid.groups[level];
            var key = dataItem.Key;
            var column = $.grep(grid.columns, function (column) { return group.member == column.member })[0];

            if (column && (column.format || column.type == 'Date'))
                key = $t.formatString(column.format || '{0:G}', key);

            html.cat('<tr class="t-grouping-row">')
                .rep('<td class="t-group-cell"></td>', level)
                .cat('<td colspan="')
                .cat(colspan - level)
                .cat('"><p class="t-reset"><a class="t-icon t-collapse" href="#"></a>')
                .cat(group.title)
                .cat(': ')
                .cat(key)
                .cat('</p></td></tr>');

            if (dataItem.HasSubgroups) {
                for (var i = 0, l = dataItem.Items.length; i < l; i++)
                    grid.bindGroup(dataItem.Items[i], colspan, html, level + 1);
            } else {
                grid.bindData(dataItem.Items, html, level + 1);
            }
        }
    }
})(jQuery);