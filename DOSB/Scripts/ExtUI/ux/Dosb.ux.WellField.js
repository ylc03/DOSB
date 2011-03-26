Ext.ns('Dosb', 'Dosb.ux');

Dosb.ux.WellField = Ext.extend(Ext.form.ComboBox, {
	fieldLabel : 'Well',
    typeAhead: false,
    mode: 'local',
    triggerAction: 'all',
	hideTrigger:true, 
    emptyText:'type well name...',
    selectOnFocus:true,
	
    initComponent : function() {
        Ext.apply(this, {
			tpl: '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">{Name}</div></tpl>',
			store: Ext.StoreMgr.get('well'),
			displayField: 'Name'
		});
		
		Dosb.ux.WellField.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('dosb-well-field', Dosb.ux.WellField);