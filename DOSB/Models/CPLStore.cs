using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DOSB.Models
{
    public class CPLStore
    {
        private static CPLDataContext _store = new CPLDataContext();

        private CPLStore()
        { }

        public static CPLDataContext Instance 
        { 
            get
            {
                return CPLStore._store;
            }
        }
    }
}