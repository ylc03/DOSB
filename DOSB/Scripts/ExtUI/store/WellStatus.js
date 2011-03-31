
// define the well status store.
(function(){
	var store = new Ext.data.JsonStore({
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