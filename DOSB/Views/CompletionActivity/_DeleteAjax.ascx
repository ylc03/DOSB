<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl" %>
<form class="CA-edit-form" action="#" method="post" id="C-active-delete-form">

<div class="t-edit-form-container">
    <%: Html.Hidden("TorqueId", Model.TorqueId) %>
    <p>Delete TorqueLog for PN: <%: Model.PartNumber %>, SN: <%: Model.SerialNumber %> ? </p>
    <center>
        <span class="t-grid-action t-button t-state-default t-grid-delete">Delete</span>
        <span class="t-grid-action t-button t-state-default t-grid-cancel">Close</span>
    </center>
</div>
</form>
