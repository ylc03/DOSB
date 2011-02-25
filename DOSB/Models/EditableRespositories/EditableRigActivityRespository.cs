using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using DOSB.Models.EditableModels;
using DOSB.Models;

namespace DOSB.Models.EditableRespositories
{
    public class EditableRigActivityRespository
    {
        /// <summary>
        /// Rig Activity in one month
        /// </summary>
        /// <param name="month">month</param>
        /// <returns>list of rig activities in a month</returns>
        public static IList<EditableRigActivity> ActivitiesOnMonth(DateTime month)
        {
            DOSBEntities storeDB = new DOSBEntities();
            IList<EditableRigActivity> result = new List<EditableRigActivity>();

            DateTime startTime = new DateTime(month.Year, month.Month, 1);
            DateTime endTime = startTime.AddMonths(1);

            var completionActivities = from ca in storeDB.CompletionActivities
                                       where ca.ShowAt >= startTime && ca.ShowAt < endTime
                                       select ca;

            var rigActivities = (from ca in completionActivities
                                group ca by ca.RigActivityId into caGroup
                                select caGroup.FirstOrDefault().RigActivity).ToList();

            foreach (var rigActivity in rigActivities)
            {
                EditableRigActivity editableRigActivity = new EditableRigActivity();
                editableRigActivity.ActivityId = rigActivity.ActivityId;
                editableRigActivity.Comment = rigActivity.Comment;
                editableRigActivity.StartAt = rigActivity.StartAt;
                editableRigActivity.FinishAt = rigActivity.FinishAt;
                editableRigActivity.Rig = rigActivity.Rig;
                editableRigActivity.Well = rigActivity.Well;
                editableRigActivity.CompletionType = rigActivity.CompletionType;
                editableRigActivity.CompletionActivities = rigActivity.CompletionActivities.ToList();

                result.Add(editableRigActivity);
            }

            return result;
        }

        /// <summary>
        /// Rig Activity in this month. It is cached.
        /// </summary>
        /// <returns>list of editable rig activities</returns>
        public static IList<EditableRigActivity> ThisMonth()
        {
            if (HttpContext.Current.Session["rigActivities"] == null)
            {
                HttpContext.Current.Session["rigActivities"] = EditableRigActivityRespository.ActivitiesOnMonth(DateTime.Today);
            }

            return (IList<EditableRigActivity>)HttpContext.Current.Session["rigActivities"];
        }

    }
}
