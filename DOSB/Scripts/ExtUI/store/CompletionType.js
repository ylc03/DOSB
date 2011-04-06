// define the completion type store.
(function(){
	var store = new Ext.data.JsonStore({
		storeId: 'completion-type',
		autoLoad: true,
		idProperty: 'CompletionTypeId',
		url: '/CompletionType/GetJson',
		totalProperty: 'total',
		successProperty: 'success',
		root: 'data',
        fields: [
			'CompletionTypeId',
			'Name'
        ]
    });
})();
