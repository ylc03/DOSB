<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<IEnumerable<DOSB.Models.EditableModels.EditablePerssureLog>>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Material Management System
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <h2>Material Management System</h2>

<div id="searcharea">
<form class="searchForm search-nodropdown" action="./" method="get">
<div class="search-box">
    <div class="search-input">    
                <input type="text" value="Search PO, PN or SN" maxlength="255" size="30" class="searchinput" id="homepage-searchinput" name="p" autocomplete="off" style="color: rgb(51, 51, 51);" />
    </div>
    <input type="submit" value="PO" class="searchsubmit" id="Submit2" />
    <input type="submit" value="SN" class="searchsubmit" id="homepage-searchsubmit" />
    <input type="submit" value="PN" class="searchsubmit" id="Submit1" />
</div>
</form>
    <p><strong>Search</strong> the materials by <font color="red">PO , PN or SN</font> ...</p>
    <div class="clear">
  </div>
</div>
  
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">

</asp:Content>

