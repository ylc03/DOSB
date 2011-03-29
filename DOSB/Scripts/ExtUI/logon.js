
// Path to the blank image should point to a valid location on your server
Ext.BLANK_IMAGE_URL = '/Scripts/ext/resources/images/default/s.gif';
               
Ext.onReady(function(){            
    Ext.QuickTips.init();
    var msg = function(title, msg) {
		Ext.Msg.show({
			title: title,
			msg: msg,
			minWidth: 200,
			modal: true,
			icon: Ext.Msg.INFO,
			buttons: Ext.Msg.OK
		});
    };
	
    var loginForm = new Ext.form.FormPanel({
		frame:true,
		width:260,     
		labelWidth:60,         
		defaults: {
			width: 165
        },
        items: [
			new Ext.form.TextField({
				id:"UserName",
				fieldLabel:"LDAP",
                allowBlank:false,
                blankText:"Enter your LDAP alias"
            }),
            new Ext.form.TextField({
				id:"Password",
				fieldLabel:"Password",
				inputType: 'password',
				allowBlank:false,
				blankText:"Enter your password"
            })
		],
		buttons: [{
			text: 'Login',                         
            handler: function(){
				if(loginForm.getForm().isValid()){
					loginForm.getForm().submit({
						url: '/Account/LogOnAjax',
						waitMsg: 'Processing Request',
						success: function(loginForm, resp){
							msg('Success', 'Loading home page...');
							document.location = resp.result.url;
						},
						failure: function(form, action) {
							switch (action.failureType) {
								case Ext.form.Action.CLIENT_INVALID:
									Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
									break;
								case Ext.form.Action.CONNECT_FAILURE:
									Ext.Msg.alert('Failure', 'Communication failed');
									break;
								case Ext.form.Action.SERVER_INVALID:
								   Ext.Msg.alert('Failure', action.result.msg);
						   }
						}
					});
				}
            }
        }]
    });
                       
    var loginWindow = new Ext.Window({
		title: 'Welcome to DOSB',
		layout: 'fit',                 
		height: 140,
		width: 260,                            
		closable: false,
		resizable: false,                              
		draggable: false,
		items: [loginForm]                     
    });
                       
    loginWindow.show();
                       
}); //end onReady