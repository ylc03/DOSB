Ext.ns('Dosb', 'Dosb.ux');

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

YVEditor = Ext.extend(Sch.plugins.EventEditor, {
    height : 330,
    width : 270,
    buttonAlign : 'left',
	
	buildLeftForm: function () {
		return { 
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
		};
	},
	buildRightForm : function (){
		return {
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
		};
	},    
    initComponent : function() {
        Ext.apply(this, {
            fieldsPanelConfig : {
                layout : 'hbox',
                style:'background:#fff',
                border : false,
                cls : 'editorpanel',
                labelAlign : 'top',
                items : [
					this.buildLeftForm(),
					this.buildRightForm()
                ]
            }
        });
		
        YVEditor.superclass.initComponent.apply(this, arguments);
		
		this.TitleLabel = new (Ext.form.Label)({
			x:100,
			y:10,
			xtype: "label", 
			text: 'Modification'
		});
		this.RigField.disable(); // not allow change of Rig
		this.startDateField.disable();
		//this.durationField.hide();
		//this.durationLabel.hide();
		
		var titlePanel = this.getComponent(0);
		titlePanel.removeAll();
		titlePanel.add([this.TitleLabel]);
    },

    show : function(eventRecord) {
        // Load the image of the resource
        //this.img.el.dom.src = this.scheduler.getResourceByEventRecord(eventRecord).get('ImgUrl');

        YVEditor.superclass.show.apply(this, arguments);
    },
	
	setTitleText: function (title) {
		this.titleLabel.setText(title);
	},
	
	onSaveClick: function () {
		var a = this, 
			record = a.eventRecord, 
			form = a.getForm();
		if (form.isValid() && this.fireEvent("beforeeventsave", this, record) !== false) {
			var c = form.getValues();
			record.beginEdit();
			form.updateRecord(record);
			record.endEdit();
			if (!this.eventRecord.store) {
				if (this.scheduler.fireEvent("beforeeventadd", this.scheduler, record) !== false) {
					this.eventStore.add(record);
				}
			}
			a.collapse();
		}
	}, 
	
	onMouseClick: function (e) {
		var controls = [this.WellStatusCombo, this.CompTypeCombo, this.WellField,
						this.FieldCombo, this.WellTypeCombo, this.CountryCombo, this.ClientCombo];
		var flag = false;
		Ext.each(controls, function (c) {
			if ( this.collapsed || e.within(c.el) || (c.view && e.within(c.view.el)) ) flag = true;
		});
		if (flag) return;
		//if (c && e.within(c.el) return;
		YVEditor.superclass.onMouseClick.apply(this, arguments);
	},
	
	onEventCreated : function(r) {
        // Overridden to provide some default values
		var res = this.scheduler.getResourceByEventRecord(r);
        r.set('RigName', res.get('Name'));
		r.set('ClientName', ''),
        r.set('FieldName', ''),
		r.set('CountryName', ''),
		r.set('WellName', ''),
        r.set('WellTypeName', ''),
        r.set('WellStatus', ''),
		r.set('CompletionTypeName', ''),
		r.set('Comment', '')
    }
	
});