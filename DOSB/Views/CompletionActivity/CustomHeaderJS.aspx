<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>
Ext.ns('Dosb', 'Dosb.CActivity');

Dosb.CActivity.MonthViewHeaderData = {
    upperCount: <%: ViewData["upperCount"] %>,
    lowerCount: <%: ViewData["lowerCount"] %>,
    start: new Date(<%: DateTime.Today.Year %>, <%: DateTime.Today.Month - 1 %>, <%: DateTime.Today.Day %>),
    headers : [
    <% foreach(var item in (ViewData["upper"] as IList<DOSB.Models.vwUpperCompletionAssembly>)) {%>
        '<%: item.Name %>',
    <% } %>
    
    <% int count = (int)ViewData["lowerCount"]; %>
    <% foreach(var item in (ViewData["lower"] as IList<DOSB.Models.vwLowerCompletionAssembly>)) {%>
        '<%: item.Name %>'<% count = count - 1; if (count > 0) { %>,<% } %>
    <% } %>
    ]
};

    <% count =  (ViewData["Company"] as IList<DOSB.Models.EditableModels.EditableCompany>).Count(); %>
Dosb.CActivity.CompanyColor = {
    <% foreach(var item in (ViewData["Company"] as IList<DOSB.Models.EditableModels.EditableCompany>)) {%>

    <%: item.ShortName %>: {BackgroundColor: "<%: item.BackgroundColor %>", TextColor: "<%: item.TextColor %>"}<% count = count - 1; if (count > 0) { %>,<% } %>
    <% } %>
};

Dosb.CActivity.WellStatus = ['Developement', 'W/O', 'Exp.', 'M W/O'];