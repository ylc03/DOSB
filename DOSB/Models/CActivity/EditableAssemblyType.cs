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
    public class EditableAssemblyType
    {
        [ReadOnly(true)]
        [ScaffoldColumn(false)]
        public int AssemblyType_Id { get; set; }

        public string Assembly_Name { get; set; }

        public string Comletion_Type { get; set; }
       


    }
}

namespace DOSB.Models.EditableRespositories
{


    public class AssemblyTypeRespository
    {
        /// <summary>
        /// Rig Activity in one month
        /// </summary>
        /// <param name="month">month</param>
        /// <returns>list of rig activities in a month</returns>
        public static IList<EditableAssemblyType> ListAll()
        {
            CActivityDataContext storeDB = new CActivityDataContext("Data Source=.\\SQLEXPRESS;AttachDbFilename=|DataDirectory|\\DOSB.mdf;Integrated Security=True;User Instance=True");


            IList<EditableAssemblyType> result = new List<EditableAssemblyType>();
            var dataResults = from tbl in storeDB.Assembly_Types
                              select tbl;

            foreach (var row in dataResults)
            {
                EditableAssemblyType entityData = new EditableAssemblyType();

                entityData.AssemblyType_Id = row.AssemblyType_Id;
                entityData.Assembly_Name = row.Assembly_Name;
                entityData.Comletion_Type = row.Comletion_Type;

                result.Add(entityData);
            }

            return result;
        }

        /// <summary>
        /// Rig Activity in one month
        /// </summary>
        /// <param name="month">month</param>
        /// <returns>list of rig activities in a month</returns>
        public static IList<EditableAssemblyType> ListUpper()
        {
            CActivityDataContext storeDB = new CActivityDataContext("Data Source=.\\SQLEXPRESS;AttachDbFilename=|DataDirectory|\\DOSB.mdf;Integrated Security=True;User Instance=True");


            IList<EditableAssemblyType> result = new List<EditableAssemblyType>();
            var dataResults = from tbl in storeDB.vwUpperCompletionAssemblies
                              select tbl;

            foreach (var row in dataResults)
            {
                EditableAssemblyType entityData = new EditableAssemblyType();

                entityData.AssemblyType_Id = row.AssemblyType_Id;
                entityData.Assembly_Name = row.Assembly_Name;
                entityData.Comletion_Type = row.Comletion_Type;

                result.Add(entityData);
            }

            return result;
        }


        /// <summary>
        /// Rig Activity in one month
        /// </summary>
        /// <param name="month">month</param>
        /// <returns>list of rig activities in a month</returns>
        public static IList<EditableAssemblyType> ListLower()
        {
            CActivityDataContext storeDB = new CActivityDataContext("Data Source=.\\SQLEXPRESS;AttachDbFilename=|DataDirectory|\\DOSB.mdf;Integrated Security=True;User Instance=True");


            IList<EditableAssemblyType> result = new List<EditableAssemblyType>();
            var dataResults = from tbl in storeDB.vwLowerCompletionAssemblies
                              select tbl;

            foreach (var row in dataResults)
            {
                EditableAssemblyType entityData = new EditableAssemblyType();

                entityData.AssemblyType_Id = row.AssemblyType_Id;
                entityData.Assembly_Name = row.Assembly_Name;
                entityData.Comletion_Type = row.Comletion_Type;

                result.Add(entityData);
            }

            return result;
        }

    }
}

