// define the segment store.
(function () {
    var proxy = new Ext.data.HttpProxy({
        api: {
            read: '/EmployeeOrg/GetJson',
            create: '/EmployeeOrg/CreateJson',
            update: '/EmployeeOrg/UpdateJson',
            destroy: '/EmployeeOrg/DeleteJson'
        }
    });

    // Typical JsonReader.  Notice additional meta-data params for defining the core attributes of your json-response
    var reader = new Ext.data.JsonReader({
        totalProperty: 'total',
        successProperty: 'success',
        idProperty: 'SegmentId',
        root: 'data',
        messageProperty: 'message'  // <-- New "messageProperty" meta-data
    }, [
			{ name: 'SegmentId' },
            { name: 'ParentId' },
			{ name: 'Name', allowBlank: false },
			{ name: 'FullName', allowBlank: false },
            { name: 'Path', allowBlank: false },
			{ name: 'BusinessCategory' }
		]);

    // The new DataWriter component.
    var writer = new Ext.data.JsonWriter({
        encode: true,
        writeAllFields: false
    });

    // Typical Store collecting the Proxy, Reader and Writer together.
    var store = new Ext.data.Store({
        id: 'segment',
        proxy: proxy,
        reader: reader,
        writer: writer,  // <-- plug a DataWriter into the store just as you would a Reader
        autoSave: false // <-- false would delay executing create, update, destroy requests until specifically told to do so with some [save] buton.
    });

    store.load();
})();