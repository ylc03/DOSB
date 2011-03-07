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
</script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

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
            <% IList<DOSB.Models.Assembly> ls1 = DOSB.Models.EditableRespositories.AssemblyRespository.Upper();
                 %>
            <th colspan="<%=ls1.Count %>" class="ui-state-default">Upper Completions</th>        
            <% IList<DOSB.Models.Assembly> ls2 = DOSB.Models.EditableRespositories.AssemblyRespository.Lower();
                 %>
            <th colspan="<%=ls2.Count %>" class="ui-state-default" >Lower Completions</th>
            <th rowspan="2" >Comments</th>         
            <th rowspan="2" >DESC Engineer</th>
        </tr>


        <tr>
        <%  foreach (DOSB.Models.Assembly item in ls1)
            { %>
        <th><%=item.Name %></th>
        <% } %>

        <%  foreach (DOSB.Models.Assembly item in ls2 )
            { %>
        <th><%=item.Name %></th>
        <% } %>
            
	    </tr>
	</thead>
	
    <tbody>
       
    </tbody> 
</table>
  
</asp:Content>