<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<DOSB.Models.EditableModels.EditableTorqueLog>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	DOSB - Torque Log
</asp:Content>


<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
<script language="javascript" type="text/javascript">
    function windowClose() {
        $('.window-content').html("");
        $('.message').html("");
    }
</script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
	   <%: Html.Telerik().Grid<DOSB.Models.EditableModels.EditableTorqueLog>()
        .Name("TorqueLogGrid")
        .ToolBar(toolbar => toolbar.Template(
            "<span id='insert-button' class='t-grid-action t-button t-state-default t-grid-select' >Insert</span>"
        ))
        .DataKeys(keys => keys.Add(t => t.TorqueId))
        .DataBinding(dataBinding => dataBinding.Ajax()
                                                .Select("_SelectAjax", "TorqueLog"))
        .Columns(columns =>
        {
            columns.Bound(t => t.TorqueId).Title("ID").Filterable(false).Width(40);
            columns.Bound(t => t.PartNumber).Width(100);
            columns.Bound(t => t.SerialNumber).Width(100);
            columns.Bound(t => t.AssemblyType).Filterable(false);
            columns.Bound(t => t.StartAt).Format("{0:yyyy-MM-dd HH:mm tt}").Width(80).Filterable(false);
            columns.Bound(t => t.FinishAt).Format("{0:yyyy-MM-dd HH:mm tt}").Width(80).Filterable(false);
            columns.Bound(t => t.Attachment).ClientTemplate("<a href='/Attachment/Download?guid=<#= AttachmentGuid #>'><#= Attachment #></a>")
                .Filterable(false);
            columns.Bound(t => t.Defect).ClientTemplate("<div class='defect-<#= Defect #>'></div>");
            columns.Bound(t => t.TorqueBy).ClientTemplate("<center><img src='/Employee/Avatar?id=<#= TorqueBy #>' width='35' height='35' alt='Torqued By'/></center>")
                .Filterable(false)
                .Title("Torque by").Width(80);
            columns.Bound(t => t.ApprovedBy).ClientTemplate("<center><img class='approved-by-<#= ApprovedBy #>' src='/Employee/Avatar?id=<#= ApprovedBy #>' width='35' height='35' alt='Approved By'/></center>")
                .Filterable(false)
                .Title("Approved by").Width(80);
            columns.Bound(t => t.TorqueId).ClientTemplate("" +
                "<span id='edit-button' class='t-grid-action t-button t-state-default t-grid-select' >Edit</span>" +
                "<span id='delete-button' class='t-grid-action t-button t-state-default t-grid-select' >Delete</span>"
            ).Title("Commands").Filterable(false);
        }) // columns end
        .DetailView(detailView => detailView.ClientTemplate("<div class='torque-details'>" +
            "<ul>" +
                "<li><label>Torque ID:</label> <#=  TorqueId #> </li>" +
                "<li><label>Part Number:</label> <#=  PartNumber #> </li>" +
                "<li><label>Serial Number:</label> <#=  SerialNumber #> </li>" +
                "<li><label>AssemblyType:</label> <#=  AssemblyType #> </li>" +
                "<li><label>Attachment:</label> <a href='/Attachment/Download?guid=<#= AttachmentGuid #>'><#= Attachment #></a> </li>" +
                "<li><label>Comment:</label> <#=  Comment #> </li>" +
            "</ul>" +
            "</div>"))
        .CellAction(cell => {
            if (cell.Column.Member == "Defect")
            {
                cell.HtmlAttributes["style"] = "color: red;";
            }
        })
        .Editable(editing => editing.Mode(GridEditMode.PopUp))
        .Filterable()
        .Pageable()
    %>   

    <% Html.Telerik().Window()
           .Name("insert-window")
           .Title("Insert Torque Log")
           .Visible(false)
           .Draggable(false)
           .Resizable(resizing => resizing.Enabled(false))
           .Modal(true)
           .Buttons(b => b.Close())
           .Content(() =>
           {%>
           <div class="window-content">
                
           </div>
           <div class="loading"></div>
           <div class="message"></div>
           <%})
           .Width(400)
           .Height(400)
           .ClientEvents(events => events.OnClose("windowClose"))
           .Render();
    %>

    <% Html.Telerik().Window()
           .Name("edit-window")
           .Title("Edit Torque Log")
           .Visible(false)
           .Draggable(false)
           .Resizable(resizing => resizing.Enabled(false))
           .Modal(true)
           .Buttons(b => b.Close())
           .Content(() =>
           {%>
           <div class="window-content">
                
           </div>
           <div class="loading"></div>
           <div class="message"></div>
           <%})
           .Width(400)
           .Height(400)
           .ClientEvents(events => events.OnClose("windowClose"))
           .Render();
    %>

    <% Html.Telerik().Window()
           .Name("delete-window")
           .Title("Delete Torque Log")
           .Visible(false)
           .Draggable(false)
           .Resizable(resizing => resizing.Enabled(false))
           .Modal(true)
           .Buttons(b => b.Close())
           .Content(() =>
           {%>
           <div class="window-content">
                
           </div>
           <div class="loading"></div>
           <div class="message"></div>
           <%})
           .Width(400)
           .Height(130)
           .ClientEvents(events => events.OnClose("windowClose"))
           .Render();
    %>

    <% Html.Telerik().Window()
           .Name("approve-window")
           .Title("Approve Torque Log")
           .Visible(false)
           .Draggable(false)
           .Resizable(resizing => resizing.Enabled(false))
           .Modal(true)
           .Buttons(b => b.Close())
           .Content(() =>
           {%>
           <div class="window-content">
                
           </div>
           <div class="loading"></div>
           <div class="message"></div>
           <%})
           .Width(400)
           .Height(200)
           .ClientEvents(events => events.OnClose("windowClose"))
           .Render();
    %>
<% Html.Telerik().ScriptRegistrar()
    .OnDocumentReady(() => {%>
        // approved by 0
        var approveWindow = $('#approve-window')
        $(".approved-by-0").live('click', function(e){
            var tr = $(this).closest('tr')[0];
            var dataItem = $('#TorqueLogGrid').data('tGrid').dataItem(tr);

            approveWindow.data('tWindow').center().open();
            $('.loading', approveWindow).show();

            $.get('/TorqueLog/_ApproveAjax', {id: dataItem.TorqueId}, function (data){
                $('.window-content', approveWindow).html(data);
                $('.loading', approveWindow).hide();
            })
        })

        $('.t-grid-cancel', approveWindow).live('click', function(e){
            approveWindow.data('tWindow').close();
        })

        $('.t-grid-approve', approveWindow).live('click', function(e){
            var TorqueId = $('input[name=TorqueId]');
            var ApprovedBy = $('input[name=ApprovedBy]');
            var Password = $('input[name=Password]');

            var data = 'id=' + TorqueId.val()
               + '&' + 'approvedBy=' + ApprovedBy.val()
               + '&' + 'password=' + Password.val();

            $('.loading', approveWindow).show();
            $.post('/TorqueLog/_ApproveAjax', data, function(response) {
                $('.loading', approveWindow).hide();
                $('.message', approveWindow).html(response);
                $('#TorqueLogGrid').data('tGrid').rebind();
            })
        })

        // insert action
        var insertWindow = $('#insert-window');
        $('#insert-button').live('click', function (e) {
            insertWindow.data('tWindow').center().open();
            $('.loading', insertWindow).show();

            $.get('/TorqueLog/_EditAjax', {id: 0}, function (data){
                $('.window-content', insertWindow).html(data);
                $('.loading', insertWindow).hide();
                $('INPUT[type="file"]', insertWindow).makeAsyncUploader({
                    upload_url: '/Attachment/AsyncUpload',
                    flash_url: '/Scripts/swfupload.swf',
                    button_image_url: '/Content/blankButton.png',
                    disableDuringUpload: 'INPUT[type="submit"]',
                });
            })
        })

        $('.t-grid-cancel', insertWindow).live('click', function(e){
            insertWindow.data('tWindow').close();
        })

        $('.t-grid-submit', insertWindow).live('click', function(e){
            var TorqueId = $('input[name=TorqueId]');
            var PartNumber = $('input[name=PartNumber]');
            var SerialNumber = $('input[name=SerialNumber]');
            var AssemblyType = $('input[name=AssemblyType]');
            var StartAt = $('input[name=StartAt]');
            var FinishAt = $('input[name=FinishAt]');
            var Comment = $('textarea[name=Comment]');
            var Guid = $('input[name=Attachment_guid]');
            var Defect = $('input[name=Defect]');
            var TorqueBy = $('input[name=TorqueBy]');

            var data = 'PartNumber=' + PartNumber.val()
               + '&' + 'SerialNumber=' + SerialNumber.val()
               + '&' + 'AssemblyType=' + AssemblyType.val()
               + '&' + 'StartAt=' + StartAt.val()
               + '&' + 'FinishAt=' + FinishAt.val()
               + '&' + 'Comment=' + Comment.val()
               + '&' + 'guid=' + Guid.val()
               + '&' + 'Defect=' + Defect.is(':checked')
               + '&' + 'TorqueBy=' + TorqueBy.val();

            $('.loading', insertWindow).show();
            $.post('/TorqueLog/_InsertAjax', data, function(response) {
                $('.loading', insertWindow).hide();
                $('.message', insertWindow).html(response);
                $('#TorqueLogGrid').data('tGrid').rebind();
            })
        })

        // edit action
        var editWindow = $('#edit-window');
        $('#edit-button').live('click', function (e) {
            var tr = $(this).closest('tr')[0];
            var dataItem = $('#TorqueLogGrid').data('tGrid').dataItem(tr);

            if (dataItem.ApprovedBy > 0) 
            {
                alert("This record is finalized! You cannot edit.");
                return;
            }

            editWindow.data('tWindow').center().open();
            $('.loading', editWindow).show();

            $.get('/TorqueLog/_EditAjax', {id: dataItem.TorqueId}, function (data){
                $('.window-content', editWindow).html(data);
                $('.loading', editWindow).hide();
                $('INPUT[type="file"]', editWindow).makeAsyncUploader({
                    upload_url: '/Attachment/AsyncUpload',
                    flash_url: '/Scripts/swfupload.swf',
                    button_image_url: '/Content/blankButton.png',
                    disableDuringUpload: 'INPUT[type="submit"]',
                    existingFilename: $('INPUT[name=OldAttachment]').val(),
                    existingGuid: $('INPUT[name=OldGuid]').val()
                });
            })
        })

        $('.t-grid-cancel', editWindow).live('click', function(e){
            editWindow.data('tWindow').close();
        })

        $('.t-grid-submit', editWindow).live('click', function(e){
            var TorqueId = $('input[name=TorqueId]');
            var PartNumber = $('input[name=PartNumber]');
            var SerialNumber = $('input[name=SerialNumber]');
            var AssemblyType = $('input[name=AssemblyType]');
            var StartAt = $('input[name=StartAt]');
            var FinishAt = $('input[name=FinishAt]');
            var Comment = $('textarea[name=Comment]');
            var Guid = $('input[name=Attachment_guid]');
            var Defect = $('input[name=Defect]');
            var TorqueBy = $('input[name=TorqueBy]');

            var data = 'id=' + TorqueId.val()
               + '&' + 'PartNumber=' + PartNumber.val()
               + '&' + 'SerialNumber=' + SerialNumber.val()
               + '&' + 'AssemblyType=' + AssemblyType.val()
               + '&' + 'StartAt=' + StartAt.val()
               + '&' + 'FinishAt=' + FinishAt.val()
               + '&' + 'Comment=' + Comment.val()
               + '&' + 'guid=' + Guid.val()
               + '&' + 'Defect=' + Defect.is(':checked')
               + '&' + 'TorqueBy=' + TorqueBy.val();

            $('.loading', editWindow).show();
            $.post('/TorqueLog/_EditAjax', data, function(response) {
                $('.loading', editWindow).hide();
                $('.message', editWindow).html(response);
                $('#TorqueLogGrid').data('tGrid').rebind();
            })
        })
        // delete action
        var deleteWindow = $('#delete-window');
        $('#delete-button').live('click', function(e){
            var tr = $(this).closest('tr')[0];
            var dataItem = $('#TorqueLogGrid').data('tGrid').dataItem(tr);

            if (dataItem.ApprovedBy > 0) 
            {
                alert("This record is finalized! You cannot delete.");
                return;
            }

            deleteWindow.data('tWindow').center().open();
            $('.loading', deleteWindow).show();

            $.get('/TorqueLog/_DeleteAjax', {id: dataItem.TorqueId}, function (data){
                $('.window-content', deleteWindow).html(data);
                $('.loading', deleteWindow).hide();
            })
        })

        $('.t-grid-delete', deleteWindow).live('click', function(e){
            var TorqueId = $('input[name=TorqueId]');
            var data = 'id=' + TorqueId.val();
            $('.loading', deleteWindow).show();
            $.post('/TorqueLog/_ConfirmDeleteAjax', data, function(response) {
                $('.loading', deleteWindow).hide();
                $('.message', deleteWindow).html(response);
                deleteWindow.data('tWindow').close();
                $('#TorqueLogGrid').data('tGrid').rebind();
            })
        })

        $('.t-grid-cancel', deleteWindow).live('click', function(e){
            deleteWindow.data('tWindow').close();
        })
  <%}); %> 
</asp:Content>