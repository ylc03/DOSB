Ext.ns('Dosb', 'Dosb.ux');

Dosb.ux.CompanyCombo = Ext.extend(Ext.form.ComboBox, {
	fieldLabel : 'Company',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    emptyText:'Select company...',
    selectOnFocus:true,
	forceSelection: true,
	
    initComponent : function() {
        Ext.apply(this, {
			tpl: '<tpl for="."><div ext:qtip="{FullName}" class="x-combo-list-item">{ShortName}</div></tpl>',
			store: Ext.StoreMgr.get('company'),
			displayField:'ShortName'
		});
		
		Dosb.ux.CompanyCombo.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('dosb-company-combo', Dosb.ux.CompanyCombo);