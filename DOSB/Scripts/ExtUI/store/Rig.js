// define the rig store.
(function(){
	var a = new Ext.data.JsonStore({
		storeId: 'rig',
		autoLoad: true,
		url: '/Rig/GetJson',
		totalProperty: 'total',
		successProperty: 'success',
		idProperty: 'RigId',
		root: 'data',
        fields: [
			'Name',
			'RigId',
           ]
    });
})();