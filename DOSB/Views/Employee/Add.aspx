<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<DOSB.viewModels.EmployeeManagerViewModel>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Add Employee to DOSB
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <h2>Add Employee to DOSB</h2>

    <% using (Html.BeginForm()) {%>
        <%: Html.ValidationSummary(true) %>

        <fieldset>
            <legend>Add Employee</legend>
            
            <p><%: ViewData["message"] %></p>
            <p><%: ViewData["ldap_message"] %></p>

            <%: Html.EditorFor(model => model.CurrentEmployee, new {SubSegments = Model.SubSegments}) %>

            <p>
                <input type="submit" value="Add Employee" />
            </p>
        </fieldset>

    <% } %>

    <div>
        <%: Html.ActionLink("Back to List", "Index") %>
    </div>

</asp:Content>

