/**
* Employee Editor.
* @auther Yuan Lichuan
* @email LYuan2@slb.com
* @company Completions, Schlumberger, Saudi Arabia
* @date 23-May-2011
*/

Ext.ns('Dosb', 'Dosb.Employee', 'Dosb.Employee.Admin');

Dosb.Employee.Admin.Org = Ext.extend(Ext.tree.TreePanel, {
    title: 'Organization',
    useArrows: true,
    autoScroll: true,
    animate: true,
    enableDD: true,
    containerScroll: true,
    border: false,
    // auto create TreeLoader
    dataUrl: '/EmployeeOrg/GetNodes',

    root: {
        nodeType: 'async',
        text: 'Organization',
        draggable: false,
        id: '0'
    },

    initComponent: function () {
        Ext.apply(this, {
            tbar: [
            {
                iconCls: 'silk-arrow-down',
                tooltip: 'Expand All',
                handler: function () {
                    this.expandAll();
                },
                scope: this
            }, {
                iconCls: 'silk-arrow-up',
                tooltip: 'Collapse All',
                handler: function () {
                    this.collapseAll();
                },
                scope: this
            }, {
                iconCls: 'silk-delete',
                tooltip: 'Delete',
                handler: function () {
                    var sel = this.getSelectionModel();
                    var node = sel.getSelectedNode();
                    node.remove();
                },
                scope: this
            }, {
                iconCls: 'silk-add',
                tooltip: 'Add',
                handler: function () {
                    var sel = this.getSelectionModel();
                    var node = sel.getSelectedNode();
                    node.remove();
                },
                scope: this           
            }
            ]
        });

        Dosb.Employee.Admin.Org.superclass.initComponent.call(this);
    },

    listeners: {
        // move node
        movenode: function (tree, node, oldP, newP, index) {
            alert(node.text);
        },
        // new node
        append: function (tree, p, node, index) {
            alert(node.text);
        },
        // delete node
        remove: function (tree, p, node) {
            alert(node.text);
            alert(node.getPath());
        }
    }
});

// add to Ext xtype
Ext.reg('dosb-emp-admin-org', Dosb.Employee.Admin.Org);
