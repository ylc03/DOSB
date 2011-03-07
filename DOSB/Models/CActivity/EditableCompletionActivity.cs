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
        public int AssemblyId { get; set; }

        [ReadOnly(true)]
        [ScaffoldColumn(false)]
        public int RigActivityId { get; set; }

        public string AssemblyType { get; set; }
        public string CompanyName { get; set; }
        public string BackgroundColor { get; set; }
        public string TextColor { get; set; }
        public string Comment { get; set; }

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
    }
}

