<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  	<link rel="stylesheet" type="text/css" href="/Scripts/ext/resources/css/ext-all.css">
    <link rel="stylesheet" type="text/css" href="/Scripts/ext/examples/shared/icons/silk.css">
	
	<link rel="stylesheet" type="text/css" href="/Scripts/ext/examples/ux/css/LockingGridView.css" />
	<link rel="stylesheet" type="text/css" href="/Scripts/ext/examples/ux/css/ColumnHeaderGroup.css" />
	
  	<script type="text/javascript" src="/Scripts/ext/adapter/ext/ext-base.js"></script>
  	<script type="text/javascript" src="/Scripts/ext/ext-all-debug.js"></script>
    <script type="text/javascript" src="/Scripts/ext/examples/ux/Spinner.js"></script>
    <script type="text/javascript" src="/Scripts/ext/examples/ux/SpinnerField.js"></script>
    <script type="text/javascript" src="/Scripts/ext/examples/ux/LockingGridView.js"></script>
	<script type="text/javascript" src="/Scripts/ExtUI/ux/ext.ux.form.datetime.js"></script>
	<script type="text/javascript" src="/Scripts/Sch/ext-sch-crack.js"></script>
	<script type="text/javascript" src="/Scripts/ExtUI/CActivity/MonthViewPreset.js"></script>

	<script type="text/javascript" src="/Scripts/ExtUI/ScriptManager.js"></script>
  	<script type="text/javascript" src="/Scripts/ExtUI/application.js"></script>
  <title>DOSB Ext Client</title>

    <script type="text/javascript" language="javascript">
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
    </script>
</head>
<body>
    <!-- Template used for Feed Items -->
    <div id="header" style="display:none;">
        <div style="float: right;">
            <span>Welcome</span>
            <span><%: this.User.Identity.Name %></span>

            <span>Logon As</span>
            <span><%: this.User.Identity.AuthenticationType %></span>

            <span><a href="/Account/LogOff">LogOut</a></span>
        </div>
    </div>
</body>
</html>
