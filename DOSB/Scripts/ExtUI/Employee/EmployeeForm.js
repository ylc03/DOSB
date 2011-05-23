/**
* Employee Editor Form.
* @auther Yuan Lichuan
* @email LYuan2@slb.com
* @company Completions, Schlumberger, Saudi Arabia
* @date 22-May-2011
*/

Ext.ns('Dosb', 'Dosb.Employee');

Dosb.Employee.EmployeeForm = Ext.extend(Ext.form.FormPanel, {
    iconCls: 'silk-application-edit',
    frame: true,
    labelAlign: 'right',
    title: 'Employee -- All fields are required',
    height: 150,
    defaultType: 'textfield',
    defaults: {
        anchor: '100%'
    },

    // private A pointer to the currently loaded record
    record: null,

    /**
    * initComponent
    * @protected
    */
    initComponent: function () {
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
            create: true,
            /**
            * @event destory
            * Fires when user clicks [destory] button
            * @param {FormPanel} this
            * @param {Object} values, the Form's values object
            */
            destory: true
        });

        // super
        Dosb.Employee.EmployeeForm.superclass.initComponent.call(this);
    },

    /**
    * buildform
    * @private
    */
    buildForm: function () {
        return [
            { fieldLabel: 'Field', name: 'Name', allowBlank: false },
            { fieldLabel: 'Client', name: 'ClientName', allowBlank: false, xtype: 'dosb-client-combo' },
            { fieldLabel: 'Country', name: 'CountryName', allowBlank: false, xtype: 'dosb-country-combo' }
        ];
    },

    /**
    * buildUI
    * @private
    */
    buildUI: function () {
        return [{
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
            handler: function (btn, ev) {
                this.getForm().reset();
            },
            scope: this
        }];
    },

    /**
    * loadRecord
    * @param {Record} rec
    */
    loadRecord: function (rec) {
        this.record = rec;
        this.getForm().loadRecord(rec);
    },

    /**
    * onUpdate
    */
    onUpdate: function (btn, ev) {
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
    onCreate: function (btn, ev) {
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
    onDelete: function (btn, ev) {
        this.fireEvent('destory', this, this.getForm().getValues());
        this.getForm().reset();
    },

    /**
    * onReset
    */
    onReset: function (btn, ev) {
        this.fireEvent('update', this, this.getForm().getValues());
        this.getForm().reset();
    }
});