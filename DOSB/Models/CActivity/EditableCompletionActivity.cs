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
    public class EditableCompletionActivity
    {
        [ReadOnly(true)]
        [ScaffoldColumn(false)]
        public int CompletionActivityId { get; set; }

        [ReadOnly(true)]
        [ScaffoldColumn(false)]
        public int AssemblyId { get; set; }

        [ReadOnly(true)]
        [ScaffoldColumn(false)]
        public int RigActivityId { get; set; }

        public string AssemblyType { get; set; }
        public string AssemblyName { get; set; }
        public string WellName { get; set; }
        public string RigName { get; set; }
        public string CompanyName { get; set; }
        public string BackgroundColor { get; set; }
        public string TextColor { get; set; }
        public string Comment { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }

    }
}

namespace DOSB.Models.EditableRespositories
{
    public class EditableCompletionActivityRespository
    {
        public static IList<EditableCompletionActivity> All(int rigActivityId)
        {
            CPLDataContext storeDB = new CPLDataContext();

            var dataResults = from tbl in storeDB.vwCompletionActivities
                              where tbl.RigActivityId == rigActivityId
                              orderby tbl.AssemblyId
                              select new EditableCompletionActivity
                              {
                                  CompletionActivityId = tbl.CompletionActivityId,
                                  RigActivityId = tbl.RigActivityId,
                                  AssemblyId = tbl.AssemblyId,
                                  AssemblyType = tbl.AssemblyType,
                                  CompanyName = tbl.CompanyName,
                                  Comment = tbl.Comment == null ? "" : tbl.Comment,
                                  BackgroundColor = tbl.BackgroundColor,
                                  TextColor = tbl.TextColor
                              };

            return dataResults.ToList();
        }

        public static IQueryable<EditableCompletionActivity> AllMapToTime()
        {

            CPLDataContext store = CPLStore.Instance;
             
            var dataResults = from tbl in store.vwCompletionActivities
                              orderby tbl.AssemblyId
                              select new EditableCompletionActivity
                              {
                                  CompletionActivityId = tbl.CompletionActivityId,
                                  RigActivityId = tbl.RigActivityId,
                                  AssemblyId = tbl.AssemblyId,
                                  AssemblyType = tbl.AssemblyType,
                                  AssemblyName = tbl.AssemblyName,
                                  WellName = tbl.WellName,
                                  RigName = tbl.RigName,
                                  CompanyName = tbl.CompanyName,
                                  Comment = tbl.Comment == null ? "" : tbl.Comment,
                                  BackgroundColor = tbl.BackgroundColor,
                                  TextColor = tbl.TextColor,
                                  StartDate = EditableAssemblyRespository.AssemblyToJSStartTime(tbl.AssemblyId),
                                  EndDate = EditableAssemblyRespository.AssemblyToJSEndTime(tbl.AssemblyId),
                              };

            return dataResults;
        }
    }
}

