<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<dynamic>" %>


<%: Html.Telerik().DropDownList()
    .Name("Role")
    .BindTo(new SelectList((IEnumerable)ViewData["roles"], "Name", "Name")) %>
