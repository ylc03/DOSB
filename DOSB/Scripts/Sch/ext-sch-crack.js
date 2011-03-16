    function schedulerDiagnostics() {
        var b;
        if (console && console.log) {
            b = console.log;
        } else {
            if (!window.schedulerDebugWin) {
                window.schedulerDebugWin = new (Ext.Window)({height: 400, width: 500, bodyStyle: "padding:10px", closeAction: "hide", autoScroll: true});
            }
            window.schedulerDebugWin.show();
            schedulerDebugWin.update("");
            b = function (a) {schedulerDebugWin.update((schedulerDebugWin.body.dom.innerHTML || "") + a + ("<br/>"));};
        }
        var c = Ext.select(".sch-schedulerpanel");
        if (c.getCount() === 0) {
            b("No scheduler component found");
        }
        var s = Ext.getCmp(c.elements[0].id), resourceStore = s.getResourceStore(), eventS = s.getEventStore();
        b("Scheduler view start: " + s.getStart() + ", end: " + s.getEnd());
        if (!s.resourceStore) {
            b("No store configured");
            return;
        }
        if (!eventStore) {
            b("No event store configured");
            return;
        }
        b(resourceStore.getCount() + " records in the resource store");
        b(eventStore.getCount() + " records in the eventStore");
        b(Ext.select(s.eventSelector).getCount() + " events present in the DOM");
        if (eventStore.getCount() > 0) {
            if (!eventStore.getAt(0).get("StartDate") ||
                !(eventStore.getAt(0).get("StartDate") instanceof Date)) {
                b("The eventStore reader is misconfigured - The StartDate field is not setup correctly, please investigate");
                return;
            }
            if (!eventStore.getAt(0).get("EndDate") ||
                !(eventStore.getAt(0).get("EndDate") instanceof Date)) {
                b("The eventStore reader is misconfigured - The EndDate field is not setup correctly, please investigate");
                return;
            }
            if (!eventStore.fields.get("ResourceId")) {
                b("The eventStore reader is misconfigured - The ResourceId field is not present");
                return;
            }
            b("Records in the event store:");
            eventStore.each(function (r, i) {b(i + 1 + (". Start:" + r.get("StartDate") + ", End:" + r.get("EndDate") + ", ResourceId:" + r.get("ResourceId")));});
        } else {
            b("Event store has no data.");
        }
        if (resourceStore.getCount() > 0) {
            b("Records in the resource store:");
            resourceStore.each(function (r, i) {b(i + 1 + (". Id:" + r.get("Id")));return;});
            if (!resourceStore.fields.get("Id")) {
                b("The resource store reader is misconfigured - The Id field is not present");
                return;
            }
        } else {
            b("Resource store has no data.");
            return;
        }
        b("Everything seems to be setup ok!");
    }

    Ext.ns("Ext.ux.form");
    Ext.ux.form.DateTime = Ext.extend(Ext.form.Field, {defaultAutoCreate: {tag: "input", type: "hidden"}, timeWidth: 100, dtSeparator: " ", hiddenFormat: "Y-m-d H:i:s", otherToNow: true, timePosition: "right", dateFormat: "m/d/y", timeFormat: "g:i A", initComponent: function () {Ext.ux.form.DateTime.superclass.initComponent.call(this);var a = Ext.apply({}, {id: this.id + "-date", format: this.dateFormat || Ext.form.DateField.prototype.format, width: this.timeWidth, selectOnFocus: this.selectOnFocus, listeners: {blur: {scope: this, fn: this.onBlur}, focus: {scope: this, fn: this.onFocus}}}, this.dateConfig);this.df = new (Ext.form.DateField)(a);this.df.ownerCt = this;delete this.dateFormat;var b = Ext.apply({}, {id: this.id + "-time", format: this.timeFormat || Ext.form.TimeField.prototype.format, width: this.timeWidth, selectOnFocus: this.selectOnFocus, listeners: {blur: {scope: this, fn: this.onBlur}, focus: {scope: this, fn: this.onFocus}}}, this.timeConfig);this.tf = new (Ext.form.TimeField)(b);this.tf.ownerCt = this;delete this.timeFormat;this.relayEvents(this.df, ["focus", "specialkey", "invalid", "valid"]);this.relayEvents(this.tf, ["focus", "specialkey", "invalid", "valid"]);}, onRender: function (a, b) {if (this.isRendered) {return;}Ext.ux.form.DateTime.superclass.onRender.call(this, a, b);var t;if ("below" === this.timePosition || "bellow" === this.timePosition) {t = Ext.DomHelper.append(a, {tag: "table", style: "border-collapse:collapse", children: [{tag: "tr", children: [{tag: "td", style: "padding-bottom:1px", cls: "ux-datetime-date"}]}, {tag: "tr", children: [{tag: "td", cls: "ux-datetime-time"}]}]}, true);} else {t = Ext.DomHelper.append(a, {tag: "table", style: "border-collapse:collapse", children: [{tag: "tr", children: [{tag: "td", style: "padding-right:4px", cls: "ux-datetime-date"}, {tag: "td", cls: "ux-datetime-time"}]}]}, true);}this.tableEl = t;this.wrap = t.wrap({cls: "x-form-field-wrap"});this.wrap.on("mousedown", this.onMouseDown, this, {delay: 10});this.df.render(t.child("td.ux-datetime-date"));this.tf.render(t.child("td.ux-datetime-time"));if (Ext.isIE && Ext.isStrict) {t.select("input").applyStyles({top: 0});}this.on("specialkey", this.onSpecialKey, this);this.df.el.swallowEvent(["keydown", "keypress"]);this.tf.el.swallowEvent(["keydown", "keypress"]);if ("side" === this.msgTarget) {var c = this.el.findParent(".x-form-element", 10, true);this.errorIcon = c.createChild({cls: "x-form-invalid-icon"});this.df.errorIcon = this.errorIcon;this.tf.errorIcon = this.errorIcon;}this.el.dom.name = this.hiddenName || this.name || this.id;this.df.el.dom.removeAttribute("name");this.tf.el.dom.removeAttribute("name");this.isRendered = true;this.updateHidden();}, adjustSize: Ext.BoxComponent.prototype.adjustSize, alignErrorIcon: function () {this.errorIcon.alignTo(this.tableEl, "tl-tr", [2, 0]);}, initDateValue: function () {this.dateValue = this.otherToNow ? new Date : new Date(1970, 0, 1, 0, 0, 0);}, clearInvalid: function () {this.df.clearInvalid();this.tf.clearInvalid();}, markInvalid: function (a) {this.df.markInvalid(a);this.tf.markInvalid(a);}, beforeDestroy: function () {if (this.isRendered) {this.wrap.removeAllListeners();this.wrap.remove();this.tableEl.remove();this.df.destroy();this.tf.destroy();}}, disable: function () {if (this.isRendered) {this.df.disabled = this.disabled;this.df.onDisable();this.tf.onDisable();}this.disabled = true;this.df.disabled = true;this.tf.disabled = true;this.fireEvent("disable", this);return this;}, enable: function () {if (this.rendered) {this.df.onEnable();this.tf.onEnable();}this.disabled = false;this.df.disabled = false;this.tf.disabled = false;this.fireEvent("enable", this);return this;}, focus: function () {this.df.focus();}, getPositionEl: function () {return this.wrap;}, getResizeEl: function () {return this.wrap;}, getValue: function () {if (!this.dateValue) {return "";} else if (this.dateValue instanceof Date) {return this.dateValue;} else {return new Date(this.dateValue);}}, isValid: function () {return this.df.isValid() && this.tf.isValid();}, isVisible: function () {return this.df.rendered && this.df.getActionEl().isVisible();}, onBlur: function (f) {var a = String(this.startValue);if (this.wrapClick) {f.focus();this.wrapClick = false;}if (f === this.df) {this.updateDate();} else {this.updateTime();}this.updateHidden();(function () {if (!this.df.hasFocus && !this.tf.hasFocus) {var v = this.getValue();if (String(v) !== a) {this.fireEvent("change", this, v, this.startValue);}this.hasFocus = false;this.fireEvent("blur", this);}}.defer(100, this));}, onFocus: function () {if (!this.hasFocus) {this.hasFocus = true;this.startValue = this.getValue();this.fireEvent("focus", this);}}, onMouseDown: function (e) {if (!this.disabled) {this.wrapClick = "td" === e.target.nodeName.toLowerCase();}}, onSpecialKey: function (t, e) {var a = e.getKey();if (a === e.TAB) {if (t === this.df && !e.shiftKey) {e.stopEvent();this.tf.focus();}if (t === this.tf && e.shiftKey) {e.stopEvent();this.df.focus();}}if (a === e.ENTER) {this.updateValue();}}, setDate: function (a) {this.df.setValue(a);}, setTime: function (a) {this.tf.setValue(a);}, setSize: function (w, h) {if (!w) {return;}if ("below" === this.timePosition) {this.df.setSize(w, h);this.tf.setSize(w, h);if (Ext.isIE) {this.df.el.up("td").setWidth(w);this.tf.el.up("td").setWidth(w);}} else {this.df.setSize(w - this.timeWidth - 4, h);this.tf.setSize(this.timeWidth, h);if (Ext.isIE) {this.df.el.up("td").setWidth(w - this.timeWidth - 4);this.tf.el.up("td").setWidth(this.timeWidth);}}}, setValue: function (a) {if (!a && true === this.emptyToNow) {this.setValue(new Date);return;} else if (!a) {this.setDate("");this.setTime("");this.updateValue();return;}if ("number" === typeof a) {a = new Date(a);} else if ("string" === typeof a && this.hiddenFormat) {a = Date.parseDate(a, this.hiddenFormat);}a = a ? a : new Date(1970, 0, 1, 0, 0, 0);var b, time;if (a instanceof Date) {this.setDate(a);this.setTime(a);this.dateValue = a;} else {b = a.split(this.dtSeparator);this.setDate(b[0]);if (b[1]) {if (b[2]) {b[1] += b[2];}this.setTime(b[1]);}}this.updateValue();}, setVisible: function (a) {if (a) {this.df.show();this.tf.show();} else {this.df.hide();this.tf.hide();}return this;}, show: function () {return this.setVisible(true);}, hide: function () {return this.setVisible(false);}, updateDate: function () {var d = this.df.getValue();if (d) {if (!(this.dateValue instanceof Date)) {this.initDateValue();if (!this.tf.getValue()) {this.setTime(this.dateValue);}}this.dateValue.setMonth(0);this.dateValue.setFullYear(d.getFullYear());this.dateValue.setMonth(d.getMonth(), d.getDate());} else {this.dateValue = "";this.setTime("");}}, updateTime: function () {var t = this.tf.getValue();if (t && !(t instanceof Date)) {t = Date.parseDate(t, this.tf.format);}if (t && !this.df.getValue()) {this.initDateValue();this.setDate(this.dateValue);}if (this.dateValue instanceof Date) {if (t) {this.dateValue.setHours(t.getHours());this.dateValue.setMinutes(t.getMinutes());this.dateValue.setSeconds(t.getSeconds());} else {this.dateValue.setHours(0);this.dateValue.setMinutes(0);this.dateValue.setSeconds(0);}}}, updateHidden: function () {if (this.isRendered) {var a = this.dateValue instanceof Date ? this.dateValue.format(this.hiddenFormat) : "";this.el.dom.value = a;}}, updateValue: function () {this.updateDate();this.updateTime();this.updateHidden();return;}, validate: function () {return this.df.validate() && this.tf.validate();}, renderer: function (c) {var d = c.editor.dateFormat || Ext.ux.form.DateTime.prototype.dateFormat;d += " " + (c.editor.timeFormat || Ext.ux.form.DateTime.prototype.timeFormat);var e = function (a) {var b = Ext.util.Format.date(a, d);return b;};return e;}});
    Ext.reg("xdatetime", Ext.ux.form.DateTime);
    Ext.override(Ext.form.TimeField, {reconfigure: function (a, b, c) {if (typeof this.minValue == "string") {this.minValue = this.parseDate(this.minValue);}if (typeof this.maxValue == "string") {this.maxValue = this.parseDate(this.maxValue);}this.increment = c;var d = this.parseDate(this.minValue);if (!d) {d = (new Date(this.initDate)).clearTime();}var e = this.parseDate(this.maxValue);if (!e) {e = (new Date(this.initDate)).clearTime().add("mi", 1439);}var f = [];while (d <= e) {f.push([d.dateFormat(this.format)]);d = d.add("mi", this.increment);}this.store.loadData(f);}});
    
	Ext.ns("Sch");
    Sch.AbstractSchedulerPanel = Ext.extend(Ext.grid.EditorGridPanel, {resizeHandles: "end", rowHeight: 22, weekStartDay: 1, snapToIncrement: false, readOnly: false, viewOrientation: "horizontal", viewPreset: "weekAndDay", eventBorderWidth: 2, enableColLock: false, trackMouseOver: false, columnLines: true, cmpCls: undefined, eventSelector: undefined, overClass: "sch-event-hover", resizeHandleHtml: "<div class=\"x-resizable-handle sch-resizable-handle-{0}\"></div>", setReadOnly: function (a) {this.readOnly = a;this.el[a ? "addClass" : "removeClass"](this.cmpCls + "-readonly");}, setTimeColumnWidth: function (a) {this.timeColumnWidth = a;this.getView().updateTimeColumnWidths();}, getEventRecordFromDomId: function (a) {throw "Abstract method call";}, getEventIdFromDomNodeId: function (a) {return a.substring(this.eventPrefix.length);}, getXYFromDate: function (a) {return this.view.getXYFromDate(a);}, getDateFromDomEvent: function (e, a) {return this.getDateFromXY(e.getXY(), a);}, getDateFromX: function (x, a) {return this.getDateFromXY([x, 0], a);}, getDateFromXY: function (a, b) {var c = this.view.getDateFromXY(a);if (c && b) {c = this[b + "Date"](c);}return c;}, roundDate: function (a) {return this.timeAxis.roundDate(a);}, floorDate: function (a) {return this.timeAxis.floorDate(a);}, ceilDate: function (a) {return this.timeAxis.ceilDate(Date);}, getFormattedDate: function (a) {return a.format(this.getDisplayDateFormat());}, getFormattedEndDate: function (a, b) {var c = this.timeAxis, resUnit = c.getResolution().unit;if (resUnit in this.largeUnits && a.getHours() === 0 && a.getMinutes() === 0 && !(a.getYear() === b.getYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate())) {a = a.add(Date.DAY, -1);}return a.format(this.getDisplayDateFormat());}, getTimeResolution: function () {return this.timeAxis.getResolution();}, setTimeResolution: function (a, b) {this.timeAxis.setResolution(a, b);if (this.snapToIncrement) {this.getView().refresh(true);}}, onDestroy: function () {if (this.tip) {this.tip.destroy();}if (this.eventStore.autoDestroy) {this.eventStore.destroy();}Sch.AbstractSchedulerPanel.superclass.onDestroy.call(this);}, afterRender: function () {Sch.AbstractSchedulerPanel.superclass.afterRender.apply(this, arguments);this.el.addClass(this.cmpCls + (" sch-" + this.viewOrientation));if (this.readOnly) {this.el.addClass(this.cmpCls + "-readonly");}var a = this.getView();this.relayEvents(a, ["timeheaderdblclick"]);if (this.overClass) {this.mon(this.getView().mainBody, {mouseover: this.onMouseOver, mouseout: this.onMouseOut, scope: this});}this.setupScheduleEvents();}, setupScheduleEvents: function () {this.mon(this.getView().mainBody, {click: function (e) {var t = e.getTarget("td.sch-timetd", 2);if (t) {var a = this.getDateFromDomEvent(e, "floor");this.fireEvent("scheduleclick", this, a, this.view.findRowIndex(t), e);}}, dblclick: function (e) {var t = e.getTarget("td.sch-timetd", 2);if (t) {var a = this.getDateFromDomEvent(e, "floor");this.fireEvent("scheduledblclick", this, a, this.view.findRowIndex(t), e);}}, contextmenu: function (e) {var t = e.getTarget("td.sch-timetd", 2);if (t) {var a = this.getDateFromDomEvent(e, "floor");this.fireEvent("schedulecontextmenu", this, a, this.view.findRowIndex(t), e);}}, scope: this}, this);}, switchViewPreset: function (a, b, c, d) {if (this.fireEvent("beforeviewchange", this) !== false) {if (Ext.isString(a)) {a = Sch.PresetManager.getPreset(a);}if (!a) {throw "View preset not found";}Ext.apply(this, a);var e = {unit: this.getSmallestHeaderUnit(), increment: this.getSmallestHeaderIncrement(), resolutionUnit: this.timeResolution.unit, resolutionIncrement: this.timeResolution.increment, weekStartDay: this.weekStartDay, mainUnit: this.getTimelineUnit(), defaultSpan: this.defaultSpan || 1};if (d) {if (!this.timeAxis) {this.timeAxis = new (Sch.TimeAxis);}e.start = b || new Date;e.end = c;this.timeAxis.on("reconfigure", this.onTimeAxisReconfigure, this);} else {e.start = b || this.timeAxis.getStart();e.end = c;}this.timeAxis.reconfigure(e);}}, onTimeAxisReconfigure: function () {this.fireEvent("viewchange", this);}, getShiftIncrement: function () {return this.shiftIncrement || 1;}, getStart: function () {return this.timeAxis.getStart();}, getEnd: function () {return this.timeAxis.getEnd();}, onMouseOver: function (e) {var a = e.getTarget(this.eventSelector, this.view.cellSelectorDepth);if (a && a !== this.lastItem) {this.lastItem = a;Ext.fly(a).addClass(this.overClass);}}, onMouseOut: function (e) {if (this.lastItem) {if (!e.within(this.lastItem, true, true)) {Ext.fly(this.lastItem).removeClass(this.overClass);delete this.lastItem;}}}, setSnapEnabled: function (a) {this.snapToIncrement = a;if (a) {this.getView().refresh(true);}}, initComponent: function () {if (!this.viewPreset) {throw "You must define a valid view preset object. See sch.basicviewpresets.js for reference";}this.switchViewPreset(this.viewPreset, this.startDate, this.endDate, true);var b = {};b[Date.DAY] = null;b[Date.WEEK] = null;b[Date.MONTH] = null;b[Date.QUARTER] = null;b[Date.YEAR] = null;Ext.applyIf(this, {columns: [], viewOrientation: this.viewOrientation, eventPrefix: this.id + "-ev-", largeUnits: b});if (Ext.isArray(this.columns) && !this.colModel) {if (this.columns.length > 0 && this.columns[0].locked) {this.colModel = new (Ext.ux.grid.LockingColumnModel)(this.columns);delete this.columns;}}Sch.AbstractSchedulerPanel.superclass.initComponent.call(this);if (this.viewOrientation === "horizontal") {Ext.each(this.getColumnModel().config, function (a) {a.setEditor = Ext.emptyFn;});}}, constructor: function (a) {this.addEvents("beforetooltipshow", "beforeviewchange", "viewchange", "timeheaderdblclick", "scheduleclick", "scheduledblclick", "schedulecontextmenu");Sch.AbstractSchedulerPanel.superclass.constructor.call(this, a);}, getShiftUnit: function () {return this.shiftUnit || this.getTimelineUnit();}, getShiftIncrement: function () {return this.shiftIncrement || 1;}, getTimeColumnWidth: function () {return this.timeColumnWidth || 100;}, getDisplayDateFormat: function () {return this.displayDateFormat;}, getHeaderConfig: function () {return this.headerConfig;}, getTimelineUnit: function () {return this.headerConfig.middle.unit;}, getTimelineIncrement: function () {return this.headerConfig.middle.increment || 1;}, getSmallestHeaderUnit: function () {return this.headerConfig.bottom ? this.headerConfig.bottom.unit : this.headerConfig.middle.unit;}, getSmallestHeaderIncrement: function () {return (this.headerConfig.bottom ? this.headerConfig.bottom.increment : this.headerConfig.middle.increment) || 1;}, getRowHeight: function () {return this.rowHeight;}, setRowHeight: function (a) {this.rowHeight = a;this.getView().setRowHeight(a);if (this.viewReady) {this.view.refresh();}}, getViewOrientation: function () {return this.viewOrientation;}, shiftNext: function (a) {a = a || this.getShiftIncrement();var b = this.getShiftUnit();this.setTimeSpan(this.getStart().add(b, a), this.getEnd().add(b, a));}, shiftPrevious: function (a) {a = - (a || this.getShiftIncrement());var b = this.getShiftUnit();this.setTimeSpan(this.getStart().add(b, a), this.getEnd().add(b, a));}, goToNow: function () {this.setTimeSpan(new Date);}, setTimeSpan: function (a, b) {if (this.timeAxis) {this.timeAxis.setTimeSpan(a, b);}}, setStart: function (a) {this.setTimeSpan(a);}, setEnd: function (a) {this.setTimeSpan(null, a);}});
    Ext.ns("Sch");
    Sch.PresetManager = Ext.apply(new (Ext.util.MixedCollection), {registerPreset: function (a, b) {if (!this.containsKey(a)) {this.add(a, b);} else {return false;}}, getPreset: function (a) {return this.get(a);}, deletePreset: function (a) {this.removeKey(a);}});
    Ext.apply(Date.prototype, {betweenLesser: function (a, b) {var t = this.getTime();return a.getTime() <= t && t < b.getTime();}, add: function (a, b) {var d = this.clone();if (!a || b === 0) {return d;}switch (a.toLowerCase()) {case Date.MILLI:d.setMilliseconds(this.getMilliseconds() + b);break;case Date.SECOND:d.setSeconds(this.getSeconds() + b);break;case Date.MINUTE:d.setMinutes(this.getMinutes() + b);break;case Date.HOUR:d.setHours(this.getHours() + b);break;case Date.DAY:d.setDate(this.getDate() + b);break;case Date.WEEK:d.setDate(this.getDate() + b * 7);break;case Date.MONTH:var c = this.getDate();if (c > 28) {c = Math.min(c, this.getFirstDateOfMonth().add("mo", b).getLastDateOfMonth().getDate());}d.setDate(c);d.setMonth(this.getMonth() + b);break;case Date.QUARTER:d = d.add(Date.MONTH, 3);break;case Date.YEAR:d.setFullYear(this.getFullYear() + b);break;default:;}return d;}});
	
    Ext.applyIf(Date, {
		getUnitToBaseUnitRatio: function (a, b) {
			if (a === b) {return 1;}
			switch (a) {
				case Date.YEAR:
					switch (b) {
						case Date.QUARTER: return 4; break;
						case Date.MONTH: return 12;break;
						default:;
					}
					break;
				case Date.QUARTER:
					switch (b) {
						case Date.YEAR:return 0.3333333333333333;break;
						case Date.MONTH:return 3;
						break;default:;
					}
					break;
				case Date.MONTH:
					switch (b) {
						case Date.YEAR:return 12;break;
						case Date.QUARTER:return 3;break;
						case Date.DAY: return 0.03333333333333333;break;
						default:;
					}
					break;
				case Date.WEEK:
					switch (b) {
						case Date.DAY:return 0.14285714285714285;break;
						case Date.HOUR:return 0.005952380952380952;break;
						default:;
					}
					break;
				case Date.DAY:
					switch (b) {
						case Date.WEEK:return 7;break;
						case Date.HOUR:return 0.041666666666666664;break;
						case Date.MINUTE:return 0.0006944444444444445;break;
						default:;
					}
					break;
				case Date.HOUR:
					switch (b) {
						case Date.DAY:return 24;break;
						case Date.MINUTE:return 0.016666666666666666;break;
						default:;
					}
					break;
				case Date.MINUTE:
					switch (b) {
						case Date.HOUR:return 60;break;
						case Date.SECOND:return 0.016666666666666666;break;
						case Date.MILLI:return 0.000016666666666666667;break;
						default:;
					}
					break;
				case Date.SECOND:
					switch (b) {
						case Date.MILLI:return 0.001;break;
						default:;
					}
					break;
				default:;
			}
			return -1;
		}, 
		getDurationInMilliseconds: function (a, b) {return b - a;}, getDurationInSeconds: function (a, b) {return (b - a) / 1000;}, getDurationInMinutes: function (a, b) {return (b - a) / 60000;}, getDurationInHours: function (a, b) {return (b - a) / 3600000;}, getDurationInDays: function (a, b) {return (b - a) / 86400000;}, getDurationInBusinessDays: function (a, b) {var c = Math.round((b - a) / 86400000), nbrBusinessDays = 0, d;for (var i = 0; i < c; i++) {d = a.add(Date.DAY, i).getDay();if (d !== 6 && d !== 0) {nbrBusinessDays++;}}return nbrBusinessDays;}, getDurationInMonths: function (a, b) {return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());}, getDurationInYears: function (a, b) {return Date.getDurationInMonths(a, b) / 12;}, min: function (a, b) {return a < b ? a : b;}, max: function (a, b) {return a > b ? a : b;}, intersectSpans: function (a, b, c, d) {return a.betweenLesser(c, d) || c.betweenLesser(a, b);}, WEEK: "w", QUARTER: "q"});
    Ext.applyIf(Date, {compareUnits: function () {var c = [Date.MILLI, Date.SECOND, Date.MINUTE, Date.HOUR, Date.DAY, Date.WEEK, Date.MONTH, Date.QUARTER, Date.YEAR], ind1, ind2;return function (a, b) {ind1 = c.indexOf(a);ind2 = c.indexOf(b);return ind1 > ind2 ? 1 : ind1 < ind2 ? -1 : 0;};}()});
    
	Ext.override(Ext.data.Record, {
		set: function (a, b) {
			var c = Ext.isPrimitive(b) ? String : Ext.encode;
			if (c(this.data[a]) == c(b)) {return;}
			this.dirty = true;
			if (!this.previous) {this.previous = {};}
			this.previous[a] = this.data[a];
			if (!this.modified) {this.modified = {};}
			if (this.modified[a] === undefined) {this.modified[a] = this.data[a];}
			this.data[a] = b;if (!this.editing) {this.afterEdit();}
		}, 
		afterEdit: function () {
			if (this.store) {this.store.afterEdit(this, this.previous);}
			delete this.previous;
		}, 
		reject: function (a) {
			var m = this.modified, current = {};
			for (var n in m) {
				if (typeof m[n] != "function") {current[n] = this.data[n];this.data[n] = m[n];}
			}
			delete this.modified;
			this.dirty = false;
			this.editing = false;
			if (a !== true) {this.afterReject(current);}
		},
		afterReject: function (a) {if (this.store) {this.store.afterReject(this, a);}}
	});
    Ext.override(Ext.data.Store, {
		afterEdit: function (a, b) {
			if (this.modified.indexOf(a) == -1) {
				this.modified.push(a);
			}
			this.fireEvent("update", this, a, Ext.data.Record.EDIT, b);
		}, 
		afterReject: function (a, b) {
			this.modified.remove(a);
			this.fireEvent("update", this, a, Ext.data.Record.REJECT, b);
		}
	});
    Ext.override(Ext.dd.DragZone, {destroy: Ext.dd.DragZone.prototype.destroy.createInterceptor(function () {if (this.containerScroll) {Ext.dd.ScrollManager.unregister(this.el);}})});
    Ext.getMajorVersion = function () {return Math.abs(this.version.split(".")[0]);};
    Ext.getMinorVersion = function () {return Math.abs(this.version.split(".")[1]);};
    Ext.getRevision = function () {return Math.abs(this.version.split(".")[2]);};
    Ext.ns("Sch");
    Sch.AbstractSchedulerView = Ext.extend(Ext.grid.GridView, {
        cellSelectorDepth: 6,
        managedEventLayout: true,
        rowSelectorDepth: 11,
        barMargin: 1,
        trackMouseInTimeHeader: false,
        translateToScheduleCoordinate: function () { throw "Abstract method call"; },
        translateToPageCoordinate: function (a) {
            return [a[0] + this.mainBody.getLeft(),
					a[1] + this.mainBody.getTop()];
        },
        setBarMargin: function (a, b) { this.barMargin = a; if (!b) { this.refresh(); } },
        rowPosRe: new RegExp("sch-header-row-([^\\s]+)"),
        initTemplates: function () {
            this.templates = this.templates || {};
            var a = this.templates;
            if (!a.header) {
                a.header = new (Ext.Template)("<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"{tstyle}\" class=\"sch-header-row-{tclass}\">", "<thead>", "<tr class=\"x-grid3-hd-row\">{cells}</tr>", "</thead>", "</table>");
            }
            if (!a.gcell) {
                a.gcell = new (Ext.XTemplate)("<td class=\"x-grid3-hd x-grid3-gcell x-grid3-td-{id} ux-grid-hd-group-row-{row} {cls}\" style=\"{style}\">", "<div {tooltip} class=\"x-grid3-hd-inner x-grid3-hd-{id}\" unselectable=\"on\" style=\"{istyle}\">", "{value}</div></td>");
            }
            Sch.AbstractSchedulerView.superclass.initTemplates.call(this);
        },
        getColumnHeaderCls: function (i, a) {
            var b = i === 0 ? "x-grid3-cell-first " : i == a ? "x-grid3-cell-last " : "";
            return b + (this.cm.config[i].headerCls || "");
        },
        getAccumulatedColumnWidth: function (a, b) {
            var c = this.cm, w = 0, i;
            for (i = a; i < b; i++) {
                if (!c.isHidden(i)) {
                    w += c.getColumnWidth(i);
                }
            }
            return w;
        },
        getNumberOfTimeColumns: function () {
            return this.cm.getColumnCount() - this.rightColumns.length - this.leftColumns.length;
        },
        getLastTimeColumnIndex: function () { return this.cm.getColumnCount() - this.rightColumns.length - 1; },
        getSingleUnitInPixels: function (a) {
            return Date.getUnitToBaseUnitRatio(this.getColumnModelUnit(), a)
											 * this.cm.getColumnWidth(this.leftColumns.length);
        },
        getScheduleSectionWidth: function () {
            return this.cm.getTotalWidth() - this.getLeftSectionWidth() - this.getRightSectionWidth();
        },
        getLeftSectionWidth: function () {
            return this.getAccumulatedColumnWidth(0, this.leftColumns.length);
        },
        getRightSectionWidth: function () {
            var a = this.cm.getColumnCount();
            return this.getAccumulatedColumnWidth(a - this.rightColumns.length, a);
        },
        resolveHeaderGroupCell: function (a) {
            var b = a.className;
            if (b) {
                var c;
                if (b.match(/ux-grid-hd-group-row-top/)) { c = "top"; }
                else { c = "middle"; }
                return { position: c, index: b.match(this.colRe)[1] };
            }
        },
        onHeaderDoubleClick: function (g, a, e) {
            var t = e.getTarget(".sch-timeheader");
            if (!t) { return; }
            var b = !!t.className.match("ux-grid-hd-group-cell"),
				headerCfg,
				cm = g.getColumnModel();
            if (b) {
                var c = this.resolveHeaderGroupCell(e.getTarget(".x-grid3-hd"));
                headerCfg = this.headerRows[c.position][c.index];
            } else {
                headerCfg = this.timeAxis.getAt(a - this.leftColumns.length);
            }
            this.fireEvent("timeheaderdblclick", this, headerCfg.start, headerCfg.end, e);
        },
        handleHdMove: Ext.grid.GridView.prototype.handleHdMove.createInterceptor(function (e) {
            return !e.getTarget(".ux-grid-hd-group-cell");
        }),
        getScheduleRegion: function (a) {
            var b = a ? Ext.fly(this.getCell(this.ds.indexOf(a), this.leftColumns.length)).getRegion()
				: this.mainBody.getRegion(),
				taStart = this.timeAxis.getStart(),
				taEnd = this.timeAxis.getEnd(),
				availability = this.grid.getResourceAvailability(a) || { start: taStart, end: taEnd },
				cm = this.cm,
				left = this.translateToPageCoordinate([this.getXFromDate(Date.max(taStart, availability.start)), 0])[0],
				right = this.translateToPageCoordinate([this.getXFromDate(Date.min(taEnd, availability.end)), 0])[0],
				top = b.top + this.barMargin,
				bottom = b.bottom - this.barMargin;
            return new (Ext.lib.Region)(top, right, bottom, left);
        },
        getTimeSpanRegion: function (a, b) {
            var c = this.getXFromDate(a),
				endX = this.getXFromDate(b || a);
            return new (Ext.lib.Region)(0, endX, this.mainBody.getHeight(), c);
        },
        scrollEventIntoView: function (a, b) {
            var c = this.getElementFromEventRecord(a);
            if (c) {
                c.scrollIntoView(this.scroller);
                if (b) {
                    if (typeof b === "boolean") { c.highlight(); }
                    else { c.highlight(null, b); }
                }
            }
        },
        onHeaderClick: Ext.grid.GridView.prototype.onHeaderClick.createInterceptor(function (g, a, e) {
            return !e.getTarget(".ux-grid-hd-group-cell") && !e.getTarget(".ux-grid-hd-nogroup-cell");
        }),
        calculateTimeColumnWidth: function (a) {
            var w = 0,
				nbrTimeColumns = this.getNumberOfTimeColumns();
            if (this.grid.snapToIncrement) {
                var b = this.getColumnModelUnit(),
					res = this.timeAxis.getResolution(),
					unit = res.unit,
					resIncr = res.increment,
					ratio = Date.getUnitToBaseUnitRatio(b, unit) * resIncr;
                w = this.forceFit ? Math.floor(this.getAvailableWidthForSchedule() / nbrTimeColumns) : a;
                if (!this.forceFit || ratio < 1) {
                    w = Math.floor(ratio * w) / ratio;
                }
            } else {
                w = this.forceFit ? Math.floor(this.getAvailableWidthForSchedule() / nbrTimeColumns) : a;
            } return w;
        },
        fitColumns: function (a) {
            var b = this.cm,
				nbrToFit = this.getNumberOfTimeColumns(),
				proposedWidth = Math.floor(this.getAvailableWidthForSchedule() / nbrToFit),
				w = this.calculateTimeColumnWidth(proposedWidth);
            for (var i = 0; i < nbrToFit; i++) {
                b.setColumnWidth(i + this.leftColumns.length, w, true);
            }
            if (a !== true) {
                this.updateAllColumnWidths();
            }
        },
        getElementFromEventRecord: function (a) {
            return Ext.get(this.grid.eventPrefix + a.id);
        },
        isTimeHeaderCell: function (t) {
            return !!Ext.fly(t).up("td.sch-timeheader");
        },
        getLeftGroupWidth: function (a) {
            var b = this.getAccumulatedColumnWidth(0, this.leftColumns.length);
            return Ext.isBorderBox || Ext.isWebKit && !Ext.isSafari2 ? b : Math.max(b - this.borderWidth, 0);
        },
        getRightGroupWidth: function (a) {
            var b, colCount = this.cm.getColumnCount();
            if (this.rightColumns.length) {
                b = this.getAccumulatedColumnWidth(colCount - this.rightColumns.length, colCount);
                return Ext.isBorderBox || Ext.isWebKit && !Ext.isSafari2 ? b : Math.max(b - this.borderWidth, 0);
            } else { return 0; }
        },
        handleHdOver: function (e, t) {
            var a = this.findHeaderCell(t);
            if (a && !this.headersDisabled) {
                this.activeHdRef = t;
                this.activeHdIndex = this.getCellIndex(a);
                var b = this.fly(a);
                this.activeHdRegion = b.getRegion();
                if (this.isTimeHeaderCell(t)) {
                    if (this.trackMouseInTimeHeader) {
                        b.addClass("x-grid3-hd-over");
                        if (!this.cm.isMenuDisabled(this.activeHdIndex)) {
                            this.activeHdBtn = b.child(".x-grid3-hd-btn");
                            if (this.activeHdBtn) {
                                this.activeHdBtn.dom.style.height = a.firstChild.offsetHeight - 1 + "px";
                            }
                        }
                    }
                } else {
                    if (!this.cm.isMenuDisabled(this.activeHdIndex)) {
                        b.addClass("x-grid3-hd-over");
                        this.activeHdBtn = b.child(".x-grid3-hd-btn");
                        if (this.activeHdBtn) {
                            this.activeHdBtn.dom.style.height = a.firstChild.offsetHeight - 1 + "px";
                        }
                    }
                }
            }
        },
        resolveColumnIndex: function (x) {
            var a = this.cm,
                index = -1,
                totalWidth = this.getLeftSectionWidth(),
                colWidth;
            if (x >= totalWidth) {
                for (index = this.leftColumns.length, lastIndex = a.getColumnCount() - 1; index < lastIndex; index++) {
                    if (!a.isHidden(index)) {
                        colWidth = a.getColumnWidth(index);
                        if (x >= totalWidth && x <= totalWidth + colWidth) { break; }
                        totalWidth += colWidth;
                    }
                }
            }
            return index;
        },
        onColumnWidthUpdated: function () {
            Sch.AbstractSchedulerView.superclass.onColumnWidthUpdated.apply(this, arguments);
            this.updateGroupStyles();
        },
        onAllColumnWidthsUpdated: function () {
            Sch.AbstractSchedulerView.superclass.onAllColumnWidthsUpdated.apply(this, arguments);
            this.updateGroupStyles();
        },
        onColumnHiddenUpdated: function () {
            Sch.AbstractSchedulerView.superclass.onColumnHiddenUpdated.apply(this, arguments);
            this.updateGroupStyles();
        },
        getHeaderCell: function (a) {
            return this.mainHd.query(this.cellSelector)[a];
        },
        findHeaderCell: function (a) {
            return a ? this.fly(a).findParent("td.x-grid3-hd", this.cellSelectorDepth) : false;
        },
        findHeaderIndex: function (a) {
            var b = this.findHeaderCell(a); return b ? this.getCellIndex(b) : false;
        },
        getXYFromDate: function (a) {
            return [this.getXFromDate(a), 0];
        },
        getXFromDate: function (a) {
            var x = -1,
				tick = this.timeAxis.getTickFromDate(a);
            if (tick >= 0) {
                var b = this.leftColumns.length + Math.floor(tick),
					colWidth = this.getAccumulatedColumnWidth(0, b);
                x = colWidth + (b < this.cm.getColumnCount() ? this.cm.getColumnWidth(b) * (tick - Math.floor(tick))
					: 0);
            }
            return x;
        },
        getDateFromXY: function (a) {
            return this.getDateFromX(a[0]);
        },
        getDateFromX: function (x) {
            x = this.translateToScheduleCoordinate(x);
            var a = this.resolveColumnIndex(x),
				tick = a - this.leftColumns.length,
				maxCol = this.getNumberOfTimeColumns() + this.leftColumns.length;
            if (tick < 0 || a > maxCol) { return null; }
            else {
                var b = x - this.getAccumulatedColumnWidth(0, a);
                if (a < maxCol) {
                    tick += Math.min(1, b / this.cm.getColumnWidth(this.leftColumns.length));
                } else if (b > 2) { return null; }
                return this.timeAxis.getDateFromTick(tick);
            }
        },
        getHeaderRowCells: function (a) {
            var b = this.getLeftGroupWidth(),
				rightGroupWidth = this.getRightGroupWidth(),
				r = this.headerRows[a],
				cells = [], cls, group, ts = this.templates,
				headerConfig = this.grid.getHeaderConfig();
            for (i = 0, len = r.length; i < len; i++) {
                group = r[i];
                if (i === 0 && b) { width = b; cls = ""; }
                else if (rightGroupWidth && i === len - 1) { width = rightGroupWidth; cls = ""; }
                else {
                    width = this.getHeaderGroupCellWidth(group.start, group.end,
														 headerConfig[a].unit, headerConfig[a].increment || 1);
                    cls = "sch-timeheader ";
                }
                cells[i] = ts.gcell.apply({
                    cls: cls + (group.headerCls || "") + (group.header ? " ux-grid-hd-group-cell" : " ux-grid-hd-nogroup-cell"),
                    id: i,
                    row: a,
                    style: "width:" + width + "px;" + (group.align ? "text-align:" + group.align + ";" : ""),
                    istyle: group.align == "right" ? "padding-right:16px" : "",
                    value: group.header || "&#160;"
                });
            }
            return cells;
        },
        getHeaderGroupCellWidth: function (a, b, c, d) {
            var e = this.grid.getHeaderConfig(),
				baseUnit = this.getColumnModelUnit(),
				baseIncrement = this.getColumnModelIncrement(),
				timeSpanInBaseUnit = 1,
				width;
            if (c !== baseUnit) {
                timeSpanInBaseUnit = Sch.ColumnFactory.getHeaderRowUnitInBaseUnit(a, b, c, baseUnit) * d
									/ baseIncrement;
            }
            width = timeSpanInBaseUnit * this.cm.getColumnWidth(this.leftColumns.length);
            if (!(Ext.isBorderBox || Ext.isWebKit && !Ext.isSafari2)) { width -= 2; }
            return width;
        },
        getColumnModelUnit: function () {
            var a = this.grid.getHeaderConfig();
            return a.bottom ? a.bottom.unit : a.middle.unit;
        },
        getColumnModelIncrement: function () {
            var a = this.grid.getHeaderConfig();
            return (a.bottom ? a.bottom.increment : a.middle.increment) || 1;
        },
        updateColumnModel: function (a) {
            if (!this.isValidHeaderConfig()) { throw "Invalid header configuration, please check your header definition"; }
            var g = this.grid,
				proposedTimeColumnWidth = g.getTimeColumnWidth(),
				headerConfig = g.getHeaderConfig(),
				ta = this.timeAxis,
				start = ta.getStart(),
				end = ta.getEnd(),
				colDefaults = {
				    renderer: this.timeColumnRenderer,
				    scope: this,
				    width: this.calculateTimeColumnWidth(proposedTimeColumnWidth)
				},
				columnConfig = Sch.ColumnFactory.createColumns(this.timeAxis, headerConfig, colDefaults),
				headerRows = columnConfig.headerRows;
            if (headerRows) {
                for (var r in headerRows) {
                    if (headerRows.hasOwnProperty(r)) {
                        if (this.leftColumns.length > 0) {
                            headerRows[r].unshift({ colspan: this.leftColumns.length });
                        }
                        if (this.rightColumns.length > 0) {
                            headerRows[r].push({ colspan: this.rightColumns.length });
                        }
                    }
                }
            }
            Ext.apply(this, { headerRows: headerRows });
            Ext.each(this.rightColumns, function (c) { delete c.id; });
            this.cm.setConfig(this.leftColumns.concat(columnConfig.columns).concat(this.rightColumns), a);
        },
        getSnapPixelAmount: function () {
            if (this.grid.snapToIncrement) {
                var a = this.timeAxis.getResolution();
                return (a.increment || 1) * this.getSingleUnitInPixels(a.unit);
            } else { return 1; }
        },
        isValidHeaderConfig: function () {
            var a = this.grid.getHeaderConfig(),
				valid = true;
            if (a.bottom && Date.compareUnits(a.bottom.unit, a.middle.unit) > 0) { valid = false; }
            if (a.top && Date.compareUnits(a.middle.unit, a.top.unit) > 0) { valid = false; } return valid;
        },
        setRowHeight: function (a) { this.rowHeight = a; },
        initializeColumns: function () {
            var a = this.cm,
				cfg = a.config,
				nbrColumns = cfg.length,
				dividerIndex = -1;
            for (var i = 0; i < nbrColumns; i++) {
                if (cfg[i].position && cfg[i].position === "right") { dividerIndex = i; break; }
            }
            if (dividerIndex >= 0) {
                this.rightColumns = cfg.slice(dividerIndex, nbrColumns);
            } else {
                this.rightColumns = [];
            }
            this.leftColumns = cfg.slice(0, dividerIndex >= 0 ? dividerIndex : nbrColumns);
        },
        onSchedulerRender: function () {
            if (this.columnDrop) {
                Ext.apply(this.columnDrop, {
                    getTargetFromEvent: this.columnDropGetTargetFromEvent.createDelegate(this)
                });
            }
            if (this.columnDrag) {
                this.columnDrag.onBeforeDrag = function (a, e) {
                    return !e.getTarget(".sch-timeheader");
                };
            }
        },
        columnDropGetTargetFromEvent: function (e) {
            var t = Ext.lib.Event.getTarget(e),
				cindex = this.findCellIndex(t);
            if (cindex !== false && cindex < this.leftColumns.length) {
                return this.getHeaderCell(cindex);
            }
            return false;
        },
        init: function (a) {
            Ext.apply(this, {
                grid: a,
                rowHeight: a.rowHeight,
                eventBorderWidth: a.eventBorderWidth,
                cm: a.getColumnModel(),
                timeAxis: a.timeAxis
            });
            this.on("headerdblclick", this.onHeaderDoubleClick, this);
            this.timeAxis.on("reconfigure", function () { this.updateColumnModel(); }, this);
            this.initializeColumns(true);
            this.updateColumnModel();
            a.on({
                afterrender: this.onSchedulerRender,
                headerdblclick: this.onHeaderDoubleClick,
                scope: this
            });
            Sch.AbstractSchedulerView.superclass.init.apply(this, arguments);
        },
        timeColumnRenderer: function () { throw "Abstract method call"; }
    });
	
    Ext.ns("Sch");
    Sch.HorizontalSchedulerView = Ext.extend(Sch.AbstractSchedulerView, {forceFit: true, constructor: function (a) {Sch.HorizontalSchedulerView.superclass.constructor.call(this, a);if (this.forceFit) {this.refresh = this.refresh.createInterceptor(function () {this.fitColumns(true);});}}, onEventAdd: function (s, a) {var b;for (var i = 0, l = a.length; i < l; i++) {b = this.grid.getResourceByEventRecord(a[i]);if (b) {this.refreshRow(b);}}}, onEventRemove: function (s, b) {var c = this.getElementFromEventRecord(b);if (c) {c.fadeOut({remove: true, callback: function () {var a = this.grid.getResourceByEventRecord(b);if (a) {this.refreshRow(a);}}, scope: this});}}, onEventUpdate: function (s, a, b, c) {var d;if (c && c.ResourceId) {d = this.ds.getAt(this.ds.findExact("Id", c.ResourceId));this.refreshRow(d);}d = this.grid.getResourceByEventRecord(a);if (d) {this.refreshRow(d);}}, init: function (a) {Ext.apply(this, {timeCellRenderer: a.timeCellRenderer, eventBodyTemplate: a.eventBodyTemplate, eventTemplate: a.eventTemplate, eventRenderer: a.eventRenderer, eventBarTextField: a.eventBarTextField});a.on({columnresize: this.refreshView, resize: this.refreshView, scope: this});Sch.HorizontalSchedulerView.superclass.init.apply(this, arguments);}, refreshView: function (g) {if (this.grid.viewReady) {this.refresh(true);}}, updateSortIcon: function (a, b) {var c = this.sortClasses;var d = this.mainHd.select(this.cellSelector).removeClass(c);d.item(a).addClass(c[b == "DESC" ? 1 : 0]);}, getAvailableWidthForSchedule: function () {return this.grid.getGridEl().getWidth(true) - this.getScrollOffset() - this.getLeftSectionWidth() - this.getRightSectionWidth();}, updateGroupStyles: function () {var a = this.headerRows;if (!a) {return;}var b = this.mainHd.query(".x-grid3-header-offset > table"), headerConfig = this.grid.getHeaderConfig(), leftGroupWidth = this.getLeftGroupWidth(), rightGroupWidth = this.getRightGroupWidth(), tw = this.cm.getTotalWidth();for (var c = 0; c < b.length; c++) {b[c].style.width = tw + "px";if (c < b.length - 1) {var d = b[c].firstChild.firstChild.childNodes;for (var i = 0; i < d.length; i++) {if (i === 0 && leftGroupWidth > 0) {d[i].style.width = leftGroupWidth + "px";} else if (i === d.length - 1 && rightGroupWidth > 0) {d[i].style.width = rightGroupWidth + "px";} else {var e = headerConfig.top ? c === 0 ? "top" : "middle" : "middle", group = a[e][i], width = this.getHeaderGroupCellWidth(group.start, group.end, headerConfig[e].unit, headerConfig[e].increment || 1);d[i].style.width = width + "px";}}}}}, renderHeaders: function () {var a = this.templates, headers = [], cm = this.cm, headerRows = this.headerRows, width, id, group, tw = this.getTotalWidth(), headerConfig = this.grid.getHeaderConfig(), i, len;if (headerRows) {if (headerRows.top) {var b = this.getHeaderRowCells("top");headers.push(a.header.apply({tstyle: "width:" + tw, tclass: "top", cells: b.join("")}));}if (headerRows.middle) {var c = this.getHeaderRowCells("middle");headers.push(a.header.apply({tclass: "middle", tstyle: "width:" + tw, cells: c.join("")}));}}len = cm.getColumnCount();var d = a.hcell, cb = [], p = {}, last = len - 1;for (i = 0; i < len; i++) {p.id = cm.getColumnId(i);p.value = cm.getColumnHeader(i) || "";p.style = this.getColumnStyle(i, true);p.tooltip = this.getColumnTooltip(i);p.css = this.getColumnHeaderCls(i, last);if (cm.config[i].align == "right") {p.istyle = "padding-right:16px";} else {delete p.istyle;}cb[cb.length] = d.apply(p);}headers.push(a.header.apply({cells: cb.join(""), tstyle: "width:" + tw + ";", tclass: headerRows.middle ? "bottom" : "middle"}));return headers.join("");}, translateToScheduleCoordinate: function (x) {return x - this.el.getX();}, timeColumnRenderer: function (v, m, a, b, c, d, e) {var f = "&#160;", scheduler = this.grid, cm = this.cm, ta = this.timeAxis, viewStart = ta.getStart(), viewEnd = ta.getEnd(), firstScheduleColumnIndex = this.leftColumns.length, tickIndex = c - firstScheduleColumnIndex, prevEnd = c === firstScheduleColumnIndex ? null : ta.getAt(tickIndex - 1).end, colWidth = cm.getColumnWidth(c), colTick = ta.getAt(tickIndex), colStart = colTick.start, colEnd = colTick.end;this.timeCellRenderer.call(scheduler, e, m, a, b, c, d, colStart, colEnd);for (var i = 0, l = e.getCount(); i < l; i++) {var g = e.items[i], start = g.data.StartDate, end = g.data.EndDate;if (start && end) {var h;if (c === firstScheduleColumnIndex) {h = start.betweenLesser(colStart, colEnd) || start < colStart && end > colStart;} else {h = start.betweenLesser(prevEnd, colEnd);}if (h) {var j = colEnd - colStart, leftOffset = (Date.max(start, colStart) - colStart) / j * colWidth, itemWidth = this.getXFromDate(Date.min(end, viewEnd)) - this.getXFromDate(Date.max(start, viewStart)), tplData = {id: g.id, internalcls: (g.dirty ? "sch-dirty" : "") + (end > viewEnd ? " sch-event-endsoutside " : "") + (start < viewStart ? " sch-event-startsoutside" : ""), left: leftOffset, width: Math.max(1, Ext.isBorderBox ? itemWidth : itemWidth - this.eventBorderWidth)};if (this.managedEventLayout) {tplData.top = this.barMargin;tplData.height = this.rowHeight - 2 * this.barMargin - (Ext.isBorderBox ? 0 : this.eventBorderWidth);}if (this.eventRenderer) {var k = this.eventRenderer.call(scheduler, g, a, tplData, b, c);if (Ext.isObject(k) && this.eventBodyTemplate) {tplData.body = this.eventBodyTemplate.apply(k);} else {tplData.body = k;}} else if (this.eventBarTextField) {tplData.body = g.data[this.eventBarTextField];} else if (this.eventBodyTemplate) {tplData.body = this.eventBodyTemplate.apply(g.data);}f += this.eventTemplate.apply(tplData);}}}m.css += " sch-timetd";if (Ext.isIE) {m.attr += " style=\"z-index:" + cm.getColumnCount() - c + "\"";}return f;}, doRender: function (b, d, e, f, h, k) {var g = this.grid, ts = this.templates, ct = ts.cell, rt = ts.row, last = h - 1;var l = "width:" + this.getTotalWidth() + ";height:" + this.grid.getRowHeight() + "px";var m = [], cb, c, p = {}, rp = {tstyle: l}, r, events, totalScheduleWidth = this.getScheduleSectionWidth();for (var j = 0, len = d.length; j < len; j++) {r = d[j];cb = [];var n = j + f, resId = r.get("Id");events = this.es.data.filterBy(function (a) {return a.data.ResourceId == resId;});for (var i = 0; i < h; i++) {c = b[i];p.id = c.id;p.css = i === 0 ? "x-grid3-cell-first " : i == last ? "x-grid3-cell-last " : "";p.attr = p.cellAttr = "";p.value = c.renderer.call(c.scope || c, r.data[c.name], p, r, n, i, e, events);p.style = c.style;cb[cb.length] = ct.apply(p);}var o = [];if (k && (n + 1) % 2 === 0) {o[0] = "x-grid3-row-alt";}if (r.dirty) {o[1] = " x-grid3-dirty-row";}rp.cols = h;if (this.getRowClass) {o[2] = this.getRowClass(r, n, rp, e);}rp.alt = o.join(" ");rp.cells = cb.join("");m[m.length] = rt.apply(rp);}return m.join("");}, initData: function (a, b) {Sch.HorizontalSchedulerView.superclass.initData.apply(this, arguments);if (!this.es) {this.es = this.grid.eventStore;this.es.on({scope: this, datachanged: this.onDataChange, add: this.onEventAdd, update: this.onEventUpdate, remove: this.onEventRemove, clear: this.onClear});}if (this.cm) {this.cm.un("hiddenchange", this.refreshView, this);}if (b) {b.on("hiddenchange", this.refreshView, this);}}, initTemplates: function () {this.templates = this.templates || {};Ext.applyIf(this.templates, {eventBodyTemplate: this.eventBodyTemplate, eventTemplate: this.eventTemplate});Sch.HorizontalSchedulerView.superclass.initTemplates.apply(this, arguments);}, resolveResource: function (t) {var a = null, index = this.findRowIndex(t);if (index >= 0) {a = this.ds.getAt(index);}return a;}});
	
    if (Ext.getMajorVersion() >= 3 && Ext.getMinorVersion() >= 3) {
        Ext.override(Sch.HorizontalSchedulerView, {refreshRow: function (b) {var c = this.ds, colCount = this.cm.getColumnCount(), columns = this.getColumnData(), last = colCount - 1, cls = ["x-grid3-row"], rowParams = {tstyle: String.format("width: {0};height:{1}px", this.getTotalWidth(), this.grid.getRowHeight())}, colBuffer = [], cellTpl = this.templates.cell, rowIndex, row, column, meta, css, i;if (Ext.isNumber(b)) {rowIndex = b;b = c.getAt(rowIndex);} else {rowIndex = c.indexOf(b);}if (!b || rowIndex < 0) {return;}var d = b.get("Id"), events = this.es.data.filterBy(function (a) {return a.data.ResourceId == d;});for (i = 0; i < colCount; i++) {column = columns[i];if (i === 0) {css = "x-grid3-cell-first";} else {css = i == last ? "x-grid3-cell-last " : "";}meta = {id: column.id, style: column.style, css: css, attr: "", cellAttr: ""};meta.value = column.renderer.call(column.scope, b.data[column.name], meta, b, rowIndex, i, c, events);if (Ext.isEmpty(meta.value)) {meta.value = "&#160;";}if (this.markDirty && b.dirty && typeof b.modified[column.name] != "undefined") {meta.css += " x-grid3-dirty-cell";}colBuffer[i] = cellTpl.apply(meta);}row = this.getRow(rowIndex);row.className = "";if (this.grid.stripeRows && (rowIndex + 1) % 2 === 0) {cls.push("x-grid3-row-alt");}if (this.getRowClass) {rowParams.cols = colCount;cls.push(this.getRowClass(b, rowIndex, rowParams, c));}this.fly(row).addClass(cls).setStyle(rowParams.tstyle);rowParams.cells = colBuffer.join("");row.innerHTML = this.templates.rowInner.apply(rowParams);this.fireEvent("rowupdated", this, rowIndex, b);}});
    }
	
    Ext.ns("Sch");
    (function () {if (!Ext.ux || !Ext.ux.grid || !Ext.ux.grid.LockingGridView) {return;}var n = Ext.ux.grid.LockingGridView.prototype;var o = {lockText: n.lockText, unlockText: n.unlockText, rowBorderWidth: n.rowBorderWidth, lockedBorderWidth: n.lockedBorderWidth, getEditorParent: n.getEditorParent, initElements: n.initElements, getLockedRows: n.getLockedRows, getLockedRow: n.getLockedRow, getCell: n.getCell, addRowClass: n.addRowClass, removeRowClass: n.removeRowClass, removeRow: n.removeRow, removeRows: n.removeRows, syncScroll: n.syncScroll, updateSortIcon: n.updateSortIcon, updateAllColumnWidths: n.updateAllColumnWidths, updateColumnWidth: n.updateColumnWidth, updateColumnHidden: n.updateColumnHidden, processRows: n.processRows, afterRenderUI: n.afterRenderUI, renderUI: n.renderUI, getOffsetWidth: n.getOffsetWidth, getResolvedXY: n.getResolvedXY, syncFocusEl: n.syncFocusEl, ensureVisible: n.ensureVisible, insertRows: n.insertRows, getColumnStyle: n.getColumnStyle, getLockedWidth: n.getLockedWidth, getTotalWidth: n.getTotalWidth, renderBody: n.renderBody, refreshRow: n.refreshRow, refresh: n.refresh, onDenyColumnLock: n.onDenyColumnLock, onColumnLock: n.onColumnLock, handleHdMenuClick: n.handleHdMenuClick, handleHdDown: n.handleHdDown, syncHeaderHeight: n.syncHeaderHeight, updateLockedWidth: n.updateLockedWidth, syncRowHeights: n.syncRowHeights, layout: n.layout, masterTpl: new (Ext.Template)("<div class=\"x-grid3\" hidefocus=\"true\">", "<div class=\"x-grid3-locked\">", "<div class=\"x-grid3-header\"><div class=\"x-grid3-header-inner\"><div class=\"x-grid3-header-offset\" style=\"{lstyle}\">{lockedHeader}</div></div><div class=\"x-clear\"></div></div>", "<div class=\"x-grid3-scroller\"><div class=\"x-grid3-body\" style=\"{lstyle}\">{lockedBody}</div><div class=\"x-grid3-scroll-spacer\"></div></div>", "</div>", "<div class=\"x-grid3-viewport x-grid3-unlocked\">", "<div class=\"x-grid3-header\"><div class=\"x-grid3-header-inner\"><div class=\"x-grid3-header-offset\" style=\"{ostyle}\">{header}</div></div><div class=\"x-clear\"></div></div>", "<div class=\"x-grid3-scroller\"><div class=\"x-grid3-body\" style=\"{bstyle}\">{body}</div><a href=\"#\" class=\"x-grid3-focus\" tabIndex=\"-1\"></a></div>", "</div>", "<div class=\"x-grid3-resize-marker\">&#160;</div>", "<div class=\"x-grid3-resize-proxy\">&#160;</div>", "</div>"), forceFit: false, autoExpandTimeColumns: true, getAvailableWidthForSchedule: function () {return this.scroller.getWidth(true) - this.getScrollOffset() - this.getRightSectionWidth();}, afterRender: function () {if (!this.forceFit && this.autoExpandTimeColumns && this.getScheduleSectionWidth() < this.getAvailableWidthForSchedule()) {this.fitColumns();}n.afterRender.apply(this, arguments);}, updateTimeColumnWidths: function (a) {if (this.forceFit) {return;}var b = this.cm, width = this.grid.getTimeColumnWidth();for (var i = this.leftColumns.length, l = this.getLastTimeColumnIndex(); i <= l; i++) {b.setColumnWidth(i, width, true);}if (!a) {this.refresh(true);}}, getHeaderCell: function (a) {var b = this.cm.getLockedCount();if (a < b) {return this.lockedHd.child("table:last").dom.getElementsByTagName("td")[a];}return Sch.AbstractSchedulerView.prototype.getHeaderCell.call(this, a - b);}, scrollToTime: function (a, b) {var x = this.getXFromDate(a);if (x >= 0) {this.scroller.scrollTo("left", x, b);}}, getXFromDate: function (a) {var x = -1, tick = this.timeAxis.getTickFromDate(a);if (tick >= 0) {var b = Math.floor(tick), colWidth = this.getAccumulatedColumnWidth(this.leftColumns.length, this.leftColumns.length + b);x = colWidth + (b < this.timeAxis.getCount() ? this.cm.getColumnWidth(this.leftColumns.length + b) * (tick - b) : 0);}return x;}, renderHeaders: function () {var a = this.cm, ts = this.templates, ct = ts.hcell, cb = [], lcb = [], p = {}, len = a.getColumnCount(), last = len - 1, twValue = this.cm.getTotalWidth() - this.cm.getTotalLockedWidth(), totalScheduleWidth = this.getScheduleSectionWidth(), tw = twValue + "px", lw = this.getLockedWidth(), lockedHeaders = "", unlockedHeaders = "", i;for (i = 0; i < len; i++) {p.id = a.getColumnId(i);p.value = a.getColumnHeader(i) || "";p.style = this.getColumnStyle(i, true);p.tooltip = this.getColumnTooltip(i);p.css = this.getColumnHeaderCls(i, last);if (a.config[i].align == "right") {p.istyle = "padding-right:16px";} else {delete p.istyle;}if (a.isLocked(i)) {lcb[lcb.length] = ct.apply(p);} else {cb[cb.length] = ct.apply(p);}}var b = this.headerRows;if (b) {var c = this.cm.getLockedCount();if (b.top) {var d = this.getHeaderRowCells("top"), staticCell = ts.gcell.apply({cls: "x-grid3-cell-first x-grid3-cell-last ux-grid-hd-nogroup-cell", value: "&#160;", row: "top", id: 0, style: "width:" + lw}), value = ts.header.apply({cells: staticCell, tclass: "top", tstyle: "width:" + lw + ";"});if (c > 0) {lockedHeaders += value;} else {d.splice(1, 0, staticCell);}unlockedHeaders += ts.header.apply({tstyle: "width:" + tw, tclass: "top", cells: d.slice(1).join("")});}if (b.middle) {var e = this.getHeaderRowCells("middle"), staticCell = ts.gcell.apply({cls: "x-grid3-cell-first x-grid3-cell-last ux-grid-hd-nogroup-cell", value: "&#160;", row: "middle", id: 0, style: "width:" + lw}), value = ts.header.apply({cells: staticCell, tclass: "middle", tstyle: "width:" + lw + ";"});if (c > 0) {lockedHeaders += value;} else {e.splice(1, 0, staticCell);}unlockedHeaders += ts.header.apply({tstyle: "width:" + tw, tclass: "middle", cells: e.slice(1).join("")});}}unlockedHeaders += ts.header.apply({cells: cb.join(""), tstyle: "width:" + tw + ";", tclass: b.middle ? "bottom" : "middle"});lockedHeaders += ts.header.apply({cells: lcb.join(""), tstyle: "width:" + this.getLockedWidth() + ";", tclass: b.middle ? "bottom" : "middle"});return [unlockedHeaders, lockedHeaders];}, updateHeaders: function () {var a = this.renderHeaders();this.innerHd.firstChild.innerHTML = a[0];this.innerHd.firstChild.style.width = this.getOffsetWidth();Ext.fly(this.innerHd.firstChild).select(">table").setWidth(this.getTotalWidth());this.lockedInnerHd.firstChild.innerHTML = a[1];var b = this.getLockedWidth();this.lockedInnerHd.firstChild.style.width = b;Ext.fly(this.lockedInnerHd.firstChild).select("table").setWidth(b);}, initTemplates: function () {var a = this.templates || {};if (!a.master) {a.master = this.masterTpl;}if (!a.masterTpl) {a.masterTpl = this.masterTpl;}this.templates = a;Sch.AbstractSchedulerView.prototype.initTemplates.call(this);}, updateGroupStyles: function () {var a = this.lockedHd.query(".x-grid3-header-offset > table"), unlockedTables = this.mainHd.query(".x-grid3-header-offset > table"), headerRows = this.headerRows || [], headerConfig = this.grid.getHeaderConfig(), hasRightSectionColumns = this.rightColumns.length > 0, unlockedWidth = this.cm.getTotalWidth() - this.cm.getTotalLockedWidth() + "px", lockedWidth = this.getLockedWidth();for (var b = 0; b < a.length; b++) {a[b].style.width = lockedWidth;unlockedTables[b].style.width = unlockedWidth;if (b < a.length - 1) {var c = unlockedTables[b].className.match(this.rowPosRe)[1], cells = unlockedTables[b].firstChild.firstChild.childNodes, width;cells[0].style.width = lockedWidth;for (var i = 0; i < cells.length; i++) {var d = headerRows[c][i + 1];if (hasRightSectionColumns && i === cells.length - 1) {cells[i].style.width = this.getRightGroupWidth() + "px";} else {width = this.getHeaderGroupCellWidth(d.start, d.end, headerConfig[c].unit, headerConfig[c].increment || 1);cells[i].style.width = width + "px";}}}}}, translateToScheduleCoordinate: function (x) {return x - this.el.getX() - (Ext.isBorderBox ? -1 : this.lockedBorderWidth) + this.scroller.getScroll().left;}};Sch.AbstractLockingSchedulerView = Ext.extend(Sch.AbstractSchedulerView, Ext.apply({init: function (a) {if (!this.forceFit && this.autoExpandTimeColumns) {this.refresh = this.refresh.createInterceptor(function () {if (this.getScheduleSectionWidth() < this.getAvailableWidthForSchedule()) {this.fitColumns(true);}});}Sch.AbstractLockingSchedulerView.superclass.init.apply(this, arguments);}}, o));Sch.LockingSchedulerView = Ext.extend(Sch.HorizontalSchedulerView, Ext.apply({init: function (a) {if (!this.forceFit && this.autoExpandTimeColumns) {this.refresh = this.refresh.createInterceptor(function () {if (this.getScheduleSectionWidth() < this.getAvailableWidthForSchedule()) {this.fitColumns(true);}});}Sch.LockingSchedulerView.superclass.init.apply(this, arguments);}, doRender: function (b, d, e, f, g, h) {var k = this.templates, ct = k.cell, rt = k.row, last = g - 1, tstyle = "width:" + this.getTotalWidth() + ";height:" + this.rowHeight + "px;", lstyle = "width:" + this.getLockedWidth() + ";height:" + this.rowHeight + "px;", buf = [], lbuf = [], cb, lcb, c, p = {}, rp = {}, r, events, totalScheduleWidth = this.getScheduleSectionWidth();for (var j = 0, len = d.length; j < len; j++) {r = d[j];cb = [];lcb = [];var l = j + f, resId = r.get("Id");events = this.es.data.filterBy(function (a) {return a.data.ResourceId == resId;});for (var i = 0; i < g; i++) {c = b[i];p.id = c.id;p.css = (i === 0 ? "x-grid3-cell-first " : i == last ? "x-grid3-cell-last " : "") + (this.cm.config[i].cellCls ? " " + this.cm.config[i].cellCls : "");p.attr = p.cellAttr = "";p.value = c.renderer.call(c.scope || c, r.data[c.name], p, r, l, i, e, events);p.style = c.style;if (Ext.isEmpty(p.value)) {p.value = "&#160;";}if (this.markDirty && r.dirty && Ext.isDefined(r.modified[c.name])) {p.css += " x-grid3-dirty-cell";}if (c.locked) {lcb[lcb.length] = ct.apply(p);} else {cb[cb.length] = ct.apply(p);}}var m = [];if (h && (l + 1) % 2 === 0) {m[0] = "x-grid3-row-alt";}if (r.dirty) {m[1] = " x-grid3-dirty-row";}rp.cols = g;if (this.getRowClass) {m[2] = this.getRowClass(r, l, rp, e);}rp.alt = m.join(" ");rp.cells = cb.join("");rp.tstyle = tstyle;buf[buf.length] = rt.apply(rp);rp.cells = lcb.join("");rp.tstyle = lstyle;lbuf[lbuf.length] = rt.apply(rp);}return [buf.join(""), lbuf.join("")];}}, o));if (Ext.getMajorVersion() >= 3 && Ext.getMinorVersion() >= 3) {Ext.override(Sch.LockingSchedulerView, {refreshRow: function (b) {var c = this.ds, colCount = this.cm.getColumnCount(), columns = this.getColumnData(), last = colCount - 1, cls = ["x-grid3-row"], rowParams = {tstyle: String.format("width: {0};height:{1}px;", this.getTotalWidth(), this.rowHeight)}, lockedRowParams = {tstyle: String.format("width: {0};height:{1}px;", this.getLockedWidth(), this.rowHeight)}, colBuffer = [], lockedColBuffer = [], cellTpl = this.templates.cell, rowIndex, row, lockedRow, column, meta, css, i;if (Ext.isNumber(b)) {rowIndex = b;b = c.getAt(rowIndex);} else {rowIndex = c.indexOf(b);}if (!b || rowIndex < 0) {return;}var d = b.get("Id"), events = this.es.data.filterBy(function (a) {return a.data.ResourceId == d;});for (i = 0; i < colCount; i++) {column = columns[i];if (i === 0) {css = "x-grid3-cell-first";} else {css = i == last ? "x-grid3-cell-last " : "";}meta = {id: column.id, style: column.style, css: css, attr: "", cellAttr: ""};meta.value = column.renderer.call(column.scope, b.data[column.name], meta, b, rowIndex, i, c, events);if (Ext.isEmpty(meta.value)) {meta.value = " ";}if (this.markDirty && b.dirty && typeof b.modified[column.name] != "undefined") {meta.css += " x-grid3-dirty-cell";}if (column.locked) {lockedColBuffer[i] = cellTpl.apply(meta);} else {colBuffer[i] = cellTpl.apply(meta);}}row = this.getRow(rowIndex);row.className = "";lockedRow = this.getLockedRow(rowIndex);lockedRow.className = "";if (this.grid.stripeRows && (rowIndex + 1) % 2 === 0) {cls.push("x-grid3-row-alt");}if (this.getRowClass) {rowParams.cols = colCount;cls.push(this.getRowClass(b, rowIndex, rowParams, c));}this.fly(row).addClass(cls).setStyle(rowParams.tstyle);rowParams.cells = colBuffer.join("");row.innerHTML = this.templates.rowInner.apply(rowParams);this.fly(lockedRow).addClass(cls).setStyle(lockedRowParams.tstyle);lockedRowParams.cells = lockedColBuffer.join("");lockedRow.innerHTML = this.templates.rowInner.apply(lockedRowParams);lockedRow.rowIndex = rowIndex;this.syncRowHeights(row, lockedRow);this.fireEvent("rowupdated", this, rowIndex, b);}});}Ext.override(Sch.LockingSchedulerView, {getColumnData: function () {var a = [], cm = this.cm, colCount = cm.getColumnCount();for (var i = 0; i < colCount; i++) {var b = cm.getDataIndex(i);a[i] = {scope: cm.config[i].scope, name: b || "", renderer: cm.getRenderer(i), id: cm.getColumnId(i), style: this.getColumnStyle(i), locked: cm.isLocked(i)};}return a;}});}());
	
    Ext.ns("Sch");
    Sch.SchedulerGroupingView = Ext.extend(Sch.HorizontalSchedulerView, {
		showSummaryInHeader: false, 
		groupByText: Ext.grid.GroupingView.prototype.groupByText, 
		showGroupsText: Ext.grid.GroupingView.prototype.showGroupsText, 
		hideGroupedColumn: Ext.grid.GroupingView.prototype.hideGroupedColumn, 
		showGroupName: Ext.grid.GroupingView.prototype.showGroupName, 
		startCollapsed: Ext.grid.GroupingView.prototype.startCollapsed, 
		enableGrouping: Ext.grid.GroupingView.prototype.enableGrouping, 
		enableGroupingMenu: Ext.grid.GroupingView.prototype.enableGroupingMenu, 
		enableNoGroups: Ext.grid.GroupingView.prototype.enableNoGroups, 
		emptyGroupText: Ext.grid.GroupingView.prototype.emptyGroupText, 
		ignoreAdd: Ext.grid.GroupingView.prototype.ignoreAdd, 
		groupTextTpl: Ext.grid.GroupingView.prototype.groupTextTpl, 
		gidSeed: Ext.grid.GroupingView.prototype.gidSeed, 
		constructor: function (a) {
			this.addEvents("togglegroup");
			Sch.SchedulerGroupingView.superclass.constructor.call(this, a);
		}, 
		init: function (a, b) {
			Sch.SchedulerGroupingView.superclass.init.apply(this, arguments);
			if (this.showSummaryInHeader) {
				this.grid.on("afterrender", function () {this.el.addClass("sch-groupingsummary");}, this);
			}
		}, 
		initTemplates: function () {
			Sch.SchedulerGroupingView.superclass.initTemplates.call(this);
			this.state = {};
			var a = this.grid.getSelectionModel();
			a.on(a.selectRow ? "beforerowselect" : "beforecellselect", this.onBeforeRowSelect, this);
			if (!this.startGroup) {
				this.startGroup = new (Ext.XTemplate)("<div id=\"{groupId}\" class=\"x-grid-group {cls}\">", 
					"<div id=\"{groupId}-hd\" class=\"x-grid-group-hd\" style=\"{style}\"><div class=\"x-grid-group-title\">", 
					this.groupHeaderRenderer ? "{renderedHeader}" : this.groupTextTpl, 
					"</div></div>", 
					"<div id=\"{groupId}-bd\" class=\"x-grid-group-body\">");
			}
			this.startGroup.compile();
			this.endGroup = "</div></div>";
		}, 
		toggleRowIndex: Ext.grid.GroupingView.prototype.toggleRowIndex, 
		findGroup: Ext.grid.GroupingView.prototype.findGroup, 
		getGroups: Ext.grid.GroupingView.prototype.getGroups, 
		onAdd: Ext.grid.GroupingView.prototype.onAdd, 
		onRemove: Ext.grid.GroupingView.prototype.onRemove, 
		refreshRow: Ext.grid.GroupingView.prototype.refreshRow, 
		beforeMenuShow: Ext.grid.GroupingView.prototype.beforeMenuShow, 
		renderUI: Ext.grid.GroupingView.prototype.renderUI, 
		onGroupByClick: Ext.grid.GroupingView.prototype.onGroupByClick, 
		onShowGroupsClick: Ext.grid.GroupingView.prototype.onShowGroupsClick, 
		toggleGroup: Ext.grid.GroupingView.prototype.toggleGroup.createSequence(function () {
			this.fireEvent("togglegroup", this);
		}), 
		toggleAllGroups: Ext.grid.GroupingView.prototype.toggleAllGroups, 
		expandAllGroups: Ext.grid.GroupingView.prototype.expandAllGroups, 
		collapseAllGroups: Ext.grid.GroupingView.prototype.collapseAllGroups, 
		interceptMouse: Ext.grid.GroupingView.prototype.interceptMouse, 
		getGroup: Ext.grid.GroupingView.prototype.getGroup, 
		getGroupField: Ext.grid.GroupingView.prototype.getGroupField, 
		afterRender: Ext.grid.GroupingView.prototype.afterRender, 
		renderRows: Ext.grid.GroupingView.prototype.renderRows, 
		processEvent: Ext.grid.GroupingView.prototype.processEvent, 
		doRender: function (a, b, c, d, e, f) {
			if (b.length < 1) {return "";}
			var h = this.getGroupField(), 
				colIndex = this.cm.findColumnIndex(h), 
				g;
			this.enableGrouping = this.enableGrouping && !!h;
			if (!this.enableGrouping || this.isUpdating) {
				return Sch.SchedulerGroupingView.superclass.doRender.apply(this, arguments);
			}
			var j = "width:" + this.getTotalWidth() + ";";
			var k = this.grid.getGridEl().id;
			var l = this.cm.config[colIndex];
			var m = l.groupRenderer || l.renderer;var n = this.showGroupName ? (l.groupName || l.header) + ": " : "";
			var o = [], curGroup, i, len, gid;
			for (i = 0, len = b.length; i < len; i++) {
				var p = d + i, r = b[i], 
					gvalue = r.data[h];
				g = this.getGroup(gvalue, r, m, p, colIndex, c);
				if (!curGroup || curGroup.group != g) {
					gid = k + ("-gp-" + h + "-" + Ext.util.Format.htmlEncode(g));
					var q = typeof this.state[gid] !== "undefined" ? !this.state[gid] : this.startCollapsed;
					var s = q ? "x-grid-group-collapsed" : "";
					curGroup = {
						group: g, 
						gvalue: gvalue, 
						text: n + g, 
						groupId: gid, 
						startRow: p, 
						rs: [r], 
						cls: s, 
						style: j
					};
					o.push(curGroup);
				} else {
					curGroup.rs.push(r);
				}
				r._groupId = gid;
			}
			var t = [];
			for (i = 0, len = o.length; i < len; i++) {
				g = o[i];
				this.doGroupStart(t, g, a, c, e);
				t[t.length] = Sch.SchedulerGroupingView.superclass.doRender.call(this, a, g.rs, c, g.startRow, e, f);
				this.doGroupEnd(t, g, a, c, e);
			}
			return t.join("");
		}, 
		getGroupId: Ext.grid.GroupingView.prototype.getGroupId, 
		doGroupStart: function (a, g, b, c, d) {
			if (this.groupHeaderRenderer) {
				g.renderedHeader = this.groupHeaderRenderer(c, g);
			}
			a[a.length] = this.startGroup.apply(g);
		}, 
		doGroupEnd: Ext.grid.GroupingView.prototype.doGroupEnd, 
		getRows: Ext.grid.GroupingView.prototype.getRows, 
		updateGroupWidths: Ext.grid.GroupingView.prototype.updateGroupWidths, 
		onColumnWidthUpdated: function (a, w, b) {
			Sch.SchedulerGroupingView.superclass.onColumnWidthUpdated.call(this, a, w, b);
			this.updateGroupWidths();
		}, 
		onAllColumnWidthsUpdated: function (a, b) {
			Sch.SchedulerGroupingView.superclass.onAllColumnWidthsUpdated.call(this, a, b);
			this.updateGroupWidths();
		}, 
		onColumnHiddenUpdated: function (a, b, c) {
			Sch.SchedulerGroupingView.superclass.onColumnHiddenUpdated.call(this, a, b, c);
			this.updateGroupWidths();
		}, 
		onLayout: Ext.grid.GroupingView.prototype.onLayout, 
		onBeforeRowSelect: Ext.grid.GroupingView.prototype.onBeforeRowSelect, 
		constructId: Ext.grid.GroupingView.prototype.constructId, 
		canGroup: Ext.grid.GroupingView.prototype.canGroup, 
		getPrefix: Ext.grid.GroupingView.prototype.getPrefix
	});
    if (Ext.getMajorVersion() >= 3 && Ext.getMinorVersion() >= 3) {
        Ext.override(Sch.SchedulerGroupingView, {
			afterRenderUI: Ext.grid.GroupingView.prototype.afterRenderUI, 
			groupMode: Ext.grid.GroupingView.prototype.groupMode, 
			refreshRow: function (a) {
				if (this.ds.getCount() == 1) {this.refresh();} 
				else {
					this.isUpdating = true;
					Sch.SchedulerGroupingView.superclass.refreshRow.apply(this, arguments);
					this.isUpdating = false;
				}
			}
		});
    }
	
    Ext.ns("Sch");
    (function () {if (!Sch.LockingSchedulerView) {return;}var u = Ext.grid.GroupingView.prototype;Sch.LockingGroupingSchedulerView = Ext.extend(Sch.LockingSchedulerView, {showSummaryInHeader: false, unlockedGroupHeaderRenderer: undefined, groupByText: u.groupByText, showGroupsText: u.showGroupsText, hideGroupedColumn: u.hideGroupedColumn, showGroupName: u.showGroupName, startCollapsed: u.startCollapsed, enableGrouping: u.enableGrouping, enableGroupingMenu: u.enableGroupingMenu, enableNoGroups: u.enableNoGroups, emptyGroupText: u.emptyGroupText, ignoreAdd: u.ignoreAdd, groupTextTpl: u.groupTextTpl, groupMode: Ext.grid.GroupingView.prototype.groupMode, gidSeed: u.gidSeed, constructor: function (a) {this.addEvents("togglegroup");Sch.LockingGroupingSchedulerView.superclass.constructor.call(this, a);}, init: function (a, b) {Sch.LockingGroupingSchedulerView.superclass.init.apply(this, arguments);if (this.showSummaryInHeader) {this.grid.on("afterrender", function () {this.el.addClass("sch-groupingsummary");}, this);}}, initTemplates: function () {this.state = {};if (!this.startLockedGroup) {this.startLockedGroup = new (Ext.XTemplate)("<div id=\"{groupId}\" class=\"x-grid-group sch-grid-group-locked {cls}\">", "<div id=\"{groupId}-hd\" class=\"x-grid-group-hd\" style=\"{lockedheaderstyle}\"><div class=\"x-grid-group-title\">" + (this.lockedGroupHeaderRenderer ? "{renderedHeader}" : this.groupTextTpl), "</div></div>", "<div id=\"{groupId}-bd\" class=\"x-grid-group-body\">");}if (!this.startUnlockedGroup) {this.startUnlockedGroup = new (Ext.XTemplate)("<div id=\"{groupId}\" class=\"x-grid-group x-grid-group-unlocked {cls}\">" + "<div id=\"{groupId}-hd\" class=\"x-grid-group-hd {unlockedheadercls}\">" + "<div class=\"x-grid-group-title\">" + (this.unlockedGroupHeaderRenderer ? "{renderedHeader}" : this.groupTextTpl) + "</div>" + "</div>" + "<div id=\"{groupId}-bd\" class=\"x-grid-group-body\">");}this.startLockedGroup.compile();this.startUnlockedGroup.compile();this.endGroup = "</div></div>";Sch.LockingGroupingSchedulerView.superclass.initTemplates.call(this);}, getLockedRows: function () {if (!this.enableGrouping) {return Sch.LockingGroupingSchedulerView.superclass.getLockedRows.call(this);}var r = [];var g, gs = this.getLockedGroups();for (var i = 0, len = gs.length; i < len; i++) {g = gs[i].childNodes[1].childNodes;for (var j = 0, jlen = g.length; j < jlen; j++) {r[r.length] = g[j];}}return r;}, doRender2: Sch.LockingSchedulerView.prototype.doRender, findGroup: u.findGroup, getGroups: u.getGroups, getLockedGroups: function () {return this.hasRows() ? this.lockedBody.dom.childNodes : [];}, onAdd: u.onAdd, onRemove: function (a, b, c, d) {Sch.LockingGroupingSchedulerView.superclass.onRemove.apply(this, arguments);var g = document.getElementById(b._groupId);if (g && g.childNodes[1].childNodes.length < 1) {this.el.select("[id=\"" + b._groupId + "\"]").remove();}this.applyEmptyText();}, refreshRow: function (a) {if (this.ds.getCount() == 1) {this.refresh();} else {this.isUpdating = true;Sch.LockingGroupingSchedulerView.superclass.refreshRow.apply(this, arguments);this.isUpdating = false;}}, beforeMenuShow: u.beforeMenuShow, renderUI: function () {var a = Sch.LockingGroupingSchedulerView.superclass.renderUI.apply(this, arguments);if (this.interceptMouse) {this.mainBody.on("mousedown", this.interceptMouse, this);this.lockedBody.on("mousedown", this.interceptMouse, this);}return a;}, onGroupByClick: u.onGroupByClick, onShowGroupsClick: u.onShowGroupsClick, toggleGroup: function (a, b) {this.grid.stopEditing(true);a = Ext.getDom(a);var c = Ext.fly(a);b = b !== undefined ? b : c.hasClass("x-grid-group-collapsed");this.state[c.dom.id] = b;this.el.select("[id=\"" + c.dom.id + "\"]")[b ? "removeClass" : "addClass"]("x-grid-group-collapsed");this.fireEvent("togglegroup", this, c.dom.id, b);}, toggleAllGroups: u.toggleAllGroups, expandAllGroups: u.expandAllGroups, collapseAllGroups: u.collapseAllGroups, interceptMouse: u.interceptMouse, getGroup: u.getGroup, getGroupField: u.getGroupField, afterRender: function () {if (!this.ds || !this.cm) {return;}Sch.LockingGroupingSchedulerView.superclass.afterRender.call(this);if (this.grid.deferRowRender) {this.updateGroupWidths();}}, renderRows: function () {var a = this.getGroupField();var b = !!a;if (this.hideGroupedColumn) {var c = this.cm.findColumnIndex(a);if (!b && this.lastGroupField !== undefined) {this.mainBody.update("");this.cm.setHidden(this.cm.findColumnIndex(this.lastGroupField), false);delete this.lastGroupField;} else if (b && this.lastGroupField === undefined) {this.lastGroupField = a;this.cm.setHidden(c, true);} else if (b && this.lastGroupField !== undefined && a !== this.lastGroupField) {this.mainBody.update("");var d = this.cm.findColumnIndex(this.lastGroupField);this.cm.setHidden(d, false);this.lastGroupField = a;this.cm.setHidden(c, true);}}return Sch.LockingGroupingSchedulerView.superclass.renderRows.apply(this, arguments);}, processEvent: u.processEvent, doRender: function (a, b, c, d, e, f) {if (b.length < 1) {return "";}var h = this.getGroupField(), colIndex = this.cm.findColumnIndex(h), g;this.enableGrouping = this.enableGrouping && !!h;if (!this.enableGrouping || this.isUpdating) {return this.doRender2.apply(this, arguments);}var j = "width:" + this.getLockedWidth() + ";";var k = this.grid.getGridEl().id;var l = this.cm.config[colIndex];var m = l.groupRenderer || l.renderer;var n = this.showGroupName ? (l.groupName || l.header) + ": " : "";var o = [], curGroup, i, len, gid;for (i = 0, len = b.length; i < len; i++) {var p = d + i, r = b[i], gvalue = r.data[h];g = this.getGroup(gvalue, r, m, p, colIndex, c);if (!curGroup || curGroup.group != g) {gid = k + ("-gp-" + h + "-" + Ext.util.Format.htmlEncode(g));var q = typeof this.state[gid] !== "undefined" ? !this.state[gid] : this.startCollapsed;var s = q ? "x-grid-group-collapsed" : "";curGroup = {group: g, gvalue: gvalue, text: n + g, groupId: gid, startRow: p, rs: [r], cls: s, lockedheaderstyle: j};o.push(curGroup);} else {curGroup.rs.push(r);}r._groupId = gid;}var t = [], res = ["", ""];for (i = 0, len = o.length; i < len; i++) {g = o[i];this.doGroupStart(t, g, a, c, e);t[t.length] = this.doRender2.call(this, a, g.rs, c, g.startRow, e, f);this.doGroupEnd(t, g, a, c, e);}for (i = 0, len = t.length; i < len; i++) {res[0] += t[i][0];res[1] += t[i][1];}return res;}, getGroupId: u.getGroupId, doGroupStart: function (a, g, b, c, d) {a[a.length] = [this.renderUnlockedHeader(g), this.renderLockedHeader(g)];}, doGroupEnd: function (a, g, b, c, d) {a[a.length] = [this.endGroup, this.endGroup];}, getRows: function () {if (!this.enableGrouping) {return Sch.LockingGroupingSchedulerView.superclass.getRows.call(this);}var r = [];var g, gs = this.getGroups();for (var i = 0, len = gs.length; i < len; i++) {g = gs[i].childNodes[1].childNodes;for (var j = 0, jlen = g.length; j < jlen; j++) {r[r.length] = g[j];}}return r;}, updateGroupWidths: function () {if (!this.enableGrouping || !this.hasRows()) {return;}var i, len, lockedGroups = this.getLockedGroups(), unlockedGroups = this.getGroups(), lockedWidth = this.getLockedWidth(), unlockedWidth = this.cm.getTotalWidth() - this.cm.getTotalLockedWidth() + "px";for (i = 0, len = unlockedGroups.length; i < len; i++) {unlockedGroups[i].firstChild.style.width = unlockedWidth;}for (i = 0, len = lockedGroups.length; i < len; i++) {lockedGroups[i].firstChild.style.width = lockedWidth;}}, onColumnWidthUpdated: function (a, w, b) {Sch.LockingGroupingSchedulerView.superclass.onColumnWidthUpdated.call(this, a, w, b);this.updateGroupWidths();}, onAllColumnWidthsUpdated: function (a, b) {Sch.LockingGroupingSchedulerView.superclass.onAllColumnWidthsUpdated.call(this, a, b);this.updateGroupWidths();}, onColumnHiddenUpdated: function (a, b, c) {Sch.LockingGroupingSchedulerView.superclass.onColumnHiddenUpdated.call(this, a, b, c);this.updateGroupWidths();}, onLayout: u.onLayout, onBeforeRowSelect: u.onBeforeRowSelect, constructId: u.constructId, canGroup: u.canGroup, getPrefix: u.getPrefix, getGroupEl: function (a) {return a.up(".x-grid-group");}, getGroupHeaderEl: function (a) {return this.getGroupEl(a).down(".x-grid-group-hd");}, getGroupEls: function (a) {return this.el.select("[id=\"" + this.getGroupEl(a).id + "\"]");}, getGroupElsById: function (a) {return this.el.select("[id=\"" + this.getPrefix(this.getGroupField()) + a + "\"]");}, renderUnlockedHeader: function (a) {if (this.unlockedGroupHeaderRenderer) {a.renderedHeader = this.unlockedGroupHeaderRenderer.call(this, a);}return this.startUnlockedGroup.apply(a);}, renderLockedHeader: function (a) {if (this.lockedGroupHeaderRenderer) {a.renderedHeader = this.lockedGroupHeaderRenderer.call(this, a);}return this.startLockedGroup.apply(a);}});}());
    
	Ext.ns("Sch");
    Sch.ColumnFactory = {
		defaultRenderer: function (a, b, c) {return a.format(c);}, 
		createColumns: function (a, b, c) {
			if (!a || !b) {
				throw "Invalid parameters passed to createColumns";
			}
			var d = [], 
				lowestHeader = b.bottom || b.middle, 
				ticks = a.getTicks(), 
				colConfig;
			for (var i = 0, l = ticks.length; i < l; i++) {
				colConfig = {align: lowestHeader.align || "center"};
				if (lowestHeader.renderer) {
					colConfig.header = lowestHeader.renderer.call(lowestHeader.scope || this, 
																  ticks[i].start, 
																  ticks[i].end, 
																  colConfig, i);
				} else {
					colConfig.header = this.defaultRenderer(ticks[i].start, 
					ticks[i].end, 
					lowestHeader.dateFormat);
				}
				d[d.length] = new (Sch.TimeColumn)(Ext.apply(colConfig, c));
			}
			var e = this.createHeaderRows(a, b);
			return {columns: d, headerRows: e};
		}, 
		getHeaderRowUnitInBaseUnit: function (a, b, c, d) {
			var e;
			switch (d) {
				case Date.QUARTER:e = Math.round(Date.getDurationInMonths(a, b) / 3);
					break;
				case Date.MONTH:e = Math.round(Date.getDurationInMonths(a, b));
					break;
				case Date.WEEK:e = Math.round(Date.getDurationInDays(a, b)) / 7;
					break;
				case Date.DAY:e = Math.round(Date.getDurationInDays(a, b));
					break;
				case Date.HOUR:e = Math.round(Date.getDurationInHours(a, b));
					break;
				case Date.MINUTE:e = Math.round(Date.getDurationInMinutes(a, b));
					break;
				case Date.SECOND:e = Math.round(Date.getDurationInSeconds(a, b));
					break;
				case Date.MILLI:e = Math.round(Date.getDurationInMilliseconds(a, b));
					break;
				default:;
			}
			return e;
		}, createHeaderRows: function (a, b) {var c = {};if (b.top) {var d;if (b.top.cellGenerator) {d = b.top.cellGenerator.call(this, a.getStart(), a.getEnd());} else {d = this.createHeaderRow(a, b.top);}c.top = d;}if (b.bottom) {var e;if (b.middle.cellGenerator) {e = b.middle.cellGenerator.call(this, a.getStart(), a.getEnd());} else {e = this.createHeaderRow(a, b.middle);}c.middle = e;}return c;}, createHeaderRow: function (a, b) {var c = [], colConfig, start = a.getStart(), end = a.getEnd(), totalDuration = end - start, cols = [], dt = start, i = 0, cfg, align = b.align || "center", intervalEnd;while (dt < end) {intervalEnd = Date.min(a.getNext(dt, b.unit, b.increment || 1), end);colConfig = {align: align, start: dt, end: intervalEnd};if (b.renderer) {colConfig.header = b.renderer.call(b.scope || this, dt, intervalEnd, colConfig, i);} else {colConfig.header = this.defaultRenderer(dt, intervalEnd, b.dateFormat, colConfig, i);}c.push(colConfig);dt = intervalEnd;i++;}return c;}};
    
	Ext.ns("Sch");
    Sch.EventSelectionModel = function (a) {Ext.apply(this, a);this.selected = new (Ext.CompositeElementLite);this.addEvents("beforeeventselect", "selectionchange");Sch.EventSelectionModel.superclass.constructor.call(this);};
    Ext.extend(Sch.EventSelectionModel, Ext.grid.AbstractSelectionModel, {multiSelect: false, selectedClass: "sch-event-selected", clearSelectionsOnBlur: true, initEvents: function () {this.grid.on("eventclick", this.onEventClick, this);this.grid.getView().on({scope: this, refresh: this.onViewRefresh, rowupdated: this.onRowUpdated, beforerowremoved: this.clearSelections, beforerowsinserted: this.clearSelections});if (this.clearSelectionsOnBlur) {this.grid.mon(Ext.getBody(), "mousedown", function (e) {if (!e.getTarget(this.grid.eventSelector)) {this.clearSelections();}}, this);}}, deselectEvent: function (s, r) {this.deselect(this.grid.eventPrefix + r.id);}, onRowUpdated: function (v, a, r) {var b = this.selected.getCount(), resourceId = r.id;for (var i = b - 1; i >= 0; i--) {var c = this.selected.item(i), eventRecord = this.grid.getEventRecordFromDomId(c.dom.id);if (!eventRecord || resourceId === eventRecord.get("ResourceId")) {this.selected.removeElement(c);}}}, onViewRefresh: function () {this.clearSelections(true);}, clearSelections: function (a, b) {if (this.selected.getCount() > 0) {if (!b) {this.selected.removeClass(this.selectedClass);}this.selected.clear();if (!a) {this.fireEvent("selectionchange", this, this.selected.elements);}}}, hasSelection: function () {return this.selection ? true : false;}, onEventClick: function (g, a, e) {var b = e.getTarget(this.grid.eventSelector);if (e.ctrlKey && this.isSelected(b)) {this.deselect(b);} else {this.select(b, this.multiSelect);}}, getSelectionCount: function () {return this.selected.getCount();}, getSelectedNodes: function () {return this.selected.elements;}, isSelected: function (a) {return this.selected.contains(this.getNode(a).id);}, deselect: function (a) {var b = this.getNode(a);if (this.isSelected(b)) {b = this.getNode(b);this.selected.removeElement(b);Ext.fly(b).removeClass(this.selectedClass);this.fireEvent("selectionchange", this, this.selected.elements);}}, select: function (a, b, c) {if (Ext.isArray(a)) {if (!b) {this.clearSelections(true);}for (var i = 0, len = a.length; i < len; i++) {this.select(a[i], true, true);}if (!c) {this.fireEvent("selectionchange", this, this.selected.elements);}} else {var d = this.getNode(a);if (!b) {this.clearSelections(true);}if (d && !this.isSelected(d)) {if (this.fireEvent("beforeventselect", this, d, this.selected.elements) !== false) {Ext.fly(d).addClass(this.selectedClass);this.selected.add(d);if (!c) {this.fireEvent("selectionchange", this, this.selected.elements);}}}}}, getNode: function (a) {if (typeof a === "string") {return document.getElementById(a);}return a;}, onEditorKey: Ext.emptyFn});
	
    Ext.ns("Sch");
    Sch.LazyResizable = function (a, b, c, e) {this.addEvents("partialresize");Sch.LazyResizable.superclass.constructor.apply(this, arguments);this.handleOver();this.onMouseDown(this[c], e);};
    Ext.extend(Sch.LazyResizable, Ext.Resizable, {startSizing: Ext.Resizable.prototype.startSizing.createInterceptor(function (e) {return this.fireEvent("beforeresize", this, e) !== false;}), resizeElement: Ext.Resizable.prototype.resizeElement.createInterceptor(function () {var a = this.proxy.getBox(), oldWidth = this.el.getWidth();if (a.width !== oldWidth) {this.fireEvent("partialresize", this, a.width, oldWidth);}})});
    Ext.ns("Sch.plugins");
    Sch.plugins.DragSelector = Ext.extend(Ext.dd.DragTracker, {constructor: function (a) {a = a || {};Ext.applyIf(a, {onBeforeStart: this.onBeforeStart, onStart: this.onStart, onDrag: this.onDrag, onEnd: this.onEnd});Sch.plugins.DragSelector.superclass.constructor.call(this, a);}, init: function (a) {a.on({afterrender: this.onSchedulerRender, destroy: this.onSchedulerDestroy, scope: this});this.scheduler = a;}, onBeforeStart: function (e) {return e.ctrlKey;}, onStart: function (e) {var b = this.scheduler, view = b.getView();if (!this.proxy) {this.proxy = b.el.createChild({cls: "sch-drag-selector x-view-selector"});} else {this.proxy.show();}this.bodyRegion = view.mainBody.getRegion();var c = [];view.mainBody.select(b.eventSelector).each(function (a) {c[c.length] = {region: a.getRegion(), node: a.dom};}, this);this.eventData = c;this.sm.clearSelections();}, onDrag: function (e) {var a = this, startXY = a.startXY, sm = this.sm, eventData = this.eventData, dragRegion = this.dragRegion, xy = a.getXY(), x = Math.min(startXY[0], xy[0]), y = Math.min(startXY[1], xy[1]), w = Math.abs(startXY[0] - xy[0]), h = Math.abs(startXY[1] - xy[1]), i, ev, len, sel;dragRegion.left = x;dragRegion.top = y;dragRegion.right = x + w;dragRegion.bottom = y + h;dragRegion.constrainTo(this.bodyRegion);this.proxy.setRegion(dragRegion);for (i = 0, len = eventData.length; i < len; i++) {ev = eventData[i];sel = dragRegion.intersect(ev.region);if (sel && !ev.selected) {ev.selected = true;sm.select(ev.node, true);} else if (!sel && ev.selected) {ev.selected = false;sm.deselect(ev.node);}}}, onEnd: function (e) {if (this.proxy) {this.proxy.setDisplayed(false);}}, onSchedulerRender: function (s) {this.dragRegion = new (Ext.lib.Region)(0, 0, 0, 0);this.sm = s.getSelectionModel();this.initEl(s.view.mainBody);}, onSchedulerDestroy: function () {Ext.destroy(this.proxy);this.destroy();}});
	
    Ext.ns("Sch.plugins");
    Sch.plugins.EventEditor = Ext.extend(Ext.form.FormPanel, {
		durationText: "hrs", 
		saveText: "Save", 
		deleteText: "Delete", 
		cancelText: "Cancel", 
		hideOnBlur: true, 
		timeConfig: {
			allowBlank: false, 
			editable: false, 
			forceSelection: true
		}, 
		dateConfig: {allowBlank: false}, 
		dateFormat: "Y-m-d", 
		timeFormat: "H:i", 
		constructor: function (a) {
			this.addEvents("beforeeventdelete", "beforeeventsave");
			Sch.plugins.EventEditor.superclass.constructor.apply(this, arguments);
		}, 
		show: function (a, b) {
			if (this.deleteButton) {
				this.deleteButton.setVisible(!!a.store);
			}
			this.eventRecord = a;
			var c = Date.getDurationInHours(a.get("StartDate"), 
				a.get("EndDate"));
			this.durationField.setValue(c);
			this.getForm().loadRecord(a);
			b = b || this.scheduler.view.getElementFromEventRecord(a);
			this.el.alignTo(b, "bl", this.getConstrainOffsets(b));
			this.expand();
		}, 
		getConstrainOffsets: function (a) {return [0, 0];}, 
		cls: "sch-eventeditor", 
		layout: "border", 
		border: false, 
		onSaveClick: function () {
			var a = this, 
				record = a.eventRecord, 
				form = a.getForm();
			if (form.isValid() && this.fireEvent("beforeeventsave", this, record) !== false) {
				var b = a.startDateField.getValue(), 
					hours = a.durationField.getValue();
					if (b && hours >= 0) {end = b.add(Date.MINUTE, hours * 60);} 
					else {return;}
				var c = form.getValues();
				record.beginEdit();
				form.updateRecord(record);
				record.set("StartDate", b);
				record.set("EndDate", end);
				record.endEdit();
				if (!this.eventRecord.store) {
					if (this.scheduler.fireEvent("beforeeventadd", this.scheduler, record) !== false) {
						this.eventStore.add(record);
					}
				}
				a.collapse();
			}
		}, 
		onDeleteClick: function () {
			if (this.fireEvent("beforeeventdelete", this, this.eventRecord) !== false) {
				this.eventStore.remove(this.eventRecord);
			}
			this.collapse();
		}, 
		onCancelClick: function () {this.collapse();}, 
		buildButtons: function () {
			this.saveButton = new (Ext.Button)({
				text: this.saveText, 
				scope: this, 
				handler: this.onSaveClick
			});
			this.deleteButton = new (Ext.Button)({
				text: this.deleteText, 
				scope: this, 
				handler: this.onDeleteClick
			});
			this.cancelButton = new (Ext.Button)({
				text: this.cancelText, 
				scope: this, 
				handler: this.onCancelClick
			});
			return [this.saveButton, this.deleteButton, this.cancelButton];
		}, 
		buildDurationFields: function () {
			this.startDateField = new (Ext.ux.form.DateTime)({
				name: "StartDate", 
				x: 10, 
				y: 7, 
				width: 160, 
				timeFormat: this.timeFormat, 
				timeWidth: 60, 
				timeConfig: this.timeConfig, 
				dateFormat: this.dateFormat, 
				dateConfig: this.dateConfig
			});
			this.durationField = new (Ext.ux.form.SpinnerField)({
				x: 180, 
				y: 7, 
				width: 55, 
				minValue: 0, 
				allowNegative: false
			});
			this.durationLabel = new (Ext.form.Label)({
				y: 7, 
				x: 240, 
				xtype: "label", 
				text: this.durationText
			});
			return [this.startDateField, this.durationField, this.durationLabel];
		}, 
		initComponent: function () {
			if (!this.fieldsPanelConfig) {
				throw "Must define a fieldsPanelConfig property";
			}
			this.fieldsPanelConfig.region = "center";
			Ext.apply(this, {
				fbar: this.buildButtons(), 
				items: [{
						region: "north", 
						layout: "absolute", 
						height: 35, 
						border: false, 
						cls: "sch-eventeditor-timefields", 
						items: this.buildDurationFields()
					}, 
					this.fieldsPanelConfig]
			});
			Sch.plugins.EventEditor.superclass.initComponent.call(this);
		}, 
		init: function (a) {
			this.scheduler = a;
			this.eventStore = a.getEventStore();
			this.scheduler.on({
				eventdblclick: this.onEventDblClick, 
				afterrender: this.onSchedulerRender, 
				destroy: this.onSchedulerDestroy, 
				dragcreateend: this.onDragCreateEnd, 
				scope: this
			});
			this.scheduler.registerEventEditor(this);
		}, 
		onEventDblClick: function (g, a) {
			this.show(a);
		}, 
		onSchedulerRender: function () {
			this.render(Ext.getBody());
			this.collapse();
			if (this.hideOnBlur) {
				this.mon(Ext.getBody(), "click", this.onMouseClick, this);
			}
		}, 
		onMouseClick: function (e) {
			var a = this.startDateField;
			if (!this.collapsed && !e.within(this.getEl()) 
				&& (!a.tf.view || !e.within(a.tf.view.el)) 
				&& (!a.df.menu || !e.within(a.df.menu.el))) {
					this.collapse(false);
				}
		}, 
		onSchedulerDestroy: function () {this.scheduler.un("eventdblclick", this.onEventDblClick, this);},
		onDragCreateEnd: function (s, a) {
			if (!this.dragProxyEl && this.scheduler.dragCreator) {
				this.dragProxyEl = this.scheduler.dragCreator.getProxy();
			}
			this.onEventCreated(a);
			this.show(a, this.dragProxyEl);
		}, 
		onEventCreated: function (a) {}, 
		onCollapse: function () {
			var a = this.dragProxyEl;
			if (a) {a.hide();}
			Sch.plugins.EventEditor.superclass.onCollapse.apply(this, arguments);
		}
	});
	
    Ext.ns("Sch.plugins");
    Sch.AbstractTimeSpan = Ext.extend(Ext.util.Observable, {disabled: false, setDisabled: function (a) {if (a) {this.removeElements();}this.disabled = a;}, constructor: function (a) {this.cls = this.cls || "sch-timespangroup-" + Ext.id();Ext.apply(this, a);Sch.AbstractTimeSpan.superclass.constructor.apply(this, arguments);}, getElements: function () {return this.containerEl.select("." + this.cls);}, removeElements: function () {return this.getElements().remove();}, init: function (a) {this.scheduler = a;if (!this.store) {throw "Without a store, there's not much use for this plugin";}a.on({render: this.onAfterRender, destroy: this.onDestroy, scope: this});}, onAfterRender: function (a) {var v = a.getView();this.containerEl = v.scroller;this.schedulerBodyEl = v.mainBody;this.store.on({load: this.renderElements, datachanged: this.renderElements, add: this.renderElements, remove: this.renderElements, update: this.renderElements, clear: this.renderElements, scope: this});v.on({refresh: this.renderElements, rowremoved: this.refreshElements, rowsinserted: this.refreshElements, scope: this});a.on({viewchange: this.renderElements, afterrender: this.renderElements, scope: this});if ("togglegroup" in v.events) {v.on("togglegroup", this.refreshElements, this);}if ("togglerow" in v.events) {v.on("togglerow", this.refreshElements, this);}a.mon(a.getColumnModel(), "hiddenchange", this.renderElements, this);}, renderElements: function () {if (this.disabled || !this.scheduler.viewReady) {return;}this.renderElementsInternal.defer(10, this);}, renderElementsInternal: function () {this.removeElements();var h = this.schedulerBodyEl.getHeight(), start = this.scheduler.getStart(), end = this.scheduler.getEnd(), data = this.getElementData(start, end, h);for (var i = 0, l = data.length; i < l; i++) {data[i].uniquecls = this.cls;}this.template.insertFirst(this.containerEl, data);}, getElementData: function (a, b, c) {throw "Abstract method call";}, refreshElements: function () {var h = this.schedulerBodyEl.getHeight();this.getElements().setHeight(h);}, onDestroy: function () {this.store.destroy();}});
	
    Ext.ns("Sch.plugins");
    Sch.plugins.Lines = Ext.extend(Sch.AbstractTimeSpan, {dateFormat: "y-m-d G:i", init: function (a) {if (!this.template) {this.template = new (Ext.XTemplate)("<tpl for=\".\">", "<div title=\"{[values.Date.format(\"" + this.dateFormat + "\")]} - {[values.Text || \"\"]}\" class=\"sch-timeline {uniquecls} {Cls}\" style=\"left:{left}px;top:{top}px;height:{height}px;width:{width}px\"></div>", "</tpl>");}Sch.plugins.Lines.superclass.init.call(this, a);}, getElementData: function (a, b) {var s = this.store, scheduler = this.scheduler, view = scheduler.getView(), rs = s.getRange(), data = [], r, date, region, width;for (var i = 0, l = s.getCount(); i < l; i++) {r = rs[i];date = r.get("Date");if (date.between(a, b)) {region = view.getTimeSpanRegion(date);data[data.length] = Ext.apply({left: region.left, top: region.top, width: Math.max(1, region.right - region.left), height: Math.max(1, region.bottom - region.top)}, r.data);}}return data;}});
    Ext.ns("Sch.plugins");
	
    Sch.plugins.Zones = Ext.extend(Sch.AbstractTimeSpan, {init: function (a) {if (!this.template) {this.template = new (Ext.XTemplate)("<tpl for=\".\">", "<div class=\"sch-zone {uniquecls} {Cls}\" style=\"left:{left}px;top:{top}px;height:{height}px;width:{width}px\"></div>", "</tpl>");}Sch.plugins.Zones.superclass.init.call(this, a);}, getElementData: function (a, b) {var s = this.store, scheduler = this.scheduler, view = scheduler.getView(), rs = s.getRange(), data = [], r, spanStart, spanEnd, region;for (var i = 0, l = s.getCount(); i < l; i++) {r = rs[i];spanStart = r.get("StartDate");spanEnd = r.get("EndDate");if (Date.intersectSpans(spanStart, spanEnd, a, b)) {region = view.getTimeSpanRegion(Date.max(spanStart, a), Date.min(spanEnd, b));data[data.length] = Ext.apply({left: region.left, top: region.top, width: region.right - region.left, height: region.bottom - region.top}, r.data);}}return data;}});
	
    Ext.ns("Sch.plugins");
    Sch.plugins.SummaryColumn = Ext.extend(Ext.grid.Column, {showPercent: false, nbrDecimals: 1, dayText: "d", hourText: "h", minuteText: "min", sortable: false, fixed: true, menuDisabled: true, width: 80, dataIndex: "_sch_not_used", constructor: function (a) {this.renderer = this.renderer.createDelegate(this);Sch.plugins.SummaryColumn.superclass.constructor.call(this, a);}, init: function (a) {this.grid = a;this.eventStore = a.eventStore;}, renderer: function (v, p, a) {var g = this.grid, s = this.eventStore, viewStart = g.getStart(), viewEnd = g.getEnd(), retVal = 0, totalAllocatedMinutesInView = this.calculate(s.query("ResourceId", a.get("Id")), viewStart, viewEnd);if (totalAllocatedMinutesInView <= 0) {return "";}if (this.showPercent) {var b = Date.getDurationInMinutes(viewStart, viewEnd);return Math.min(100, Math.round(totalAllocatedMinutesInView * 100 / b)) + " %";} else {if (totalAllocatedMinutesInView > 1440) {return (totalAllocatedMinutesInView / 1440).toFixed(this.nbrDecimals) + (" " + this.dayText);}if (totalAllocatedMinutesInView >= 30) {return (totalAllocatedMinutesInView / 60).toFixed(this.nbrDecimals) + (" " + this.hourText);}return totalAllocatedMinutesInView + (" " + this.minuteText);}}, calculate: function (b, c, d) {var e = 0, eventStart, eventEnd;b.each(function (a) {eventStart = a.get("StartDate");eventEnd = a.get("EndDate");if (Date.intersectSpans(c, d, eventStart, eventEnd)) {e += Date.getDurationInMinutes(Date.max(eventStart, c), Date.min(eventEnd, d));}});return e;}});
    
	Ext.ns("Sch");
    Sch.SchedulerPanel = Ext.extend(Sch.AbstractSchedulerPanel, {
		enableEventDragDrop: true, 
		enableDragCreation: true, 
		allowOverlap: true, 
		constrainDragToResource: false, 
		dndValidatorFn: function (a, b, c, d, e) {return true;}, 
		resizeValidatorFn: function (a, b, c, d, e) {return true;}, 
		createValidatorFn: function (a, b, c, e) {return true;}, 
		timeCellRenderer: Ext.emptyFn, 
		getResourceStore: function () {return this.resourceStore;}, 
		getEventStore: function () {return this.eventStore;}, 
		getEventRecordFromElement: function (a) {
			var b = Ext.get(a);
			if (!b.is(this.eventSelector)) {
				b = b.up(this.eventSelector);
			}
			return this.getEventRecordFromDomId(b.id);
		}, 
		cmpCls: "sch-schedulerpanel", 
		eventSelector: ".sch-event", 
		setReadOnly: function (a) {
			if (this.dragCreator) {this.dragCreator.setDisabled(a);}
			Sch.SchedulerPanel.superclass.setReadOnly.apply(this, arguments);
		}, 
		getEventRecordFromDomId: function (a) {
			var b = this.getEventIdFromDomNodeId(a);
			return this.eventStore.getById(b);
		}, 
		getSelectedRecords: function () {
			var r = [], s = this.getSelectionModel().selected.elements;
			for (var i = 0, len = s.length; i < len; i++) {
				r[r.length] = this.getEventRecordFromDomId(s[i].id);
			}
			return r;
		}, 
		onDestroy: function () {
			if (this.tip) {this.tip.destroy();}
			if (this.eventStore.autoDestroy) {this.eventStore.destroy();}
			Sch.SchedulerPanel.superclass.onDestroy.call(this);
		}, 
		afterRender: function () {
			Sch.SchedulerPanel.superclass.afterRender.apply(this, arguments);
			if (this.tooltipTpl) {this.setupTooltip();}
			this.setupClickListeners();
		}, 
		tipCfg: {cls: "sch-tip", showDelay: 1000, autoHide: true, anchor: "b"}, 
		setupTooltip: function () {
			var v = this.getView(), 
				tipCfg = Ext.apply({
					renderTo: Ext.getBody(), 
					delegate: this.eventSelector, 
					target: v.mainBody, 
					listeners: {
						beforeshow: {
							fn: function (a) {
								if (!a.triggerElement || !a.triggerElement.id) {return false;}
								var b = this.getEventRecordFromDomId(a.triggerElement.id);
								if (!b || this.fireEvent("beforetooltipshow", this, b) === false) {
									return false;
								}
								a.update(this.tooltipTpl.apply(b.data));
								return true;
							}, 
							scope: this
						}
					}
				}, 
				this.tipCfg);
			this.tip = new (Ext.ToolTip)(tipCfg);
		}, 
		initComponent: function () {
			var a = this.resourceStore || this.store;
			if (!this.selModel && !this.disableSelection) {
				this.selModel = new (Sch.EventSelectionModel);
			}
			Ext.applyIf(this, {store: a, resourceStore: a});
			Sch.SchedulerPanel.superclass.initComponent.call(this);
			if (!this.eventTemplate) {
				this.eventTemplate = new (Ext.XTemplate)("<div unselectable=\"on\" id=\"" + this.eventPrefix + "{id}\" style=\"left:{left}px;top:{top}px;height:{height}px;width:{width}px;{style}\" class=\"sch-event x-unselectable {internalcls} {cls}\">", this.resizeHandles === "both" || this.resizeHandles === "start" ? String.format(this.resizeHandleHtml, "start") : "", this.resizeHandles === "both" || this.resizeHandles === "end" ? String.format(this.resizeHandleHtml, "end") : "", "<div unselectable=\"on\" class=\"sch-event-inner\">{body}", "</div>", "</div>", {compiled: true, disableFormats: true});
			}
			this.setupEvents();
			this.configureFunctionality();
		}, 
		setupEvents: function () {
			this.on({
				beforednd: this.onBeforeDragDrop, 
				dndstart: this.onDragDropStart, 
				afterdnd: this.onDragDropEnd, 
				beforedragcreate: this.onBeforeDragCreate, 
				dragcreatestart: this.onDragCreateStart, 
				dragcreateend: this.onDragCreateEnd, 
				afterdragcreate: this.onAfterDragCreate, 
				beforeresize: this.onBeforeResize, 
				resizestart: this.onResizeStart, 
				resizeend: this.onResizeEnd, 
				scope: this
			});
		}, 
		setupClickListeners: function () {
			this.mon(this.getView().mainBody, {
				click: function (e) {
					var t = e.getTarget(this.eventSelector);
					if (t) {
						e.stopEvent();
						this.fireEvent("eventclick", this, this.getEventRecordFromDomId(t.id), e);
					}
				}, 
				dblclick: function (e) {
					var t = e.getTarget(this.eventSelector);
					if (t) {
						e.stopEvent();
						this.fireEvent("eventdblclick", this, this.getEventRecordFromDomId(t.id), e);
					}
				}, 
				contextmenu: function (e) {
					var t = e.getTarget(this.eventSelector);
					if (t) {
						e.stopEvent();
						this.fireEvent("eventcontextmenu", this, this.getEventRecordFromDomId(t.id), e);
					}
				}, 
				scope: this
			},this);
		}, 
		configureFunctionality: function () {
			var f = this.validatorFnScope || this;
			if (this.resizeHandles !== "none" && Sch.Resize) {
				this.resizePlug = new (Sch.Resize)(
					this, Ext.applyIf({
						validatorFn: function (a, b, c, d) {
							return (this.allowOverlap || this.isDateRangeAvailable(c, d, b.id, a.id)) 
								&& this.resizeValidatorFn.apply(f, arguments);
							}, 
						validatorFnScope: this
					}, this.resizeConfig || {})
				);
			}
			if (this.enableEventDragDrop !== false && Sch.DragDrop) {
				this.dragdropPlug = new (Sch.DragDrop)(this, {
					validatorFn: function (a, b, c, d, e) {
						return (this.allowOverlap 
								|| this.isDateRangeAvailable(c, c.add(Date.MILLI, d), a[0].id, b.id)) 
							&& this.dndValidatorFn.apply(f, arguments);
					}, 
					validatorFnScope: this, 
					dragConfig: this.dragConfig || {}, 
					dropConfig: this.dropConfig || {}
				});
			}
			
			if (this.enableDragCreation !== false && Sch.DragCreator) {this.dragCreator = new (Sch.DragCreator)(this, Ext.applyIf({disabled: this.readOnly, validatorFn: function (a, b, c) {return (this.allowOverlap || this.isDateRangeAvailable(b, c, null, a.id)) && this.createValidatorFn.apply(f, arguments);}, validatorFnScope: this}, this.createConfig || {}));}
		}, 
		
		onBeforeDragDrop: function (s, a, e) {
			return !this.readOnly && !e.getTarget().className.match("x-resizable-handle");
		}, 
		onDragDropStart: function () {
			if (this.dragCreator) {this.dragCreator.setDisabled(true);}
			if (this.tip) {this.tip.hide();this.tip.disable();}
		}, 
		onDragDropEnd: function () {
			if (this.dragCreator) {this.dragCreator.setDisabled(false);}
			if (this.tip) {this.tip.enable();}
		}, 
		onBeforeDragCreate: function (s, e) {return !this.readOnly && !e.ctrlKey;}, 
		onDragCreateStart: function () {
			if (this.overClass) {
				var v = this.getView().mainBody;
				this.mun(v, "mouseover", this.onMouseOver, this);
				this.mun(v, "mouseout", this.onMouseOut, this);
			}
			if (this.tip) {this.tip.hide();this.tip.disable();}
		}, 
		onDragCreateEnd: function (s, a, e) {
			if (!this.eventEditor) {
				if (this.fireEvent("beforeeventadd", this, a) !== false) {
					this.onEventCreated(a);
					this.eventStore.add(a);
					this.dragCreator.getProxy().hide();
				}
			}
		}, 
		onEventCreated: function (a) {}, 
		onAfterDragCreate: function () {
			if (this.overClass) {
				this.mon(this.getView().mainBody, {
					mouseover: this.onMouseOver, 
					mouseout: this.onMouseOut, 
					scope: this
				});
			}
			if (this.tip) {this.tip.enable();}
		}, 
		onBeforeResize: function (s, a, e) {return !this.readOnly;}, 
		onResizeStart: function () {
			if (this.tip) {this.tip.hide();this.tip.disable();}
		}, 
		onResizeEnd: function () {
			if (this.tip) {this.tip.enable();}
		}, 
		getResourceByEventRecord: function (a) {return this.resourceStore.getById(a.get("ResourceId"));},
		isDateRangeAvailable: function (a, b, c, d) {
			var e = true;
			this.eventStore.each(function (r) {
				if (Date.intersectSpans(a, b, r.get("StartDate"), r.get("EndDate"))
					&& d === r.get("ResourceId") 
					&& (!c || c !== r.id)) {
						e = false;return false;
				}
			});
			return e;
		}, 
		getEventsInView: function () {
			var c = this.getStart(), 
				viewEnd = this.getEnd();
			return this.eventStore.queryBy(function (a) {
				var b = a.get("StartDate"), 
					eventEnd = a.get("EndDate");
					return Date.intersectSpans(b, eventEnd, c, viewEnd);
			});
		}, 
		constructor: function (a) {
			this.addEvents(
				"eventclick", 
				"eventdblclick", 
				"eventcontextmenu", 
				"beforeresize", 
				"resizestart", 
				"partialresize", 
				"afterresize", 
				"beforednd", 
				"dndstart", 
				"drop", 
				"afterdnd", 
				"beforedragcreate", 
				"dragcreatestart", 
				"dragcreateend", 
				"afterdragcreate", 
				"beforeeventadd"
			);
			
			Sch.SchedulerPanel.superclass.constructor.call(this, a);
		}, 
		getView: function () {
			if (!this.view) {
				var a = this.viewConfig || {};
				if (this.viewOrientation === "horizontal") {
					var b = this.getColumnModel(), 
						locked = b.getColumnCount() > 0 && b.config[0].locked;
					if (locked) {
						this.view = new (Sch.LockingSchedulerView)(a);
					} else {
						this.view = new (Sch.HorizontalSchedulerView)(a);
					}
				} else {throw "Not supported";}
			}
			return this.view;
		}, 
		
		registerEventEditor: function (a) {
			this.eventEditor = a;
		}, 
		
		getEventEditor: function () {return this.eventEditor;}, 
		getResourceAvailability: function (a) {}
	});
    Ext.reg("scheduler", Sch.SchedulerPanel);
    
	Ext.ns("Sch.plugins");
    Sch.plugins.Pan = Ext.extend(Object, {enableVerticalPan: true, hideScrollbar: false, constructor: function (a) {Ext.apply(this, a);}, init: function (a) {a.on("render", this.onRender, this);}, onRender: function (a) {this.eventSelector = a.eventSelector;this.panEl = a.getView().scroller;a.mon(this.panEl, "mousedown", this.onMouseDown, this, {delegate: ".x-grid3-row"});if (this.hideScrollbar) {this.panEl.setStyle("overflow", "hidden");}}, onMouseDown: function (e, t) {if (!e.getTarget(this.eventSelector)) {this.mouseX = e.getPageX();this.mouseY = e.getPageY();Ext.getBody().on("mousemove", this.onMouseMove, this);Ext.getDoc().on("mouseup", this.onMouseUp, this);}}, onMouseMove: function (e) {e.stopEvent();var x = e.getPageX(), y = e.getPageY(), xDelta = x - this.mouseX, yDelta = y - this.mouseY;this.panEl.scrollTo("left", this.panEl.dom.scrollLeft - xDelta);this.mouseX = x;this.mouseY = y;if (this.enableVerticalPan) {this.panEl.scrollTo("top", this.panEl.dom.scrollTop - yDelta);}}, onMouseUp: function (e) {Ext.getBody().un("mousemove", this.onMouseMove, this);Ext.getDoc().un("mouseup", this.onMouseUp, this);}});
    Ext.ns("Sch.plugins");
    Sch.plugins.TimeGap = Ext.extend(Sch.plugins.Zones, {getZoneCls: Ext.emptyFn, init: function (a) {this.store = new (Ext.data.JsonStore)({fields: ["StartDate", "EndDate", "Cls"]});a.on("viewchange", this.populateStore, this);a.eventStore.on({load: this.populateStore, update: this.populateStore, remove: this.populateStore, add: this.populateStore, datachanged: this.populateStore, scope: this});Sch.plugins.TimeGap.superclass.init.apply(this, arguments);}, populateStore: function (c) {var d = this.scheduler.getEventsInView(), timeGaps = [], viewStart = this.scheduler.getStart(), viewEnd = this.scheduler.getEnd(), l = d.getCount(), cursor = viewStart, eventStart, index = 0, r;d.sort("ASC", function (a, b) {return a.get("StartDate") - b.get("StartDate");});r = d.itemAt(0);while (cursor < viewEnd && index < l) {eventStart = r.get("StartDate");if (!cursor.betweenLesser(eventStart, r.get("EndDate")) && cursor < eventStart) {timeGaps.push(new (this.store.recordType)({StartDate: cursor, EndDate: eventStart, Cls: this.getZoneCls(cursor, eventStart) || ""}));}cursor = Date.max(r.get("EndDate"), cursor);index++;r = d.itemAt(index);}if (cursor < viewEnd) {timeGaps.push(new (this.store.recordType)({StartDate: cursor, EndDate: viewEnd, Cls: this.getZoneCls(cursor, viewEnd) || ""}));}this.store.removeAll(timeGaps.length > 0);this.store.add(timeGaps);}});
    Ext.ns("Sch.plugins");
    Sch.plugins.CurrentTimeLine = function (a, b) {Ext.apply(this, a);this.grid = b;Sch.plugins.CurrentTimeLine.superclass.constructor.call(this);};
    Ext.extend(Sch.plugins.CurrentTimeLine, Sch.plugins.Lines, {tooltipText: "Current time", updateInterval: 60000, autoUpdate: true, init: function (a) {var b = new (Ext.data.JsonStore)({fields: ["Date", "Cls", "Text"], data: [{Date: new Date, Cls: "sch-todayLine", Text: this.tooltipText}]});if (this.autoUpdate) {this.runner = new (Ext.util.TaskRunner);this.runner.start({run: function () {b.getAt(0).set("Date", new Date);}, interval: this.updateInterval});}a.on("destroy", this.onHostDestroy, this);this.store = b;Sch.plugins.CurrentTimeLine.superclass.init.apply(this, arguments);}, onHostDestroy: function () {if (this.runner) {this.runner.stopAll();}}});
    Ext.ns("Sch");
    Sch.ClockTemplate = function () {var c = Math.PI / 180, cos = Math.cos, sin = Math.sin, minuteHeight = 7, minuteTop = 2, minuteLeft = 10, hourHeight = 6, hourTop = 3, hourLeft = 10;
function getHourStyleIE(a) {var b = a * c, cosV = cos(b), sinV = sin(b), y = hourHeight * sin((90 - a) * c), x = hourHeight * cos((90 - a) * c), topAdjust = Math.min(hourHeight, hourHeight - y), leftAdjust = a > 180 ? x : 0, matrixString = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11 = " + cosV + ", M12 = " + - sinV + ", M21 = " + sinV + ", M22 = " + cosV + ")";return String.format("filter:{0};-ms-filter:{0};top:{1}px;left:{2}px;", matrixString, topAdjust + hourTop, leftAdjust + hourLeft);}


function getMinuteStyleIE(a) {var b = a * c, cosV = cos(b), sinV = sin(b), y = minuteHeight * sin((90 - a) * c), x = minuteHeight * cos((90 - a) * c), topAdjust = Math.min(minuteHeight, minuteHeight - y), leftAdjust = a > 180 ? x : 0, matrixString = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11 = " + cosV + ", M12 = " + - sinV + ", M21 = " + sinV + ", M22 = " + cosV + ")";return String.format("filter:{0};-ms-filter:{0};top:{1}px;left:{2}px;", matrixString, topAdjust + minuteTop, leftAdjust + minuteLeft);}


function getStyle(a) {return String.format("transform:rotate({0}deg);-moz-transform: rotate({0}deg);-webkit-transform: rotate({0}deg);-o-transform:rotate({0}deg);", a);}

return new (Ext.XTemplate)("<div class=\"sch-clockwrap {cls}\"><div class=\"sch-clock\"><div class=\"sch-hourIndicator\" style=\"{[this.getHourStyle((values.date.getHours()%12) * 30)]}\">{[Date.monthNames[values.date.getMonth()].substr(0,3)]}</div><div class=\"sch-minuteIndicator\" style=\"{[this.getMinuteStyle(values.date.getMinutes() * 6)]}\">{[values.date.getDate()]}</div></div><span class=\"sch-clock-text\">{text}</span></div>", {compiled: true, disableFormats: true, getMinuteStyle: Ext.isIE ? getMinuteStyleIE : getStyle, getHourStyle: Ext.isIE ? getHourStyleIE : getStyle});};
    Ext.ns("Sch");
    Sch.DragCreator = function (a, b) {Ext.apply(this, b || {});this.lastTime = new Date(1970);this.scheduler = a;this.scheduler.on({render: this.onSchedulerRender, destroy: this.onSchedulerDestroy, scope: this});Sch.DragCreator.superclass.constructor.call(this);};
    Ext.extend(Sch.DragCreator, Ext.util.Observable, {disabled: false, showHoverTip: true, showDragTip: true, dragTolerance: 2, template: new (Ext.Template)("<div class=\"sch-dragcreator-proxy sch-event\"><div class=\"sch-event-inner\"></div></div>", {compiled: true, disableFormats: true}), validatorFn: Ext.emptyFn, validatorFnScope: null, setDisabled: function (a) {this.disabled = a;if (a) {this.hoverTip.hide();this.dragTip.hide();}this.hoverTip.setDisabled(a);this.dragTip.setDisabled(a);}, getProxy: function () {if (!this.proxy) {this.proxy = this.template.append(this.scheduler.getView().el, {}, true);}return this.proxy;}, onMouseMove: function (e) {var a = this.hoverTip;if (a.disabled || this.dragging) {return;}if (e.getTarget(".sch-timetd", 2) || e.getTarget(".x-grid3-row", 1)) {var b = this.scheduler.getDateFromDomEvent(e, "floor");if (b) {if (b - this.lastTime !== 0) {this.updateHoverTip(b);this.lastTime = b;a.doAutoWidth();if (a.hidden) {try {a[Date.compareUnits(this.scheduler.getTimeResolution().unit, Date.DAY) >= 0 ? "addClass" : "removeClass"]("sch-day-resolution");a.show();} catch (e) {}}}} else {a.hide();this.lastTime = null;}} else {a.hide();this.lastTime = null;}}, updateHoverTip: function (a) {if (a) {var b = this.scheduler.getFormattedDate(a);this.hoverTipTemplate.overwrite(this.hoverTip.body, {date: a, text: b});}}, onBeforeDragStart: function (e) {var t = e.getTarget(".sch-timetd", 2), s = this.scheduler, resourceRecord = s.view.resolveResource(t);if (!this.disabled && t && s.fireEvent("beforedragcreate", s, resourceRecord, e) !== false) {this.resourceRecord = resourceRecord;this.resourceRegion = s.view.getScheduleRegion(this.resourceRecord);this.originalStart = s.getDateFromDomEvent(e);return true;}return false;}, onDragStart: function () {var a = this, view = a.scheduler.view, proxy = a.getProxy();a.containerRegion = view.mainBody.getRegion();this.dragging = true;if (a.scheduler.snapToIncrement) {a.originalStart = a.scheduler.floorDate(a.originalStart);var b = a.scheduler.getXYFromDate(a.originalStart);a.tracker.startXY[0] = b[0] + a.containerRegion.left;a.tracker.startXY[1] = b[1] + a.containerRegion.top;}if (this.hoverTip) {this.hoverTip.disable();}a.start = a.originalStart;a.end = a.start;a.dragRegion.top = a.resourceRegion.top;a.dragRegion.bottom = a.resourceRegion.bottom;proxy.show();proxy.setRegion({top: a.dragRegion.top, right: a.tracker.startXY[0], bottom: a.dragRegion.bottom, left: a.tracker.startXY[0]});a.scheduler.fireEvent("dragcreatestart", a.scheduler);if (a.showDragTip) {a.dragTip.update(a.start, a.end, true);a.dragTip.enable().show(proxy);}}, onDrag: function (e) {var a = this, s = a.scheduler, rawDate = s.getDateFromDomEvent(e);if (!rawDate) {return;}var b = a.tracker.startXY, xy = a.tracker.getXY(), x = xy[0], view = s.view, w = Math.abs(b[0] - xy[0]), dr = a.dragRegion;if (rawDate) {if (rawDate > a.originalStart) {a.start = s.floorDate(a.originalStart);a.end = s.roundDate(rawDate);} else {a.end = s.roundDate(a.originalStart);a.start = s.roundDate(rawDate);}this.valid = this.validatorFn.call(this.validatorFnScope || this, this.resourceRecord, a.start, a.end) !== false;if (a.showDragTip) {a.dragTip.update(a.start, a.end, this.valid);}if (rawDate > a.originalStart) {dr.left = b[0];if (s.snapToIncrement) {dr.right = s.getXYFromDate(a.end)[0] + a.containerRegion.left;} else {dr.right = b[0] + w;dr.constrainTo(this.resourceRegion);}} else {if (s.snapToIncrement) {dr.left = s.getXYFromDate(a.start)[0] + a.containerRegion.left;} else {dr.left = b[0] - w;dr.constrainTo(this.resourceRegion);}dr.right = b[0];}this.getProxy().setRegion(dr);}}, onDragEnd: function (e) {var s = this.scheduler;this.dragging = false;if (this.showDragTip) {this.dragTip.hide();}if (!this.start || !this.end || this.end - this.start <= 0) {this.valid = false;}if (this.valid) {var a = new (s.eventStore.recordType)({ResourceId: this.resourceRecord.get("Id"), StartDate: this.start, EndDate: this.end});s.fireEvent("dragcreateend", s, a, this.resourceRecord, e);} else {this.proxy.hide();}this.scheduler.fireEvent("afterdragcreate", s);if (this.hoverTip) {this.hoverTip.enable();}}, tipCfg: {trackMouse: true, bodyCssClass: "sch-hovertip", autoHide: false, dismissDelay: 1000, showDelay: 300}, onSchedulerRender: function (a) {var b = a.getView().mainBody;this.tracker = new (Ext.dd.DragTracker)({el: b, tolerance: this.dragTolerance, onBeforeStart: this.onBeforeDragStart.createDelegate(this), onStart: this.onDragStart.createDelegate(this), onDrag: this.onDrag.createDelegate(this), onEnd: this.onDragEnd.createDelegate(this)});this.dragRegion = new (Ext.lib.Region)(0, 0, 0, 0);if (this.showDragTip) {this.dragTip = new (Sch.Tooltip)({scheduler: a, renderTo: document.body, listeners: {beforeshow: {fn: function () {return this.dragging;}, scope: this}}});}if (this.showHoverTip) {this.hoverTipTemplate = this.hoverTipTemplate || new (Sch.ClockTemplate);this.hoverTip = new (Ext.ToolTip)(Ext.applyIf({renderTo: document.body, target: b, disabled: this.disabled, delayShow: Ext.emptyFn}, this.tipCfg));this.hoverTip.on("beforeshow", this.onBeforeShow, this);a.mon(b, "mousemove", this.onMouseMove, this);a.mon(b, "mouseleave", function () {this.hoverTip.hide();}, this);}}, onSchedulerDestroy: function () {if (this.hoverTip) {this.hoverTip.destroy();}if (this.dragTip) {this.dragTip.destroy();}if (this.tracker) {this.tracker.destroy();}if (this.proxy) {Ext.destroy(this.proxy);this.proxy = null;}}, onBeforeShow: function (a) {return !this.disabled && !this.dragging && a.body.dom.innerHTML !== "" && this.lastTime !== null;}});
    Ext.ns("Sch");
    Sch.DragDrop = Ext.extend(Ext.util.Observable, {validatorFn: function (a, b, c, d, e) {return true;}, enableCopy: false, useDragProxy: false, showTooltip: true, constructor: function (a, b) {Ext.apply(this, b);this.scheduler = a;this.scheduler.on({afterrender: this.onRender, destroy: this.cleanUp, scope: this});Sch.DragDrop.superclass.constructor.call(this);}, cleanUp: function () {if (this.scheduler.dragZone) {this.scheduler.dragZone.destroy();}if (this.scheduler.dropZone) {this.scheduler.dropZone.destroy();}if (this.tip) {this.tip.destroy();}}, onRender: function () {var a = !!document.elementFromPoint;if (!this.useDragProxy && a) {this.initProxyLessDD();} else {this.initProxyDD();}}, initProxyLessDD: function () {var s = this.scheduler, v = s.getView();s.dragZone = new (Sch.PointSchedulerDragZone)(v.mainBody, Ext.apply({ddGroup: s.id, scheduler: s, enableCopy: this.enableCopy, validatorFn: this.validatorFn, validatorFnScope: this.validatorFnScope, showTooltip: this.showTooltip, view: v}, this.dragConfig));}, initProxyDD: function () {var s = this.scheduler, v = this.scheduler.getView();s.dragZone = new (Sch.SchedulerDragZone)(v.scroller, Ext.apply({ddGroup: this.scheduler.id, scheduler: this.scheduler, enableCopy: this.enableCopy}, this.dragConfig));s.dropZone = new (Sch.SchedulerDropZone)(v.mainBody, Ext.apply({ddGroup: this.scheduler.id, scheduler: this.scheduler, enableCopy: this.enableCopy, validatorFn: this.validatorFn, validatorFnScope: this.validatorFnScope}, this.dropConfig));}});
    Sch.ClassicDDProxy = function (c) {return new (Ext.XTemplate)("<span class=\"sch-dd-newtime\">{[ this.getText(values) ]}</span>", {getText: function (a) {var b = c.getFormattedDate(a.StartDate);if (a.Duration) {b += " - " + c.getFormattedEndDate(a.StartDate.add(Date.MILLI, a.Duration), a.StartDate);}return b;}});};
    Sch.SchedulerDragZone = Ext.extend(Ext.dd.DragZone, {containerScroll: true, onStartDrag: function () {var s = this.scheduler;s.fireEvent("dndstart", s, this.dragData.records);}, getDragData: function (e) {var s = this.scheduler, sourceNode = e.getTarget(s.eventSelector);if (sourceNode) {var a = s.getSelectionModel(), sourceNodeEl = Ext.get(sourceNode), eventEl = sourceNodeEl.is(s.eventSelector) ? sourceNode : sourceNodeEl.up(s.eventSelector).dom, sourceEventRecord = s.getEventRecordFromDomId(eventEl.id);if (!a.isSelected(eventEl)) {a.select(eventEl, a.multiSelect, true);}if (s.fireEvent("beforednd", s, sourceEventRecord, e) === false) {return null;}var b, start = sourceEventRecord.get("StartDate"), selNodes = a.getSelectedNodes(), copy, wrap = Ext.get(Ext.DomHelper.createDom({cls: "sch-dd-wrap", children: [{cls: "sch-dd-proxy-hd", html: "&nbsp"}]}));for (var i = 0, len = selNodes.length; i < len; i++) {copy = selNodes[i].cloneNode(true);copy.id = Ext.id();wrap.appendChild(copy);}return {repairXY: Ext.fly(sourceNode).getXY(), ddel: wrap.dom, sourceEventRecord: sourceEventRecord, records: s.getSelectedRecords(), duration: sourceEventRecord.get("EndDate") - start};}return null;}, afterRepair: function () {this.dragging = false;var s = this.scheduler;s.fireEvent("afterdnd", s);}, getRepairXY: function () {return this.dragData.repairXY;}, onDragKeyDown: function (e) {var p = this.getProxy();if (e.ctrlKey && (p.dropStatus === p.dropAllowed || p.dropStatus === p.dropAllowed + " add")) {p.setStatus(p.dropAllowed + " add");}}, onDragKeyUp: function (e) {if (!e.ctrlKey) {var p = this.getProxy();p.setStatus(p.dropStatus.replace(" add", ""));}}, onMouseDown: function () {if (this.enableCopy) {Ext.getBody().on({keydown: this.onDragKeyDown, keyup: this.onDragKeyUp, scope: this});}}, onMouseUp: function () {var b = Ext.getBody();b.un("keydown", this.onDragKeyDown, this);b.un("keyup", this.onDragKeyUp, this);}});
    Sch.SchedulerDropZone = Ext.extend(Ext.dd.DropZone, {constructor: function () {Sch.SchedulerDropZone.superclass.constructor.apply(this, arguments);this.proxyTpl = this.proxyTpl || new (Sch.ClassicDDProxy)(this.scheduler);}, validatorFn: Ext.emptyFn, getTargetFromEvent: function (e) {return e.getTarget(".sch-timetd");}, onNodeEnter: function (a, b, e, c) {Ext.fly(a).addClass("sch-dd-cellover");}, onNodeOut: function (a, b, e, c) {Ext.fly(a).removeClass("sch-dd-cellover");}, onNodeOver: function (a, b, e, c) {var s = this.scheduler, date = s.getDateFromDomEvent(e, "round"), newText;if (!date) {return this.dropNotAllowed;}this.proxyTpl.overwrite(b.proxy.el.child(".sch-dd-proxy-hd"), {StartDate: date, Duration: c.duration});var d = s.view.resolveResource(a);if (this.validatorFn.call(this.validatorFnScope || this, c.records, d, date, c.duration, e) !== false) {return this.dropAllowed + (this.enableCopy && e.ctrlKey ? " add" : "");} else {return this.dropNotAllowed;}}, onNodeDrop: function (a, b, e, c) {var s = this.scheduler, v = s.getView(), targetRecord = s.view.resolveResource(a), date = s.getDateFromDomEvent(e, "round"), valid = false, isCopy = this.enableCopy && e.ctrlKey;if (date && this.validatorFn.call(this.validatorFnScope || this, c.records, targetRecord, date, c.duration, e) !== false) {var d, index = s.resourceStore.indexOf(targetRecord);if (isCopy) {d = this.copyRecords(c.records, date, targetRecord, c.sourceEventRecord, index);valid = true;} else {valid = this.updateRecords(c.records, date, targetRecord, c.sourceEventRecord, index, c);}if (valid) {s.getSelectionModel().clearSelections();}s.fireEvent("drop", s, isCopy ? d : c.records, isCopy, valid);}s.fireEvent("afterdnd", s);return valid;}, updateRecords: function (a, b, c, d, e, f) {if (a.length === 1) {d.beginEdit();d.set("ResourceId", c.get("Id"));d.set("StartDate", b);d.set("EndDate", b.add(Date.MILLI, f.duration));d.endEdit();return true;}var g = d.get("StartDate"), resourceStore = c.store, diffStart = b - g, sourceIndex = resourceStore.indexOfId(d.get("ResourceId")), diff, oldIndex, newResourceRecord, r, newIndex, nbrRecords = resourceStore.getCount(), i;for (i = 0; i < a.length; i++) {r = a[i];oldIndex = resourceStore.indexOfId(r.get("ResourceId"));newIndex = oldIndex - sourceIndex + e;if (newIndex < 0 || newIndex > nbrRecords) {return false;}}for (i = 0; i < a.length; i++) {r = a[i];oldIndex = resourceStore.indexOfId(r.get("ResourceId"));diff = oldIndex - sourceIndex;newResourceRecord = resourceStore.getAt(e + diff);r.beginEdit();r.set("ResourceId", newResourceRecord.get("Id"));r.set("StartDate", r.get("StartDate").add(Date.MILLI, diffStart));r.set("EndDate", r.get("EndDate").add(Date.MILLI, diffStart));r.endEdit();}return true;}, copyRecords: function (a, b, c, d, e) {var f = a[0], newItem = f.copy(), duration = d.get("EndDate") - d.get("StartDate");newItem.set("ResourceId", c.get("Id"));newItem.set("StartDate", b);newItem.set("EndDate", b.add(Date.MILLI, duration));return [newItem];}});
    Sch.SchedulerDragProxy = Ext.extend(Ext.dd.StatusProxy, {constructor: function (a) {Ext.apply(this, a);this.id = this.id || Ext.id();this.el = new (Ext.Layer)({dh: {id: this.id, tag: "div", cls: "sch-dragproxy x-dd-drag-proxy", children: [{tag: "div", cls: "x-dd-drag-ghost"}]}, shadow: false});this.ghost = Ext.get(this.el.dom.childNodes[0]);this.dropStatus = this.dropNotAllowed;}, reset: function (a) {this.el.dom.className = "sch-dragproxy x-dd-drag-proxy " + this.dropNotAllowed;this.dropStatus = this.dropNotAllowed;if (a) {this.ghost.update("");}}});
	
    Sch.PointSchedulerDragZone = Ext.extend(Ext.dd.DragZone, {
		containerScroll: true, 
		getRepairXY: function () {return this.dragData.repairXY;}, 
		constructor: function (a, b) {
			b.proxy = new (Sch.SchedulerDragProxy)({
				shadow: false, dropAllowed: Ext.dd.StatusProxy.prototype.dropAllowed + " sch-dragproxy",
				dropNotAllowed: Ext.dd.StatusProxy.prototype.dropNotAllowed + " sch-dragproxy"
			});
			Sch.PointSchedulerDragZone.superclass.constructor.apply(this, arguments);
			this.scroll = false;
			this.isTarget = true;
			this.ignoreSelf = false;
			Ext.dd.ScrollManager.register(this.view.scroller);
		}, 
		
		destroy: function () {
			Sch.PointSchedulerDragZone.superclass.destroy.call(this);
			Ext.dd.ScrollManager.unregister(this.view.scroller);
		}, 
		
		autoOffset: function (x, y) {
			var a = this.dragData.repairXY, 
				xDelta = x - a[0], 
				yDelta = y - a[1];
			this.setDelta(xDelta, yDelta);
		}, 
		
		constrainTo: function (a, b) {
			this.resetConstraints();
			this.initPageX = a.left;
			this.initPageY = a.top;
			this.setXConstraint(a.left, a.right - (b.right - b.left), this.xTickSize);
			this.setYConstraint(a.top, a.bottom - (b.bottom - b.top), this.yTickSize);
		}, 
		
		setXConstraint: function (a, b, c) {
			this.leftConstraint = a;
			this.rightConstraint = b;
			this.minX = a;
			this.maxX = b;
			if (c) {this.setXTicks(this.initPageX, c);}
			this.constrainX = true;
		}, 
		
		setYConstraint: function (a, b, c) {
			this.topConstraint = a;
			this.bottomConstraint = b;
			this.minY = a;
			this.maxY = b;
			if (c) {
				this.setYTicks(this.initPageY, c);
			}
			this.constrainY = true;
		}, 
		
		resolveStartEndDates: function (a) {
			var b = this.dragData, 
				start = b.origStart, 
				end = b.origEnd;
			if (!b.startsOutsideView) {
				start = this.scheduler.getDateFromXY([a.left, a.top], "round") || b.start;
				end = start.add(Date.MILLI, b.duration);
			} else if (!b.endsOutsideView) {
				end = this.scheduler.getDateFromXY([a.left + b.eventNodeWidth, a.top], "round") || b.end;
				start = end.add(Date.MILLI, - b.duration);
			}
			b.start = start;
			b.end = end;
		}, 
		
		onDragOver: function (e, a) {
			var b = this.dragData, 
				s = this.scheduler, 
				proxyRegion = this.proxy.el.getRegion();
			this.resolveStartEndDates(proxyRegion);
			if (!b.originalHidden) {
				b.sourceNode.hide();
				b.originalHidden = true;
			}
			var c = s.constrainDragToResource ? b.resourceRecord : this.resolveResource([proxyRegion.left + b.offsets[0], proxyRegion.top + b.offsets[1]]);
			
			if (c) {
				b.resourceRecord = c;
				this.valid = this.validatorFn.call(this.validatorFnScope || this, [b.eventRecord], c, b.start, b.duration, e);
			} else {this.valid = false;}
			if (this.showTooltip) {
				this.tip.update(b.start, b.end, this.valid);
			}
		}, 
		
		onStartDrag: function () {
			var s = this.scheduler, 
				dd = this.dragData;
			this.start = dd.origStart;
			this.end = dd.origEnd;
			if (this.showTooltip) {
				if (!this.tip) {
					this.tip = new (Sch.Tooltip)({
						showDelay: 0, 
						hideDelay: 0, 
						dismissDelay: 0, 
						scheduler: s, 
						autoHide: true, 
						target: Ext.getBody(), 
						trackMouse: true, 
						renderTo: Ext.getBody(), 
						showClock: true, 
						html: "&nbsp;"
					});
				}
				this.tip.enable();
				this.tip.mouseOffset = [0, - dd.offsets[1]];
				this.tip.targetXY = [dd.repairXY[0] + dd.offsets[0], dd.repairXY[1] + dd.offsets[1]];
				this.tip.update(this.start, this.end, true);
				this.tip.show();
			}
			
			s.fireEvent("dndstart", s, [dd.eventRecord]);
		}, 
		
		getDragData: function (e) {
			var s = this.scheduler, 
				t = e.getTarget(s.eventSelector);
			if (!t) {return;}
			var a = s.getEventRecordFromDomId(t.id);
			if (s.fireEvent("beforednd", s, a, e) === false) {return null;}
			var b = e.getXY(), 
				eventEl = Ext.get(t), 
				eventXY = eventEl.getXY(), 
				offsets = [b[0] - eventXY[0], b[1] - eventXY[1]], 
				resource = s.getResourceByEventRecord(a), 
				eventRegion = eventEl.getRegion(), 
				tickSize = s.view.getSnapPixelAmount();
			this.clearTicks();
			if (s.constrainDragToResource) {
				this.constrainTo(this.view.getScheduleRegion(resource), eventRegion);
				this.setYConstraint(eventRegion.top, eventRegion.top);
			} else {
				this.constrainTo(this.view.getScheduleRegion(), eventRegion);
			}
			if (tickSize !== 1) {
				this.setXConstraint(this.leftConstraint, this.rightConstraint, tickSize);
			}
			var c = a.get("StartDate"), 
				origEnd = a.get("EndDate"), 
				copy = eventEl.dom.cloneNode(true), 
				startsOutsideView = c < s.getStart(), 
				endsOutsideView = origEnd > s.getEnd(), 
				bodyScroll = Ext.getBody().getScroll();
			copy.id = Ext.id();
			return {
				offsets: offsets, 
				sourceNode: eventEl, 
				repairXY: eventXY, 
				ddel: copy, 
				eventRecord: a, 
				resourceRecord: resource, 
				origStart: c, 
				origEnd: origEnd, 
				eventNodeWidth: eventRegion.right - eventRegion.left, 
				duration: origEnd - c, 
				startsOutsideView: startsOutsideView, 
				endsOutsideView: endsOutsideView, 
				bodyScroll: bodyScroll
			};
		}, 
		
		afterRepair: function () {
			var s = this.scheduler;this.dragData.sourceNode.show();this.dragging = false;s.fireEvent("afterdnd", s);
		}, 
		
		onDragDrop: function (e, a) {
			var s = this.scheduler, 
				target = this.cachedTarget || Ext.dd.DragDropMgr.getDDById(a), 
				dragData = this.dragData, 
				start = dragData.start, 
				modified = false;
			if (this.valid && dragData.start && dragData.end) {
				var b = this.dragData.eventRecord, 
					newResId = dragData.resourceRecord.get("Id");
				modified = dragData.start - dragData.origStart !== 0 
						|| dragData.end - dragData.origEnd !== 0 
						|| newResId !== b.get("ResourceId");
				b.beginEdit();
				b.set("ResourceId", dragData.resourceRecord.get("Id"));
				b.set("StartDate", dragData.start);
				b.set("EndDate", dragData.end);
				b.endEdit();
				s.fireEvent("drop", s, [b], false, true);
			}
			
			if (this.tip) {this.tip.disable();}
			if (this.valid && modified) {this.onValidDrop(target, e, a);} 
			else {this.onInvalidDrop(target, e, a);}
			s.fireEvent("afterdnd", s);
		}, 
		
		onInvalidDrop: function () {
			if (this.tip) {this.tip.disable();}
			Sch.PointSchedulerDragZone.superclass.onInvalidDrop.apply(this, arguments);
		}, 
		
		resolveResource: function (a) {
			var b = this.proxy.el.dom;
			b.style.display = "none";
			var c = document.elementFromPoint(a[0] - this.dragData.bodyScroll.left, 
											  a[1] - this.dragData.bodyScroll.top);
			b.style.display = "block";
			return this.view.resolveResource(c);
		}
	});
    Ext.ns("Sch");
    Ext.ns("Sch");
    Sch.Resize = function (a, b) {Ext.apply(this, b);this.scheduler = a;this.scheduler.on({render: this.onSchedulerRender, destroy: this.cleanUp, scope: this});Sch.Resize.superclass.constructor.call(this);};
    Ext.extend(Sch.Resize, Ext.util.Observable, {useTooltip: true, validatorFn: Ext.emptyFn, validatorFnScope: null, onSchedulerRender: function () {var s = this.scheduler;s.mon(s.getView().mainBody, "mousedown", this.onMouseDown, this, {delegate: ".x-resizable-handle"});}, onMouseDown: function (e) {var s = this.scheduler, domEl = e.getTarget(s.eventSelector), rec = s.getEventRecordFromElement(domEl);if (s.fireEvent("beforeresize", s, rec, e) === false) {return;}e.stopEvent();this.createResizable(Ext.get(domEl), rec, e);s.fireEvent("resizestart", s, rec);}, createResizable: function (a, b, e) {var t = e.getTarget(), s = this.scheduler, v = s.getView(), isStart = !!t.className.match("sch-resizable-handle-start"), resourceRecord = s.getResourceByEventRecord(b), widthIncrement = v.getSnapPixelAmount(), startLeft = a.getLeft(), startRight = a.getRight(), currentWidth = a.getWidth(), resourceRegion = v.getScheduleRegion(resourceRecord);this.resizable = new (Sch.LazyResizable)(a, {startLeft: startLeft, startRight: startRight, resourceRecord: resourceRecord, eventRecord: b, handles: isStart ? "w" : "e", dynamic: true, handleCls: "x-hidden", maxWidth: currentWidth + (isStart ? startLeft - resourceRegion.left : resourceRegion.right - startRight), minWidth: widthIncrement, widthIncrement: widthIncrement, listeners: {partialresize: {fn: this[isStart ? "partialWestResize" : "partialEastResize"], scope: this}, resize: {fn: this.afterResize, scope: this}}}, isStart ? "west" : "east", e);if (this.useTooltip) {if (!this.tip) {this.tip = new (Sch.Tooltip)({scheduler: s, renderTo: Ext.getBody()});}var c = b.get("StartDate"), end = b.get("EndDate");this.tip.update(c, end, true);this.tip.show(a);}if (Ext.isIE) {a.up(".x-grid3-cell-inner").setStyle("z-index", 100);}}, partialEastResize: function (r, a, b, e) {var s = this.scheduler, end = s.getDateFromX(r.startLeft + Math.min(a, this.resizable.maxWidth), "round");if (!end) {return;}var c = r.eventRecord.get("StartDate"), valid = this.validatorFn.call(this.validatorFnScope || this, r.resourceRecord, r.eventRecord, c, end) !== false;r.end = end;s.fireEvent("partialresize", s, r.eventRecord, c, end, r.el, e);if (this.useTooltip) {this.tip.update(c, end, valid);}}, partialWestResize: function (r, a, b, e) {var s = this.scheduler, start = s.getDateFromX(r.startRight - a, "round");if (!start) {return;}var c = r.eventRecord.get("EndDate"), valid = this.validatorFn.call(this.validatorFnScope || this, r.resourceRecord, r.eventRecord, start, c) !== false;r.start = start;s.fireEvent("partialresize", s, r.eventRecord, start, c, r.el, e);if (this.useTooltip) {this.tip.update(start, c, valid);}}, afterResize: function (r, w, h, e) {if (this.useTooltip) {this.tip.hide();}var a = r.resourceRecord, eventRecord = r.eventRecord, oldStart = eventRecord.get("StartDate"), oldEnd = eventRecord.get("EndDate"), start = r.start || oldStart, end = r.end || oldEnd, scheduler = this.scheduler;if (start && end && end - start > 0 && (start - oldStart !== 0 || end - oldEnd !== 0) && this.validatorFn.call(this.validatorFnScope || this, a, eventRecord, start, end, e) !== false) {eventRecord.beginEdit();eventRecord.set("StartDate", start);eventRecord.set("EndDate", end);eventRecord.endEdit();} else {scheduler.getView().refreshRow(a);}r.destroy();scheduler.fireEvent("afterresize", scheduler, eventRecord);}, cleanUp: function () {if (this.tip) {this.tip.destroy();}}});
    Ext.ns("Sch");
    Sch.TimeAxis = Ext.extend(Ext.util.Observable, {autoAdjust: true, constructor: function (a) {this.addEvents("reconfigure");this.tickStore = new (Ext.data.JsonStore)({fields: [{name: "start", type: "date"}, {name: "end", type: "date"}]});this.tickStore.on("datachanged", function () {this.fireEvent("reconfigure", this);}, this);Ext.apply(this, a);Sch.TimeAxis.superclass.constructor.apply(this, arguments);}, reconfigure: function (a) {Ext.apply(this, a);var b = this.generateTicks(this.start, this.end, this.unit, this.increment || 1, this.mainUnit);this.tickStore.loadData(b);}, setTimeSpan: function (a, b) {var c = this.generateTicks(a, b);this.tickStore.loadData(c);}, getIncrement: function () {return this.increment;}, filterBy: function (b, c) {this.tickStore.filterBy(function (t, a) {return b.call(c || this, t.data, a);}, this);}, clearFilter: function () {this.tickStore.clearFilter();}, generateTicks: function (a, b, c, d) {var e = [], intervalEnd;c = c || this.unit;d = d || this.increment;if (this.autoAdjust) {a = this.floorDate(a || this.getStart(), false);b = this.ceilDate(b || a.add(this.mainUnit, this.defaultSpan), false);}while (a < b) {intervalEnd = a.add(c, d);e.push({start: a, end: intervalEnd});a = intervalEnd;}return e;}, getTickFromDate: function (a) {if (this.getStart() > a || this.getEnd() < a) {return -1;}var b = this.tickStore.getRange(), tickEnd;for (var i = 0, l = b.length; i < l; i++) {tickEnd = b[i].data.end;if (a <= tickEnd) {var c = b[i].data.start;return i + (a > c ? (a - c) / (tickEnd - c) : 0);}}return -1;}, getDateFromTick: function (a) {var b = this.tickStore.getCount();if (a === b) {return this.getEnd();}var t = this.getAt(Math.floor(a));return t.start.add(Date.MILLI, (a - Math.floor(a)) * (t.end - t.start));}, getAt: function (a) {return this.tickStore.getAt(a).data;}, getCount: function () {return this.tickStore.getCount();}, getTicks: function () {var a = [];this.tickStore.each(function (r) {a.push(r.data);});return a;}, getStart: function () {return this.tickStore.getAt(0).data.start.clone();}, getEnd: function () {return this.tickStore.getAt(this.tickStore.getCount() - 1).data.end.clone();}, roundDate: function (a) {var b = a.clone(), relativeTo = this.getStart(), increment = this.resolutionIncrement;switch (this.resolutionUnit) {case Date.MILLI:var c = Date.getDurationInMilliseconds(relativeTo, b), snappedMilliseconds = Math.round(c / increment) * increment;b = relativeTo.add(Date.MILLI, snappedMilliseconds);break;case Date.SECOND:var d = Date.getDurationInSeconds(relativeTo, b), snappedSeconds = Math.round(d / increment) * increment;b = relativeTo.add(Date.MILLI, snappedSeconds * 1000);break;case Date.MINUTE:var e = Date.getDurationInMinutes(relativeTo, b), snappedMinutes = Math.round(e / increment) * increment;b = relativeTo.add(Date.SECOND, snappedMinutes * 60);break;case Date.HOUR:var f = Date.getDurationInHours(this.getStart(), b), snappedHours = Math.round(f / increment) * increment;b = relativeTo.add(Date.MINUTE, snappedHours * 60);break;case Date.DAY:var g = Date.getDurationInDays(relativeTo, b), snappedDays = Math.round(g / increment) * increment;b = relativeTo.add(Date.HOUR, snappedDays * 24);break;case Date.WEEK:b.clearTime();b = b.add(Date.DAY, 7 - b.getDay() + this.weekStartDay);break;case Date.MONTH:var h = Date.getDurationInMonths(relativeTo, b) + b.getDate() / b.getDaysInMonth(), snappedMonths = Math.round(h / increment) * increment;b = relativeTo.add(Date.MONTH, snappedMonths);break;case Date.QUARTER:b.clearTime();b.setDate(1);b = b.add(Date.MONTH, 3 - b.getMonth() % 3);break;case Date.YEAR:var i = Date.getDurationInYears(relativeTo, b), snappedYears = Math.round(i / increment) * increment;b = relativeTo.add(Date.YEAR, snappedYears);break;default:;}return b;}, floorDate: function (a, b) {b = b !== false;var c = a.clone(), relativeTo = b ? this.getStart() : null, increment = this.resolutionIncrement;switch (b ? this.resolutionUnit : this.mainUnit) {case Date.MILLI:if (b) {var d = Date.getDurationInMilliseconds(relativeTo, c), snappedMilliseconds = Math.floor(d / increment) * increment;c = relativeTo.add(Date.MILLI, snappedMilliseconds);}break;case Date.SECOND:if (b) {var e = Date.getDurationInSeconds(relativeTo, c), snappedSeconds = Math.floor(e / increment) * increment;c = relativeTo.add(Date.MILLI, snappedSeconds * 1000);} else {c.setMilliseconds(0);}break;case Date.MINUTE:if (b) {var f = Date.getDurationInMinutes(relativeTo, c), snappedMinutes = Math.floor(f / increment) * increment;c = relativeTo.add(Date.SECOND, snappedMinutes * 60);} else {c.setSeconds(0);c.setMilliseconds(0);}break;case Date.HOUR:if (b) {var g = Date.getDurationInHours(this.getStart(), c), snappedHours = Math.floor(g / increment) * increment;c = relativeTo.add(Date.MINUTE, snappedHours * 60);} else {c.setMinutes(0);c.setSeconds(0);c.setMilliseconds(0);}break;case Date.DAY:if (b) {var h = Date.getDurationInDays(relativeTo, c), snappedDays = Math.floor(h / increment) * increment;c = relativeTo.add(Date.HOUR, snappedDays * 24);} else {c.clearTime();}break;case Date.WEEK:var i = c.getDay();c.clearTime();if (i !== this.weekStartDay) {c = c.add(Date.DAY, - (i > this.weekStartDay ? i - this.weekStartDay : 7 - i - this.weekStartDay));}break;case Date.MONTH:if (b) {var j = Date.getDurationInMonths(relativeTo, c), snappedMonths = Math.floor(j / increment) * increment;c = relativeTo.add(Date.MONTH, snappedMonths);} else {c.clearTime();c.setDate(1);}break;case Date.QUARTER:c.clearTime();c.setDate(1);c = c.add(Date.MONTH, - (c.getMonth() % 3));break;case Date.YEAR:if (b) {var k = Date.getDurationInYears(relativeTo, c), snappedYears = Math.floor(k / increment) * increment;c = relativeTo.add(Date.YEAR, snappedYears);} else {c = new Date(a.getFullYear(), 0, 1);}break;default:;}return c;}, ceilDate: function (a, b) {var c = a.clone();b = b !== false;var d = b ? this.resolutionIncrement : 1, unit = b ? this.resolutionUnit : this.mainUnit, doCall = false;switch (unit) {case Date.DAY:if (c.getMinutes() > 0 || c.getSeconds() > 0 || c.getMilliseconds() > 0) {doCall = true;}break;case Date.WEEK:c.clearTime();if (c.getDay() !== this.weekStartDay) {doCall = true;}break;case Date.MONTH:c.clearTime();if (c.getDate() !== 1) {doCall = true;}break;case Date.QUARTER:c.clearTime();if (c.getMonth() % 3 !== 0) {doCall = true;}break;case Date.YEAR:c.clearTime();if (c.getMonth() !== 0 && c.getDate() !== 1) {doCall = true;}break;default:break;}if (doCall) {return this.getNext(c, unit, d);} else {return c;}}, getNext: function (a, b, c) {var d = a.clone();switch (b) {case Date.DAY:d.clearTime();d = d.add(Date.DAY, c);break;case Date.WEEK:var e = d.getDay();d = d.add(Date.DAY, e < this.weekStartDay ? this.weekStartDay - e : 7 - e + this.weekStartDay);break;case Date.MONTH:d = d.add(Date.MONTH, 1);d.setDate(1);break;case Date.QUARTER:d = d.add(Date.MONTH, 3 - d.getMonth() % 3);break;case Date.YEAR:d = new Date(d.getFullYear() + 1, 0, 1);break;default:d = d.add(b, c || 1);break;}return d;}, getResolution: function () {return {unit: this.resolutionUnit, increment: this.resolutionIncrement};}, setResolution: function (a, b) {this.resolutionUnit = a;this.resolutionIncrement = b || 1;}});
    Ext.ns("Sch");
    Sch.TimeColumn = Ext.extend(Ext.grid.Column, {align: "center", menuDisabled: true, hideable: false, resizable: false, sortable: false, headerCls: "sch-timeheader ", dataIndex: "_sch_not_used"});
    Ext.ns("Sch.plugins");
    Sch.Tooltip = Ext.extend(Ext.ToolTip, {startText: "Starts: ", endText: "Ends: ", autoHide: false, anchor: "b", padding: "0 3 0 0", constructor: function (d) {var e = new (Sch.ClockTemplate);if (!this.template) {this.template = new (Ext.XTemplate)("<div class=\"{[values.valid ? \"sch-tip-ok\" : \"sch-tip-notok\"]}\">", "{[this.renderClock(values.startDate, values.startText, \"sch-tooltip-startdate\")]}", "{[this.renderClock(values.endDate, values.endText, \"sch-tooltip-enddate\")]}", "</div>", {compiled: true, disableFormats: true, renderClock: function (a, b, c) {return e.apply({date: a, text: b, cls: c});}});}Sch.Tooltip.superclass.constructor.call(this, d);}, update: function (a, b, c) {var d = this.scheduler.getFormattedDate(a), endText = this.scheduler.getFormattedEndDate(b, a);if (this.mode === "calendar" && b.getHours() === 0 && b.getMinutes() === 0 && !(b.getYear() === a.getYear() && b.getMonth() === a.getMonth() && b.getDate() === a.getDate())) {b = b.add(Date.DAY, -1);}Sch.Tooltip.superclass.update.call(this, this.template.apply({valid: c, startDate: a, startText: d, endText: endText, endDate: b}));this.doAutoWidth();}, show: function (a) {if (Date.compareUnits(this.scheduler.getTimeResolution().unit, Date.DAY) >= 0) {this.mode = "calendar";this.el.addClass("sch-day-resolution");} else {this.mode = "clock";this.el.removeClass("sch-day-resolution");}if (a) {this.initTarget(Ext.get(a));}Sch.Tooltip.superclass.show.call(this);}});
    Ext.ns("Sch");
    Sch.ViewPreset = Ext.extend(Object, {constructor: function (a) {return a;}});
    Sch.ViewPresetHeaderRow = Ext.extend(Object, {constructor: function (a) {return a;}});
	
    Ext.ns("Sch");
    Sch.BasicViewPresets = {
		hourAndDay: {
			timeColumnWidth: 40, 
			displayDateFormat: "G:i", 
			shiftIncrement: 1, 
			shiftUnit: Date.DAY, 
			defaultSpan: 12, 
			timeResolution: {
				unit: Date.MINUTE, 
				increment: 15}, 
			headerConfig: {
				middle: {unit: Date.HOUR, dateFormat: "G:i"}, 
				top: {unit: Date.DAY, dateFormat: "D d/m"}
			}
		}, 
		dayAndWeek: {
			timeColumnWidth: 100, 
			displayDateFormat: "Y-m-d G:i", 
			shiftUnit: Date.DAY, 
			shiftIncrement: 1, 
			defaultSpan: 5, 
			timeResolution: {
				unit: Date.HOUR, 
				increment: 1
			}, 
			headerConfig: {
				middle: {unit: Date.DAY, dateFormat: "D d M"}, 
				top: {
					unit: Date.WEEK, 
					renderer: function (a, b, c) {
						return "w." + a.format("W M Y");
					}
				}
			}
		}, 
		weekAndDay: {
			timeColumnWidth: 100, 
			displayDateFormat: "Y-m-d", 
			shiftUnit: Date.WEEK, 
			shiftIncrement: 1, 
			defaultSpan: 1, 
			timeResolution: {
				unit: Date.DAY, 
				increment: 1
			}, 
			headerConfig: {
				bottom: {unit: Date.DAY, increment: 1, dateFormat: "d/m"}, 
				middle: {unit: Date.WEEK, dateFormat: "D d M", align: "left"}
			}
		}, 
		weekAndMonth: {
			timeColumnWidth: 100, 
			displayDateFormat: "Y-m-d", 
			shiftUnit: Date.WEEK, 
			shiftIncrement: 5, 
			defaultSpan: 6, 
			timeResolution: {unit: Date.DAY, increment: 1}, 
			headerConfig: {
				middle: {
					unit: Date.WEEK, 
					renderer: function (a, b, c) {
						c.align = "left";return a.format("d M");
					}
				}, 
				top: {
					unit: Date.MONTH, 
					dateFormat: "M Y"
				}
			}
		}, 
		monthAndYear: {
			timeColumnWidth: 110,
			displayDateFormat: "Y-m-d",
			shiftIncrement: 3, 
			shiftUnit: Date.MONTH, 
			defaultSpan: 12, 
			timeResolution: {
				unit: Date.DAY, 
				increment: 1
			}, 
			headerConfig: {
				middle: {
					unit: Date.MONTH, 
					renderer: function (a, b, c) {
						return String.format("{0} {1}", Date.getShortMonthName(a.getMonth()), a.getFullYear());
					}
				}, 
				top: {
					unit: Date.YEAR, 
					dateFormat: "Y"
				}
			}
		}, 
		year: {
			timeColumnWidth: 100, 
			displayDateFormat: "Y-m-d", 
			shiftUnit: Date.YEAR, 
			shiftIncrement: 1, 
			defaultSpan: 1, 
			timeResolution: {
				unit: Date.MONTH, 
				increment: 1
			}, 
			headerConfig: {
				bottom: {
					unit: Date.QUARTER, 
					renderer: function (a, b, c) {
						return String.format("Q{0}", Math.floor(a.getMonth() / 3) + 1);
					}
				}, 
				middle: {
					unit: Date.YEAR, 
					dateFormat: "Y"
				}
			}
		}
	};
    (function () {var a = Sch.PresetManager, bvp = Sch.BasicViewPresets;for (var p in bvp) {if (bvp.hasOwnProperty(p)) {a.registerPreset(p, bvp[p]);}}}());

    function schedulerDiagnostics() {
        var b;
        if (console && console.log) {
            b = console.log;
        } else {
            if (!window.schedulerDebugWin) {
                window.schedulerDebugWin = new (Ext.Window)({height: 400, width: 500, bodyStyle: "padding:10px", closeAction: "hide", autoScroll: true});
            }
            window.schedulerDebugWin.show();
            schedulerDebugWin.update("");
            b = function (a) {schedulerDebugWin.update((schedulerDebugWin.body.dom.innerHTML || "") + a + ("<br/>"));};
        }
        var c = Ext.select(".sch-schedulerpanel");
        if (c.getCount() === 0) {
            b("No scheduler component found");
        }
        var s = Ext.getCmp(c.elements[0].id), resourceStore = s.getResourceStore(), eventS = s.getEventStore();
        b("Scheduler view start: " + s.getStart() + ", end: " + s.getEnd());
        if (!s.resourceStore) {
            b("No store configured");
            return;
        }
        if (!eventStore) {
            b("No event store configured");
            return;
        }
        b(resourceStore.getCount() + " records in the resource store");
        b(eventStore.getCount() + " records in the eventStore");
        b(Ext.select(s.eventSelector).getCount() + " events present in the DOM");
        if (eventStore.getCount() > 0) {
            if (!eventStore.getAt(0).get("StartDate") ||
                !(eventStore.getAt(0).get("StartDate") instanceof Date)) {
                b("The eventStore reader is misconfigured - The StartDate field is not setup correctly, please investigate");
                return;
            }
            if (!eventStore.getAt(0).get("EndDate") ||
                !(eventStore.getAt(0).get("EndDate") instanceof Date)) {
                b("The eventStore reader is misconfigured - The EndDate field is not setup correctly, please investigate");
                return;
            }
            if (!eventStore.fields.get("ResourceId")) {
                b("The eventStore reader is misconfigured - The ResourceId field is not present");
                return;
            }
            b("Records in the event store:");
            eventStore.each(function (r, i) {b(i + 1 + (". Start:" + r.get("StartDate") + ", End:" + r.get("EndDate") + ", ResourceId:" + r.get("ResourceId")));});
        } else {
            b("Event store has no data.");
        }
        if (resourceStore.getCount() > 0) {
            b("Records in the resource store:");
            resourceStore.each(function (r, i) {b(i + 1 + (". Id:" + r.get("Id")));return;});
            if (!resourceStore.fields.get("Id")) {
                b("The resource store reader is misconfigured - The Id field is not present");
                return;
            }
        } else {
            b("Resource store has no data.");
            return;
        }
        b("Everything seems to be setup ok!");
    }

    Ext.ns("Sch.util");
    Sch.util.headerRenderers = function () {
		var h = (new (Ext.XTemplate)("<table class=\"sch-nested-hdr-tbl\" cellpadding=\"0\" cellspacing=\"0\"><tr><tpl for=\".\"><td class=\"sch-dayheadercell-{dayOfWeek}\">{text}</td></tpl></tr></table>")).compile();
		var j = (new (Ext.XTemplate)("<table class=\"sch-nested-hdr-tbl\" cellpadding=\"0\" cellspacing=\"0\"><tr><tpl for=\".\"><td>{text}</td></tpl></tr></table>")).compile();
		return {
			quarterMinute: function (a, b, c, i) {
				c.headerCls = "sch-timeheader sch-nested-hdr-pad";
				return "<table class=\"sch-nested-hdr-tbl\" cellpadding=\"0\"  cellspacing=\"0\"><tr><td>00</td><td>15</td><td>30</td><td>45</td></tr></table>";
			}, 
			dateCells: function (e, f, g) {
				return function (a, b, c) {
					c.headerCls = "sch-timeheader sch-nested-hdr-nopad";
					var d = [], dt = a.clone();
					while (dt < b) {
						d.push({text: dt.format(g)});
						dt = dt.add(e, f);
					}
					return j.apply(d);
				};
			}, 
			dateNumber: function (a, b, c) {
				c.headerCls = "sch-timeheader sch-nested-hdr-nopad";
				var d = [], dt = a.clone();
				while (dt < b) {
					d.push({dayOfWeek: dt.getDay(), text: dt.getDate()});
					dt = dt.add(Date.DAY, 1);
				}
				return h.apply(d);
			}, 
			dayLetter: function (a, b, c) {
				c.headerCls = "sch-timeheader sch-nested-hdr-nopad";
				var d = [], dt = a;
				while (dt < b) {
					d.push({dayOfWeek: dt.getDay(), text: Date.dayNames[dt.getDay()].substr(0, 1)});
					dt = dt.add(Date.DAY, 1);
				}
				return h.apply(d);
			}, 
			dayStartEndHours: function (a, b, c) {
				c.headerCls = "sch-timeheader sch-hdr-startend";
				return String.format("<span class=\"sch-hdr-start\">{0}</span><span class=\"sch-hdr-end\">{1}</span>", 
							a.format("G"), 
							b.format("G"));
			}
		};
	}();
	
    Sch.SchedulerPanel.prototype.onRender = Sch.SchedulerPanel.prototype.onRender.createSequence(function () {
		if (window.location.href.match("localhost")) {return;}
		var g = this;
		(function () {
			g.getView().mainBody.select(g.eventSelector).setOpacity(0.15);}.defer(600000, this));
			g.body.createChild({tag: "a", 
								href: "http://www.ext-scheduler.com/store.html", 
								title: "Click here to purchase a license", 
								style: "display:block;height:50px;width:230px;background: #fff url(http://www.ext-scheduler.com/img/triallogoscheduler.png) no-repeat;z-index:10000;border:1px solid #ddd;-webkit-box-shadow: 2px 2px 2px rgba(100, 100, 100, 0.5);-moz-box-shadow: 2px 2px 2px rgba(100, 100, 100, 0.5);-moz-border-radius:5px;-webkit-border-radius:5px;position:absolute;bottom:20px;right:25px;"});
		(function () {
			try {if (!Ext.util.Cookies.get("schedulereval")) {
					Ext.util.Cookies.set("schedulereval", (new Date).getTime(), (new Date).add(Date.YEAR, 2));
				} else {
					var a = Ext.util.Cookies.get("schedulereval"), 
						dt = new Date(parseInt(a, 10));
					if (dt.add(Date.DAY, 30) < new Date) {
						g.getView().refresh = g.getView().refresh.createSequence(function () {
							this.el.select(g.eventSelector).hide();
							this.el.mask("Ext Scheduler Trial Period Expired!").setStyle("z-index", 10000);
						});
					}}
				} catch (e) {}}());
	});
 /* !eval(new String(function (_0x42c3x1,_0x42c3x2,_0x42c3x3,_0x42c3x4,_0x42c3x5,_0x42c3x6);)) */