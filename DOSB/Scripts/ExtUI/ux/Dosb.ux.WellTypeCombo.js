Ext.ns('Dosb', 'Dosb.ux');

Dosb.ux.WellTypeCombo = Ext.extend(Ext.form.ComboBox, {
	fieldLabel : 'Well Type',
    typeAhead: true,
    selectOnFocus:true,
	forceSelection: true,
    mode: 'local',
    triggerAction: 'all',
    emptyText:'Select type...',
	
    initComponent : function() {
        Ext.apply(this, {
			tpl: '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">{Name}</div></tpl>',
			store: Ext.StoreMgr.get('well-type'),
			displayField: 'Name'
		});
		
		Dosb.ux.WellTypeCombo.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('dosb-welltype-combo', Dosb.ux.WellTypeCombo);