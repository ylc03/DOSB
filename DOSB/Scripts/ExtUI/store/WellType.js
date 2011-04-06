// define the well type store.
(function(){
	var store = new Ext.data.JsonStore({
		storeId: 'well-type',
		autoLoad: true,
		url: '/WellType/GetJson',
        idProperty: 'WellTypeId',
		totalProperty: 'total',
		successProperty: 'success',
		root: 'data',
        fields: [
			'WellTypeId',
			'Name'
        ]
    });
})();