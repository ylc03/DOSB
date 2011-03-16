Ext.ns('Dosb', 'Dosb.ux')

Dosb.ux.WellField = Ext.extend(Ext.form.ComboBox, {
	fieldLabel : 'Well',
    typeAhead: false,
    mode: 'local',
    triggerAction: 'all',
	hideTrigger:true, 
    emptyText:'type well name...',
    selectOnFocus:true,
	
    initComponent : function() {
		var store = new Ext.data.JsonStore({
			url: '/Well/GetJson',
            idProperty: 'WellId',
            fields: [
				{ name: 'attr', mapping: 'Name' },
				'Name',
				'WellId',
            ]
        });
		
		store.load();
		
        Ext.apply(this, {
			tpl: '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">{Name}</div></tpl>',
			store: store,
			displayField: 'Name'
		});
		
		Dosb.ux.WellField.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('dosb-well-field', Dosb.ux.WellField);