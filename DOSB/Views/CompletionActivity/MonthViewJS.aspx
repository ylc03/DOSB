<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

/*<script language="javascript">*/
Ext.ns('Dosb', 'Dosb.CActivity');

Dosb.CActivity.MonthView = function(config) {
	Dosb.CActivity.MonthView.superclass.constructor.call(this, {});
}

Ext.extend(Dosb.CActivity.MonthView, Ext.grid.GridPanel, {
	initComponent : function(){

        // create the data store
        var store = new Ext.data.ArrayStore({
            fields: [
               {name: 'Rig'},
               {name: 'Well'},
               <% foreach(var item in (ViewData["upper"] as IList<DOSB.Models.vwUpperCompletionAssembly>)) {%>
               {name: '<%: item.Name %>'},
               <% } %>
               <% foreach(var item in (ViewData["lower"] as IList<DOSB.Models.vwLowerCompletionAssembly>)) {%>
               {name: '<%: item.Name %>'},
               <% } %>
            ],
            data: []
        });

        var row = [
            {header: 'Upper Completions', align: 'center', colspan: <%: ViewData["upperCount"] %>},
            {header: 'Lower Completions', align: 'center', colspan: <%: ViewData["lowerCount"] %>}];

        var group = new Ext.ux.grid.LockingColumnHeaderGroup({
					rows: [row]
				});
		
		var config = {
			store: store,
			//storeUrl: '/CompletionActivity/MonthViewJson',
            viewConfig: {
                forceFit: true,
            },
            width:          500,
            height:         600,
			enableColLock: 	true,
			loadMask: 		true,
			border: 		true,
			stripeRows: 	true,
			colModel: 		new Ext.ux.grid.LockingColumnModel([
                {header: 'Rig',      width: 60, sortable: true, dataIndex: 'Rig', locked: true, id:'company'},
                {header: 'Well',     width: 60, sortable: true, dataIndex: 'Well', locked: true, },
                <% foreach(var item in (ViewData["upper"] as IList<DOSB.Models.vwUpperCompletionAssembly>)) {%>
                {header: '<%: item.Name %>',    width: 80,  sortable: false, align: 'center', dataIndex: '<%: item.Name %>'},
                <% } %>
                <% foreach(var item in (ViewData["lower"] as IList<DOSB.Models.vwLowerCompletionAssembly>)) {%>
                {header: '<%: item.Name %>',    width: 85,  sortable: false, align: 'center', dataIndex: '<%: item.Name %>'},
                <% } %>
            ]),
            view:           new Ext.ux.grid.LockingGridView(),
	    	title: 			'Completion Activity Month View',
            plugins:        group
		}
		
		Ext.apply(this, config);
		Ext.apply(this.initialConfig, config);
		Dosb.CActivity.MonthView.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('dosb-ca-monthview', Dosb.CActivity.MonthView);

/*</script>*/