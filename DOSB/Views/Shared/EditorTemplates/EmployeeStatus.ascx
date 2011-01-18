<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl" %>

<%: Html.Telerik().DropDownList()
    .Name("Status")
    .BindTo(new SelectList((IEnumerable)ViewData["status"])) %>

