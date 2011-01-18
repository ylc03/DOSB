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

        public int Segment { get; set; }

        public string Status { get; set; }
        //[DataType(DataType.Date), Required]
        //public DateTime OrderDate { get; set; }

        //[DataType(DataType.Currency), Required]
        //public decimal Freight { get; set; }
    }
}