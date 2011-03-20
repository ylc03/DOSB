YearScheduler = Ext.extend(Sch.SchedulerPanel, {
    clicksToEdit: 1,
    rowHeight : 30,
    snapToIncrement: true,
    
    eventRenderer: function (item, resourceRec, tplData, row, col, ds) {
        tplData.style = 'background-color:' + (resourceRec.get('Color') || 'Coral');

        return {
            headerText: item.get('WellName'),
            footerText: item.get('RigName') 
        };
    },

    initComponent : function() {
        
        Ext.apply(this, {

            columns: [
                { header: 'Rig', sortable: true, width: 80, dataIndex: 'Name', editor: new Ext.form.TextField() },
                { header: 'Type', sortable: true, width: 120, dataIndex: 'Type', editor: new Ext.form.ComboBox({
                        store: ['Sales', 'Developer', 'Marketing', 'Product manager'],
                        typeAhead: true,
                        forceSelection: true,
                        triggerAction: 'all',
                        selectOnFocus: true
                    })
                },
                {
                    xtype: 'actioncolumn',
                    width: 30,
                    position: 'right',
                    items: [
                        {
                            iconCls : 'delete',  
                            tooltip: 'Clear row',
                            handler: function(scheduler, rowIndex, colIndex) {
                                var els = Ext.fly(scheduler.getView().getRow(rowIndex)).select(scheduler.eventSelector),
                                    rs = [];
                                els.each(function(el) {
                                    rs.push(scheduler.getEventRecordFromElement(el));
                                });
                                scheduler.eventStore.remove(rs);
                            }
                        }
                    ]
                }
            ],

            // Specialized body template with header and footer
            eventBodyTemplate: new Ext.Template(
                '<div class="sch-event-header">{headerText}</div>' +
                '<div class="sch-event-footer">{footerText}</div>'
            ),

            border: true,
            tbar: [
                {
                    iconCls: 'icon-prev',
                    scope : this,
                    handler: function () {
                        this.shiftPrevious();
                    }
                },
                '->',
                {
                    iconCls: 'icon-next',
                    scope : this,
                    handler: function () {
                        this.shiftNext();
                    }
                }
            ],

            tooltipTpl: new Ext.XTemplate(
                '<dl class="eventTip">',
                    '<dt class="icon-clock">Time</dt><dd>{[values.StartDate.format("Y-m-d G:i")]}</dd>',
                    '<dt class="icon-task">Task</dt><dd>{Title}</dd>',
                    '<dt class="icon-earth">Location</dt><dd>{Location}&nbsp;</dd>',
                '</dl>').compile(),

            plugins: [
                this.editor = new YVEditor({
                    // Extra config goes here
                })
            ],
    
            onEventCreated : function(newEventRecord) {
                // Overridden to provide some default values
                //newEventRecord.set('Rig', 'Rig...');
                //newEventRecord.set('Type', 'Local office');
            }
        });

        YearScheduler.superclass.initComponent.call(this);
    }
});