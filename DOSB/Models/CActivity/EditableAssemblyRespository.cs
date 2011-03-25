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
    public class EditableAssembly
    {
        [ReadOnly(true)]
        [ScaffoldColumn(false)]
        public int AssemblyId { get; set; }

        public string Name { get; set; }

        public string Type { get; set; }
    }
}

namespace DOSB.Models.EditableRespositories
{
    public class EditableAssemblyRespository
    {
        private static IList<int> orderedId = new List<int>();

        static EditableAssemblyRespository()
        {

            foreach(var item in EditableAssemblyRespository.Upper() ){
                orderedId.Add(item.AssemblyId);
            }
            foreach (var item in EditableAssemblyRespository.Lower())
            {
                orderedId.Add(item.AssemblyId);
            }
        }

        public static IList<Assembly> All()
        {
            CPLDataContext storeDB = new CPLDataContext("Data Source=.\\SQLEXPRESS;AttachDbFilename=|DataDirectory|\\DOSB.mdf;Integrated Security=True;User Instance=True");

            return storeDB.Assemblies.ToList();
        }

        public static IList<EditableAssembly> Upper()
        {
            CPLDataContext storeDB = new CPLDataContext("Data Source=.\\SQLEXPRESS;AttachDbFilename=|DataDirectory|\\DOSB.mdf;Integrated Security=True;User Instance=True");

            var dataResults = from tbl in storeDB.vwUpperCompletionAssemblies
                              select new EditableAssembly
                              {
                                  AssemblyId = tbl.AssemblyId,
                                  Name = tbl.Name,
                                  Type = tbl.Type
                              };

            return dataResults.ToList();
        }

        public static IList<EditableAssembly> Lower()
        {
            CPLDataContext storeDB = new CPLDataContext("Data Source=.\\SQLEXPRESS;AttachDbFilename=|DataDirectory|\\DOSB.mdf;Integrated Security=True;User Instance=True");

            var dataResults = from tbl in storeDB.vwLowerCompletionAssemblies
                              select new EditableAssembly
                              {
                                  AssemblyId = tbl.AssemblyId,
                                  Name = tbl.Name,
                                  Type = tbl.Type
                              };

            return dataResults.ToList();
        }

        public static string AssemblyToJSStartTime(int id)
        {
            int index = EditableAssemblyRespository.orderedId.IndexOf(id);
            DateTime date = DateTime.Today.AddHours(index);
            return date.ToString("yyyy-MM-dd HH:mm");
        }

        public static string AssemblyToJSEndTime(int id)
        {
            int index = EditableAssemblyRespository.orderedId.IndexOf(id);
            DateTime date = DateTime.Today.AddHours(index+1);
            return date.ToString("yyyy-MM-dd HH:mm");
        }

        public static int StartTimeToAssemblyId(string start)
        { 
            DateTime result;
            int index = -1;
            if (DateTime.TryParse(start, out result)) 
            {
                index = result.Hour;
            }
            return orderedId.ElementAt(index);
        }
    }
}

