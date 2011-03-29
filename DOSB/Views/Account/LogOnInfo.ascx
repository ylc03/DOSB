<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<dynamic>" %>

<div style="padding: 10px;">
    <div>Welcome: <%: this.Page.User.Identity.Name %></div>
    <div><img src="/Employee/Avatar?id=<%: Membership.GetUser().ProviderUserKey.ToString() %>" 
              width="35" 
              height="35" 
              alt="<%: Membership.GetUser().UserName %>"/>
    </div>
    <div><a href="/Account/LogOff">Log out</a></div>
</div>