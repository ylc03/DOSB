<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl" %>

<%: Html.Telerik().DropDownList()
    .Name("Segment")
    .BindTo(new SelectList((IEnumerable)ViewData["segments"], "Name", "Name")) %>

