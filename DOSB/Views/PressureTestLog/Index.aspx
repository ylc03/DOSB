<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<IEnumerable<DOSB.Models.EditableModels.EditablePressureTestLog>>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Pressure Test Log
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <h2>Pressure Test Log</h2>

<div id="searcharea">
<form class="searchForm search-nodropdown" action="./" method="get">
<div class="search-box">
    <div class="search-input">    
                <input type="text" value="Search PN/SN" maxlength="255" size="30" class="searchinput" id="homepage-searchinput" name="p" autocomplete="off" style="color: rgb(51, 51, 51);" />
    </div>
    <input type="submit" value="SN" class="searchsubmit" id="homepage-searchsubmit" />
    <input type="submit" value="PN" class="searchsubmit" id="Submit1" />
</div>
</form>
    <p><strong>Search</strong> the pressure test certificates by <font color="red">PN / SN</font> ...</p>
    <div class="clear">
  </div>
</div>

<% Html.Telerik().Grid<DOSB.Models.EditableModels.EditablePressureTestLog>()
        .Name("Grid")
        .DataBinding(dataBinding => dataBinding.Ajax()
                                                .Select("_SelectAjaxEdit", "PressureTestLog")
                                                .Insert("_InsertAjaxEdit", "PressureTestLog")
                                                .Update("_UpdateAjaxEdit", "PressureTestLog")
                                                .Delete("_DeleteAjaxEdit", "PressureTestLog"))
        .Columns(columns =>
        {
            columns.Bound(e => e.PerssureTestId).Width(5).Title("ID");
            columns.Bound(e => e.PartNumber);
            columns.Bound(e => e.SerialNumber);
            columns.Bound(e => e.StartAt);
            columns.Bound(e => e.FinishAt);
            columns.Bound(e => e.AssemblyType);
            columns.Bound(e => e.Comment);
            columns.Bound(e => e.Defect);
            columns.Bound(e => e.TestBy).ClientTemplate("<img src='/Employee/Avatar?id=<#= TestBy #>' width='35' height='35' />")
                .Width(40);
            columns.Bound(e => e.ApprovedBy).ClientTemplate("<img src='/Employee/Avatar?id=<#= ApprovedBy #>' width='35' height='35' />")
                .Width(40);
        })
        .Render();
         
    %>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
</asp:Content>

