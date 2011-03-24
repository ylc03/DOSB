using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using DOSB.Models;
using DOSB.Models.EditableModels;

namespace DOSB.Models.EditableRespositories
{
    public class EditableCompanyRespository
    {
        /// <summary>
        /// All companies
        /// CPL LINQ to SQL model for read only, should removed later
        /// </summary>
        /// <returns>All editable companies</returns>
        public static IQueryable<EditableCompany> All()
        {
            IQueryable<EditableCompany> result =
                (IQueryable<EditableCompany>)HttpContext.Current.Session["companies"];
            if (result == null)
            {
                CPLDataContext store = new CPLDataContext();

                result = from row in store.Companies
                         select new EditableCompany
                         {
                             CompanyId = row.CompanyId,
                             ShortName = row.ShortName,
                             FullName = row.FullName,
                             BackgroundColor = row.BackgroundColor,
                             TextColor = row.TextColor
                         };

                HttpContext.Current.Session["companies"] = result;
            }

            return result;
        }
    }
}