using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using DOSB.Models;
using DOSB.Models.EditableRespositories;
using DOSB.Models.EditableModels;

namespace DOSB
{
    public static class GlobalConstant
    {
        /// <summary>
        /// Employe Status List for the application
        /// </summary>
        /// <returns>Employe Status List</returns>
        public static List<string> GetEmployeStatusList()
        {
            return new List<string> { "Base", "Job", "Days Off", "Vacation" };
        }

        /// <summary>
        /// Segment list for the session
        /// </summary>
        /// <returns>segment list</returns>
        public static List<Segment> GetAllSegments()
        {
            if (HttpContext.Current.Session["segments"] == null)
            {
                HttpContext.Current.Session["segments"] = (new CPLDataContext()).Segments.ToList();
            }

            return (List<Segment>)HttpContext.Current.Session["segments"];
        }

        /// <summary>
        /// Role list for the session
        /// </summary>
        /// <returns>segment list</returns>
        public static List<Role> GetAllRoles()
        {
            if (HttpContext.Current.Session["roles"] == null)
            {
                HttpContext.Current.Session["roles"] = (new CPLDataContext()).Roles.ToList();
            }

            return (List<Role>)HttpContext.Current.Session["roles"];
        }

        /// <summary>
        /// Segment list for the session
        /// </summary>
        /// <returns>segment list</returns>
        public static List<EditableEmployee> GetAllEmployees()
        {
            if (HttpContext.Current.Session["employees"] == null)
            {
                EditableEmployeeRespository.All();
            }

            return (List<EditableEmployee>)HttpContext.Current.Session["employees"];
        }
    }
}