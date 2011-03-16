Ext.ns('Dosb', 'Dosb.ux')

Dosb.ux.RigField = Ext.extend(Ext.form.ComboBox, {
	fieldLabel : 'Rig',
    typeAhead: false,
    mode: 'local',
    triggerAction: 'all',
	hideTrigger:true, 
    emptyText:'type rig name...',
    selectOnFocus:true,
	
    initComponent : function() {
		var store = new Ext.data.JsonStore({
			url: '/Rig/GetJson',
			totalProperty: 'total',
			successProperty: 'success',
			idProperty: 'RigId',
			root: 'data',
            fields: [
				{ name: 'attr', mapping: 'Name' },
				'Name',
				'RigId',
            ]
        });
		
		store.load();
		
        Ext.apply(this, {
			tpl: '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">{Name}</div></tpl>',
			store: store,
			displayField: 'Name'
		});
		
		Dosb.ux.RigField.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('dosb-rig-field', Dosb.ux.RigField);