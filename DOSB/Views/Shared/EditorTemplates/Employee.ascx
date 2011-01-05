<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<DOSB.Models.Employee>" %>

            <div class="editor-label">
                <%: Html.LabelFor(model => model.LDAP) %>
            </div>
            <div class="editor-field">
                <%: Html.TextBoxFor(model => model.LDAP) %>
                <%: Html.ValidationMessageFor(model => model.LDAP) %>
            </div>