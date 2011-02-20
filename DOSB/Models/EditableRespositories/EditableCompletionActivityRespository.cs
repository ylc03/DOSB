using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using DOSB.Models.EditableModels;
using DOSB.Models;

namespace DOSB.Models.EditableRespositories
{
    public class EditableCompletionActivityRespository
    {
        public static IList<EditableCompletionActivity> ActivitiesOnMonth(DateTime month)
        {
            DOSBEntities storeDB = new DOSBEntities();
            List<EditableCompletionActivity> result = new List<EditableCompletionActivity>();

            DateTime startTime = new DateTime(month.Year, month.Month, 1);
            DateTime endTime = new DateTime(month.Year, month.Month + 1, 1);

            foreach (var activity in storeDB.CompletionActivities.Where(a => a.ShowAt >= startTime && a.ShowAt < endTime))
            {
                EditableCompletionActivity editableActivity = new EditableCompletionActivity();
                editableActivity.ActivityId = activity.ActivityId;
                editableActivity.Comment = activity.Comment;
                editableActivity.CompletionType = activity.CompletionType;
                editableActivity.Rig = activity.Rig;
                editableActivity.Well = activity.Well;
                editableActivity.Jobs = activity.CompletionActivityRelations.ToList();
                editableActivity.ShowAt = activity.ShowAt;

                result.Add(editableActivity);
            }

            return result;
        }

    }
}