<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<dynamic>" %>
           <td>
                <a href="#" onclick="update(<%: Model.EmployeeId %>)">Update</a> |
                <a href="#" onclick="del(<%: Model.EmployeeId %>)">Delete</a> 
            </td>
            <td>
                <img alt="<%: Model.LDAP %>" src="<%: Url.Action( "Avatar", "Employee", new { id = Model.EmployeeId } ) %>" width="50" height="50"/>
            </td>
            <td>
                <%: Model.LDAP%>
            </td>
            <td>
                <%: Model.Segment.Name%>
            </td>
            <td>
                <%: Model.Status%>s
            </td>
