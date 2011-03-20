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
Ext.ns('Dosb.CActivity');
 
// application main entry point
Ext.onReady(function() {
 
    Ext.QuickTips.init();

   	var a = new Ext.Panel({
		viewConfig: {
			forceFit: true
		},
		items: [{xtype: 'dosb-ca-yview'}]
	});

	a.render('test');
 
}); // eo function onReady
 
// eof