/**
* DOSB
*
* @author    Yuan Lichuan
* @copyright (c) 2011, by Yuan Lichuan
* @company	 Schlumberger
* @date      5. March 2011
* @version   $Id$
*/

Ext.BLANK_IMAGE_URL = '/Scripts/ext/resources/images/default/s.gif';
Ext.ns('Dosb');

/*
var App = new Ext.App({});
////
// ***New*** centralized listening of DataProxy events "beforewrite", "write" and "writeexception"
// upon Ext.data.DataProxy class.  This is handy for centralizing user-feedback messaging into one place rather than
// attaching listenrs to EACH Store.
//
// Listen to all DataProxy beforewrite events
//
Ext.data.DataProxy.addListener('beforewrite', function(proxy, action) {
    App.setAlert(App.STATUS_NOTICE, "Before " + action);
});

////
// all write events
//
Ext.data.DataProxy.addListener('write', function(proxy, action, result, res, rs) {
    App.setAlert(true, action + ':' + res.message);
});

////
// all exception events
//
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
*/

// application main entry point
Ext.onReady(function() {
 
    Ext.QuickTips.init();

    // Go ahead and create the TreePanel now so that we can use it below
    var menuTreePanel = new Ext.tree.TreePanel({
    	id: 'menu-tree-panel',
    	title: 'Menu',
        region:'west',
        split: true,
        width: 225,
        minSize: 175,
        maxSize: 400,
        collapsible: true,
        autoScroll: true,
        
        // tree-specific configs:
        rootVisible: false,
        lines: false,
        singleExpand: false,
        useArrows: true,
        
        loader: new Ext.tree.TreeLoader({
            dataUrl:'/ExtUI/SiteMenu'
        }),
        
        root: new Ext.tree.AsyncTreeNode()
    });
	
	var mainPanel = new Ext.Panel({
	    region: 'center',
		border: false,
	    layout: 'fit',
	    id: 'main-panel'
	});

    var viewport = new Ext.Viewport({
        layout:'border', 
		items: [{
			xtype: 'box',
			region: 'north',
			height: 50
		},
			menuTreePanel,
			mainPanel
		],
        renderTo: Ext.getBody()
    });

	var menuMapping = new Array();
	
	menuMapping['ca-fields'] = {
		scripts: ['/Scripts/ExtUI/ux/Dosb.ux.ClientCombo.js',
				  '/Scripts/ExtUI/ux/Dosb.ux.CountryCombo.js',
				  '/Scripts/ExtUI/CActivity/FieldEditor.js'], 
		xtype: 'dosb-ca-feditor', 
		id: 'main-ca-fields'
	};
	
	menuMapping['ca-gtview'] = {
		scripts:'/Scripts/ExtUI/CActivity/GridViewTest.js', 
		xtype: 'dosb-ca-gtview', 
		id: 'main-ca-gtview'
	};
	
	menuMapping['ca-yview'] = {
		css: ['/Scripts/ext/examples/ux/css/Spinner.css',
			  '/Scripts/Sch/sch-all.css',
			  '/Scripts/Sch/app.css'],		
	    scripts: ['/Scripts/Sch/ext-sch-crack.js',				//sch
				  '/Scripts/ExtUI/ux/Dosb.ux.FieldCombo.js',	//ux
				  '/Scripts/ExtUI/CActivity/YearScheduler.js',	//app
				  '/Scripts/ExtUI/CActivity/YearView.js'],  
		xtype: 'dosb-ca-yview', 
		id: 'main-ca-yview'
	};
	
	menuMapping['ca-mview'] = {
		css: ['/Scripts/ext/examples/ux/css/Spinner.css',
			  '/Scripts/ext/examples/ux/css/LockingGridView.css',
			  '/Scripts/Sch/sch-all.css',
			  '/Scripts/Sch/app.css'],		
	    scripts: ['/Scripts/ExtUI/ux/ext.ux.form.datetime.js',
				 '/Scripts/ExtUI/ux/Dosb.ux.CompanyCombo.js',
				 '/Scripts/ExtUI/ux/Dosb.ux.CountryCombo.js',
				 '/Scripts/ExtUI/ux/Dosb.ux.ClientCombo.js',
				 '/Scripts/ExtUI/ux/Dosb.ux.FieldCombo.js',
				 '/Scripts/ExtUI/ux/Dosb.ux.CompTypeCombo.js',
				 '/Scripts/ExtUI/ux/Dosb.ux.WellTypeCombo.js',
				 '/Scripts/ExtUI/ux/Dosb.ux.RigField.js',
				 '/Scripts/ExtUI/ux/Dosb.ux.WellField.js',
				 '/Scripts/Sch/ext-sch-crack.js',
				 '/CompletionActivity/CustomHeaderJS',
				 '/Scripts/ExtUI/CActivity/CActivityWindow.js',
				 '/Scripts/ExtUI/CActivity/RAEditor.js',
				 '/Scripts/ExtUI/CActivity/MonthScheduler.js',
				 '/Scripts/ExtUI/CActivity/MonthView.js'], 
		xtype: 'dosb-ca-mview', 
		id: 'main-ca-mview'
	};
	
	menuTreePanel.on('click', function(n){
    	var sn = this.selModel.selNode || {}; // selNode is null on initial selection
    	if(n.leaf){  // ignore clicks on folders and currently selected node 
			// execute an Ajax request to invoke server side script:
			treeData = menuMapping[n.id];
			ScriptMgr.loadCss(treeData.css);
			ScriptMgr.addAsScript({
			     scripts : treeData.scripts,
			     callback : function() {
					var mainPanel = Ext.getCmp('main-panel');
					mainPanel.removeAll();
			        var panel = {xtype: treeData.xtype, id: treeData.id}
					mainPanel.add(panel);
					mainPanel.doLayout();
			     },
			     scope : this
			});
    	}
    });

}); // eo function onReady
 
// eof