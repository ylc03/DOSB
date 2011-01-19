using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace DOSB.Models.EditableModels
{
    public class EditablePressureTestLog
    {
        [ReadOnly(true)]
        public int PerssureTestId { get; set; }
     
        public string PartNumber { get; set; }
       
        public string SerialNumber { get; set; }
        
        public string Comment { get; set; }

        
        public string AssemblyType { get; set; }

      
        public DateTime? StartAt { get; set; }

        
        public DateTime? FinishAt { get; set; }

        public int? TestBy { get; set; }

        public int? ApprovedBy { get; set; }

        public int? Defect { get; set; }
        //[DataType(DataType.Date), Required]
        //public DateTime OrderDate { get; set; }

        //[DataType(DataType.Currency), Required]
        //public decimal Freight { get; set; }
    }
}