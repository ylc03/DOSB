<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<IEnumerable<DOSB.Models.WorkshopDailyActivity>>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Workshop Daily Activity
</asp:Content>


<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">

<script language="javascript" type="text/javascript">
    function OnDateChange(e) {
        var value = $.telerik.formatString('{0:d}', e.date);
        var PVD = $('#PVD').data('tGrid');
        PVD.rebind({
            date: value
        });
    }
</script>

<style type="text/css">
    .assignment
    {
        height: 35px;
        width: 140px;     
    }
</style>

</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <% Html.Telerik().Grid(Model)
        .Name("PVD")
        .ToolBar(toolbar => toolbar.Template(() =>
        { %>
            <span style="float: right; font-weight: bold;"> Select Date :  
            <%
                Html.Telerik().DatePicker()
                .Name("DatePicker")
                .MaxDate(DateTime.Today)
                .Format("yyyy-MM-dd")
                .Value(DateTime.Today)
                .ClientEvents(events => events.OnChange("OnDateChange"))
                .Render();
            %>
            </span>
            <span id="add-button" class="t-grid-action t-button t-state-default">Add</span>
        <% }))
        .DataKeys(keys => keys.Add(a => a.ActivityId))
        .DataBinding(dataBinding => dataBinding.Ajax()
                                                .Select("_SelectAjax", "WorkshopDailyActivity", new { date = DateTime.Today })
                                                .Update("_UpdateAjax", "WorkshopDailyActivity")
                                                .Delete("_DeleteAjax", "WorkshopDailyActivity"))

        .Columns(columns =>
        {
            columns.Bound(a => a.ActivityId).ClientTemplate("<ul class='assignment'></ul>").Width(200);
            columns.Bound(a => a.Description).Width(200);
            columns.Bound(a => a.Forklift).Title("FL").Width(40);
            columns.Bound(a => a.PressureTest).Title("PT").Width(40);
            columns.Bound(a => a.Torque).Title("T").Width(40);
            columns.Bound(a => a.CreatedAt).Width(150);
            columns.Bound(a => a.FinishedAt).Width(150);
            columns.Command(commands =>
            {
                commands.Edit();
                commands.Delete();
            }).Title("Commands");
        })
        .Editable(editing => editing.Mode(GridEditMode.InLine))
        .Pageable()
        .Render(); 
    %>
    
    <br />
    <div class="t-widget">
        <form action="#" method="post" id="toolbar-form">
        <div class="t-toolbar t-grid-toolbar">
            Employee Filter
            <span id="employee-status">
		        <input type="radio" id="radio1" name="employee-status" value="Base" checked="checked" /><label for="radio1">Base</label>
		        <input type="radio" id="radio2" name="employee-status" value="Job" /><label for="radio2">On Job</label>
		        <input type="radio" id="radio3" name="employee-status" value="V/DO" /><label for="radio3">V/DO</label>
            </span>
            <span id="employee-subseg">
	            <input type="checkbox" id="check1" name="employee-subseg" checked="checked" value="RMC"/><label for="check1">RMC</label>
	            <input type="checkbox" id="check2" name="employee-subseg" checked="checked" value="CC"/><label for="check2">CC</label>
	            <input type="checkbox" id="check3" name="employee-subseg" checked="checked" value="SMS"/><label for="check3">SMS</label>
            </span>
        </div>
        <div>
            <ul id="employee-list">
            </ul>
        </div>
        </form>
    </div>

<% Html.Telerik().ScriptRegistrar()
    .OnDocumentReady(() => {%>

    // toolbar form
    function SubmitForm(){
        var form = $("#toolbar-form");
        var Status = $('input[name=employee-status]:checked', form);
        var Subseg = $('input[name=employee-subseg]:checked', form);
        
        var filter = "Status~eq~'" + Status.val() + "'";
        var data = "page=1&size=10&orderBy=&groupBy=&filter=" + filter;

        $.post('/Employee/_SelectAjaxEdit', data, function(response) {
                $("#employee-list").html("");
                $.each(response.data, function(i, employee){
                    $("#employee-list").append("<li>"+employee.LDAP+"</li>");
                });
            })
    }

    $( "#employee-status" ).buttonset();
    $( "#employee-subseg" ).buttonset();
    $( "input[name=employee-status]" ).bind("click", SubmitForm);
    $( "input[name=employee-subseg]" ).bind("click", SubmitForm);

<%}); %> 
</asp:Content>