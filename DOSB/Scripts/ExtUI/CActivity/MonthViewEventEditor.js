Ext.ns('Dosb', 'Dosb.CActivity');
Ext.ns('Sch');

Dosb.CActivity.MonthViewEventEditor = Ext.extend(Ext.Window, {
    width : 300,
	modal: true,
	resizable: false,
    closeAction:'hide',
	bodyStyle:'background:#fff',
    
	initComponent : function() {
        Ext.apply(this, {
			buttons: this.buildButtons(), 
			items: this.buildForm()
		});

        Dosb.CActivity.MonthViewEventEditor.superclass.initComponent.apply(this);
		this.on('hide', this.onHide, this);
    },
	
	onHide: function (p, a){
		var store = this.scheduler.eventStore;
		store.save();
		store.commitChanges();
		return true;
	},
	
	onSaveClick: function () {
		var	record = this.record, 
			form = this.formPanel.getForm();
		if (form.isValid()) {
			record.beginEdit();
			form.updateRecord(record);
			record.endEdit();
			if (!record.store) {
				this.scheduler.eventStore.add(record);
			}
			this.hide();
		}
	}, 
	
	onDeleteClick: function () {
		this.scheduler.eventStore.remove(this.record);
		this.hide();
	}, 
	
	onCancelClick: function () {this.hide();},
	
	buildButtons: function () {
		this.saveButton = new (Ext.Button)({
			iconCls: 'silk-disk',
			text: 'Save', 
			scope: this, 
			handler: this.onSaveClick
		});
		this.deleteButton = new (Ext.Button)({
			iconCls: 'silk-delete',
			text: 'Delete', 
			scope: this, 
			handler: this.onDeleteClick
		});
		this.cancelButton = new (Ext.Button)({
			iconCls: 'silk-cancel',
			text: 'Cancel', 
			scope: this, 
			handler: this.onCancelClick
		});
		return [this.saveButton, this.deleteButton, this.cancelButton];
	},     
	
	buildForm: function (){
		this.formPanel = new Ext.form.FormPanel({
			frame: false,
			border: false,
			layout: 'column',
			padding: 5,
			
			items: [
				{
                    xtype : 'container',
					layout: 'form',
					padding: 5,
					labelAlign: 'top',
                    columnWidth : 0.5,
					items : [
						this.Rig = new Ext.form.TextField({
							name: 'RigName',
							disabled: true,
							width: 120,
							fieldLabel: 'RIG'
						}),
                        this.Well = new Ext.form.TextField({
                            name : 'WellName',
							disabled: true,
							width: 120,
                            fieldLabel : 'Well'
                        }),
						this.Assembly = new Ext.form.TextField({
							name: 'AssemblyName',
							disabled: true,
							width: 120,
							fieldLabel: 'Assembly'
						}),
						{
							xtype: 'datefield',
							fieldLabel: 'Job Start Date',
							name: 'JobStartDate',
							//id: 'StartDate',
							//vtype: 'daterange',
							width: 120
							//endDateField: 'JobEndDate' // id of the end date field
						}
					]
                },
				{
                    xtype : 'container',
					layout: 'form',
					padding: 5,
                    labelAlign: 'top',
					columnWidth : 0.5,
                    items : [					
						this.companyField = new Dosb.ux.CompanyCombo({
							name: 'CompanyName',
							width: 120,
							fieldLabel: 'Company',
							allowBlank: false
						}),
                        this.commentField = new Ext.form.TextField({
                            name : 'Comment',
							width: 120,
                            fieldLabel : 'Comment'
                        }),
						this.DescEng = new Dosb.ux.CompanyCombo({
							name: 'CompanyName',
							width: 120,
							fieldLabel: 'DESC Eng'
						}),
						this.BackgroundColorField = new Ext.form.Hidden({
							name: 'BackgroundColor'
						}),
						this.BackgroundColorField = new Ext.form.Hidden({
							name: 'TextColor'
						}),
						{
							xtype: 'datefield',
							fieldLabel: 'Job End Date',
							name: 'JobEndDate',
							//id: 'StartDate',
							//vtype: 'daterange',
							width: 120
							//endDateField: 'JobEndDate' // id of the end date field
						}
					]
                }
			]
		});
		
		return this.formPanel;
	},
	
    onEventCreated : function(newEventRecord) {
        // Overridden to provide some default values
        newEventRecord.set('CompanyName', '');
        newEventRecord.set('Comment', '');
    },
	
	show : function(rec){
		this.record = rec;
		this.formPanel.getForm().loadRecord(rec);
		Dosb.CActivity.MonthViewEventEditor.superclass.show.apply(this);
		
		if (!rec.store){
			this.setTitle('Add a job', 'silk-add');
			this.deleteButton.disable();
			this.saveButton.setText('Create');
		} else {
			this.setTitle('Update a job', 'silk-application-edit');
			this.deleteButton.enable();
			this.saveButton.setText('Update');
		}
	}
});