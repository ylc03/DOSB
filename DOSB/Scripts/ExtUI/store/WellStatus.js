
// define the well status store.
(function(){
	var store = new Ext.data.JsonStore({
		storeId: 'well-status',
		autoLoad: true,
		url: '/WellStatus/GetJson',
        idProperty: 'WellStatusId',
		totalProperty: 'total',
		successProperty: 'success',
		root: 'data',
        fields: [
			'WellStatusId',
			'Name'
        ]
    });
})();