Ext.ux.MonthPickerPlugin = function(config) {
    Ext.apply(this, config);
}

Ext.ux.MonthPickerPlugin.prototype = {
    init: function(picker) {
        this.picker = picker;
        picker.onTriggerClick = picker.onTriggerClick.createSequence(this.onClick, this);
        picker.parseDate = picker.parseDate.createInterceptor(this.setDefaultMonthDay, this).createSequence(this.restoreDefaultMonthDay, this);
    },

    setDefaultMonthDay: function() {
        this.oldDateDefaults = Date.defaults.d;
        Date.defaults.d = 1;
        return true;
    },

    restoreDefaultMonthDay: function(ret) {
        Date.defaults.d = this.oldDateDefaults;
        return ret;
    },

    first: true,

    onClick: function(e, el, opt) {
        var p = this.picker.menu.picker;
        p.activeDate = p.activeDate.getFirstDateOfMonth();
        if (p.value) {
            p.value = p.value.getFirstDateOfMonth();
        }
        p.showMonthPicker();
        if (!p.disabled) {
            if (this.first) {
                // We should create the sequence functions only once.
                this.first = false;
                if (Ext.version < "3") {
                    p.monthPicker.slideIn = Ext.emptyFn;
                    p.monthPicker.slideOut = Ext.emptyFn;
                } else {
                    p.monthPicker.stopFx();
                }

                if (typeof p.mun == 'function') {
                    p.mun(p.monthPicker, 'click', p.onMonthClick, p);
                    p.mun(p.monthPicker, 'dblclick', p.onMonthDblClick, p);
                } else {
                    p.monthPicker.un('click', p.onMonthClick)
                    p.monthPicker.un('dblclick', p.onMonthDblClick)
                }
                p.onMonthClick = p.onMonthClick.createSequence(this.pickerClick, this);
                p.onMonthDblClick = p.onMonthDblClick.createSequence(this.pickerDblclick, this);
                p.mon(p.monthPicker, 'click', p.onMonthClick, p);
                p.mon(p.monthPicker, 'dblclick', p.onMonthDblClick, p);
            }
            p.monthPicker.show();
        }
    },

    pickerClick: function(e, t) {
        var picker = this.picker;
        var el = new Ext.Element(t);
        if (el.is('button.x-date-mp-cancel')) {
            picker.menu.hide();
        } else if (el.is('button.x-date-mp-ok')) {
            var p = picker.menu.picker;
            p.setValue(p.activeDate);
            p.fireEvent('select', p, p.value);
        }
    },

    pickerDblclick: function(e, t) {
        var el = new Ext.Element(t);
        var parent = el.parent();
        if (parent && (parent.is('td.x-date-mp-month') || parent.is('td.x-date-mp-year'))) {
            var p = this.picker.menu.picker;
            p.setValue(p.activeDate);
            p.fireEvent('select', p, p.value);
        }
    }
};

if(Ext.version >= "3") {
    Ext.preg('monthPickerPlugin', Ext.ux.MonthPickerPlugin); 
}