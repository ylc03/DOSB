
// define the well status store.
(function(){
	var a = new Ext.data.ArrayStore({
		storeId: 'well-status',
        fields: [
		'Name',
		'Short'
		],
		data: [['Developement', 'Dev.'], ['Workover', 'W/O'], ['Exploration', 'Exp.'], ['ML Workover', 'ML W/O']]
    });
})();