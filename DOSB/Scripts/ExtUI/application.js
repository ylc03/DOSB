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
	
	menuMapping['ca-gtview'] = {
		scripts:'/Scripts/ExtUI/CActivity/GridViewTest.js', 
		xtype: 'dosb-ca-gtview', 
		id: 'main-ca-gtview'
	};
	
	menuMapping['ca-mview'] = {
	    scripts: ['/Scripts/ext/examples/ux/LockingGridView.js',
				 '/Scripts/ExtUI/ux/LockingColumnHeaderGroup.js',
				 '/CompletionActivity/MonthViewJS'], 
		xtype: 'dosb-ca-monthview', 
		id: 'main-ca-mview'
	};
	
	menuMapping['ca-yview'] = {
	    scripts: '/Scripts/CActivity/YearView.js', 
		xtype: 'dosb-ca-yearview', 
		id: 'main-ca-yview'
	};
	
	menuTreePanel.on('click', function(n){
    	var sn = this.selModel.selNode || {}; // selNode is null on initial selection
    	if(n.leaf){  // ignore clicks on folders and currently selected node 
			// execute an Ajax request to invoke server side script:
			treeData = menuMapping[n.id];
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