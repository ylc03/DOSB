Ext.ns('Dosb', 'Dosb.ux')

Dosb.ux.ClientCombo = Ext.extend(Ext.form.ComboBox, {
	fieldLabel : 'Client',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    emptyText:'Select client...',
    selectOnFocus:true,
	forceSelection: true,
	
    initComponent : function() {
        Ext.apply(this, {
			tpl: '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">{Name}</div></tpl>',
			store: Ext.StoreMgr.get('client'),
			displayField:'Name'
		});
		
		Dosb.ux.CountryCombo.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('dosb-client-combo', Dosb.ux.ClientCombo);