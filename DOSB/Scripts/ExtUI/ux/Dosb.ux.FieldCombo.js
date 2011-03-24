Ext.ns('Dosb', 'Dosb.ux')

Dosb.ux.FieldCombo = Ext.extend(Ext.form.ComboBox, {
	fieldLabel : 'Field',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    emptyText:'Select field...',
    selectOnFocus: true,
    forceSelection: true,
	
    initComponent : function() {
		var store = new Ext.data.JsonStore({
			url: '/Field/GetJson',
			idProperty: 'FieldId',
            totalProperty: 'total',
			successProperty: 'success',
			root: 'data',
			messageProperty: 'message',  // <-- New "messageProperty" meta-data
            fields: [
			    {name: 'Name', allowBlank: false},
				'FieldId',
				'ClientId',
				'ClientName',
				'CountryId',
				'CountryName'
            ]
        });
		
		store.load();
		
        Ext.apply(this, {
			tpl: '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">{Name}</div></tpl>',
			store: store,
			displayField:'Name'
		});
		
		Dosb.ux.FieldCombo.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('dosb-field-combo', Dosb.ux.FieldCombo);