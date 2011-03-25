// define the field store.
(function(){
	var a = new Ext.data.JsonStore({
		storeId: 'field',
		url: '/Field/GetJson',
		autoLoad: true,
		idProperty: 'FieldId',
        totalProperty: 'total',
		successProperty: 'success',
		root: 'data',
		messageProperty: 'message', 
        fields: [
		    {name: 'Name', allowBlank: false},
			'FieldId',
			'ClientId',
			'ClientName',
			'CountryId',
			'CountryName'
        ]
    });
})();