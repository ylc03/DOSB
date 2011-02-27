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
    public class EditableCompletionRelation
    {
        [ReadOnly(true)]
        [ScaffoldColumn(false)]
        public int AssemblyTypeId { get; set; }

        [ReadOnly(true)]
        [ScaffoldColumn(false)]
        public int ActivityId { get; set; }

        public string ComletionType { get; set; }


        public string CoName { get; set; }
        public string CoColor { get; set; }
        public string CoTxtColor { get; set; }
        public string RComment { get; set; }
      
    }
}

namespace DOSB.Models.EditableRespositories
{


    public class EditableCompletionRelationRespository
    {
        /// <summary>
        /// Rig Activity in one month
        /// </summary>
        /// <param name="month">month</param>
        /// <returns>list of rig activities in a month</returns>
        public static IList<EditableCompletionRelation> ListAllUpper(int ActivityID )
        {
            CActivityDataContext storeDB = new CActivityDataContext("Data Source=.\\SQLEXPRESS;AttachDbFilename=|DataDirectory|\\DOSB.mdf;Integrated Security=True;User Instance=True");


            IList<EditableCompletionRelation> result = new List<EditableCompletionRelation>();
            var dataResults = from tbl in storeDB.vwCompletionActivityRelations
                              where tbl.ActivityId == ActivityID && tbl.ComletionType == "Upper Completions"
                              orderby tbl.AssemblyTypeId
                              select tbl;
             string backColor;
            foreach (var row in dataResults)
            {
                EditableCompletionRelation entityData = new EditableCompletionRelation();

                entityData.ActivityId = row.ActivityId;
                entityData.AssemblyTypeId = row.AssemblyTypeId;
                entityData.CoColor = row.CoColor == null ? backColor : row.CoColor;
                entityData.ComletionType = row.ComletionType;
                entityData.RComment = row.RComment == null ? "" : row.RComment;
                entityData.CoName = row.CoName;
                entityData.CoTxtColor = row.CoTxtColor;

                result.Add(entityData);
            }

            return result;
        }

        /// <summary>
        /// Rig Activity in one month
        /// </summary>
        /// <param name="month">month</param>
        /// <returns>list of rig activities in a month</returns>
        public static IList<EditableCompletionRelation> ListAllLower(int ActivityID)
        {
            CActivityDataContext storeDB = new CActivityDataContext("Data Source=.\\SQLEXPRESS;AttachDbFilename=|DataDirectory|\\DOSB.mdf;Integrated Security=True;User Instance=True");


            IList<EditableCompletionRelation> result = new List<EditableCompletionRelation>();
            var dataResults = from tbl in storeDB.vwCompletionActivityRelations
                              where tbl.ActivityId == ActivityID && tbl.ComletionType == "Lower Completions"
                              orderby tbl.AssemblyTypeId 
                              select tbl;

            foreach (var row in dataResults)
            {
                EditableCompletionRelation entityData = new EditableCompletionRelation();

                entityData.ActivityId = row.ActivityId;
                entityData.AssemblyTypeId = row.AssemblyTypeId;
                entityData.CoColor = row.CoColor;
                entityData.ComletionType = row.ComletionType;
                entityData.RComment = row.RComment == null ? "" : row.RComment;
                entityData.CoName = row.CoName;
                entityData.CoTxtColor = row.CoTxtColor;

                result.Add(entityData);
            }

            return result;
        }

          

    }
}

