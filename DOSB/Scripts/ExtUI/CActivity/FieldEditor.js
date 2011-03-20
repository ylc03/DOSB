/**
 * Field editor page. Consist a form and a grid
 * @auther Yuan Lichuan
 * @email LYuan2@slb.com
 * @company Completions, Schlumberger, Saudi Arabia
 * @date 19-Mar-2011
 */

Ext.ns('Dosb', 'Dosb.CActivity');

Dosb.CActivity.FieldForm = Ext.extend(Ext.form.FormPanel, {
    iconCls: 'silk-application-edit',
    frame: true,
    labelAlign: 'right',
    title: 'Field -- All fields are required',
	height: 150,
    defaultType: 'textfield',
    defaults: {
        anchor: '100%'
    },

    // private A pointer to the currently loaded record
    record : null,

    /**
     * initComponent
     * @protected
     */
    initComponent : function() {
        // build the form-fields.  Always a good idea to defer form-building to a method so that this class can
        // be over-ridden to provide different form-fields
        this.items = this.buildForm();

        // build form-buttons
        this.buttons = this.buildUI();

        // add a create event for convenience in our application-code.
        this.addEvents({
            /**
             * @event create
             * Fires when user clicks [create] button
             * @param {FormPanel} this
             * @param {Object} values, the Form's values object
             */
            create : true,
			/**
             * @event destory
             * Fires when user clicks [destory] button
             * @param {FormPanel} this
             * @param {Object} values, the Form's values object
             */
			destory : true
        });

        // super
        Dosb.CActivity.FieldForm.superclass.initComponent.call(this);
    },

    /**
     * buildform
     * @private
     */
    buildForm : function() {
        return [
            {fieldLabel: 'Field', name: 'Name', allowBlank: false},
            {fieldLabel: 'Client', name: 'ClientName', allowBlank: false, xtype: 'dosb-client-combo'},
            {fieldLabel: 'Country', name: 'CountryName', allowBlank: false, xtype: 'dosb-country-combo'}
        ];
    },

    /**
     * buildUI
     * @private
     */
    buildUI: function(){
        return [{
            text: 'Create',
            iconCls: 'silk-application-add',
            handler: this.onCreate,
            scope: this
        }, {
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onUpdate,
            scope: this
        }, {
            text: 'Delete',
            iconCls: 'silk-application-delete',
            handler: this.onDelete,
            scope: this
        }, {
            text: 'Reset',
            handler: function(btn, ev){
                this.getForm().reset();
            },
            scope: this
        }];
    },

    /**
     * loadRecord
     * @param {Record} rec
     */
    loadRecord : function(rec) {
        this.record = rec;
        this.getForm().loadRecord(rec);
    },

    /**
     * onUpdate
     */
    onUpdate : function(btn, ev) {
        if (this.record == null) {
            return;
        }
        if (!this.getForm().isValid()) {
            //App.setAlert(false, "Form is invalid.");
            return false;
        }
        this.getForm().updateRecord(this.record);
    },

    /**
     * onCreate
     */
    onCreate : function(btn, ev) {
        if (!this.getForm().isValid()) {
            //App.setAlert(false, "Form is invalid");
            return false;
        }
        this.fireEvent('create', this, this.getForm().getValues());
        this.getForm().reset();
    },

    /**
     * onDelete
     */
    onDelete : function(btn, ev) {
        this.fireEvent('destory', this, this.getForm().getValues());
		this.getForm().reset();
	},
	
    /**
     * onReset
     */
    onReset : function(btn, ev) {
        this.fireEvent('update', this, this.getForm().getValues());
        this.getForm().reset();
    }
});

Dosb.CActivity.FieldGrid = Ext.extend(Ext.grid.GridPanel, {
    frame: false,
	
    initComponent : function() {

        // typical viewConfig
        this.viewConfig = {
            forceFit: true
        };

        // relay the Store's CRUD events into this grid so these events can be conveniently listened-to in our application-code.
        this.relayEvents(this.store, ['destroy', 'save', 'update']);
		
        // super
        Dosb.CActivity.FieldGrid.superclass.initComponent.call(this);
    },

    /**
     * Delete the selected
     */
    DeleteSelected : function() {
        var rec = this.getSelectionModel().getSelected();
        if (!rec) {
            return false;
        }
        this.store.remove(rec);
    }
});

Dosb.CActivity.FieldEditor = Ext.extend(Ext.Panel, {
	frame: false,		// no frame
	border: false,		// no border
	layout: 'border', 	// form at 'north', grid at 'center'
	viewConfig: {
		forceFit: true
	},
	
	/**
	 * Create data store, field form and field grid
	 */
	initComponent : function(){
		// Create HttpProxy instance.  Notice new configuration parameter "api" here instead of load.  However, you can still use
		// the "url" paramater -- All CRUD requests will be directed to your single url instead.
		var proxy = new Ext.data.HttpProxy({
			api: {
				read : '/Field/GetJson',
				create : '/Field/CreateJson',
				update: '/Field/UpdateJson',
				destroy: '/Field/DeleteJson'
			}
		});

		// Typical JsonReader.  Notice additional meta-data params for defining the core attributes of your json-response
		var reader = new Ext.data.JsonReader({
			totalProperty: 'total',
			successProperty: 'success',
			idProperty: 'FieldId',
			root: 'data',
			messageProperty: 'message'  // <-- New "messageProperty" meta-data
		}, [
			{name: 'FieldId'},
			{name: 'Name', allowBlank: false},
			{name: 'CountryName', allowBlank: false},
			{name: 'CountryId'},
			{name: 'ClientName', allowBlank: false},
			{name: 'ClientId'}
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
		var fieldColumns =  [
			{header: "ID", width: 40, sortable: true, dataIndex: 'FieldId'},
			{header: "Field", width: 100, sortable: true, dataIndex: 'Name'},
			{header: "Client", width: 80, sortable: true, dataIndex: 'ClientName'},
			{header: "Country", width: 80, sortable: true, dataIndex: 'CountryName'}
		];

		// field form
		var fieldForm = new Dosb.CActivity.FieldForm({
			region: 'north',
			listeners: {
				create : function(fpanel, data) {   // <-- custom "create" event defined in FieldForm class
					var rec = new fieldGrid.store.recordType(data);
					fieldGrid.store.insert(0, rec);
				},
				destory : function(fpanel, data) {
					fieldGrid.DeleteSelected();
				}
			}
		});

		// field grid
		var fieldGrid = new Dosb.CActivity.FieldGrid({
			region: 'center',
			store: store,
			columns : fieldColumns,
			listeners: {
				rowclick: function(g, index, ev) {
					var rec = g.store.getAt(index);
					fieldForm.loadRecord(rec);
				},
				destroy : function() {
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
Ext.reg('dosb-ca-feditor', Dosb.CActivity.FieldEditor);
