using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using DOSB.Models;

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
        public static List<Segment> GetSegments()
        {
            if (HttpContext.Current.Session["segments"] == null)
            {
                HttpContext.Current.Session["segments"] = (new DOSBEntities()).Segment.ToList();
            }

            return (List<Segment>)HttpContext.Current.Session["segments"];
        }
    }
}