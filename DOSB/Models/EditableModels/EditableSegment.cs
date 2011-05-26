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

        public string Path 
        { 
            get 
            {
                CPLDataContext store = new CPLDataContext();
                Segment seg = store.Segments.FirstOrDefault(s => s.SegmentId == this.SegmentId);

                string path = "/";
                while (seg.Parent != null)
                {
                    path = "/" + seg.Parent.Name + path;
                    seg = seg.Parent;
                }

                return path;
            }
        }

        public string BusinessCategory { get; set; }

        public int ParentId { get; set; }
    }
}