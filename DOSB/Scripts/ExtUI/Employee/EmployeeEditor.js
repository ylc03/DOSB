/**
* Employee Editor.
* @auther Yuan Lichuan
* @email LYuan2@slb.com
* @company Completions, Schlumberger, Saudi Arabia
* @date 22-May-2011
*/

Ext.ns('Dosb', 'Dosb.Employee');

Dosb.Employee.EmployeeEditor = Ext.extend(Ext.Panel, {
    frame: false, 	// no frame
    border: false, 	// no border
    layout: 'border', 	// form at 'north', grid at 'center'
    viewConfig: {
        forceFit: true
    },

    /**
    * Create data store, field form and field grid
    */
    initComponent: function () {
        // Create HttpProxy instance.  Notice new configuration parameter "api" here instead of load.  However, you can still use
        // the "url" paramater -- All CRUD requests will be directed to your single url instead.
        var proxy = new Ext.data.HttpProxy({
            api: {
                read: '/Employee/GetJson',
                create: '/Employee/CreateFromLdapJson',
                update: '/Employee/UpdateJson',
                destroy: '/Employee/DeleteJson'
            }
        });

        // Typical JsonReader.  Notice additional meta-data params for defining the core attributes of your json-response
        var reader = new Ext.data.JsonReader({
            totalProperty: 'total',
            successProperty: 'success',
            idProperty: 'EmployeeId',
            root: 'data',
            messageProperty: 'message'  // <-- New "messageProperty" meta-data
        }, [
			{ name: 'EmployeeId' },
			{ name: 'Name', allowBlank: false },
			{ name: 'CountryName', allowBlank: false },
			{ name: 'CountryId' },
			{ name: 'ClientName', allowBlank: false },
			{ name: 'ClientId' }
		]);

        // The new DataWriter component.
        var writer = new Ext.data.JsonWriter({
            encode: true,
            writeAllFields: false
        });

        // Typical Store collecting the Proxy, Reader and Writer together.
        var store = new Ext.data.Store({
            id: 'field',
            proxy: proxy,
            reader: reader,
            writer: writer,  // <-- plug a DataWriter into the store just as you would a Reader
            autoSave: true // <-- false would delay executing create, update, destroy requests until specifically told to do so with some [save] buton.
        });

        // load the store immeditately
        store.load();

        // define columns in fieldGrid
        var fieldColumns = [
			{ header: "ID", width: 40, sortable: true, dataIndex: 'FieldId' },
			{ header: "Field", width: 100, sortable: true, dataIndex: 'Name' },
			{ header: "Client", width: 80, sortable: true, dataIndex: 'ClientName' },
			{ header: "Country", width: 80, sortable: true, dataIndex: 'CountryName' }
		];

        // field form
        var fieldForm = new Dosb.CActivity.FieldForm({
            region: 'north',
            listeners: {
                create: function (fpanel, data) {   // <-- custom "create" event defined in FieldForm class
                    var rec = new fieldGrid.store.recordType(data);
                    fieldGrid.store.insert(0, rec);
                },
                destory: function (fpanel, data) {
                    fieldGrid.DeleteSelected();
                }
            }
        });

        // field grid
        var fieldGrid = new Dosb.CActivity.FieldGrid({
            region: 'center',
            store: store,
            columns: fieldColumns,
            listeners: {
                rowclick: function (g, index, ev) {
                    var rec = g.store.getAt(index);
                    fieldForm.loadRecord(rec);
                },
                destroy: function () {
                    fieldForm.getForm().reset();
                }
            }
        });

        // add components
        Ext.apply(this, {
            items: [
				fieldForm,
				fieldGrid
			]
        });

        Dosb.CActivity.FieldEditor.superclass.initComponent.apply(this, arguments);
    }
});

// add to Ext xtype
Ext.reg('dosb-emp-editor', Dosb.Employee.EmployeeEditor);
