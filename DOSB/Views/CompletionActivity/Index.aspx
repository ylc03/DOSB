<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/CompletionActivity.Master" Inherits="System.Web.Mvc.ViewPage<IEnumerable<DOSB.Models.EditableModels.EditableCActivity>>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Completion Activity
</asp:Content>


<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
<script language="javascript" type="text/javascript">
    $(document).ready(function () {
        $('#example').dataTable({
		    "bJQueryUI": true,
		    "sPaginationType": "full_numbers",
	        "bProcessing": false,
		    "bServerSide": true,
		    "sAjaxSource": "/CompletionActivity/_SelectAjax"
	    } );
} );

function windowClose() {
    $('.window-content').html("");
    $('.message').html("");
}
</script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">


 <%: Html.Telerik().Grid(Model)
                        .Name("CompletionActivityGrid")
        .ToolBar(toolbar => toolbar.Template(
                  "<span id='insert-button' class='t-grid-action t-button t-state-default t-grid-select' >Insert</span>"
        ))
      .DataKeys(keys => keys.Add(ca => ca.ActivityId))
                   .DataBinding(dataBinding => dataBinding.Ajax().Select("_SelectAjax","CompletionActivity"))
        .Columns(columns =>
        {
            columns.Bound(ca => ca.ActivityId).Title("ID").Filterable(false).Width(40);
            columns.Bound(ca => ca.ClientName).Width(100);
            columns.Bound(ca => ca.ActivityId).ClientTemplate("" +
                "<span id='edit-button' class='t-grid-action t-button t-state-default t-grid-select' >Edit</span>" +
                "<span id='delete-button' class='t-grid-action t-button t-state-default t-grid-select' >Delete</span>"
            ).Title("Commands").Filterable(false);
        }) 
        .Editable(editing => editing.Mode(GridEditMode.PopUp))
        .Filterable()
        .Pageable()
    %>   

    <% Html.Telerik().Window()
           .Name("insert-window")
           .Title("Insert Completion Activity")
           .Visible(false)
           .Draggable(false)
           .Resizable(resizing => resizing.Enabled(false))
           .Modal(true)
           .Buttons(b => b.Close())
           .Content(() =>
           {%>
           <div class="window-content">
                
           </div>
           <div class="loading"></div>
           <div class="message"></div>
           <%})
           .Width(400)
           .Height(400)
           .ClientEvents(events => events.OnClose("windowClose"))
           .Render();
    %>

    <% Html.Telerik().Window()
           .Name("edit-window")
           .Title("Edit Completion Activity")
           .Visible(false)
           .Draggable(false)
           .Resizable(resizing => resizing.Enabled(false))
           .Modal(true)
           .Buttons(b => b.Close())
           .Content(() =>
           {%>
           <div class="window-content">
                
           </div>
           <div class="loading"></div>
           <div class="message"></div>
           <%})
           .Width(400)
           .Height(400)
           .ClientEvents(events => events.OnClose("windowClose"))
           .Render();
    %>

    <% Html.Telerik().Window()
           .Name("delete-window")
           .Title("Delete Completion Activity")
           .Visible(false)
           .Draggable(false)
           .Resizable(resizing => resizing.Enabled(false))
           .Modal(true)
           .Buttons(b => b.Close())
           .Content(() =>
           {%>
           <div class="window-content">
                
           </div>
           <div class="loading"></div>
           <div class="message"></div>
           <%})
           .Width(400)
           .Height(130)
           .ClientEvents(events => events.OnClose("windowClose"))
           .Render();
    %>

   
<% Html.Telerik().ScriptRegistrar()
    .OnDocumentReady(() => {%>
        

        // insert action
        var insertWindow = $('#insert-window');
        $('#insert-button').live('click', function (e) {
            insertWindow.data('tWindow').center().open();
            $('.loading', insertWindow).show();

            $.get('/CompletionActivity/_EditAjax', {id: 0}, function (data){
                $('.window-content', insertWindow).html(data);
                $('.loading', insertWindow).hide();
            })
        })

        $('.t-grid-cancel', insertWindow).live('click', function(e){
            insertWindow.data('tWindow').close();
        })

        $('.t-grid-submit', insertWindow).live('click', function(e){
            var Comment = $('textarea[name=Comment]');
            var data =  'Comment=' + Comment.val());

            $('.loading', insertWindow).show();
            $.post('/CompletionActivity/_InsertAjax', data, function(response) {
                $('.loading', insertWindow).hide();
                $('.message', insertWindow).html(response);
                $('#CompletionActivityGrid').data('tGrid').rebind();
            })
        })

        // edit action
        var editWindow = $('#edit-window');
        $('#edit-button').live('click', function (e) {
            var tr = $(this).closest('tr')[0];
            var dataItem = $('#CompletionActivityCActivityGrid').data('tGrid').dataItem(tr);

            editWindow.data('tWindow').center().open();
            $('.loading', editWindow).show();

            $.get('/CompletionActivity/_EditAjax', {id: dataItem.ActivityId}, function (data){
                $('.window-content', editWindow).html(data);
                $('.loading', editWindow).hide();
            })
        })

        $('.t-grid-cancel', editWindow).live('click', function(e){
            editWindow.data('caWindow').close();
        })

        $('.t-grid-submit', editWindow).live('click', function(e){
            var ActivityId = $('input[name=ActivityId]');
            var Comment = $('textarea[name=Comment]');;

            var data = 'id=' + ActivityId.val()
               + '&' + 'Comment=' + Comment.val();

            $('.loading', editWindow).show();
            $.post('/CompletionActivity/_EditAjax', data, function(response) {
                $('.loading', editWindow).hide();
                $('.message', editWindow).html(response);
                $('#CompletionActivityGrid').data('tGrid').rebind();
            })
        })
        // delete action
        var deleteWindow = $('#delete-window');
        $('#delete-button').live('click', function(e){
            var tr = $(this).closest('tr')[0];
            var dataItem = $('#CompletionActivityGrid').data('tGrid').dataItem(tr);

            deleteWindow.data('tWindow').center().open();
            $('.loading', deleteWindow).show();

            $.get('/CompletionActivity/_DeleteAjax', {id: dataItem.ActivityId}, function (data){
                $('.window-content', deleteWindow).html(data);
                $('.loading', deleteWindow).hide();
            })
        })

        $('.t-grid-delete', deleteWindow).live('click', function(e){
            var ActivityId = $('input[name=ActivityId]');
            var data = 'id=' + ActivityId.val();
            $('.loading', deleteWindow).show();
            $.post('/CompletionActivity/_ConfirmDeleteAjax', data, function(response) {
                $('.loading', deleteWindow).hide();
                $('.message', deleteWindow).html(response);
                deleteWindow.data('tWindow').close();
                $('#CompletionActivityGrid').data('tGrid').rebind();
            })
        })

        $('.t-grid-cancel', deleteWindow).live('click', function(e){
            deleteWindow.data('tWindow').close();
        })
  <%}); %>

<table cellspacing="0" cellpadding="0" border="0" id="example" class="display">
	<thead>
		<tr>
            <th rowspan="2" >Id</th>
            <th rowspan="2" >Clinet</th>
			<th rowspan="2" >Country</th>
			<th rowspan="2" >Rigs</th>
			<th rowspan="2" >Wells</th>
			<th rowspan="2" >Fields</th>
            <th rowspan="2" >Well Type</th>
            <th rowspan="2" >Completion Type</th>
            <th rowspan="2" >Status</th>
            <% IList<DOSB.Models.EditableModels.EditableAssemblyType> ls1 = DOSB.Models.EditableRespositories.AssemblyTypeRespository.ListUpper();
                 %>
            <th colspan="<%=ls1.Count %>" class="ui-state-default">Upper Completions</th>        
            <% IList<DOSB.Models.EditableModels.EditableAssemblyType> ls2 = DOSB.Models.EditableRespositories.AssemblyTypeRespository.ListLower();
                 %>
            <th colspan="<%=ls2.Count %>" class="ui-state-default" >Lower Completions</th>
            <th rowspan="2" >Comments</th>         
            <th rowspan="2" >DESC Engineer</th>
        </tr>


        <tr>

        <%  foreach (DOSB.Models.EditableModels.EditableAssemblyType item in ls1)
            { %>
        <th><%=item.Assembly_Name %></th>
        <% } %>

        <%  foreach (DOSB.Models.EditableModels.EditableAssemblyType item in ls2 )
            { %>
        <th><%=item.Assembly_Name %></th>
        <% } %>
            
	    </tr>
	</thead>
	
    <tbody>
		<% bool alterRow = false;
		    foreach (var row in Model )
     {
         string backColor = "#DDFFDD";

         if (alterRow) backColor = "#EEFFEE";
         alterRow = !alterRow;
         DOSB.Models.EditableRespositories.EditableCompletionRelationRespository.backColor = backColor;
                %>

        <tr class="gradeA">
			<td rowspan="2" class="center" style="background-color:<%=backColor%>"><%=row.ActivityId%></td>
            <td rowspan="2" class="center" style="background-color:<%=backColor%>"><%=row.ClientName%></td>
			<td rowspan="2" class="center" style="background-color:<%=backColor%>"><%=row.CountryName%></td>
			<td rowspan="2" class="center" style="background-color:<%=backColor%>"><%=row.RigName%></td>
			<td rowspan="2" class="center" style="background-color:<%=backColor%>"><%=row.WellName%></td>
			<td rowspan="2" class="center" style="background-color:<%=backColor%>"><%=row.FieldName%></td>
            <td rowspan="2" class="center" style="background-color:<%=backColor%>"><%=row.WellTypeName%></td>
            <td rowspan="2" class="center" style="background-color:<%=backColor%>"><%=row.CompTypeName%></td>
            <td rowspan="2" class="center" style="background-color:<%=backColor%>"><%=row.WellStatus%></td>

            <%IList<DOSB.Models.EditableModels.EditableCompletionRelation> ls3 = DOSB.Models.EditableRespositories.EditableCompletionRelationRespository.ListAllUpper(row.ActivityId);
              foreach (var subRow1 in ls3)
              {
                  %>
            <td class="center" style='background-color:<%=subRow1.CoColor%>;color:<%=subRow1.CoTxtColor%>'><%=subRow1.CoName%></td>
            <%} %>
            
            <%IList<DOSB.Models.EditableModels.EditableCompletionRelation> ls4 = DOSB.Models.EditableRespositories.EditableCompletionRelationRespository.ListAllLower(row.ActivityId);
              foreach (var subRow2 in ls4)
              { %>
            <td class="center" style='background-color:<%=subRow2.CoColor%>;color:<%=subRow2.CoTxtColor%>'><%=subRow2.CoName%></td>
            <%} %>


            <td rowspan="2" style="background-color:<%=backColor%>"><%=row.Comment%></td>
            <td rowspan="2" style="background-color:<%=backColor%>">AAA</td>
		</tr>

        <tr>
            <%foreach (var subRow1 in ls3)  { %>
            <td style="background-color:<%=backColor%>"><%=subRow1.RComment%></td>
            <%} %>

            <%foreach (var subRow2 in ls4) { %>
            <td style="background-color:<%=backColor%>"><%=subRow2.RComment%></td>
            <%} %>
        </tr>

         <% } %>
       
    </tbody> 
</table>

<hr /> <% //---------------------------------------- %>

	   

  
</asp:Content>