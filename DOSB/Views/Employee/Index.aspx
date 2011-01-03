<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<IEnumerable<DOSB.Models.Employee>>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Employee
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
	<script language="javascript" type="text/javascript">
	    $(function () {
            $("#calendar").datepicker();
        });

        function update(id) {
            $("#row-" + id).load("/Employee/Update", { "id": id });
        }

        function del(id) {
            $("#row-" + id).load("/Employee/Delete", { "id": id }, function () {
                $("#row-" + id).fadeOut("normal");
            });
        }
    </script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h2>Employee Board</h2>

    <table>
        <tr>
            <th></th>
            <th>
                Avatar
            </th>
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
        <tr id="row-<%: item.EmployeeId %>">
            <td>
                <a href="#" onclick="update(<%: item.EmployeeId %>)">Update</a> |
                <a href="#" onclick="del(<%: item.EmployeeId %>)">Delete</a> 
            </td>
            <td>
                <img src="<%: Url.Action( "Avatar", "Employee", new { id = item.EmployeeId } ) %>" width="50" height="50"/>
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

