using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

using DOSB.Models;
using DOSB.Models.EditableModels;

namespace DOSB.Models.EditableRespositories
{
    public class AssemblyRespository
    {
        public static IList<Assembly> All()
        {
            CActivityDataContext storeDB = new CActivityDataContext("Data Source=.\\SQLEXPRESS;AttachDbFilename=|DataDirectory|\\DOSB.mdf;Integrated Security=True;User Instance=True");

            return storeDB.Assemblies.ToList();
        }

        public static IList<Assembly> Upper()
        {
            CActivityDataContext storeDB = new CActivityDataContext("Data Source=.\\SQLEXPRESS;AttachDbFilename=|DataDirectory|\\DOSB.mdf;Integrated Security=True;User Instance=True");

            var dataResults = from tbl in storeDB.vwUpperCompletionAssemblies
                              select new Assembly
                              {
                                  AssemblyId = tbl.AssemblyId,
                                  Name = tbl.Name,
                                  Type = tbl.Type
                              };

            return dataResults.ToList();
        }

        public static IList<Assembly> Lower()
        {
            CActivityDataContext storeDB = new CActivityDataContext("Data Source=.\\SQLEXPRESS;AttachDbFilename=|DataDirectory|\\DOSB.mdf;Integrated Security=True;User Instance=True");

            var dataResults = from tbl in storeDB.vwLowerCompletionAssemblies
                              select new Assembly
                              {
                                  AssemblyId = tbl.AssemblyId,
                                  Name = tbl.Name,
                                  Type = tbl.Type
                              };

            return dataResults.ToList();
        }

    }
}

