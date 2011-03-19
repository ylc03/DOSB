Ext.ns('DOSB', 'DOSB.CActivity');

Ext.onReady(function () {
    Ext.QuickTips.init();

    DOSB.CActivity.MonthView.init();
	
	Ext.data.DataProxy.addListener('exception', function(proxy, type, action, options, res) {
		if (type === 'remote') {
			Ext.Msg.show({
				title: 'REMOTE EXCEPTION',
				msg: res.message,
				icon: Ext.MessageBox.ERROR,
				buttons: Ext.Msg.OK
			});
		}
	});
	
});

DOSB.CActivity.MonthView = {
    // Bootstrap function
    init: function () {
        this.scheduler = this.createScheduler();

        this.initSchedulerEvents();
        this.initStoreEvents();
    },

    onEventContextMenu: function (s, rec, e) {
        e.stopEvent();

        if (!s.ctx) {
            s.ctx = new Ext.menu.Menu({
                items: [{
                    text: 'Delete Job',
                    iconCls: 'icon-delete',
                    handler : function() {
                        s.eventStore.remove(s.ctx.rec);
						s.eventStore.save();
						s.eventStore.commitChanges();
                    }
                }]
            });
        }
        s.ctx.rec = rec;
        s.ctx.showAt(e.getXY());
    },
	
    onCellDblClick: function (panel, rowIndex, cellIndex, e) {
		if (this.scheduler.getColumnModel().getColumnAt(cellIndex).locked) return;
        e.stopEvent();
		var s = this.scheduler;
		var pos = e.getXY();
		
		// save data to 
		s.dbClickData = { date: s.getDateFromXY(pos),
			rowIndex : rowIndex
		};
		
		if (!s.ctxAddJob) {
            s.ctxAddJob = new Ext.menu.Menu({
                items: [{
                    text: 'Add Job',
                    iconCls: 'icon-add',
                    handler : function(e) {
						var start = s.getStart();
						var click = s.dbClickData.date;			// date of pos when db clicked
						var rowIndex = s.dbClickData.rowIndex;	// row index when db clicked.
						var startTimeByHour = Math.floor((click - start)/3600000);
						var record = s.resourceStore.getAt(rowIndex);
						var eventRecord = new (s.eventStore.recordType)({
							ResourceId: record.get("Id"), 
							StartDate: new Date(start.getTime() + 3600000*startTimeByHour), 
							EndDate: new Date(start.getTime() + 3600000*(startTimeByHour+1))});
						
						s.onEventCreated(eventRecord);
						s.editor.show(eventRecord, s.ctxAddJob.getEl());
					}
                }]
            });
        }
        s.ctxAddJob.showAt(pos);
    },

	

    // Don't show tooltip if editor is visible
    beforeTooltipShow: function (s, r) {
		return false;
        //return s.editor.collapsed;
    },
	
	beforeEditorCollapse: function (p, a){
		var eventStore = this.scheduler.eventStore;
		eventStore.save();
		eventStore.commitChanges();
		return true;
	},
	
    initStoreEvents: function () {
        var s = this.scheduler;
        s.eventStore.on('update', function (store, bookingRecord, operation) {
            if (operation !== Ext.data.Record.EDIT && operation !== Ext.data.Record.COMMIT) return;
			
			var company = bookingRecord.get("CompanyName");
			bookingRecord.set("BackgroundColor", Dosb.CActivity.CompanyColor[company].BackgroundColor);
			bookingRecord.set("TextColor", Dosb.CActivity.CompanyColor[company].TextColor);	

            //s.view.getElementFromEventRecord(bookingRecord).addClass('sch-fake-loading');
            // Simulate server delay 1.5 seconds
            //bookingRecord.commit();//.defer(1500, bookingRecord);
        });
    },

    initSchedulerEvents: function () {
        var s = this.scheduler;

        s.on({
            eventcontextmenu : this.onEventContextMenu, 
            beforetooltipshow : this.beforeTooltipShow, 
			celldblclick : this.onCellDblClick,
            scope : this
        });
		
		s.editor.on({
			beforecollapse: this.beforeEditorCollapse,
			scope : this
		});
    },

    createScheduler: function () {
		// initialize the resource store.
		var resourceProxy = new Ext.data.HttpProxy({
			api: {
				read: '/RigActivity/GetJson',
				create: '/RigActivity/CreateJson',
				update: '/RigActivity/UpdateJson',
				destroy: '/RigActivity/DeleteJson'
			}		
		});
		
		var resourceReader = new Ext.data.JsonReader({
				totalProperty: 'total',
				successProperty: 'success',
				idProperty: 'RigActivityId',
				root: 'data',
				messageProperty: 'message'  // <-- New "messageProperty" meta-data
			}, [
            { name: 'Id', mapping: 'RigActivityId' },
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
		
		var resourceWriter = new Ext.data.JsonWriter({
			encode: true,
			writeAllFields: false	
		});

		var resourceStore = new Ext.data.Store({
			id: 'RA',
			proxy: resourceProxy,
			reader: resourceReader,
			writer: resourceWriter,  // <-- plug a DataWriter into the store just as you would a Reader
			autoSave: false // <-- false would delay executing create, update, destroy requests until specifically told to do so with some [save] buton.
		});

        resourceStore.load();

        // Store holding all the events
		var eventProxy = new Ext.data.HttpProxy({
			api: {
				read: '/CompletionActivity/GetJson',
				create: '/CompletionActivity/CreateJson',
				update: '/CompletionActivity/UpdateJson',
				destroy: '/CompletionActivity/DeleteJson'
			}
		});
		
		var eventReader = new Ext.data.JsonReader({
				totalProperty: 'total',
				successProperty: 'success',
				idProperty: 'CompletionActivityId',
				root: 'data',
				messageProperty: 'message'  // <-- New "messageProperty" meta-data		
		}, [
                { name: 'ResourceId', mapping: 'RigActivityId' },
                { name: 'StartDate', type: 'date', dateFormat: 'Y-m-d g:i' },
                { name: 'EndDate', type: 'date', dateFormat: 'Y-m-d g:i' },
				'CompletionActivityId',
				'AssemblyId',
                'AssemblyType',
                'CompanyName',
				'BackgroundColor',
				'TextColor',
				'Comment'		
		]);
		
		var eventWriter = new Ext.data.JsonWriter({
			encode: true,
			writeAllFields: false
		});

		// Typical Store collecting the Proxy, Reader and Writer together.
		var eventStore = new Ext.data.Store({
			id: 'CA',
			proxy: eventProxy,
			reader: eventReader,
			writer: eventWriter,  // <-- plug a DataWriter into the store just as you would a Reader
			autoSave: false // <-- false would delay executing create, update, destroy requests until specifically told to do so with some [save] buton.
		});
		
        eventStore.load();

		var start = Dosb.CActivity.MonthViewHeaderData.start;
		
        return new MonthScheduler({
			showTooltip: false,
			loadMask: true,
            width: 1030,
            height: 400,
            renderTo : 'test',
            resourceStore: resourceStore,
			enableDragCreation: false,
            eventStore: eventStore,
			viewPreset: 'assembly2Day',
            startDate: start,
            endDate: start.add(Date.HOUR, Dosb.CActivity.MonthViewHeaderData.upperCount + Dosb.CActivity.MonthViewHeaderData.lowerCount)
        });
    }
};
