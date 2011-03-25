Ext.ns('Dosb', 'Dosb.ux')

Dosb.ux.CompTypeCombo = Ext.extend(Ext.form.ComboBox, {
	fieldLabel : 'Comp Type',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    emptyText:'Select type...',
    selectOnFocus:true,
	forceSelection: true,
	
    initComponent : function() {
        Ext.apply(this, {
			tpl: '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">{Name}</div></tpl>',
			store: Ext.StoreMgr.get('completion-type'),
			displayField:'Name'
		});
		
		Dosb.ux.CompTypeCombo.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('dosb-comptype-combo', Dosb.ux.CompTypeCombo);