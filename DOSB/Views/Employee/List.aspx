<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/TelerikSite.Master" Inherits="System.Web.Mvc.ViewPage<IEnumerable<Employees>>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	List Employees
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <p />

    <% Html.Telerik().Grid(Model)
        .Name("Grid")
        .ToolBar(commands => commands.Insert())
        .DataKeys(keys => keys.Add(e => e.EmployeeId))
        .DataBinding(dataBinding => dataBinding.Ajax()
                                                .Select("_SelectAjaxEdit", "Employee")
                                                .Update("_UpdateAjaxEdit", "Employee")
                                                .Delete("_DeleteAjaxEdit", "Employee")
                                                .Insert("_InsertAjaxEdit", "Employee"))
                                                
        .Columns(columns =>
        {
            columns.Bound(e => e.GIN).ClientTemplate("<img src='/Employee/Avatar?id=<#= EmployeeId #>' width='35' height='35' alt='<#= LDAP #>'/>")
                .Width(40);
            columns.Bound(e => e.LDAP).Width(60);
            columns.Bound(e => e.GivenName).ClientTemplate("<#= GivenName #> <#= SurName #>").Title("Name").Width(200);
            columns.Bound(e => e.Segment.Name).Title("SEG").Width(40);
            columns.Bound(e => e.Status).Width(50);
            columns.Bound(e => e.Mobile);
            columns.Command(commands =>
            {
                commands.Edit();
                commands.Delete();
            }).Width(180).Title("Command");
        })
        .DataBinding(dataBinding => dataBinding.Ajax().Select("_List", "Employee"))
        .Editable(editing => editing.Mode(GridEditMode.PopUp))
        .Pageable()
        .Render();    
    %>

</asp:Content>

<asp:Content ID="Content3" contentPlaceHolderID="HeadContent" runat="server">
    <style type="text/css">
        #buy, #express
        {
            position: absolute;
            width: 50%;
            height: 100%;
            text-indent: -9999px;
            outline: 0;
        }
        
        #buy { left: 0; }
        #express { right: 0; }
    </style>
</asp:Content>