Ext.ns('Dosb', 'Dosb.ux')

Dosb.ux.CountryCombo = Ext.extend(Ext.form.ComboBox, {
	fieldLabel : 'Country',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    emptyText:'Select country...',
    selectOnFocus:true,
	
    initComponent : function() {
		var countryStore = new Ext.data.JsonStore({
			url: '/Country/GetJson',
            idProperty: 'CountryId',
            fields: [
				{ name: 'attr', mapping: 'Name' },
				'Name',
				'CountryId',
            ]
        });
		
		countryStore.load();
		
        Ext.apply(this, {
			tpl: '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">{Name}</div></tpl>',
			store: countryStore,
			displayField:'Name'
		});
		
		Dosb.ux.CountryCombo.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('dosb-country-combo', Dosb.ux.CountryCombo);