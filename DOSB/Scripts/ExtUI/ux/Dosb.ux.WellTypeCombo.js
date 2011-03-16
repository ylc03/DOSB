Ext.ns('Dosb', 'Dosb.ux')

Dosb.ux.WellTypeCombo = Ext.extend(Ext.form.ComboBox, {
	fieldLabel : 'Well Type',
    typeAhead: false,
    mode: 'local',
    triggerAction: 'all',
    emptyText:'Select type...',
    selectOnFocus:true,
	
    initComponent : function() {
		var store = new Ext.data.JsonStore({
			url: '/WellType/GetJson',
            idProperty: 'WellTypeId',
            fields: [
				{ name: 'attr', mapping: 'Name' },
				'Name',
				'WellTypeId',
            ]
        });
		
		store.load();
		
        Ext.apply(this, {
			tpl: '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">{Name}</div></tpl>',
			store: store,
			displayField: 'Name'
		});
		
		Dosb.ux.WellTypeCombo.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('dosb-welltype-combo', Dosb.ux.WellTypeCombo);