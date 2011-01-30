<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<DOSB.Models.EditableModels.EditableTorqueLog>" %>
<form class="t-edit-form" action="#" method="post" id="torque-log-edit-form">

<p>Approve PN:<%: Model.PartNumber %> SN:<%: Model.SerialNumber %>?</p>
<p>You cannot modify after approvement.</p>

<div class="t-edit-form-container">
    <div class="editor-label"><label for="ApprovedBy">Approver LDAP</label></div>
    <div class="editor-field">
        <%: Html.Telerik().ComboBox()
                        .Name("ApprovedBy")
                        .BindTo(new SelectList((IEnumerable)ViewData["employees"], "EmployeeId", "LDAP", Model.ApprovedBy))
        %>
    </div>

    <div class="editor-label"><label for="Password">Approver Password</label></div>
    <div class="editor-field">
        <%: Html.Password("Password") %>
    </div>

    <%: Html.Hidden("TorqueId", Model.TorqueId) %>

    <center>
        <span class="t-grid-action t-button t-state-default t-grid-approve">Approve</span>
        <span class="t-grid-action t-button t-state-default t-grid-cancel">Close</span>
    </center>
</div>
</form>
