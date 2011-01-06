<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<IEnumerable<DOSB.Models.PressureTest>>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Index
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <h2>Index</h2>

    <table>
        <tr>
            <th></th>
            <th>
                PressureTestId
            </th>
            <th>
                PartNumber
            </th>
            <th>
                SerialNumber
            </th>
            <th>
                Memo
            </th>
            <th>
                TestBy
            </th>
            <th>
                StartAt
            </th>
            <th>
                FinishAt
            </th>
            <th>
                Defect
            </th>
            <th>
                Attachable
            </th>
        </tr>

    <% foreach (var item in Model) { %>
    
        <tr>
            <td>
                <%: Html.ActionLink("Edit", "Edit", new { id=item.PressureTestId }) %> |
                <%: Html.ActionLink("Details", "Details", new { id=item.PressureTestId })%> |
                <%: Html.ActionLink("Delete", "Delete", new { id=item.PressureTestId })%>
            </td>
            <td>
                <%: item.PressureTestId %>
            </td>
            <td>
                <%: item.PartNumber %>
            </td>
            <td>
                <%: item.SerialNumber %>
            </td>
            <td>
                <%: item.Memo %>
            </td>
            <td>
                <%: item.TestBy %>
            </td>
            <td>
                <%: String.Format("{0:g}", item.StartAt) %>
            </td>
            <td>
                <%: String.Format("{0:g}", item.FinishAt) %>
            </td>
            <td>
                <%: item.Defect %>
            </td>
            <td>
                <%: item.Attachable %>
            </td>
        </tr>
    
    <% } %>

    </table>

    <p>
        <%: Html.ActionLink("Create New", "Create") %>
    </p>

</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
</asp:Content>

