/*
 * Ext Scheduler 1.7
 * Copyright(c) 2009-2011 Mats Bryntse Consulting
 * mats@ext-scheduler.com
 * http://www.ext-scheduler.com/license.html
 *
 */
 
Ext.ns('Sch');

(function() {
    
    var myCustomPresets = {
		assembly2Day: {
			timeColumnWidth: 60, 
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
