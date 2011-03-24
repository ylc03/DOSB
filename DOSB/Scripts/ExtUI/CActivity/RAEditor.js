// A simple preconfigured editor plugin
Ext.ns('Sch', 'Sch.plugins');
Ext.ns('Dosb', 'Dosb.CActivity');

Dosb.CActivity.RAEditor = Ext.extend(Ext.Window, {
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

        Dosb.CActivity.RAEditor.superclass.initComponent.apply(this);
		this.FieldCombo.on('select', this.onFieldNameChange, this);
		this.RigField.on('select', this.onRigSelect, this);
		this.on('hide', this.onHide, this);
    },
	
	
	onHide: function() {
		var store = this.scheduler.resourceStore;
		store.save();
		store.commitChanges();
		return true;
	},
	
	onFieldNameChange: function (combo, rec, index) {
        var fieldName = rec.get('Name');
		var clientName= rec.get('ClientName');
		var countryName= rec.get('CountryName');
		if (fieldName == '(Not Specified)') return;
        this.WellTxt.setValue(fieldName + '-');
		this.CountryTxt.setValue(clientName);
		this.ClientTxt.setValue(countryName);
		this.WellTxt.focus();
    },
	
	onSaveClick: function () {
		var	record = this.record, 
			form = this.formPanel.getForm();
		if (form.isValid()) {
			record.beginEdit();
			form.updateRecord(record);
			record.endEdit();
			if (!record.store) {
				this.scheduler.resourceStore.add(record);
			}
			this.hide();
		}
	}, 
	
	onDeleteClick: function () {
		this.scheduler.resourceStore.remove(this.record);
		this.hide();
	}, 
	
	onCancelClick: function () {
		this.hide();
	},
	
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
						this.RigField = new Dosb.ux.RigField({
							name: 'RigName',
							width : 100,
							fieldLabel: 'Rig'
						}),{
							xtype: 'datefield',
							fieldLabel: 'Start Date',
							name: 'StartDate',
							id: 'StartDate',
							//vtype: 'daterange',
							width: 100,
							endDateField: 'EndDate' // id of the end date field
						},{
							xtype: 'datefield',
							fieldLabel: 'End Date',
							name: 'EndDate',
							id: 'EndDate',
							//vtype: 'daterange',
							width: 100,
							startDateField: 'StartDate' // id of the start date field
						},
						this.WellStatusCombo = new Ext.form.ComboBox({
							store: Dosb.CActivity.WellStatus, // fetch from database later
							typeAhead: true,
							forceSelection: true,
							triggerAction: 'all',
							selectOnFocus: true,
							fieldLabel : 'Well Status',
							name : 'WellStatus',
							width: 100
						}),
						this.CompTypeCombo = new Dosb.ux.CompTypeCombo({
							name: 'CompletionTypeName',
							width : 100,
							fieldLabel: 'Comp Type'
						})		
						   
					]
                },
				{
                    xtype : 'container',
					layout: 'form',
					padding: 5,
                    labelAlign: 'top',
					columnWidth : 0.5,
                    items : [
						
					this.FieldCombo = new Dosb.ux.FieldCombo({
						name : 'FieldName',
						width : 100,
						fieldLabel : 'Field'
					}),
						
					this.WellTxt = new Ext.form.TextField({
						name : 'WellName',
						emptyText: 'Well...',
						allowBlank: false,
						width : 100,
						fieldLabel : 'Well'
					}),
					
					this.WellTypeCombo = new Dosb.ux.WellTypeCombo({
						name : 'WellTypeName',
						width : 100,
						fieldLabel : 'Well Type'
					}),
					
					this.CountryTxt = new Ext.form.TextField({
						name : 'CountryName',
						disabled: true,
						emptyText: 'Country...',
						width : 100,
						fieldLabel : 'Country'
					}),
					
					this.ClientTxt = new Ext.form.TextField({
						name : 'ClientName',
						disabled: true,
						emptyText: 'Client...',
						width : 100,
						fieldLabel : 'Client'
					})
					]
                }
			]
		});
		
		return this.formPanel;
	},

	show : function(rec){
		this.record = rec;
		this.formPanel.getForm().loadRecord(rec);
		Dosb.CActivity.RAEditor.superclass.show.apply(this);
		
		if (!rec.store){
			this.setTitle('Add activity', 'silk-add');
			this.deleteButton.disable();
			this.saveButton.setText('Create');
		} else {
			this.setTitle('Update a job', 'silk-application-edit');
			this.deleteButton.enable();
			this.saveButton.setText('Update');
		}
	}
});