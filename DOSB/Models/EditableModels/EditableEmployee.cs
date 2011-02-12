using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace DOSB.Models.EditableModels
{
    public class EditableEmployee
    {
        [ReadOnly(true)]
        [ScaffoldColumn(false)]
        public int EmployeeId { get; set; }

        [ReadOnly(true)]
        public string GIN { get; set; }

        [ReadOnly(true)]
        public string SurName { get; set; }

        [ReadOnly(true)]
        public string GivenName { get; set; }

        [ReadOnly(true)]
        public string LDAP { get; set; }

        [ReadOnly(true)]
        public string Mobile { get; set; }

        [UIHint("EmployeeSegment"), Required]
        public string Segment { get; set; }
        public int SegmentId { get; set; }

        [UIHint("EmployeeRole")]
        public string Role { get; set; }
        public int RoleId { get; set; }

        [UIHint("EmployeeStatus"), Required]
        public string Status { get; set; }
    }
}