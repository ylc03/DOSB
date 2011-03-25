Ext.ns('Dosb', 'Dosb.CActivity');

Dosb.CActivity.Statistics = Ext.extend(Ext.Panel, {
    title: 'Under construction',
		
	initComponent: function(config){
		var store = new Ext.data.JsonStore({
			fields: ['season', 'total'],
			data: [{
				season: 'Summer',
				total: 150
			},{
				season: 'Fall',
				total: 245
			},{
				season: 'Winter',
				total: 117
			},{
				season: 'Spring',
				total: 184
			}]
		});
		
		Ext.apply(this, {
			items: {
				store: store,
				xtype: 'piechart',
				dataField: 'total',
				categoryField: 'season',
				//extra styles get applied to the chart defaults
				extraStyle:
				{
					legend:
					{
						display: 'bottom',
						padding: 5,
						font:
						{
							family: 'Tahoma',
							size: 13
						}
					}
				}
			}
		});
		
		Dosb.CActivity.Statistics.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('dosb-ca-stat', Dosb.CActivity.Statistics);
