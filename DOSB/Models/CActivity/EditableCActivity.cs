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

        private static string getConString()
        {
            var conString = System.Configuration.ConfigurationManager.ConnectionStrings["DOSBConnectionString"];
            return conString.ConnectionString;
        }


        /// <summary>
        /// Rig Activity in one month
        /// </summary>
        /// <param name="month">month</param>
        /// <returns>list of rig activities in a month</returns>
        public static IList<EditableCActivity> All()
        {
                        IList<EditableCActivity> result =
                (IList<EditableCActivity>)HttpContext.Current.Session["CAs"];

            if (result == null)
            {
                result = new List<EditableCActivity>();
            CActivityDataContext storeDB = new CActivityDataContext(getConString());
 

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
            HttpContext.Current.Session["CAs"] = result;
            }

            return result;
        }

        /// <summary>
        /// Find One Editable Activity
        /// </summary>
        /// <param name="predicate">predicate</param>
        /// <returns>an editable Activity</returns>
        public static EditableCActivity One(Func<EditableCActivity, bool> predicate)
        {
            return All().Where(predicate).FirstOrDefault();
        }

        /// <summary>
        /// Insert new Activity
        /// </summary>
        /// <param name="torque">Editable Activity</param>
        public static void Insert(EditableCActivity Activity)
        {
            Activity.ActivityId = All().OrderByDescending(ca => ca.ActivityId).First().ActivityId + 1;
            All().Insert(0, Activity);

            
             CActivityDataContext storeDB = new CActivityDataContext(getConString());

              CompletionActivity target = new CompletionActivity();
            target.ActivityId = Activity.ActivityId;
            target.Comment = Activity.Comment;

            storeDB.CompletionActivities.InsertOnSubmit(target);
            storeDB.SubmitChanges();
        }

        /// <summary>
        /// Update Activity
        /// </summary>
        /// <param name="torque">Editable Activity</param>
        public static void Update(EditableCActivity Activity)
        {
             CActivityDataContext storeDB = new CActivityDataContext(getConString());
            CompletionActivity target = storeDB.CompletionActivities.First(e => e.ActivityId == Activity.ActivityId);

            if (target != null)
            {
                target.ActivityId = Activity.ActivityId;
                target.Comment = Activity.Comment;
            }

            storeDB.SubmitChanges();
        }

        /// <summary>
        /// Delete Activity
        /// Currently not deleted from database.
        /// </summary>
        /// <param name="torque">Editable Activity</param>
        public static void Delete(EditableCActivity Activity)
        {
            EditableCActivity target = One(ca => ca.ActivityId == Activity.ActivityId);
            if (target != null)
            {
                All().Remove(target);
            }
        }

    }
}

