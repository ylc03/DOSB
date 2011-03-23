// A simple preconfigured editor plugin
Ext.ns('Sch', 'Sch.plugins');

CAEditor = Ext.extend(Ext.Window, {
    height : 180,
    width : 270,
    buttonAlign : 'left',
    
    initComponent : function() {
        var fieldsPanelConfig = new Ext.Panel({
                layout : 'hbox',
                style:'background:#fff',
                border : false,
                cls : 'editorpanel',
                labelAlign : 'top',
                items : [
                    {
                        xtype : 'container',
                        cls : 'image-ct',
                        items : this.img = new Ext.BoxComponent({
                            cls : 'profile-image',
                            autoEl : 'img'
                        }),
                        width : 110
                    },
                    {
                        padding : 10,
                        labelAlign : 'top',
                        style:'background:#fff',
                        border : false,
                        layout : 'form',
                        flex : 2,
                        defaults : {
                            width : 135
                        },
                        items : [
							this.companyField = new Dosb.ux.CompanyCombo({
								name: 'CompanyName',
								fieldLabel: 'Company'
							}),
                            this.commentField = new Ext.form.TextField({
                                name : 'Comment',
                                fieldLabel : 'Comment'
                            }),
							this.BackgroundColorField = new Ext.form.Hidden({
								name: 'BackgroundColor'
							}),
							this.BackgroundColorField = new Ext.form.Hidden({
								name: 'TextColor'
							})						
                        ]
                    }
                ]
            });
		
        Ext.apply(this, {items: [fieldsPanelConfig]});

        CAEditor.superclass.initComponent.apply(this, arguments);
		
		this.RigLabel = new (Ext.form.Label)({
			y: 10, 
			x: 15, 
			xtype: "label", 
			text: 'Rig'
		});
		
		this.WellLabel = new (Ext.form.Label)({
			y: 10, 
			x: 85, 
			xtype: "label", 
			text: 'Well'
		});
		
		this.JobTypeLabel = new (Ext.form.Label)({
			y: 10, 
			x: 195, 
			xtype: "label", 
			text: 'Type'
		});
		
		//var titlePanel = this.getComponent(0);
		//titlePanel.add([this.RigLabel, this.WellLabel, this.JobTypeLabel]);
    },
    
    onEventCreated : function(newEventRecord) {
        // Overridden to provide some default values
        newEventRecord.set('CompanyName', 'Select a company...');
        newEventRecord.set('Comment', '');
    },
	
	show : function(rec){
		var res = this.scheduler.getResourceByEventRecord(rec);
		this.RigLabel.setText(res.get("RigName"));
		this.WellLabel.setText(res.get("WellName"));
		var idx = Math.floor((rec.get("StartDate") - this.scheduler.getStart())/3600000);
		this.JobTypeLabel.setText(Dosb.CActivity.MonthViewHeaderData.headers[idx]);
		CAEditor.superclass.show.apply(this);
	},
	
	onMouseClick : function(e) {
		var c = this.companyField;
		if ( this.collapsed || e.within(c.el) || (c.view && e.within(c.view.el)) ) return;
		  
		//if (c && e.within(c.el) return;
		CAEditor.superclass.onMouseClick.apply(this, arguments);
	}
});