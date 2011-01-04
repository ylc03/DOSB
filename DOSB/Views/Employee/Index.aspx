<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<DOSB.viewModels.EmployeeManagerViewModel>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Employee
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="ScriptContent" runat="server">
	<script language="javascript" type="text/javascript">
	    function updateAramcoId(id, text) {
            alert(id + text);
        }

        $(function () {
            $("#calendar").datepicker();

            <% foreach (var item in Model.AllEmployees) { %>
            $("#aramco-id-<%: item.EmployeeId %>").editInPlace({
                callback: function(unused, enteredText) { updateAramcoId(<%: item.EmployeeId %>, enteredText); return;}
                show_buttons: true
            });
            <%} %>
        });

        function update(id) {
            $("#row-" + id).load("/Employee/Update", { "id": id });
        }

        function updateStatus(id) {
            $.post("/Employee/UpdateStatus", { "id": id, "status": $("#status-"+id).val()})
        }

        function updateSubSegment(id) {
            $.post("/Employee/UpdateSubSegment", { "id": id, "segmentId": $("#sub-segment-" + id).val() })
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
                <img src="<%: Url.Action( "Avatar", "Employee", new { id = item.EmployeeId } ) %>" width="50" height="50"/>
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
                
                <select id="sub-segment-<%: item.EmployeeId %>" name="sub-segment-<%: item.EmployeeId %>" onchange="updateSubSegment(<%: item.EmployeeId %>)">
                    <% foreach( var s in Model.SubSegments){ %>
                    <option value="<%: s.SegmentId %>" <% if (item.SegmentId == s.SegmentId){ %> selected <%} %> ><%: s.Name  %></option>
                    <% } %>
                </select>
            </td>
            <td>
                <select id="status-<%: item.EmployeeId %>" name="status-<%: item.EmployeeId %>" onchange="updateStatus(<%: item.EmployeeId %>)">
                    <% foreach( string s in Model.Status){ %>
                    <option value="<%: s %>" <% if (item.Status.Equals(s)){ %> selected <%} %> ><%: s %></option>
                    <% } %>
                </select>
            </td>
            <td>
                <%: item.Mobile %> <br /> 
                <%: item.PersonalMobile %> 
            </td>
            
            <td>
               <p id="aramco-id-<%: item.EmployeeId %>"><%: item.AramcoID %></p>
            </td>
            
            <td>
                <%: item.AramcoIdExpDate %>
            </td>
            
            <td>
                <%: item.H2SExpDate %>
            </td>
            
            <td>
                <%: item.HUETExpDate %>
            </td>
        </tr>
    
    <% } %>

    </table>

    <p>
        <%: Html.ActionLink("Add Employee", "Add") %>
    </p>
    
    <%: Html.TextBox("calendar") %>
</asp:Content>

