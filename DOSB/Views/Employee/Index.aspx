<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<DOSB.viewModels.EmployeeManagerViewModel>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Employee
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
	<script language="javascript" type="text/javascript">
	    $(function () {
	        $(".edit-aramco-id").editable("/Employee/UpdateAramcoId", {
	            indicator: 'Saving...',
	            tooltip: 'Click to edit...'
	        });

	        $(".edit-status").editable("Employee/UpdateStatus", {
	            data: "{'Job':'Job', 'Base':'Base', 'Days Off':'Days Off', 'Vacation':'Vacation'}",
	            type: "select"
	        });

	        $(".edit-sub-segment").editable("Employee/UpdateSubSegment", {
	            data: "{'5':'RMC', '6':'CC', '7':'SMS'}",
	            type: "select"
	        });


	        $(".edit-aramco-id-expdate").editable("/Employee/UpdateAramcoIdExpireDate", {
	            datepicker: "true",
                onblur: "none"
	        });

            
	        $(".edit-h2s-expdate").editable("/Employee/UpdateH2SExpireDate", {
	            datepicker: "true",
                onblur: "none"
	        });

            $(".edit-huet-expdate").editable("/Employee/UpdateHUETExpireDate", {
	            datepicker: "true",
                onblur: "none"
	        });
	    });

        function update(id) {
            $("#row-" + id).load("/Employee/Update", { "id": id });
        }

        function del(id) {
            $("#row-" + id).load("/Employee/Delete", { "id": id }, function () {
                $("#row-" + id).fadeOut("normal");
            });
        }
    </script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h2>Employee Board</h2>

    <table>
        <tr>
            <th></th>
            <th>
                Avatar
            </th>
            <th>
                LDAP
            </th>
            <th>
                Full Name    
            </th>
            <th>
                GIN   
            </th>
            <th>
                Segment
            </th>
            <th>
                Status
            </th>
            <th>
                Phone
            </th>
            <th>
                Aramco ID
            </th>
            <th>
                Aramco Expire Date
            </th>
            
            <th>
                H2S Expire Date
            </th>
            
            <th>
                HEUT Expire Date
            </th>
        </tr>

    <% foreach (var item in Model.AllEmployees) { %>
        <tr id="row-<%: item.EmployeeId %>">
            <td>
                <a href="#" onclick="update(<%: item.EmployeeId %>)">Update</a> |
                <a href="#" onclick="del(<%: item.EmployeeId %>)">Delete</a> 
            </td>
            <td>
                <img src="<%: Url.Action( "Avatar", "Employee", new { id = item.EmployeeId } ) %>" width="50" height="50" alt="<%: item.LDAP %>"/>
            </td>
            <td>
                <%: item.LDAP %>
            </td>
            <td>
                <%: item.GivenName + " " + item.SurName %>
            </td>
            <td>
                <%: item.GIN %>
            </td>
            <td>
                <p id="sub-segment-<%: item.EmployeeId %>" class="edit-sub-segment" ><%: item.Segment.Name %></p>
            </td>
            <td>
                <p id="status-<%: item.EmployeeId %>" class="edit-status" ><%: item.Status %></p>
            </td>
            <td>
                <%: item.Mobile %> <br /> 
                <%: item.PersonalMobile %> 
            </td>
            
            <td>
               <p id="aramco-id-<%: item.EmployeeId %>" class="edit-aramco-id"><%: item.AramcoID %></p>
            </td>
            
            <td>
                <p id="aramco-id-expdate-<%: item.EmployeeId %>" class="edit-aramco-id-expdate">
                <% if (item.AramcoIdExpDate.HasValue) { %>
                    <%: ((DateTime)item.AramcoIdExpDate).Date.ToShortDateString() %>
                <% }%>
                </p>
            </td>
            
            <td>
                <p id="h2s-expdate-<%: item.EmployeeId %>" class="edit-h2s-expdate">
                <% if (item.H2SExpDate.HasValue) { %>
                    <%: ((DateTime)item.H2SExpDate).Date.ToShortDateString() %>
                <% }%>
                </p>
            </td>
            
            <td>
                <p id="huet-expdate-<%: item.EmployeeId %>" class="edit-huet-expdate">
                <% if (item.HUETExpDate.HasValue) { %>
                    <%: ((DateTime)item.HUETExpDate).Date.ToShortDateString() %>
                <% }%>
                </p>
            </td>
        </tr>
    
    <% } %>

    </table>

    <p>
        <%: Html.ActionLink("Add Employee", "Add") %>
    </p>
</asp:Content>

