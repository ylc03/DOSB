// define the country store.
(function(){
	var a = new Ext.data.JsonStore({
		storeId: 'country',
		autoLoad: true,
		url: '/Country/GetJson',
        idProperty: 'CountryId',
        fields: [
			'Name',
			'CountryId',
        ]
    });
})();