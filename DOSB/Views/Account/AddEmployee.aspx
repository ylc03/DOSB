<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<DOSB.Models.AddEmployeeModel>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Add Employee
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <h2>Add Employee</h2>

    <% using (Html.BeginForm()) {%>
        <%: Html.ValidationSummary(true) %>

        <fieldset>
            <legend>Fields</legend>
            
            <div class="editor-label">
                <%: Html.LabelFor(model => model.LDAP) %>
            </div>
            <div class="editor-field">
                <%: Html.TextBoxFor(model => model.LDAP) %>
                <%: Html.ValidationMessageFor(model => model.LDAP) %>
            </div>
            
            <div class="editor-label">
                <%: Html.LabelFor(model => model.SubSegment) %>
            </div>
            <div class="editor-field">
                <%: Html.TextBoxFor(model => model.SubSegment) %>
                <%: Html.ValidationMessageFor(model => model.SubSegment) %>
            </div>
            
            <p>
                <input type="submit" value="Add to DOSB" />
            </p>
        </fieldset>

    <% } %>

    <div>
        <%: Html.ActionLink("Back to List", "Index") %>
    </div>

</asp:Content>

