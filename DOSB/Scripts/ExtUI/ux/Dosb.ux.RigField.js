Ext.ns('Dosb', 'Dosb.ux');

Dosb.ux.RigField = Ext.extend(Ext.form.ComboBox, {
	fieldLabel : 'Rig',
    typeAhead: false,
    mode: 'local',
    triggerAction: 'all',
	hideTrigger:true, 
    emptyText:'type rig name...',
    selectOnFocus:true,
	
    initComponent : function() {
        Ext.apply(this, {
			tpl: '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">{Name}</div></tpl>',
			store: Ext.StoreMgr.get('rig'),
			displayField: 'Name'
		});
		
		Dosb.ux.RigField.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('dosb-rig-field', Dosb.ux.RigField);