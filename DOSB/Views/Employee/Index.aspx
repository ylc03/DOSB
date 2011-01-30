<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<IEnumerable<DOSB.Models.EditableModels.EditableEmployee>>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Employee
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ScriptContent" runat="server">
    <script type="text/javascript">
        function onEdit(e) {
            var dataItem = e.dataItem;
            var mode = e.mode;
            var form = e.form;

            var segmentDropDownList = $(form).find('#Segment');
            if (mode == 'edit') {
                //Select the proper dropdown list item
                segmentDropDownList.val(dataItem['Segment']);
            }
        }
    </script>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">

	   <% Html.Telerik().Grid(Model)
        .Name("EmployeeGrid")
        .ToolBar(toolbar => toolbar.Template(() => { %>
            <span id="add-button" class="t-grid-action t-button t-state-default" >Add</span>
       <% }))
        .DataKeys(keys => keys.Add(e => e.EmployeeId))
        .DataBinding(dataBinding => dataBinding.Ajax()
                                                .Select("_SelectAjaxEdit", "Employee")
                                                .Update("_UpdateAjaxEdit", "Employee")
                                                .Delete("_DeleteAjaxEdit", "Employee"))

        .Columns(columns =>
        {
            columns.Bound(e => e.GIN).ClientTemplate("<img src='/Employee/Avatar?id=<#= EmployeeId #>' width='35' height='35' alt='<#= LDAP #>'/>")
                .Width(50);
            columns.Bound(e => e.LDAP).Width(80);
            columns.Bound(e => e.GivenName).ClientTemplate("<#= GivenName #> <#= SurName #>").Title("Name").Width(200);
            columns.Bound(e => e.Segment).Title("SEG").Width(80);
            columns.Bound(e => e.Status).Width(80);
            columns.Bound(e => e.Mobile).Width(300);
            columns.Command(commands =>{
                commands.Edit();
                commands.Delete();
            }).Title("Commands");
        })
        .Editable(editing => editing.Mode(GridEditMode.InLine))
        .ClientEvents(events => events.OnEdit("onEdit"))
        .Pageable()
        .Render();    
    %>

     <% Html.Telerik().Window()
           .Name("add-window")
           .Title("Add Employee")
           .Visible(false)
           .Draggable(false)
           .Resizable(resizing => resizing.Enabled(false)
            )
           .Modal(true)
           .Buttons(b => b.Close())
           .Content(() =>
           {%>
           <form id="GridForm" class="t-edit-form" method="post" action="#">
           <div class="t-edit-form-container">
                <div id="message"></div>
                <div class="editor-label">
                    LDAP
                </div>
                <div class="editor-field">
                    <input type="text" name="input-ldap" />
                </div>
                <center>
                <a id="add-window-submit" class="t-grid-action t-button t-state-default t-grid-update" href="#">Add</a>
                <a id="add-window-cancel" class="t-grid-action t-button t-state-default t-grid-cancel" href="#">Cancel</a>
                <div class="loading"></div>
                </center>
            </div>
            </form>
           <%})
           .Width(400)
           .Height(120)
           .Render();
    %>

        <% Html.Telerik().ScriptRegistrar()
           .OnDocumentReady(() => {%>           
                var addButton = $('#add-button');
                var addWindow = $('#add-window');
                var addWindowSubmit = $('#add-window-submit');
                var addWindowCancel = $('#add-window-cancel');
                addButton
                    .bind('click', function(e) {
                        addWindow.data('tWindow').center().open();
                    })
                addWindowCancel.bind('click', function(e){
                    addWindow.data('tWindow').close();
                })
                addWindowSubmit.bind('click', function(e){
                    var LDAP = $('input[name=input-ldap]');
                    if (LDAP.val()=='') {
                        LDAP.addClass('input-validation-error');
                        return false;
                    } else LDAP.removeClass('input-validation-error');
      
                    var data = 'LDAP=' + LDAP.val();
                    addWindowCancel.attr('disabled', 'true');
                    
                    $('.loading').show();
                    $.post('/Employee/_AddFromLDAP', data, function(response) {
                        $('#message').html(response).addClass('validation-summary-errors');
                        setTimeout(function() {
                            $("#add-window").data("tWindow").close()
                            $('#message').html("").removeClass('validation-summary-errors');
                            $('.loading').hide();
                            LDAP.attr('value', '');
                        }, 3000);
                    });
                })
           <%}); %>
</asp:Content>

