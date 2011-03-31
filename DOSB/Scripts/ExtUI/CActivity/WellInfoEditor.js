/**
 * Field editor page. Consist a form and a grid
 * @auther Ali Jassim
 * @email AJassim@slb.com
 * @company Completions, Schlumberger, Saudi Arabia
 * @date 29-Mar-2011
 */

Ext.ns('Dosb', 'Dosb.CActivity');

Dosb.CActivity.WellInfoEditor = Ext.extend(Ext.Panel, {
	frame: false,		// no frame
	border: false,		// no border
	layout: 'hbox',	// form at 'north', grid at 'center'
	layoutConfig : {
		align: 'stretch'
	},
	/**
	 * Create data store, field form and field grid
	 */
	initComponent : function(){
		// Create HttpProxy instance.  Notice new configuration parameter "api" here instead of load.  However, you can still use
		// the "url" paramater -- All CRUD requests will be directed to your single url instead.
		var cTypeGrid = this.buildCTypeGrid();
		var wTypeGrid = this.buildWTypeGrid();
		var wStatusGrid= this.buildWStatusGrid();
		
		Ext.apply(this, {
			items: [cTypeGrid, wTypeGrid, wStatusGrid]
		});
		
		Dosb.CActivity.WellInfoEditor.superclass.initComponent.apply(this, arguments);
	},
	
	buildCTypeGrid : function(){
		var proxy = new Ext.data.HttpProxy({
			api: {
				read : '/CompletionType/GetJson',
				create : '/CompletionType/CreateJson',
				update: '/CompletionType/UpdateJson',
				destroy: '/CompletionType/DeleteJson'
			}
		});
		
		var reader = new Ext.data.JsonReader({
			totalProperty: 'total',
			successProperty: 'success',
			idProperty: 'CompletionTypeId',
			root: 'data',
			messageProperty: 'message'  // <-- New "messageProperty" meta-data
		}, [
			{name: 'CompletionTypeId'},
			{name: 'Name', allowBlank: false}
		]);
		
		var writer = new Ext.data.JsonWriter({
			encode: true,
			writeAllFields: false
		});
		
		var columns =  [
			{header: "Completion Types", width: 330, align:'center', sortable: true, dataIndex: 'Name', editor: new Ext.form.TextField()}
		];
		
		var store = new Ext.data.Store({
			proxy: proxy,
			reader: reader,
			writer: writer,  // <-- plug a DataWriter into the store just as you would a Reader
			autoSave: true // <-- false would delay executing create, update, destroy requests until specifically told to do so with some [save] buton.
		});
		
		store.load();

		var grid = new Ext.grid.EditorGridPanel({
			store: store,
			columns : columns,
			flex: 1
		});
		
		return grid;
	},
	
	buildWTypeGrid : function(){
	var proxy = new Ext.data.HttpProxy({
			api: {
				read : '/WellType/GetJson',
				create : '/WellType/CreateJson',
				update: '/WellType/UpdateJson',
				destroy: '/WellType/DeleteJson'
			}
		});
		
		var reader = new Ext.data.JsonReader({
			totalProperty: 'total',
			successProperty: 'success',
			idProperty: 'WellTypeId',
			root: 'data',
			messageProperty: 'message'  // <-- New "messageProperty" meta-data
		}, [
			{name: 'WellTypeId'},
			{name: 'Name', allowBlank: false}
		]);
		
		var writer = new Ext.data.JsonWriter({
			encode: true,
			writeAllFields: false
		});
		
		var columns =  [
			{header: "Well Types", width: 330, align:'center', sortable: true, dataIndex: 'Name', editor: new Ext.form.TextField()}
		];
		
		var store = new Ext.data.Store({
			proxy: proxy,
			reader: reader,
			writer: writer,  // <-- plug a DataWriter into the store just as you would a Reader
			autoSave: true // <-- false would delay executing create, update, destroy requests until specifically told to do so with some [save] buton.
		});
		
		store.load();

		var grid = new Ext.grid.EditorGridPanel({
			store: store,
			columns : columns,
			flex: 1
		});
		
		return grid;
	},
	
	buildWStatusGrid : function(){
	var proxy = new Ext.data.HttpProxy({
			api: {
				read : '/WellStatus/GetJson',
				create : '/WellStatus/CreateJson',
				update: '/WellStatus/UpdateJson',
				destroy: '/WellStatus/DeleteJson'
			}
		});
		
		var reader = new Ext.data.JsonReader({
			totalProperty: 'total',
			successProperty: 'success',
			idProperty: 'WellStatusId',
			root: 'data',
			messageProperty: 'message'  // <-- New "messageProperty" meta-data
		}, [
			{name: 'WellStatusId'},
			{name: 'Name', allowBlank: false}
		]);
		
		var writer = new Ext.data.JsonWriter({
			encode: true,
			writeAllFields: false
		});
		
		var columns =  [
			{header: "Well Status", width: 330, align:'center', sortable: true, dataIndex: 'Name', editor: new Ext.form.TextField()}
		];
		
		var store = new Ext.data.Store({
			proxy: proxy,
			reader: reader,
			writer: writer,  // <-- plug a DataWriter into the store just as you would a Reader
			autoSave: true // <-- false would delay executing create, update, destroy requests until specifically told to do so with some [save] buton.
		});
		
		store.load();

		var grid = new Ext.grid.EditorGridPanel({
			store: store,
			columns : columns,
			flex: 1
		});
		
		return grid;
	}
});

// add to Ext xtype
Ext.reg('dosb-ca-wellinfo', Dosb.CActivity.WellInfoEditor);
