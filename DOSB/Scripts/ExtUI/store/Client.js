// define the client store.
(function(){
	var clientStore = new Ext.data.JsonStore({
		storeId: 'client',
		autoLoad: true,
		url: '/Client/GetJson',
        idProperty: 'ClientId',
        fields: [
			'ClientId',
			'Name'
        ]
    });
})();