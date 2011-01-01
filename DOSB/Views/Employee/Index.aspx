<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<IEnumerable<DOSB.Models.Employee>>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Employee
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
	<script language="javascript" type="text/javascript">
        $(function () {
            $("#calendar").datepicker();
        });
    </script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h2>Employee Board</h2>

    <table>
        <tr>
            <th></th>
            <th>
                LDAP
            </th>
            <th>
                Segment
            </th>
            <th>
                Status
            </th>
        </tr>

    <% foreach (var item in Model) { %>
    
        <tr>
            <td>
                <%: Html.ActionLink("Edit", "Edit", new { id=item.EmployeeId }) %> |
                <%: Html.ActionLink("Details", "Details", new { id=item.EmployeeId })%> |
                <%: Html.ActionLink("Delete", "Delete", new { id=item.EmployeeId })%>
            </td>
            <td>
                <%: item.LDAP %>
            </td>
            <td>
                <%: item.Segment.Name %>
            </td>
            <td>
                <%: item.Status %>
            </td>
        </tr>
    
    <% } %>

    </table>

    <p>
        <%: Html.ActionLink("Add Employee", "Add") %>
    </p>
    
    <%: Html.TextBox("calendar") %>

</asp:Content>

