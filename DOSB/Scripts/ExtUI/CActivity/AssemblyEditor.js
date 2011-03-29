/**
 * Field editor page. Consist a form and a grid
 * @auther Ali Jassim
 * @email AJassim@slb.com
 * @company Completions, Schlumberger, Saudi Arabia
 * @date 28-Mar-2011
 */

Ext.ns('Dosb', 'Dosb.CActivity');

Dosb.CActivity.AssemblyForm = Ext.extend(Ext.form.FormPanel, {
    iconCls: 'silk-application-edit',
    frame: true,
    labelAlign: 'right',
    title: 'Manage job type',
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
        Dosb.CActivity.AssemblyForm.superclass.initComponent.call(this);
    },

    /**
     * buildform
     * @private
     */
    buildForm : function() {
        return [
            {fieldLabel: 'Job', name: 'Name', allowBlank: false},
            new Ext.form.ComboBox({
                store: ['Upper Completion', 'Lower Completion'],
				fieldLabel: 'Job Type',
				name: 'Type',
				allowBlank: false,
                typeAhead: true,
			    forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true
            })
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
            text: 'Update',
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
        if (this.record === null) {
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

Dosb.CActivity.AssemblyGrid = Ext.extend(Ext.grid.GridPanel, {
    frame: false,
	
    initComponent : function() {

        // typical viewConfig
        this.viewConfig = {
            forceFit: true
        };

        // relay the Store's CRUD events into this grid so these events can be conveniently listened-to in our application-code.
        this.relayEvents(this.store, ['destroy', 'save', 'update']);
		
        // super
        Dosb.CActivity.AssemblyGrid.superclass.initComponent.call(this);
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

Dosb.CActivity.AssemblyEditor = Ext.extend(Ext.Panel, {
	frame: false,		// no frame
	border: false,		// no border
	layout: 'border',	// form at 'north', grid at 'center'
	viewConfig: {
		forceFit: true
	},
	
	/**
	 * Create data store, field form and field grid
	 */
	initComponent : function(){
		// Create HttpProxy instance.  Notice new configuration parameter "api" here instead of load.  However, you can still use
		// the "url" paramater -- All CRUD requests will be directed to your single url instead.
		var proxyLower = new Ext.data.HttpProxy({
			api: {
				read : '/Assembly/LowerAssemblyGetJson',
				create : '/Assembly/CreateJson',
				update: '/Assembly/UpdateJson',
				destroy: '/Assembly/DeleteJson'
			}
		});
		
		var proxyUpper = new Ext.data.HttpProxy({
			api: {
				read : '/Assembly/UpperAssemblyGetJson',
				create : '/Assembly/CreateJson',
				update: '/Assembly/UpdateJson',
				destroy: '/Assembly/DeleteJson'
			}
		});
		
		// Typical JsonReader.  Notice additional meta-data params for defining the core attributes of your json-response
		var reader = new Ext.data.JsonReader({
			totalProperty: 'total',
			successProperty: 'success',
			idProperty: 'AssemblyId',
			root: 'data',
			messageProperty: 'message'  // <-- New "messageProperty" meta-data
		}, [
			{name: 'AssemblyId'},
			{name: 'Name', allowBlank: false},
			{name: 'Type', allowBlank: false}
		]);

		// The new DataWriter component.
		var writer = new Ext.data.JsonWriter({
			encode: true,
			writeAllFields: false
		});

		// Typical Store collecting the Proxy, Reader and Writer together.
		var storeLower = new Ext.data.Store({
			id: 'assembly',
			proxy: proxyLower,
			reader: reader,
			writer: writer,  // <-- plug a DataWriter into the store just as you would a Reader
			autoSave: true // <-- false would delay executing create, update, destroy requests until specifically told to do so with some [save] buton.
		});

		var storeUpper = new Ext.data.Store({
			id: 'assembly',
			proxy: proxyUpper,
			reader: reader,
			writer: writer,  // <-- plug a DataWriter into the store just as you would a Reader
			autoSave: true // <-- false would delay executing create, update, destroy requests until specifically told to do so with some [save] buton.
		});
		
		// load the store immeditately
		storeLower.load();
		storeUpper.load();
		
		// define columns in fieldGrid
		var assemblyLowerColumns =  [
			{header: "Lower Completion", width: 100, sortable: true, dataIndex: 'Name'}
		];
		
		var assemblyUpperColumns =  [
			{header: "Upper Completion", width: 100, sortable: true, dataIndex: 'Name'}
		];

		// field form
		var assemblyForm = new Dosb.CActivity.AssemblyForm({
			region: 'north',
			listeners: {
				create : function(fpanel, data) {   // <-- custom "create" event defined in FieldForm class
					var rec;
					if (data.Type == 'Upper Completions'){
						rec = new assemblyUpperGrid.store.recordType(data);
						assemblyUpperGrid.store.insert(0, rec);
					} else if (data.Type == 'Lower Completions' ){
						rec = new assemblyLowerGrid.store.recordType(data);
						assemblyLowerGrid.store.insert(0, rec);
					}
				},
				destory : function(fpanel, data) {
					Ext.Msg.show({
						title:'Confirm delete.',
						msg: 'All job related to this Job type will be deleted! Comfirm? ',
						buttons: Ext.Msg.OKCANCEL,
						icon: Ext.MessageBox.QUESTION,
						fn: function(btn){
							if (btn == 'ok') {
								if (data.Type == 'Upper Completions'){
									assemblyUpperGrid.DeleteSelected();
								} else if (data.Type == 'Lower Completions'){
									assemblyLowerGrid.DeleteSelected();
								}
							}
						}
					});
				}
			}
		});

		// field grid
		var assemblyLowerGrid = new Dosb.CActivity.AssemblyGrid({
			flex: 1,
			//border:false,
			//bodyStyle:'padding:5px 0 5px 5px',
			store: storeLower,
			columns : assemblyLowerColumns,
			listeners: {
				rowclick: function(g, index, ev) {
					var rec = g.store.getAt(index);
					assemblyForm.loadRecord(rec);
				},
				destroy : function() {
					assemblyForm.getForm().reset();
				}
			}
		});
		
		var assemblyUpperGrid = new Dosb.CActivity.AssemblyGrid({
			flex: 1,
			//border:false,
			//bodyStyle:'padding:5px 0 5px 5px',
			store: storeUpper,
			columns : assemblyUpperColumns,
			listeners: {
				rowclick: function(g, index, ev) {
					var rec = g.store.getAt(index);
					assemblyForm.loadRecord(rec);
				},
				destroy : function() {
					assemblyForm.getForm().reset();
				}
			}
		});
		
		// add components
		Ext.apply(this, {
			items: [
				assemblyForm,
				{
					layout: 'hbox',
					region: 'center',
					layoutConfig : {
						align: 'stretch'
					},
					items: [assemblyUpperGrid, assemblyLowerGrid]
				}
			]
		});
		
		Dosb.CActivity.AssemblyEditor.superclass.initComponent.apply(this, arguments);
	}
});

// add to Ext xtype
Ext.reg('dosb-ca-asmeditor', Dosb.CActivity.AssemblyEditor);
