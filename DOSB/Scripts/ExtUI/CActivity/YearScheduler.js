Ext.ns('Dosb', 'Dosb.CActivity');

Dosb.CActivity.YearScheduler = Ext.extend(Sch.SchedulerPanel, {
    clicksToEdit: 1,
    snapToIncrement: true,

    eventRenderer: function (item, resourceRec, tplData, row, col, ds) {
        //tplData.cls = 'evt-' + resource.get('Category');
        tplData.style = row % 2 === 1 ? 'background-color:lightgray' : '';
        return {
            well: item.get('WellName')
        };
    },

    initComponent: function () {
        Ext.apply(this, {
            columns: this.buildColumns(),
            tbar: this.buildToolbar(),

            eventBodyTemplate: new Ext.Template(
                '<div class="sch-event-body">{well}</div>'
            ),

            onEventCreated: function (newEventRecord) {
                // Overridden to provide some default values
                //newEventRecord.set('Rig', 'Rig...');
                //newEventRecord.set('Type', 'Local office');
            }
        });

        Dosb.CActivity.YearScheduler.superclass.initComponent.call(this);
    },

    buildColumns: function () {
        var columns = [
                { header: 'Rig', sortable: true, width: 80, dataIndex: 'Name' },
                { header: 'Sales', sortable: true, width: 120, dataIndex: 'Type', editor: new Ext.form.ComboBox({
                    store: ['Sales', 'Developer', 'Marketing', 'Product manager'],
                    typeAhead: true,
                    forceSelection: true,
                    triggerAction: 'all',
                    selectOnFocus: true
                })
                }
            ];
        return columns;
    },

    buildToolbar: function () {
        
        var toolbar = [
                {
                    xtype: 'tbtext',
                    text: 'Rig'
                },
                {
                    xtype: 'textfield',
                    length: 5,
                    name: 'rig-name',
                    emptyText: 'Rig'
                },
                {
                    iconCls: 'silk-add',
                    tooltip: 'Add a rig',
                    scope: this,
                    handler: function () {
                        var u = new this.resourceStore.recordType({
                            Name: 'ADC'
                        });
                        this.stopEditing();
                        this.store.insert(0, u);
                        this.startEditing(0, 1);

                    }
                },
                '-',
                ' ',
                {
                    xtype: 'tbtext',
                    text: 'Field'
                },
                {
                    xtype: 'dosb-field-combo',
                    name: 'field-name',
                    emptyText: 'Field',
                    width: 80
                },
                '   ',
                {
                    xtype: 'tbtext',
                    text: 'Well'
                },
                {
                    xtype: 'textfield',
                    name: 'well-name',
                    emptyText: 'Well'
                },
                '->',
                {
                    iconCls: 'silk-arrow-left',
                    tooltip: 'prev quarter',
                    scope: this,
                    handler: function () {
                        this.shiftPrevious();
                        this.resourceStore.load();
                        this.eventStore.load();
                    }
                }, 
                {
                    iconCls: 'silk-arrow-right',
                    tooltip: 'next quarter',
                    scope: this,
                    handler: function () {
                        this.shiftNext();
                        this.resourceStore.load();
                        this.eventStore.load();
                    }
                }
            ];
        return toolbar;
    }

});