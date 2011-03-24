Ext.ns('Dosb', 'Dosb.CActivity');
Ext.ns('Sch');

Dosb.CActivity.MonthScheduler = Ext.extend(Sch.SchedulerPanel, {
    clicksToEdit: 1,
    snapToIncrement: true,
    border: true,
	
    eventRenderer: function (item, resourceRec, tplData, row, col, ds) {
        tplData.style = 'background-color:' + item.get('BackgroundColor') + '; color:' + item.get('TextColor');

        return {
            headerText: item.get('Comment'),
            footerText: item.get('CompanyName')
        };
    },

    initComponent : function() {
        Ext.apply(this, {
            columns: [
                {
                    xtype: 'actioncolumn',
					header: 'Action',
					locked: true,
                    width: 30,
                    position: 'left',
                    items: [
                        {
                            iconCls: 'silk-delete',  
                            tooltip: 'delete row',
                            handler: function(scheduler, rowIndex, colIndex) {
								var store = scheduler.resourceStore;
								store.removeAt(rowIndex);
								store.save();
                            }
                        }
                    ]
                },				
                { header: 'Client', sortable: true, locked:true, align:'center', width: 40, dataIndex: 'ClientName',     
				editor: new Dosb.ux.ClientCombo()
                },	
                { header: 'Country', sortable: true, locked:true, align:'center', width: 60, dataIndex: 'CountryName', 
					editor: new Dosb.ux.CountryCombo()
                },		
                { header: 'Rig', sortable: true, locked:true, align:'center', width: 60, dataIndex: 'RigName', 
					editor: new Dosb.ux.RigField()
                },
                { header: 'Well', sortable: true, locked:true, align:'center', width: 60, dataIndex: 'WellName', 
					editor: new Dosb.ux.WellField()
                },		
                { header: 'Field', sortable: true, locked:true, align:'center', width: 60, dataIndex: 'FieldName', 
					editor: new Dosb.ux.FieldCombo()
                },
                { header: 'Well Type', sortable: true, locked:true, align:'center', width: 80, dataIndex: 'WellTypeName', 
					editor: new Dosb.ux.WellTypeCombo()
                },	
                { header: 'Comp Type', sortable: true, locked:true, align:'center', width: 80, 
					dataIndex: 'CompletionTypeName', 
					editor: new Dosb.ux.CompTypeCombo()
                },		
                { header: 'Status', sortable: true, locked:true, align:'center', width: 80, dataIndex: 'WellStatus', 
					editor: new Ext.form.ComboBox({
                        store: Dosb.CActivity.WellStatus, // fetch from database later
                        typeAhead: true,
                        forceSelection: true,
                        triggerAction: 'all',
                        selectOnFocus: true
                    })
                }			
            ],

            // Specialized body template with header and footer
            eventBodyTemplate: new Ext.Template(
                '<div class="sch-event-footer">{footerText}</div>' +
                '<div class="sch-event-header">{headerText}</div>'
            ).compile(),
			
			// tool bar
            tbar: [
                {
                    id: 'silk-save',
                    text: 'Save',
					iconCls: 'silk-disk',
					tooltip: 'save all changes',
                    scope : this,
                    handler: function () {
						this.resourceStore.save();
						this.resourceStore.commitChanges();
                    }
                },
                '            ',
                {
                    id: 'silk-add',
                    text: 'Add',
					iconCls: 'silk-add',
					tooltip: 'Add a new Activity',
                    scope : this,
                    handler: function () {
						var record = new (this.resourceStore.recordType)({
							
						});
						this.resourceEditor.show(record);
                    }
                },
                '->',
                {
                    iconCls: 'silk-arrow-left',
                    scope : this,
                    handler: function () {
                        //this.shiftPreviousMonth();
                    }
                },
				'			',
				{
                    iconCls: 'silk-arrow-right',
                    scope : this,
                    handler: function () {
                        //this.shiftNextMonth();
                    }
                }
            ],

            onEventCreated : function(newEventRecord) {
                // Overridden to provide some default values
                newEventRecord.set('CompanyName', '');
                newEventRecord.set('Comment', '');
            },

            tooltipTpl: new Ext.XTemplate(
                '<dl class="eventTip">',
                    '<dt class="icon-clock">Time</dt><dd>{[values.StartDate.format("Y-m-d G:i")]}</dd>',
                    '<dt class="icon-task">Task</dt><dd>{CompanyName}</dd>',
                    '<dt class="icon-earth">Location</dt><dd>{Comment}&nbsp;</dd>',
                '</dl>').compile(),

            plugins:  [
				this.resourceEditor = new RAEditor({
				})
            ]
        });
		
        Dosb.CActivity.MonthScheduler.superclass.initComponent.call(this);
    }
});