Ext.ns('Dosb', 'Dosb.CActivity');
Ext.ns('Sch');

Dosb.CActivity.YearScheduler = Ext.extend(Sch.SchedulerPanel, {
    clicksToEdit: 1,
    snapToIncrement: true,

    eventRenderer: function (item, resourceRec, tplData, row, col, ds) {
        //tplData.cls = 'evt-' + resource.get('Category');
        tplData.style = row % 2 === 1 ? 'background-color:lightgray' : '';
        return {
            well: item.get('WellName')
        };
    },

    initComponent: function () {
        Ext.apply(this, {
            columns: this.buildColumns(),
            tbar: this.buildToolbar(),

            eventBodyTemplate: new Ext.Template(
                '<div class="sch-event-body">{well}</div>'
            ),

            onEventCreated: function (newEventRecord) {
                // Overridden to provide some default values
                //newEventRecord.set('Rig', 'Rig...');
                //newEventRecord.set('Type', 'Local office');
            }
        });

        Dosb.CActivity.YearScheduler.superclass.initComponent.call(this);

        // disable Edit
        this.disableEdit();
        this.fieldNameCombo.on('change', this.onFieldNameChange, this);
    },

    // disable editing event, enable editing rig
    disableEdit: function () {
        this.wellNameEdit.setValue('');
        this.fieldNameCombo.setValue('');
        this.wellNameEdit.disable();
        this.fieldNameCombo.disable();

        this.rigNameEdit.setValue('');
        this.rigNameEdit.enable();

        this.ifDisableEdit = true;
    },

    // enable editing event, disable editing rig
    enableEdit: function (rec) {
        if (rec) {
            this.rigNameEdit.setValue(rec.get('RigName'));
            this.wellNameEdit.setValue(rec.get('WellName'));
            this.fieldNameCombo.setValue(rec.get('FieldName'));
        }
        this.wellNameEdit.enable();
        this.fieldNameCombo.enable();

        this.rigNameEdit.disable();

        this.ifDisableEdit = false;
    },

    onFieldNameChange: function (combo, newVal, oldVal) {
        var fieldName = newVal;
        if (fieldName == '(Not Specified)') return;
        this.wellNameEdit.setValue(fieldName + '-');
        this.wellNameEdit.focus();
    },

    addRigHandler: function () {
        this.stopEditing();

        var name = this.rigNameEdit.getValue();
        if (name === '') return;

        var index = this.resourceStore.findExact('Name', name);
        if (index >= 0) {
            this.startEditing(index, 1);
        } else {
            var u = new this.resourceStore.recordType({
                Name: name
            });
            this.rigNameEdit.setValue('');
            this.store.insert(0, u);
            this.startEditing(0, 1);
        }
    },

    updateWellHandler: function (e) {
        var sel = this.getSelectionModel().selected;
        if (this.ifDisableEdit) return;
        var rec = this.getEventRecordFromElement(sel.el);
        var wellName = this.wellNameEdit.getValue();
        var fieldName = this.fieldNameCombo.getValue();
        rec.beginEdit();
        rec.set('WellName', wellName);
        rec.set('FieldName', fieldName);
        rec.endEdit();

        //this.disableEdit();
    },

    cancelWellHandler: function () {
        this.disableEdit();
    },

    buildColumns: function () {
        var columns = [
                { header: 'Rig', sortable: true, width: 80, dataIndex: 'Name' },
                { header: 'Desk Eng', sortable: true, width: 120, dataIndex: 'Type', editor: new Ext.form.ComboBox({
                    store: ['The', 'List', 'Is', 'To', 'Be', 'Added', 'Soon!'],
                    typeAhead: true,
                    forceSelection: true,
                    triggerAction: 'all',
                    selectOnFocus: true
                })
                }
            ];
        return columns;
    },

    buildToolbar: function () {
        this.rigNameEdit = new Ext.form.TextField({
            name: 'rig-name',
            emptyText: 'Rig',
            width: 100
        });
        this.fieldNameCombo = new Dosb.ux.FieldCombo({
            name: 'field-name',
            emptyText: 'Field',
            allowBlank: false,
            width: 80
        });
        this.wellNameEdit = new Ext.form.TextField({
            name: 'well-name',
            emptyText: 'Well',
            allowBlank: false,
            width: 120
        });

        var toolbar = [
                {
                    xtype: 'tbtext',
                    text: 'Rig'
                },
                this.rigNameEdit,
                {
                    iconCls: 'silk-add',
                    tooltip: 'Add a rig',
                    scope: this,
                    handler: this.addRigHandler
                },
                '-',
                ' ',
                {
                    xtype: 'tbtext',
                    text: 'Field'
                },
                this.fieldNameCombo,
                '   ',
                {
                    xtype: 'tbtext',
                    text: 'Well'
                },
                this.wellNameEdit,
                {
                    iconCls: 'silk-disk',
                    name: 'update',
                    tooltip: 'Update changes',
                    scope: this,
                    handler: this.updateWellHandler
                },
                {
                    iconCls: 'silk-cancel',
                    name: 'cancel',
                    tooltip: 'Discard changes',
                    scope: this,
                    handler: this.cancelWellHandler
                },
                '-',
                {
                    iconCls: 'silk-database-refresh',
                    name: 'refresh',
                    tooltip: 'Reload data',
                    scope: this,
                    handler: function () {
                        this.resourceStore.load();
                        this.eventStore.load();
                    }
                },
                {
                    iconCls: 'silk-database-save',
                    name: 'save-all',
                    tooltip: 'Save all',
                    scope: this,
                    handler: function () {
                        this.resourceStore.save();
                        this.eventStore.save();
                    }
                },
				{
                    iconCls: 'silk-database-lightning',
                    name: 'discard-all',
                    tooltip: 'Discard all',
                    scope: this,
                    handler: function () {
                        this.resourceStore.rejectChanges();
                        this.eventStore.rejectChanges();
                    }
                },
                '-',
                '->',
                {
                    iconCls: 'silk-arrow-left',
                    tooltip: 'prev quarter',
                    scope: this,
                    handler: function () {
                        this.shiftPrevious();
                        this.resourceStore.load();
                        this.eventStore.load();
                    }
                },
                {
                    iconCls: 'silk-arrow-right',
                    tooltip: 'next quarter',
                    scope: this,
                    handler: function () {
                        this.shiftNext();
                        this.resourceStore.load();
                        this.eventStore.load();
                    }
                }
            ];
        return toolbar;
    }
});