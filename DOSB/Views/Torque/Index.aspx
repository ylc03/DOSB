<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<IEnumerable<DOSB.Models.Torque>>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Index
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <h2>Torque Log</h2>

    
    <p>
        <%: Html.ActionLink("Create New", "Create") %>
    </p>
    <table>
        <tr>
            <th>
                Sequence Number
            </th>
            <th>
                Part Number
            </th>
            <th>
                Serial Number
            </th>
            <th>
                OneCat 
            </th>
            <th>
                Memo
            </th>
            <th>
                Torque By
            </th>
            <th>
                Start Time
            </th>
            <th>
                End Time
            </th>
            <th>
                Defect
            </th>
        </tr>

    <% foreach (var item in Model) { %>
    
        <tr>
            <td>
                <%: item.TorqueId %>
            </td>
            <td>
                <%: item.PartNumber %>
            </td>
            <td>
                <%: item.SerialNumber %>
            </td>
            <td>
                info from onecat
            </td>
            <td>
                <%: item.Memo %>
            </td>
            <td>
                <%: item.Employee.GivenName +" " + item.Employee.SurName%>
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
        </tr>
    
    <% } %>

    </table>

</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
</asp:Content>

