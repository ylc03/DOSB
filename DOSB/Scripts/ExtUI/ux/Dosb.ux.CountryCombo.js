Ext.ns('Dosb', 'Dosb.ux');

Dosb.ux.CountryCombo = Ext.extend(Ext.form.ComboBox, {
	fieldLabel : 'Country',
	forceSelection: true, // force select from the list
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    emptyText:'Select country...',
    selectOnFocus:true,
	
    initComponent : function() {		
        Ext.apply(this, {
			tpl: '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">{Name}</div></tpl>',
			store: Ext.StoreMgr.get('country'),
			displayField: 'Name'
		});
		
		Dosb.ux.CountryCombo.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('dosb-country-combo', Dosb.ux.CountryCombo);