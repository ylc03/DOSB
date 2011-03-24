/**
 * Rig activity year view & edit
 * @company Completions, Schlumberger, Saudi Arabia
 * @history 23 Mar 2011,	 Yuan Lichuan,		first stable edition
 */

Ext.ns('Sch');
Ext.ns('Dosb', 'Dosb.CActivity');

(function() {
    
    var myCustomPresets = {
		assembly2Day: {
			timeColumnWidth: 80, 
			displayDateFormat: "G:i", 
			shiftIncrement: 1, 
			shiftUnit: Date.DAY, 
			defaultSpan: Dosb.CActivity.MonthViewHeaderData.upperCount + Dosb.CActivity.MonthViewHeaderData.lowerCount, 
			timeResolution: {
				unit: Date.MINUTE, 
				increment: 15
			}, 
			headerConfig: {
				middle: {
					unit: Date.HOUR, 
					//dateFormat: "G:i"
					renderer : function(start, end, cfg) {
						var viewStart = Dosb.CActivity.MonthViewHeaderData.start;
						var one_hour=3600000;
						var index = Math.floor((start - viewStart)/one_hour);
                        return Dosb.CActivity.MonthViewHeaderData.headers[index];
                    }
				}, 
				top: {
					unit: Date.DAY, 
					//dateFormat: "D d/m"
					cellGenerator : function(viewStart, viewEnd) {
                        var cells = [];
                        
                        // Simplified scenario, assuming view will always just show one US fiscal year
                        return [{
                            start : viewStart,
                            end : viewStart.add(Date.HOUR, Dosb.CActivity.MonthViewHeaderData.upperCount),
                            header : 'Upper Completion',
							align: 'center'
                        },{
                            start : viewStart.add(Date.HOUR, Dosb.CActivity.MonthViewHeaderData.upperCount),
                            end : viewEnd,
                            header : 'Lower Completion',
							align : 'center'
                        }];
                    }
				}
			}
		}		
	};
        
    var pm = Sch.PresetManager;

    for (var o in myCustomPresets) {
        if (myCustomPresets.hasOwnProperty(o)) {
            pm.registerPreset(o, myCustomPresets[o]);
        }
    }
})();
 
Dosb.CActivity.MonthView = Ext.extend(Ext.Panel, {
    frame: false,
    border: false,
    layout: 'fit',
	startDate: '2011-3-1',
	endDate: '2011-4-1',
    initComponent: function () {
        this.scheduler = this.createScheduler();
		// event editor popup window
		this.editorWindow = new  Dosb.CActivity.CActivityWindow({
			scheduler: this.scheduler
		});
		
        this.initSchedulerEvents();
        this.initStoreEvents();
		
        Ext.apply(this, {
            items: [this.scheduler]
        });

        this.scheduler.resourceStore.load();
        this.scheduler.eventStore.load();
		
        Dosb.CActivity.MonthView.superclass.initComponent.apply(this, arguments);
    },
	
	onEventDblClick: function (g, rec) {
		this.editorWindow.show(rec);
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
                    iconCls: 'silk-add',
                    handler : function(e) {
						var start = s.getStart();
						var click = s.dbClickData.date;			// date of pos when db clicked
						var rowIndex = s.dbClickData.rowIndex;	// row index when db clicked.
						var startTimeByHour = Math.floor((click - start)/3600000);
						var record = s.resourceStore.getAt(rowIndex);
						var eventRecord = new (s.eventStore.recordType)({
							ResourceId: record.get("RigActivityId"), 
							StartDate: new Date(start.getTime() + 3600000*startTimeByHour), 
							EndDate: new Date(start.getTime() + 3600000*(startTimeByHour+1)),
							RigName: record.get("RigName"),
							WellName: record.get("WellName"),
							AssemblyName: Dosb.CActivity.MonthViewHeaderData.headers[startTimeByHour]});
							
						s.onEventCreated(eventRecord);
						this.editorWindow.show(eventRecord);
					},
					scope: this
                }]
            });
        }
        s.ctxAddJob.showAt(pos);
    },

    // Don't show tooltip if editor is visible
    beforeTooltipShow: function (s, r) {
		return false; // don't show tooltip
        //return s.editor.collapsed;
    },
	
	afterEditorHide: function (p, a){
		var eventStore = this.scheduler.eventStore;
		eventStore.save();
		eventStore.commitChanges();
		return true;
	},
	
    initStoreEvents: function () {
        var s = this.scheduler;
        s.resourceStore.on({
            'beforeload': function (store, opt) {
                store.baseParams.startDate = '2011-3-1';
                store.baseParams.endDate = '2011-4-1';
				return true;
            }
		});
		
		s.eventStore.on({
			'update': function (store, bookingRecord, operation) {
				if (operation !== Ext.data.Record.EDIT && operation !== Ext.data.Record.COMMIT) return true;
				
				var company = bookingRecord.get("CompanyName");
				bookingRecord.set("BackgroundColor", Dosb.CActivity.CompanyColor[company].BackgroundColor);
				bookingRecord.set("TextColor", Dosb.CActivity.CompanyColor[company].TextColor);	

				//s.view.getElementFromEventRecord(bookingRecord).addClass('sch-fake-loading');
				// Simulate server delay 1.5 seconds
				//bookingRecord.commit();//.defer(1500, bookingRecord);
			},
			
            'beforeload': function (store, opt) {
                store.baseParams.startDate = this.startDate;
                store.baseParams.endDate = this.endDate;
				return true;
            }
		});
    },

    initSchedulerEvents: function () {
        var s = this.scheduler;

        s.on({
            eventcontextmenu : this.onEventContextMenu, 
            beforetooltipshow : this.beforeTooltipShow, 
			celldblclick : this.onCellDblClick,
			eventdblclick : this.onEventDblClick,
            scope : this
        });
		
		
		this.editorWindow.on({
			hide: this.afterEditorHide,
			//beforecollapse: this.beforeEditorCollapse,
			scope : this
		});
    },

    createScheduler: function () {
		// initialize the resource store.
		var resourceProxy = new Ext.data.HttpProxy({
			api: {
				read: '/RigActivity/GetByTimeSpan',
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
			'RigActivityId',
            { name: 'Id', mapping: 'RigActivityId'},
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
		
		var resourceWriter = new Ext.data.JsonWriter({
			encode: true,
			writeAllFields: false	
		});

		var resourceStore = new Ext.data.Store({
			id: 'ra',
			proxy: resourceProxy,
			reader: resourceReader,
			writer: resourceWriter,  // <-- plug a DataWriter into the store just as you would a Reader
			autoSave: false // <-- false would delay executing create, update, destroy requests until specifically told to do so with some [save] buton.
		});

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
				'AssemblyName',
				'RigName',
				'WellName',
				'BackgroundColor',
				'TextColor',
				'Comment'		
		]);
		
		var eventWriter = new Ext.data.JsonWriter({
			encode: true,
			writeAllFields: false
		});

		var eventStore = new Ext.data.Store({
			id: 'ca',
			proxy: eventProxy,
			reader: eventReader,
			writer: eventWriter,
			autoSave: false
		});
		
		var start = Dosb.CActivity.MonthViewHeaderData.start;
		
        return new Dosb.CActivity.MonthScheduler({
            rowHeight: 30,
			stripeRows: true,
            showTooltip: false,
			loadMask: true,
            resourceStore: resourceStore,
            eventStore: eventStore,
			enableDragCreation: false,
			enableEventDragDrop: false,
			resizeHandles: 'none',
			viewPreset: 'assembly2Day',
            startDate: start,
            endDate: start.add(Date.HOUR, Dosb.CActivity.MonthViewHeaderData.upperCount + Dosb.CActivity.MonthViewHeaderData.lowerCount)
        });
    }
});

Ext.reg('dosb-ca-mview', Dosb.CActivity.MonthView);