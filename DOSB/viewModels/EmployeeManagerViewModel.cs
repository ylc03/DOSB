using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using DOSB.Models;

namespace DOSB.viewModels
{
    public class EmployeeManagerViewModel
    {
        public Employee Employee {get; set;}
        public List<Segment> SubSegments { get; set; }
    }
}