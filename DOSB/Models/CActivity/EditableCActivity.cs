using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

using DOSB.Models;

using DOSB.Models.EditableModels;

namespace DOSB.Models.EditableModels
{
    public class EditableCActivity
    {
        [ReadOnly(true)]
        [ScaffoldColumn(false)]
        public int ActivityId { get; set; }

        public string  FieldName { get; set; }


        public string  ClientName { get; set; }
        public string      CountryName { get; set; }
        public string      Comment { get; set; }
        public string      RigName { get; set; }
        public string      WellName { get; set; }
        public string      WellStatus { get; set; }
         public string     WellTypeName { get; set; }
         public string CompTypeName { get; set; }


    }
}

namespace DOSB.Models.EditableRespositories
{


    public class EditableCActivityRespository
    {
        /// <summary>
        /// Rig Activity in one month
        /// </summary>
        /// <param name="month">month</param>
        /// <returns>list of rig activities in a month</returns>
        public static IList<EditableCActivity> ListAll()
        {
            CActivityDataContext storeDB = new CActivityDataContext("Data Source=.\\SQLEXPRESS;AttachDbFilename=|DataDirectory|\\DOSB.mdf;Integrated Security=True;User Instance=True");

     //       DOSBEntities storeDB = new DOSBEntities();
            IList<EditableCActivity> result = new List<EditableCActivity>();
            var dataResults = from tbl in storeDB.vwCompActivities
                              select tbl;

            foreach (var row in dataResults )
            {
                EditableCActivity entityData = new EditableCActivity();

                entityData.ActivityId = row.ActivityId;
                entityData.FieldName = row.FieldName;
                entityData.ClientName = row.ClientName;
                entityData.CountryName = row.CountryName;
                entityData.Comment = row.Comment == null ? "" : row.Comment;
                entityData.RigName = row.RigName;
                entityData.WellName = row.WellName;
                entityData.WellStatus = row.WellStatus;
                entityData.WellTypeName = row.WellTypeName;
                entityData.CompTypeName = row.CompTypeName;


                result.Add(entityData);
            }

            return result;
        }

        /// <summary>
        /// Rig Activity in this month. It is cached.
        /// </summary>
        /// <returns>list of editable rig activities</returns>
        //public static IList<EditableCActivity> ThisMonth()
        //{
        //    if (HttpContext.Current.Session["rigActivities"] == null)
        //    {
        //        HttpContext.Current.Session["rigActivities"] = EditableCActivityRespository.ActivitiesOnMonth(DateTime.Today);
        //    }

        //    return (IList<EditableCActivity>)HttpContext.Current.Session["rigActivities"];
        //}

    }
}

