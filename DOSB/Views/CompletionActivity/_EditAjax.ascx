<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<DOSB.Models.EditableModels.EditableCActivity>" %>

<form class="CA-edit-form" action="#" method="post" class="CA-edit-form" id="C-Active-edit-form" enctype = "multipart/form-data">

<div class="CA-edit-form-container">





    <div class="editor-label"><label for="Comment">Comment</label></div>
    <div class="editor-field"><%: Html.TextBox("Comment", Model.Comment, new { @class = "text-box single-line" })%></div>


    <center>
        <span name="submit" class="t-grid-action t-button t-state-default t-grid-submit">Submit</span>
        <span name="reset" class="t-grid-action t-button t-state-default t-grid-cancel">Close</span>
    </center>
</div>
</form>
