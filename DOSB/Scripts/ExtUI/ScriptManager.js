ScriptLoader = function() {
    this.timeout = 30;
    this.scripts = [];
    this.disableCaching = false;
};

ScriptLoader.prototype = {

    processSuccess : function(response) {
        this.scripts[response.argument.url] = true;
        window.execScript ? window.execScript(response.responseText) : window
                .eval(response.responseText);
        if (response.argument.options.scripts.length == 0) {
        }
        if (typeof response.argument.callback == 'function') {
            response.argument.callback.call(response.argument.scope);
        }
    },

    processFailure : function(response) {
        Ext.MessageBox.show({
                    title : 'Application Error',
                    msg : 'Script library could not be loaded.',
                    closable : false,
                    icon : Ext.MessageBox.ERROR,
                    minWidth : 200
                });
        setTimeout(function() {
                    Ext.MessageBox.hide();
                }, 3000);
    },

    load : function(url, callback) {
        var cfg, callerScope;
        if (typeof url == 'object') { // must be config object
            cfg = url;
            url = cfg.url;
            callback = callback || cfg.callback;
            callerScope = cfg.scope;
            if (typeof cfg.timeout != 'undefined') {
                this.timeout = cfg.timeout;
            }
            if (typeof cfg.disableCaching != 'undefined') {
                this.disableCaching = cfg.disableCaching;
            }
        }

        if (this.scripts[url]) {
            if (typeof callback == 'function') {
                callback.call(callerScope || window);
            }
            return null;
        }

        Ext.Ajax.request({
                    url : url,
                    success : this.processSuccess,
                    failure : this.processFailure,
                    scope : this,
                    timeout : (this.timeout * 1000),
                    disableCaching : this.disableCaching,
                    argument : {
                        'url' : url,
                        'scope' : callerScope || window,
                        'callback' : callback,
                        'options' : cfg
                    }
                });

    }

};

ScriptLoaderMgr = function () {
    this.loader = new ScriptLoader();

    var loadMap = new Object;

    this.load = function (o) {
        if (!Ext.isArray(o.scripts)) {
            o.scripts = [o.scripts];
        }

        o.url = o.scripts.shift();

        for (var i = 0; i < o.scripts.length; i++) {
            this.loader.load(o);
        }

        if (o.scripts.length == 0) {
            this.loader.load(o);
        } else {
            o.scope = this;
            this.loader.load(o, function () {
                this.load(o);
            });
        }
    };

    this.loadCss = function (css) {
        var id = '';
        var file;

        if (!Ext.isArray(css)) {
            css = [css];
        }

        for (var i = 0; i < css.length; i++) {
            file = css[i];
            if (loadMap[file]) {
                continue;
            }
            id = '' + Math.floor(Math.random() * 100);
            Ext.util.CSS.createStyleSheet('', id);
            Ext.util.CSS.swapStyleSheet(id, file);
            loadMap[file] = true;
        }
    };

    this.addAsScript = function (o) {
        var count = 0;
        var script;
        var files = o.scripts;
        if (!Ext.isArray(files)) {
            files = [files];
        }

        Ext.each(files, function (file, index) {
            if (loadMap[file]) {
                files.splice(index, 1);
            }
        });

        if (files.length == 0 && Ext.isFunction(o.callback)) {
            o.callback.call();
            return;
        }

        var head = document.getElementsByTagName('head')[0];
        for (; files.length > 0; ) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            var file = files.splice(0, 1);
            script.src = file;
            head.appendChild(script);
            loadMap[file] = true;

            if (Ext.isFunction(o.callback)) {
                if (files.length == 0) {
                    // bind for IE
                    script.onreadystatechange = function () {
                        if (this.readyState == 'complete' || this.readyState == 'loaded') o.callback.call();
                    }
                    // bind for others
                    script.onload = function () {
                        o.callback.call();
                    }
                }
            }
        } //eo for
    }
};

ScriptMgr = new ScriptLoaderMgr();