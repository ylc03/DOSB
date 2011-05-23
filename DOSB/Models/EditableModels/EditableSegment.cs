using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

using DOSB.Models;
using DOSB.Models.EditableRespositories;

namespace DOSB.Models.EditableModels
{
    public class EditableSegment
    {
        [ReadOnly(true)]
        [ScaffoldColumn(false)]
        public int SegmentId { get; set; }

        public string Name { get; set; }

        public string FullName { get; set; }

        public string BusinessCategory { get; set; }

        public int ParentId { get; set; }

        public bool HasChildren
        {
            get
            {
                return EditableSegmentRespository.Children(this.SegmentId).Count() > 0;
            }
        }
    }
}