// define the completion type store.
(function(){
	var store = new Ext.data.JsonStore({
		storeId: 'completion-type',
		autoLoad: true,
		url: '/CompletionType/GetJson',
        idProperty: 'CompTypeId',
        fields: [
			'CompTypeId',
			'Name'
        ]
    });
})();