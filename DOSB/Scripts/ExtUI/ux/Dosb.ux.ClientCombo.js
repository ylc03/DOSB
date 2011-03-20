Ext.ns('Dosb', 'Dosb.ux')

Dosb.ux.ClientCombo = Ext.extend(Ext.form.ComboBox, {
	fieldLabel : 'Client',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    emptyText:'Select client...',
    selectOnFocus:true,
	
    initComponent : function() {
		var clientStore = new Ext.data.JsonStore({
			url: '/Client/GetJson',
            idProperty: 'CountryId',
            fields: [
				'Name',
				'ClientId',
            ]
        });
		
		clientStore.load();
		
        Ext.apply(this, {
			tpl: '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">{Name}</div></tpl>',
			store: clientStore,
			displayField:'Name'
		});
		
		Dosb.ux.CountryCombo.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('dosb-client-combo', Dosb.ux.ClientCombo);