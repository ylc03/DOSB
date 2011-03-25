// define the Assembly store, upper and lower.
(function(){
	var a = new Ext.data.JsonStore({
		storeId: 'upper-assembly',
		autoLoad: false,
		url: '/CompletionActivity/UpperAssembly',
        idProperty: 'AssemblyId',
		totalProperty: 'total',
		successProperty: 'success',
		root: 'data',
        fields: [
			'AssemblyId',
			'Name',
			'Type'
        ]
    });
	var b = new Ext.data.JsonStore({
		storeId: 'lower-assembly',
		autoLoad: false,
		url: '/CompletionActivity/LowerAssembly',
        idProperty: 'AssemblyId',
		totalProperty: 'total',
		successProperty: 'success',
		root: 'data',
        fields: [
			'AssemblyId',
			'Name',
			'Type'
        ]
    });
})();