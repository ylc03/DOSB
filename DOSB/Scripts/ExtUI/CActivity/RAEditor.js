 Ext.apply(Ext.form.VTypes, {
    daterange : function(val, field) {
        var date = field.parseDate(val);

        if(!date){
            return false;
        }
        if (field.startDateField) {
            var start = Ext.getCmp(field.startDateField);
            if (!start.maxValue || (date.getTime() != start.maxValue.getTime())) {
                start.setMaxValue(date);
                start.validate();
            }
        }
        else if (field.endDateField) {
            var end = Ext.getCmp(field.endDateField);
            if (!end.minValue || (date.getTime() != end.minValue.getTime())) {
                end.setMinValue(date);
                end.validate();
            }
        }
        /*
         * Always return true since we're only using this vtype to set the
         * min/max allowed values (these are tested for after the vtype test)
         */
        return true;
    }
});
 
 RAEditor = Ext.extend(Ext.form.FormPanel, {
 		saveText: "Save", 
		deleteText: "Delete", 
		cancelText: "Cancel", 
		hideOnBlur: false,  
		constructor: function (a) {
			//this.addEvents("beforeeventdelete", "beforeeventsave");
			Sch.plugins.EventEditor.superclass.constructor.apply(this, arguments);
		}, 
		show: function (a, b) {
			if (this.deleteButton) {
				this.deleteButton.setVisible(!!a.store);
			}
			this.resourceRecord = a;
			this.getForm().loadRecord(a);
			b = b || this.scheduler.view.el;
			this.el.alignTo(b, "c", this.getConstrainOffsets(b));
			this.expand();
		}, 
		getConstrainOffsets: function (a) {
			return [-this.width/2, -this.height/2];
		}, 
		cls: "sch-eventeditor", 
		layout: "border", 
		border: false, 
		onSaveClick: function () {
			var a = this, 
				record = a.resourceRecord, 
				form = a.getForm();
			if (form.isValid()) {
				var c = form.getValues();
				record.beginEdit();
				form.updateRecord(record);
				record.endEdit();
				if (!this.resourceRecord.store) {
					this.resourceStore.add(record);
				}
				a.collapse();
			}
		}, 
		onDeleteClick: function () {
			this.resourceStore.remove(this.resourceRecord);
			this.collapse();
		}, 
		onCancelClick: function () {this.collapse();}, 
		buildButtons: function () {
			this.saveButton = new (Ext.Button)({
				text: this.saveText, 
				scope: this, 
				handler: this.onSaveClick
			});
			this.deleteButton = new (Ext.Button)({
				text: this.deleteText, 
				scope: this, 
				handler: this.onDeleteClick
			});
			this.cancelButton = new (Ext.Button)({
				text: this.cancelText, 
				scope: this, 
				handler: this.onCancelClick
			});
			return [this.saveButton, this.deleteButton, this.cancelButton];
		}, 
		buildLeftForm: function () {
			return new Ext.Panel({ 
				labelAlign : 'top',
				style:'background:#fff',
				padding : 10,
				border : false,
				layout : 'form',
				flex : 2,	
				items : [
					this.RigField = new Dosb.ux.RigField({
						name: 'RigName',
						width : 100,
						fieldLabel: 'Rig'
					}),							
					{
						xtype: 'datefield',
						fieldLabel: 'Start Date',
						name: 'StartDate',
						id: 'StartDate',
						vtype: 'daterange',
						width: 100,
						endDateField: 'EndDate' // id of the end date field
					},{
						xtype: 'datefield',
						fieldLabel: 'End Date',
						name: 'EndDate',
						id: 'EndDate',
						vtype: 'daterange',
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
			});
		},
		buildRightForm : function (){
			return new Ext.Panel({
				labelAlign : 'top',
				style:'background:#fff',
				padding: 10,
				border : false,
				layout : 'form',
				flex : 2,	
				items : [			
					this.WellField = new Dosb.ux.WellField({
						name : 'WellName',
						width : 100,
						fieldLabel : 'Well'
					}),
					this.FieldCombo = new Dosb.ux.FieldCombo({
						name : 'FieldName',
						width : 100,
						fieldLabel : 'Field'
					}),
					this.WellTypeCombo = new Dosb.ux.WellTypeCombo({
						name : 'WellTypeName',
						width : 100,
						fieldLabel : 'Well Type'
					}),
					this.CountryCombo = new Dosb.ux.CountryCombo({
						name : 'CountryName',
						width : 100,
						fieldLabel : 'Country'
					}),
					this.ClientCombo = new Dosb.ux.ClientCombo({
						name : 'ClientName',
						width : 100,
						fieldLabel : 'Client'
					})
				]
			});
		},
		initComponent: function () {
			Ext.apply(this, {
				height : 330,
				width : 240,
				buttonAlign : 'left',
				fbar: this.buildButtons(), 
				items: [{
					region: "north", 
					layout: "absolute", 
					height: 35, 
					border: false, 
					cls: "sch-eventeditor-timefields", 
					items: [{
						xtype: 'label',
						x: 50,
						y:10,
						text: 'Add Completion Activity'
					}]
				},{
					layout : 'hbox',
					style:'background:#fff',
					border : false,
					region: 'center',
					cls : 'editorpanel',
					labelAlign : 'top',
					items:[
						this.buildLeftForm(),
						this.buildRightForm()
					]//end of item 2
				}]
			});
			RAEditor.superclass.initComponent.call(this);
		}, 
		init: function (a) {
			this.scheduler = a;
			this.resourceStore = a.getResourceStore();
			this.scheduler.on({
				afterrender: this.onSchedulerRender, 
				scope: this
			});
		}, 
		onSchedulerRender: function () {
			this.render(Ext.getBody());
			this.collapse();
			if (this.hideOnBlur) {
				this.mon(Ext.getBody(), "click", this.onMouseClick, this);
			}
		}, 
		onMouseClick: function (e) {
		}
	});