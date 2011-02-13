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

    function AddToTask(employeeWidget, taskWidget) {
        // add to server
        var employeeId = employeeWidget.data("Id");
        var tr = $(taskWidget).closest('tr')[0];
        var dataItem = $('#PVD').data('tGrid').dataItem(tr);
        var data = "id=" + dataItem.ActivityId + "&employeeId=" + employeeId;
        $.post("/WorkshopDailyActivity/_AssignEmployeeAjax", data);

        // add to UI
        var $Id = employeeWidget.data("Id");
        var $newWidget = $("<li class='ui-widget-content ui-corner-tr ui-draggable'>"
                    + "<img src=/Employee/Avatar?id=" + $Id + " />"
                    + "</li>");
        $newWidget.draggable({
            revert: "invalid",
            helper: "clone",
            cursor: "move"
        }).data("Id", $Id);
        $newWidget.appendTo(taskWidget);
    }

    function RemoveFromTask(employeeWidget, taskWidget) {
        // remove from server
        var employeeId = employeeWidget.data("Id");
        var tr = $(taskWidget).closest('tr')[0];
        var dataItem = $('#PVD').data('tGrid').dataItem(tr);
        var data = "id=" + dataItem.ActivityId + "&employeeId=" + employeeId;
        $.post("/WorkshopDailyActivity/_RemoveEmployeeAjax", data);

        // remover from UI
        employeeWidget.remove();
    }

    function OnDataBound(e) {
        $("#PVD .assignment").droppable({
            accept: ".ui-draggable",
            activeClass: "custom-state-active",
            drop: function (event, ui) {
                // prevent drop on the same place
                if ($(ui.draggable).closest("ul")[0] == this) return;

                // prevent duplicate drop
                var Exist = false;
                var $Id = $(ui.draggable).data("Id");
                $.each($("li", this), function (i, item) {
                    if ($(item).data("Id") == $Id) Exist = true;
                });
                if (Exist) return;

                // add to destination
                AddToTask($(ui.draggable), this);

                // delete from the source
                if ($(ui.draggable).closest("ul").attr("id") != "employee-list") {
                    $(ui.helper).remove();
                    RemoveFromTask($(ui.draggable), $(ui.draggable).closest("ul"));
                }
            }
        });
    }
</script>

<style type="text/css">
    .custom-state-active { background: #eee; }
    .assignment
    {
        min-height: 45px;
        width: 100%;  
    }
    
    .assignment li {
        float: left;
        margin: 0 2px 2px 0;
        padding: 1px;
        text-align: center;
        width: 40px;
    }
    
    .assignment li img {
        cursor: move;
        width: 35px;
        height: 35px;
    }

    .employee-list 
    {
        padding: 5px;    
    }
    
    .employee-list li {
        float: left;
        margin: 0 0.4em 0.4em 0;
        padding: 0.4em;
        text-align: center;
        width: 70px;
    }
    
    .employee-list li h5 {
        cursor: move;
        margin: 0 0 0.4em;
    }
    .employee-list li img {
        cursor: move;
        width: 45px;
        height: 45px;
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
            columns.Bound(a => a.ActivityId).ClientTemplate("<ul class='assignment ui-helper-reset ui-helper-clearfix ui-droppable'></ul>").Width(210);
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
        .ClientEvents(events => events.OnDataBound("OnDataBound"))
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
        </form>
        <div>
            <ul id="employee-list" class="employee-list ui-helper-reset ui-helper-clearfix ui-droppable">
            </ul>
        </div>
    </div>

<% Html.Telerik().ScriptRegistrar()
    .OnDocumentReady(() => {%>

    // toolbar form
    function SubmitForm(){
        var form = $("#toolbar-form");
        var Status = $('input[name=employee-status]:checked', form);
        var Subseg = $('input[name=employee-subseg]:checked', form);
        
        var filter = "Status~eq~'" + Status.val() + "'";
        var counter = 0;
        $.each(Subseg, function(i, item){
            if (item.checked){
                if (counter++ == 0) filter = filter + "~and~Segment~eq~'" + item.value + "'";
                else filter = filter + "~or~Segment~eq~'" + item.value + "'";
            }
        });

        var data = "page=1&size=10&orderBy=&groupBy=&filter=" + filter;

        $.post('/Employee/_SelectAjaxEdit', data, function(response) {
                $("#employee-list").html("");
                $.each(response.data, function(i, employee){
                    var $item = $("<li class='ui-widget-content ui-corner-tr ui-draggable'>"
                        + "<h5 class='ui-widget-header'>" + employee.LDAP + "</h5>"
                        + "<img src='/Employee/Avatar?id=" + employee.EmployeeId + "' />"
                        +"</li>");
                    $item.draggable({
                            revert: "invalid",
                            helper: "clone",
                            cursor: "move",}).data("Id", employee.EmployeeId);
                    $item.appendTo($("#employee-list"));
                });
            })
    }

    $( "#employee-status" ).buttonset();
    $( "#employee-subseg" ).buttonset();
    $( "input[name=employee-status]" ).bind("click", SubmitForm);
    $( "input[name=employee-subseg]" ).bind("click", SubmitForm);
    SubmitForm();

    // drop 
    $("#employee-list").droppable({
        accept: ".assignment li",
        activeClass: "custom-state-active",
        drop: function(event, ui){
            $(ui.helper).remove();
            RemoveFromTask($(ui.draggable), $(ui.draggable).closest('ul'));
        }
    });
<%}); %> 
</asp:Content>