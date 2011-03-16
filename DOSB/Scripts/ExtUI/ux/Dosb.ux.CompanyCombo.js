Ext.ns('Dosb', 'Dosb.ux')

Dosb.ux.CompanyCombo = Ext.extend(Ext.form.ComboBox, {
	fieldLabel : 'Company',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    emptyText:'Select company...',
    selectOnFocus:true,
	
    initComponent : function() {
		var companyStore = new Ext.data.JsonStore({
			url: '/Company/GetJson',
            idProperty: 'CompanyId',
            fields: [
				{ name: 'attr', mapping: 'ShortName' },
				'CompanyId',
				'ShortName',
				'FullName',
				'BackgroundColor',
				'TextColor'
            ]
        });
		
		companyStore.load();
		
        Ext.apply(this, {
			tpl: '<tpl for="."><div ext:qtip="{FullName}" class="x-combo-list-item">{ShortName}</div></tpl>',
			store: companyStore,
			displayField:'ShortName'
		});
		
		Dosb.ux.CompanyCombo.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('dosb-company-combo', Dosb.ux.CompanyCombo);