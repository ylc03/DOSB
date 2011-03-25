// define the company store.
(function(){
	var a = new Ext.data.JsonStore({
		storeId: 'company',
		autoLoad: true,
		url: '/Company/GetJson',
        idProperty: 'CompanyId',
		totalProperty: 'total',
		successProperty: 'success',
		root: 'data',
	    fields: [
			'CompanyId',
			'ShortName',
			'FullName',
			'BackgroundColor',
			'TextColor'
        ]
    });
})();