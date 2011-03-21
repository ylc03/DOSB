/**
 * Rig activity year view & edit
 * @auther Yuan Lichuan & Ali Jassim
 * @email LYuan2@slb.com & AJassim@slb.com
 * @company Completions, Schlumberger, Saudi Arabia
 * @date 20-Mar-2011
 */

Ext.ns('Dosb', 'Dosb.CActivity');

Dosb.CActivity.YearView = Ext.extend(Ext.Panel, {
	frame: false,
	border: true,
	layout:'fit',
    initComponent: function () {
        this.scheduler = this.createScheduler();

        this.initSchedulerEvents();
        this.initStoreEvents();
		
		Ext.apply(this, {
			items: [this.scheduler]
		});
        Dosb.CActivity.YearView.superclass.initComponent.apply(this, arguments);

        this.scheduler.resourceStore.load();
        this.scheduler.eventStore.load();
		
    },

    onEventContextMenu: function (s, rec, e) {
        e.stopEvent();

        if (!s.ctx) {
            s.ctx = new Ext.menu.Menu({
                items: [{
                    text: 'Delete event',
                    iconCls: 'silk-delete',
                    handler : function() {
                        s.eventStore.remove(s.ctx.rec);
                    }
                }]
            });
        }
        s.ctx.rec = rec;
        s.ctx.showAt(e.getXY());
    },

    // Don't show tooltip if editor is visible
    beforeTooltipShow: function (s, r) {
        return s.editor.collapsed;
    },

    initStoreEvents: function () {
        var s = this.scheduler;

        s.eventStore.on({
            'update' : function (store, bookingRecord, operation) {
                if (operation !== Ext.data.Record.EDIT) return;

                s.getView().getElementFromEventRecord(bookingRecord).addClass('sch-fake-loading');

                // Simulate server delay 1.5 seconds
                bookingRecord.commit.defer(1500, bookingRecord);
            },
			'beforeload' : function(store, opt){
				store.baseParams.startDate = s.getStart().format('Y-n-d');
				store.baseParams.endDate = s.getEnd().format('Y-n-d');
			}
        });
		
		s.resourceStore.on({
			'beforeload' : function(store, opt){
				store.baseParams.startDate = s.getStart().format('Y-n-d');
				store.baseParams.endDate = s.getEnd().format('Y-n-d');
			}
		});
    },

    allowModify : function(s, r) {
        // Don't allow modifications while "fake loading" is happening
        return !r.dirty;
    },

    initSchedulerEvents: function () {
        var s = this.scheduler;

        s.on({
            eventcontextmenu : this.onEventContextMenu, 
            beforetooltipshow : this.beforeTooltipShow, 
            beforeresize : this.allowModify,
            beforednd : this.allowModify,
            scope : this
        });
    },	
	
    createScheduler: function () {
		// initialize the resource store.
		var eventProxy = new Ext.data.HttpProxy({
			api: {
				read: '/RigActivity/GetByTimeSpan',
				create: '/RigActivity/CreateJson',
				update: '/RigActivity/UpdateJson',
				destroy: '/RigActivity/DeleteJson'
			}		
		});
		
		var eventReader = new Ext.data.JsonReader({
				totalProperty: 'total',
				successProperty: 'success',
				idProperty: 'RigActivityId',
				root: 'data',
				messageProperty: 'message'  // <-- New "messageProperty" meta-data
			}, [
            'RigActivityId',
			{ name: 'ResourceId', mapping: 'RigId' },
            { name: 'StartDate', type: 'date', dateFormat: 'Y-m-d' },
            { name: 'EndDate', type: 'date', dateFormat: 'Y-m-d' },	
			'ClientName',
            'FieldName',
			'CountryName',
            'RigName',
			'WellName',
            'WellTypeName',
            'WellStatus',
			'CompletionTypeName',
			'Comment'
		]);
		
		var eventWriter = new Ext.data.JsonWriter({
			encode: true,
			writeAllFields: false	
		});

		var eventStore = new Ext.data.Store({
			id: 'RA',
			proxy: eventProxy,
			reader: eventReader,
			writer: eventWriter,  // <-- plug a DataWriter into the store just as you would a Reader
			autoSave: true // <-- false would delay executing create, update, destroy requests until specifically told to do so with some [save] buton.
		});
		
        // Store holding all the events
		var resProxy = new Ext.data.HttpProxy({
			api: {
				read: '/Rig/GetByTimeSpan',
				create: '/Rig/CreateJson',
				update: '/Rig/UpdateJson',
				destroy: '/Rig/DeleteJson'
			}
		});
		
		var resReader = new Ext.data.JsonReader({
				totalProperty: 'total',
				successProperty: 'success',
				idProperty: 'RigId',
				root: 'data',
				messageProperty: 'message'  // <-- New "messageProperty" meta-data		
		}, [
                { name: 'Id', mapping: 'RigId' },
				'Name',
				'Type'
		]);
		
		var resWriter = new Ext.data.JsonWriter({
			encode: true,
			writeAllFields: false
		});

		// Typical Store collecting the Proxy, Reader and Writer together.
		var resStore = new Ext.data.Store({
			id: 'Rig',
			proxy: resProxy,
			reader: resReader,
			writer: resWriter,  // <-- plug a DataWriter into the store just as you would a Reader
			autoSave: true
		});
        return new Dosb.CActivity.YearScheduler({
			rowHeight : 25,
			showTooltip: false,
			resourceStore: resStore,
            eventStore: eventStore,
			loadMask: {store: eventStore},			
			resizeHandles: 'both',
			constrainDragToResource: true,
			enableDragCreation: true,
			viewPreset: 'monthAndYear',
            startDate: new Date(2011, 0, 1),
            endDate: new Date(2012, 0, 1)
        });
    }
});

Ext.reg('dosb-ca-yview', Dosb.CActivity.YearView);
