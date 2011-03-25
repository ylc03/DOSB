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
        Ext.apply(this, {
			tpl: '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">{Name}</div></tpl>',
			store: Ext.StoreMgr.get('field'),
			displayField:'Name'
		});
		
		Dosb.ux.FieldCombo.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('dosb-field-combo', Dosb.ux.FieldCombo);