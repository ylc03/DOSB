<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<DOSB.Models.EditableModels.EditableTorqueLog>" %>
<form class="t-edit-form" action="#" method="post" class="t-edit-form" id="torque-log-edit-form" enctype = "multipart/form-data">

<div class="t-edit-form-container">
    <div class="editor-label"><label for="PartNumber">Part Number</label></div>
    <div class="editor-field"><%: Html.TextBox("PartNumber", Model.PartNumber, new { @class = "text-box single-line"}) %></div>

    <div class="editor-label"><label for="SerialNumber">Serial Number</label></div>
    <div class="editor-field"><%: Html.TextBox("SerialNumber", Model.SerialNumber, new { @class = "text-box single-line" })%></div>

    <div class="editor-label"><label for="AssemblyType">Assembly Type</label></div>
    <div class="editor-field"><%: Html.TextBox("AssemblyType", Model.AssemblyType, new { @class = "text-box single-line" })%></div>

    <div class="editor-label"><label for="StartAt">Start At</label></div>
    <div class="editor-field"><%: Html.Telerik().DateTimePicker()
                                  .Name("StartAt")
                                  .Format("yyyy-MM-dd HH:mm tt")
                                  .Value(Model.StartAt)%></div>

    <div class="editor-label"><label for="FinishAt">Finish At</label></div>
    <div class="editor-field"><%: Html.Telerik().DateTimePicker()
                                  .Name("FinishAt")
                                  .Format("yyyy-MM-dd HH:mm tt")                            
                                  .Value(Model.FinishAt)%></div>

    <div class="editor-label"><label for="Comment">Comment</label></div>
    <div class="editor-field"><%: Html.TextArea("Comment", Model.Comment, new { @class = "text-box multiple-line"})%></div>

    <div class="editor-label"><label for="Attachment">Attachment</label></div>
    <div class="editor-field">
        <%: Html.TextBox("Attachment", Model.Attachment, new { @class = "text-box single-line", @type = "file" })%>
    </div>

    <div class="editor-label"><label for="Defect">Defect</label></div>
    <div class="editor-field"><%: Html.CheckBox("Defect", Model.Defect, new { @class = "text-box single-line"})%></div>
    
    <div class="editor-label"><label for="TorqueBy">Torque by</label></div>
    <div class="editor-field">
        <%: Html.Telerik().ComboBox()
                        .Name("TorqueBy")
                        .BindTo(new SelectList((IEnumerable)ViewData["employees"], "EmployeeId", "LDAP", Model.TorqueBy))
        %>
    </div>

    <%: Html.Hidden("TorqueId", Model.TorqueId) %>
    <%: Html.Hidden("OldAttachment", Model.Attachment) %>
    <%: Html.Hidden("OldGuid", Model.AttachmentGuid) %>

    <center>
        <span name="submit" class="t-grid-action t-button t-state-default t-grid-submit">Submit</span>
        <span name="reset" class="t-grid-action t-button t-state-default t-grid-cancel">Close</span>
    </center>
</div>
</form>
