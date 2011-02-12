using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using DOSB.Models.EditableModels;
using DOSB.Models;

namespace DOSB.Models.EditableRespositories
{
    public class EditableActivityRespository
    {
        /// <summary>
        /// All activities on one day. not cached.
        /// </summary>
        /// <param name="date">date</param>
        /// <returns>list of activities</returns>
        public static IList<EditableActivity> ActivitiesOn(DateTime date)
        {
            DOSBEntities storeDB = new DOSBEntities();
            List<EditableActivity> result = new List<EditableActivity>();

            DateTime startTime = new DateTime(date.Year, date.Month, date.Day);
            DateTime endTime = new DateTime(date.Year, date.Month, date.Day + 1);

            foreach (var activity in storeDB.WorkshopDailyActivity.Where(a => a.CreatedAt < endTime
                                                                         && (!a.FinishedAt.HasValue || a.FinishedAt.Value >= startTime)
                                                                         && (!a.CanceledAt.HasValue || a.CanceledAt.Value >= startTime)))
            {
                EditableActivity editableActivity = new EditableActivity();
                editableActivity.ActivityId = activity.ActivityId;
                editableActivity.Description = activity.Description;
                editableActivity.Forklift = activity.Forklift > 0;
                editableActivity.Torque = activity.Torque;
                editableActivity.PressureTest = activity.PressureTest;
                editableActivity.CreatedAt = activity.CreatedAt;
                editableActivity.FinishedAt = activity.FinishedAt.HasValue ? activity.FinishedAt.Value : DateTime.MaxValue;
                editableActivity.CanceledAt = activity.CanceledAt.HasValue ? activity.CanceledAt.Value : DateTime.MaxValue;
                editableActivity.Assignments = activity.WorkshopAssignments.ToList();

                result.Add(editableActivity);
            }

            return result;
        }

        /// <summary>
        /// Activities for today. Cached.
        /// </summary>
        /// <returns>List of editable activities</returns>
        public static IList<EditableActivity> Today()
        {
            if (HttpContext.Current.Session["activities"] == null)
            {
                HttpContext.Current.Session["activities"] = EditableActivityRespository.ActivitiesOn(DateTime.Today);
            }

            return (IList<EditableActivity>)HttpContext.Current.Session["activities"];
        }

        /// <summary>
        /// Insert new activity
        /// </summary>
        /// <param name="activity">Editable Activity</param>
        public static void Insert(EditableActivity activity)
        {
            WorkshopDailyActivity target = new WorkshopDailyActivity();
            target.Description = activity.Description;
            target.Forklift = activity.Forklift ? 1 : 0;
            target.Torque = activity.Torque;
            target.PressureTest = activity.PressureTest;
            target.CreatedAt = DateTime.Now;

            DOSBEntities storeDB = new DOSBEntities();
            storeDB.WorkshopDailyActivity.AddObject(target);
            storeDB.SaveChanges();

            activity.ActivityId = target.ActivityId;
            Today().Add(activity); // update cache.
        }

        /// <summary>
        /// Update Activity
        /// </summary>
        /// <param name="activity">Editable activity</param>
        public static void Update(EditableActivity activity)
        {
            DOSBEntities storeDB = new DOSBEntities();
            WorkshopDailyActivity target = storeDB.WorkshopDailyActivity.First(a => a.ActivityId == activity.ActivityId);
            if (target != null)
            {
                target.Description = activity.Description;
                target.Forklift = activity.Forklift ? 1 : 0;
                target.Torque = activity.Torque;
                target.PressureTest = activity.PressureTest;
                target.CreatedAt = activity.CreatedAt;
                
                if (activity.FinishedAt <= DateTime.Now)
                {
                    target.FinishedAt = activity.FinishedAt;
                }

                if (activity.CanceledAt <= DateTime.Now)
                {
                    target.CanceledAt = activity.CanceledAt;
                }
            }

            storeDB.SaveChanges();
        }

        /// <summary>
        /// Delete activity
        /// Currently not deleted from database.
        /// </summary>
        /// <param name="activity">Editable activity</param>
        public static void Delete(EditableActivity activity)
        {
            EditableActivity target = Today().FirstOrDefault(a => a.ActivityId == activity.ActivityId);
            if (target != null)
            {
                Today().Remove(target);
            }
        }
    }
}