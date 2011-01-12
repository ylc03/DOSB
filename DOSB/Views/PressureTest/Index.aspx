<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<IEnumerable<DOSB.Models.PressureTest>>" %>

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


    <!--Start of Pressure Test List-->

    <div id="pressure-test-log">
    <ul>
        <% foreach (var item in Model){ %>
        <li>
            <div class="sequence-number"><%: item.PressureTestId %></div>
            <div class="content">
                <div class="column1">
                    <div class="title">PN</div><p><%: item.PartNumber %></p>
                    <div class="title">SN</div><p><%: item.SerialNumber %></p>
                </div>
                <div class="column2">
                    <div class="time">Started At</div><p><%: item.StartAt %></p>
                    <div class="time">Finished At</div><p><%: item.FinishAt %></p>
                </div>
                <div class="description">
                    <img src="/Content/Images/download.jpg" width="15" height="15" alt="download certificate"/>
                </div><p><%: item.AssemblyType  %></p>
            </div>
                <div class="action">
                    <center>
                     <img src="<%: Url.Action( "Avatar", "Employee", new { id = item.TestBy } ) %>" width="35" height="35" alt="Tester"/>
                     <div style="font-size: 1em; font-weight: bold">Tested By</div>
                     <div style="font-size: 1em;"> <%: item.Employee.GivenName %></div>
                     </center>
                </div>
                <div class="action">
                    <center>
                     <img src="<%: Url.Action( "Avatar", "Employee", new { id = item.ApprovedBy } ) %>" width="35" height="35" alt="Approver"/>
                     <div style="font-size: 1em; font-weight: bold">Approved By</div>
                     <div style="font-size: 1em;"> <%: item.Approver.GivenName %></div>
                    </center>
                </div>
        </li>
        <%} %>  
    </ul>
    </div>
    <!-- End of Pressure Test List-->
    

        
    <p>
         <img src="/Content/Images/icon_plus.gif"/>
         <%: Html.ActionLink("New", "Create") %>
    </p>
  
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
</asp:Content>

