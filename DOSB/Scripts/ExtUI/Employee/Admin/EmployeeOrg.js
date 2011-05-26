/// <reference path="../../application.js" />
/**
* Employee Editor.
* @auther Yuan Lichuan
* @email LYuan2@slb.com
* @company Completions, Schlumberger, Saudi Arabia
* @date 23-May-2011
*/
Ext.ns('Dosb', 'Dosb.Employee', 'Dosb.Employee.Admin')

Dosb.Employee.Admin.OrgForm = Ext.extend(Ext.form.FormPanel, {
    frame: false,
    columnWidth: 0.3,
    labelAlign: 'right',
    defaultType: 'textfield',

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
            * @event save
            * Fires when user clicks [save] button
            * @param {FormPanel} this
            * @param {Object} values, the Form's values object
            */
            save: true
        });

        // super
        Dosb.Employee.Admin.OrgForm.superclass.initComponent.call(this);
    },

    /**
    * buildform
    * @private
    */
    buildForm: function () {
        return [
            { xtype: 'hidden', name: 'SegmentId' },
            { xtype: 'hidden', name: 'ParentId' },
            { fieldLabel: 'Save to', name: 'Path', allowBlank: false },
            { fieldLabel: 'Name', name: 'Name', allowBlank: false },
            { fieldLabel: 'Full Name', name: 'FullName', allowBlank: false }
        ];
    },

    /**
    * buildUI
    * @private
    */
    buildUI: function () {
        return [{
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        }, {
            text: 'Cancel',
            iconCls: 'silk-cancel',
            handler: this.onCancel,
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
    * onSave
    */
    onSave: function (btn, ev) {
        var form = this.getForm();
        if (!form.isValid()) {
            //App.setAlert(false, "Form is invalid");
            return false;
        }
        var rec = this.record;
        rec.beginEdit();
        form.updateRecord(rec);
        rec.endEdit();
        this.fireEvent('save', this, rec);
        form.reset();
    },

    /**
    * onCancel
    */
    onCancel: function (btn, ev) {
        this.getForm().reset();
    }
});

Dosb.Employee.Admin.OrgTree = Ext.extend(Ext.tree.TreePanel, {
    frame: false,
    columnWidth: 0.3,
    useArrows: true,
    autoScroll: true,
    animate: true,
    enableDD: false,
    containerScroll: true,
    border: false,
    // auto create TreeLoader
    dataUrl: '/EmployeeOrg/GetNodes',

    root: {
        nodeType: 'async',
        text: 'root',
        draggable: false,
        id: '8'
    }
});

Dosb.Employee.Admin.Org = Ext.extend(Ext.Panel, {
    iconCls: 'silk-organisation',
    border: true,
    title: 'Manage employee organisation',
    initComponent: function () {
        var form = new Dosb.Employee.Admin.OrgForm();
        var tree = new Dosb.Employee.Admin.OrgTree();
        this.tree = tree;
        var store = Ext.StoreMgr.get('segment');

        var sm = tree.getSelectionModel();
        this.mon(sm, 'selectionchange', function (sm, node) {
            if (node != null && node.id != 0) {
                var rec = store.getById(node.id);
                form.loadRecord(rec);
            }
        });

        // listen to write, responed to server
        this.mon(store, 'write', this.onStoreWrite, this);

        // listen to errors
        this.mon(store, 'exception', function () {
            store.rejectChanges();
        });

        form.on('save', function (f, rec) {
            // add to store
            if (rec.get('SegmentId') < 1) {
                store.add(rec);
            }
            store.save();
        });

        Ext.apply(this, {
            layout: 'column',
            items: [tree, form],

            tbar: [
            {
                iconCls: 'silk-arrow-down',
                tooltip: 'Expand All',
                handler: function () {
                    tree.expandAll();
                },
                scope: this
            }, {
                iconCls: 'silk-arrow-up',
                tooltip: 'Collapse All',
                handler: function () {
                    tree.collapseAll();
                },
                scope: this
            }, {
                iconCls: 'silk-arrow-refresh',
                tooltip: 'Refresh',
                handler: function () {
                    tree.getRootNode().reload();
                },
                scope: this
            }, "-", {
                iconCls: 'silk-organisation-delete',
                tooltip: 'Delete',
                handler: function () {
                    var sel = tree.getSelectionModel();
                    var node = sel.getSelectedNode();
                    if (node == null) return;

                    // remove from server
                    store.remove(store.getById(node.id));
                    store.save();
                },
                scope: this
            }, {
                iconCls: 'silk-organisation-add',
                tooltip: 'Add',
                handler: function () {
                    var sel = tree.getSelectionModel();
                    var node = sel.getSelectedNode();
                    var pid = 0;

                    var parent = store.getById(node.id);
                    if (parent != null) pid = parent.get('SegmentId');
                    var rec = new (store.recordType)({
                        ParentId: pid,
                        SegmentId: 0,
                        Path: parent.get('Path') + parent.get('Name') + "/",
                        Name: '',
                        FullName: ''
                    });
                    form.loadRecord(rec);
                },
                scope: this
            }
            ]
        });

        Dosb.Employee.Admin.Org.superclass.initComponent.call(this);
    },

    onStoreWrite: function (s, act, result, tran, rs) {
        var tree = this.tree;
        // create
        if (act == Ext.data.Api.actions.create) {
            Ext.each(rs, function (rec) {
                // add to tree
                var node = new Ext.tree.TreeNode({
                    id: rec.get("SegmentId"),
                    text: rec.get("Name")
                });

                var pnode = tree.getNodeById(rec.get('ParentId'));
                pnode.appendChild(node);
                pnode.expand();
            });
            // update
        } else if (act == Ext.data.Api.actions.update) {
            var node = tree.getNodeById(rs.get('SegmentId'));
            node.setText(rs.get('Name'));
            node.setTooltip(rs.get('FullName'));
            // delete
        } else if (act == Ext.data.Api.actions.destroy) {
            var node = tree.getNodeById(rs.get('SegmentId'));
            // remove from tree
            node.parentNode.removeChild(node, true);
        }
    }
});

// add to Ext xtype
Ext.reg('dosb-emp-admin-org', Dosb.Employee.Admin.Org);
