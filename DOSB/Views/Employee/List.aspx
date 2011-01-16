<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/TelerikSite.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	List Employees
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <p />

    <%: Html.Telerik().Grid<Employees>()
        .Name("Grid")
        .Columns(columns =>
        {
            columns.Bound(e => e.GIN).Width(120);
            columns.Bound(e => e.GivenName).Width(200);
            columns.Bound(e => e.PersonalMobile);
            columns.Bound(e => e.AramcoIdExpDate).Format("{0:MM/dd/yyyy}").Width(100);
        })
        .DataBinding(dataBinding => dataBinding.Ajax().Select("_List", "Employee"))
        .Pageable()
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