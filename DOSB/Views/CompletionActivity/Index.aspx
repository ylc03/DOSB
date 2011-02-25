<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/CompletionActivity.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Completion Activity
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
<script language="javascript">
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
         string backColor = "#FFFFFF";
         if (alterRow) backColor = "#00FF00";
         alterRow = !alterRow;
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
              { %>
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
            <td><%=subRow1.RComment%></td>
            <%} %>

            <%foreach (var subRow2 in ls4) { %>
            <td><%=subRow2.RComment%></td>
            <%} %>
        </tr>

         <% } %>
       
    </tbody> 
</table>
</asp:Content>