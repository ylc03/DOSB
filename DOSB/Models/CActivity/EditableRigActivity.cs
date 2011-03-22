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
    public class EditableRigActivity
    {
        //[ReadOnly(true)]
        //[ScaffoldColumn(false)]
        public int RigActivityId { get; set; }
        public int RigId { get; set; }
        public string FieldName { get; set; }
        public string ClientName { get; set; }
        public string CountryName { get; set; }
        public string Comment { get; set; }
        public string RigName { get; set; }
        public string WellName { get; set; }
        public string WellStatus { get; set; }
        public string WellTypeName { get; set; }
        public string CompletionTypeName { get; set; }

        private DateTime start;
        public DateTime StartAt 
        {
            get
            {
                return start;
            }
            set 
            {
                start = value;
                StartDate = value.ToString("yyyy-MM-dd");
            } 
        }

        private DateTime end;
        public DateTime FinishAt 
        {
            get
            {
                return end;
            }
            set
            {
                end = value;
                EndDate = value.ToString("yyyy-MM-dd");
            }
        }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
    }
}

namespace DOSB.Models.EditableRespositories
{
    public class EditableRigActivityRespository
    {
        /// <summary>
        /// Rig Activity in one month
        /// </summary>
        /// <param name="month">month</param>
        /// <returns>list of rig activities in a month</returns>
        public static IList<EditableRigActivity> All()
        {
            IList<EditableRigActivity> result = (IList<EditableRigActivity>)HttpContext.Current.Session["RigActivities"];

            if (result == null)
            {
                CPLDataContext store = CPLStore.Instance;

                var dataResults = from tbl in store.vwRigActivities
                                  select new EditableRigActivity
                                  {
                                      RigActivityId = tbl.RigActivityId,
                                      RigId = tbl.RigId,
                                      RigName = tbl.RigName,
                                      WellName = tbl.WellName,
                                      FieldName = tbl.FieldName,
                                      ClientName = tbl.ClientName,
                                      CountryName = tbl.CountryName,
                                      CompletionTypeName = tbl.CompletionTypeName,
                                      WellStatus = tbl.WellStatus,
                                      WellTypeName = tbl.WellTypeName,
                                      Comment = tbl.Comment,
                                      StartAt = tbl.StartAt.HasValue ? tbl.StartAt.Value : DateTime.Today,
                                      FinishAt = tbl.FinishAt.HasValue ? tbl.FinishAt.Value : DateTime.MaxValue
                                  };
                HttpContext.Current.Session["RigActivities"] = result = dataResults.ToList();
            }

            return result;
        }

        public static IQueryable<EditableRigActivity> AllByTimeSpan(DateTime start, DateTime end)
        {
            CPLDataContext store = CPLStore.Instance;

            var dataResults = from tbl in store.fnFilterRigActivity(start, end)
                              select new EditableRigActivity
                              {
                                  RigActivityId = tbl.RigActivityId,
                                  RigId = tbl.RigId,
                                  RigName = tbl.RigName,
                                  WellName = tbl.WellName,
                                  FieldName = tbl.FieldName,
                                  ClientName = tbl.ClientName,
                                  CountryName = tbl.CountryName,
                                  CompletionTypeName = tbl.CompletionTypeName,
                                  WellStatus = tbl.WellStatus,
                                  WellTypeName = tbl.WellTypeName,
                                  Comment = tbl.Comment,
                                  StartAt = tbl.StartAt.HasValue ? tbl.StartAt.Value : DateTime.Today,
                                  FinishAt = tbl.FinishAt.HasValue ? tbl.FinishAt.Value : DateTime.Today.AddMonths(1)
                              };
            return dataResults;
        }

        /// <summary>
        /// Find One Editable Activity
        /// </summary>
        /// <param name="predicate">predicate</param>
        /// <returns>an editable Activity</returns>
        public static EditableRigActivity One(Func<EditableRigActivity, bool> predicate)
        {
            return All().Where(predicate).FirstOrDefault();
        }

        /// <summary>
        /// Insert new Activity
        /// </summary>
        /// <param name="torque">Editable Activity</param>
        public static void Insert(EditableRigActivity Activity)
        {
            Activity.RigActivityId = All().OrderByDescending(ca => ca.RigActivityId).First().RigActivityId + 1;
            All().Insert(0, Activity);


            CPLDataContext storeDB = new CPLDataContext();

            RigActivity target = new RigActivity();
            target.RigActivityId = Activity.RigActivityId;
            target.Comment = Activity.Comment;

            storeDB.RigActivities.InsertOnSubmit(target);
            storeDB.SubmitChanges();
        }

        /// <summary>
        /// Update Activity
        /// </summary>
        /// <param name="torque">Editable Activity</param>
        public static void Update(EditableRigActivity activity)
        {
            CPLDataContext store = CPLStore.Instance;
            RigActivity target = store.RigActivities.First(ra => ra.RigActivityId == activity.RigActivityId);

            if (target != null)
            {
                target.RigActivityId = activity.RigActivityId;
                target.Comment = activity.Comment;
            }

            store.SubmitChanges();
        }

        /// <summary>
        /// Delete Activity
        /// Currently not deleted from database.
        /// </summary>
        /// <param name="torque">Editable Activity</param>
        public static void Delete(EditableRigActivity activity)
        {
            EditableRigActivity target = One(ra => ra.RigActivityId == activity.RigActivityId);
            if (target != null)
            {
                All().Remove(target);
            }
        }
    }
}

