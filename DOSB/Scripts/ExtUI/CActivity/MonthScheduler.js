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
                { header: 'Client', sortable: true, locked:true, align:'center', width: 40, dataIndex: 'ClientName'},	
                { header: 'Country', sortable: true, locked:true, align:'center', width: 60, dataIndex: 'CountryName'},		
                { header: 'Field', sortable: true, locked:true, align:'center', width: 60, dataIndex: 'FieldName', 
					editor: new Dosb.ux.FieldCombo()
                },
				{ header: 'Rig', sortable: true, locked:true, align:'center', width: 60, dataIndex: 'RigName', 
					id: 'RigName', 
					editor: new Dosb.ux.RigField()
                },
                { header: 'Well', sortable: true, locked:true, align:'center', width: 60, dataIndex: 'WellName', 
					id: 'WellName', 
					editor: new Dosb.ux.WellField()
                },
				{ header: 'Comp Type', sortable: true, locked:true, align:'center', width: 80, 
					dataIndex: 'CompletionTypeName', 
					editor: new Dosb.ux.CompTypeCombo()
                },	
                { header: 'Well Type', sortable: true, locked:true, align:'center', width: 80, dataIndex: 'WellTypeName', 
					editor: new Dosb.ux.WellTypeCombo()
                },		
                { header: 'Status', sortable: true, locked:true, align:'center', width: 80, dataIndex: 'WellStatus', 
					editor: new Ext.form.ComboBox({
                        store: Ext.StoreMgr.get('well-status'), // fetch from database later
                        typeAhead: true,
						mode: 'local',
                        forceSelection: true,
                        triggerAction: 'all',
                        selectOnFocus: true,
						displayField: 'Name'
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
                    id: 'silk-add',
                    text: 'Add',
					iconCls: 'silk-add',
					tooltip: 'Add a new Activity',
                    scope : this,
                    handler: function () {
						var record = new (this.resourceStore.recordType)({});
						this.resourceEditor.show(record);	
                    }
                },
				'-',
                {
                    iconCls: 'silk-database-refresh',
                    name: 'refresh',
                    tooltip: 'Reload data',
                    scope: this,
                    handler: function () {
						var now = this.monthPicker.getValue();
						this.reloadStore(now);
                    }
                },
                {
                    iconCls: 'silk-database-save',
                    name: 'save-all',
                    tooltip: 'Save all',
                    scope: this,
                    handler: function () {
                        this.resourceStore.save();
                        this.eventStore.save();
                    }
                },
				{
                    iconCls: 'silk-database-lightning',
                    name: 'discard-all',
                    tooltip: 'Discard all',
                    scope: this,
                    handler: function () {
                        this.resourceStore.rejectChanges();
                        this.eventStore.rejectChanges();
                    }
                },
                '-',
				{
                    iconCls: 'silk-page-add',
                    name: 'info-more',
                    tooltip: 'More information',
                    scope: this,
                    handler: function () {
						var cm = this.getColumnModel();
						var i = 0;
					    for(i=0; i<8; i++){
							cm.setHidden(i, false);
						}
                    }
                },{
                    iconCls: 'silk-page-delete',
                    name: 'info-less',
                    tooltip: 'Less information',
                    scope: this,
                    handler: function () {
						var cm = this.getColumnModel();
						var i = 0;
					    for(i=0; i<8; i++){
							cm.setHidden(i, true);
						}
						cm.setHidden(cm.getIndexById('RigName'), false);
						cm.setHidden(cm.getIndexById('WellName'), false);
                    }
                },
				'-',
                '->',
                {
                    iconCls: 'silk-arrow-left',
                    scope : this,
					tooltip: 'previous month',
                    handler: function () {
                        //shift to previous month						
						var a = this.monthPicker.getValue().add(Date.MONTH, -1);
						this.monthPicker.setValue(a);
						this.reloadStore();
                    }
                },
				'			',
				this.monthPicker = new Ext.form.DateField({
                    id: 'dtMonth',
                    fieldLabel: 'Choose month',
                    plugins: 'monthPickerPlugin',
                    format: 'M Y',
                    editable: false
				}),
				'			',
				{
                    iconCls: 'silk-arrow-right',
					tooptip: 'next month',
                    scope : this,
                    handler: function () {
                        //shift to next month
						var a = this.monthPicker.getValue().add(Date.MONTH, 1);
						this.monthPicker.setValue(a);
						this.reloadStore();
                    }
                }
            ],

            onEventCreated : function(r) {
                // Overridden to provide some default values
                r.set('CompanyName', '');
                r.set('Comment', '');
				var a = this.monthPicker.getValue();
				r.set('JobStartDate', a.format('Y-m-d'));
				r.set('JobEndDate', a.add(Date.MONTH, 1).add(Date.DAY, -1).format('Y-m-d'));
            }

			/*
            tooltipTpl: new Ext.XTemplate(
                '<dl class="eventTip">',
                    '<dt class="icon-clock">Time</dt><dd>{[values.StartDate.format("Y-m-d G:i")]}</dd>',
                    '<dt class="icon-task">Task</dt><dd>{CompanyName}</dd>',
                    '<dt class="icon-earth">Location</dt><dd>{Comment}&nbsp;</dd>',
                '</dl>').compile(),
			*/
        });
		
        Dosb.CActivity.MonthScheduler.superclass.initComponent.call(this);
		
		this.monthPicker.setValue(this.startDate.clearTime());
		this.monthPicker.on(
			'change', 
			function(m, newVal, oldVal) {
				this.reloadStore();
			},
			this
		);
    },
	
	reloadStore: function(start){
		this.resourceStore.load();
		this.eventStore.load();
	}
});
