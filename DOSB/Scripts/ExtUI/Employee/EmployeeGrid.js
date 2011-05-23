/**
* Employee Editor Grid.
* @auther Yuan Lichuan
* @email LYuan2@slb.com
* @company Completions, Schlumberger, Saudi Arabia
* @date 22-May-2011
*/
Ext.ns('Dosb', 'Dosb.Employee');

Dosb.Employee.EmployeeGrid = Ext.extend(Ext.grid.GridPanel, {
    frame: false,

    initComponent: function () {

        // typical viewConfig
        this.viewConfig = {
            forceFit: true
        };

        // relay the Store's CRUD events into this grid so these events can be conveniently listened-to in our application-code.
        this.relayEvents(this.store, ['destroy', 'save', 'update']);

        // super
        Dosb.Employee.EmployeeGrid.superclass.initComponent.call(this);
    },

    /**
    * Delete the selected
    */
    DeleteSelected: function () {
        var rec = this.getSelectionModel().getSelected();
        if (!rec) {
            return false;
        }
        this.store.remove(rec);
    }
});