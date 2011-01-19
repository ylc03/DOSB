<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<DOSB.Models.EditableModels.EditableTorqueLog>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	DOSB - Torque Log
</asp:Content>


<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
	   <% Html.Telerik().Grid<DOSB.Models.EditableModels.EditableTorqueLog>()
        .Name("TorqueLogGrid")
        .ToolBar(toolbar => toolbar.Insert())
        .DataKeys(keys => keys.Add(t => t.TorqueId))
        .DataBinding(dataBinding => dataBinding.Ajax()
                                                .Select("_SelectAjaxEdit", "TorqueLog")
                                                .Update("_UpdateAjaxEdit", "TorqueLog")
                                                .Insert("_InsertAjaxEdit", "TorqueLog")
                                                .Delete("_DeleteAjaxEdit", "TorqueLog"))

        .Columns(columns =>
        {
            columns.Bound(t => t.PartNumber);
            columns.Bound(t => t.SerialNumber);
            columns.Bound(t => t.StartAt);
            columns.Bound(t => t.FinishAt);
            columns.Bound(t => t.TorqueBy).ClientTemplate("<img src='/Employee/Avatar?id=<#= TorqueBy #>' width='35' height='35' alt='Torqued By'/>")
    .Width(50);
            columns.Bound(t => t.ApprovedBy).ClientTemplate("<img src='/Employee/Avatar?id=<#= ApprovedBy #>' width='35' height='35' alt='Approved By'/>")
   .Width(50);
            columns.Command(commands =>{
                commands.Edit();
                commands.Delete();
            }).Title("Commands");
        })
        .Editable(editing => editing.Mode(GridEditMode.PopUp))
        .Pageable()
        .Render();    
    %>   
</asp:Content>