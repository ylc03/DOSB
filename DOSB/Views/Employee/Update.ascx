<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<DOSB.Models.Employee>" %>
            <td>
                <a href="#" onclick="update(<%: Model.EmployeeId %>)">Update</a> |
                <a href="#" onclick="del(<%: Model.EmployeeId %>)">Delete</a> 
            </td>
            <td>
                <img src="<%: Url.Action( "Avatar", "Employee", new { id = Model.EmployeeId } ) %>" width="50" height="50"/>
            </td>
            <td>
                <%: Model.LDAP %>
            </td>
            <td>
                <%: Model.GivenName + " " + Model.SurName %>
            </td>
            <td>
                <%: Model.GIN %>
            </td>
            <td>
                <%: Model.Segment.Name %>
            </td>
            <td>
                <%: Model.Status %>
            </td>
            <td>
                <%: Model.Mobile %> <br /> 
                <%: Model.PersonalMobile %> 
            </td>
            
            <td>
                <%: Model.AramcoID %>
            </td>
            
            <td>
                <%: Model.AramcoIdExpDate %>
            </td>
            
            <td>
                <%: Model.H2SExpDate %>
            </td>
            
            <td>
                <%: Model.HUETExpDate %>
            </td>