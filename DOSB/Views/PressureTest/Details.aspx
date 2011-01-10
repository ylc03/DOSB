<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<DOSB.Models.PressureTest>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Pressure Test Log - SN: <%: Model.PressureTestId %>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <%: Html.ActionLink("<< PREV", "Details", new {id = Model.PressureTestId-1}) %>
    <h2>Pressure Test Log  - SN: <%: Model.PressureTestId %></h2>
    <%: Html.ActionLink("NEXT >>", "Details", new {id = Model.PressureTestId + 1}) %>

    <fieldset>
        <legend>Log details</legend>
        <div class="display-label">PartNumber</div>
        <div class="display-field"><%: Model.PartNumber %></div>
        
        <div class="display-label">SerialNumber</div>
        <div class="display-field"><%: Model.SerialNumber %></div>
        
        <div class="display-label">Memo</div>
        <div class="display-field"><%: Model.Memo %></div>
        
        <div class="display-label">TestBy</div>
        <div class="display-field"><%: Model.TestBy %></div>
        
        <div class="display-label">StartAt</div>
        <div class="display-field"><%: String.Format("{0:g}", Model.StartAt) %></div>
        
        <div class="display-label">FinishAt</div>
        <div class="display-field"><%: String.Format("{0:g}", Model.FinishAt) %></div>
        
        <div class="display-label">Defect</div>
        <div class="display-field"><%: Model.Defect %></div>
        
    </fieldset>
    <p>

        <%: Html.ActionLink("Edit", "Edit", new { id=Model.PressureTestId }) %> |
        <%: Html.ActionLink("Back to List", "Index") %>
    </p>

</asp:Content>