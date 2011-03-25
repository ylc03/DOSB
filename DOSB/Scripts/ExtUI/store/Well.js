// define the well store.
(function(){
	var store = new Ext.data.JsonStore({
		storeId: 'well',
		url: '/Well/GetJson',
		autoLoad: true,
		totalProperty: 'total',
		successProperty: 'success',
		messageProperty: 'message',
		idProperty: 'WellId',
		root: 'data',
        fields: [
			'WellId',
			'Name',
			'FieldId',
			'Status',
			'WellTypeId',
			'WellTypeName'
           ]
    });
})();