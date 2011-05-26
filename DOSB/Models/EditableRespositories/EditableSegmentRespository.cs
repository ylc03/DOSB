using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using DOSB.Models;
using DOSB.Models.EditableModels;

namespace DOSB.Models.EditableRespositories
{
    public class EditableSegmentRespository
    {
        /// <summary>
        /// All companies
        /// CPL LINQ to SQL model for read only, should removed later
        /// </summary>
        /// <returns>All editable companies</returns>
        public static IQueryable<EditableSegment> All()
        {
            IQueryable<EditableSegment> result =
                (IQueryable<EditableSegment>)HttpContext.Current.Session["segments"];

            EditableSegmentRespository.Clean();

            if (result == null)
            {
                CPLDataContext store = new CPLDataContext();

                result = from r in store.Segments
                          select new EditableSegment
                          {
                              SegmentId = r.SegmentId,
                              Name = r.Name,
                              FullName = r.FullName,
                              BusinessCategory = r.BusinessCategory,
                              ParentId = r.ParentId
                          };

                HttpContext.Current.Session["segments"] = result;
            }

            return result;
        }

        public static IQueryable<EditableSegment> Roots()
        {
            CPLDataContext store = new CPLDataContext();

            var res = from r in store.Segments
                      where r.ParentId == 8
                      select new EditableSegment
                      {
                          SegmentId = r.SegmentId,
                          Name = r.Name,
                          FullName = r.FullName,
                          BusinessCategory = r.BusinessCategory,
                          ParentId = r.ParentId
                      };

            return res;
        }

        public static EditableSegment One(int id)
        {
            CPLDataContext store = new CPLDataContext();

            var res = from r in store.Segments
                      where r.SegmentId == id
                      select new EditableSegment
                      {
                          SegmentId = r.SegmentId,
                          Name = r.Name,
                          FullName = r.FullName,
                          BusinessCategory = r.BusinessCategory,
                          ParentId = r.ParentId
                      };

            return res.FirstOrDefault();
        }

        public static EditableSegment Parent(int id)
        {
            CPLDataContext store = new CPLDataContext();

            Segment seg = store.Segments.FirstOrDefault(s => s.SegmentId == id);

            var res = from r in store.Segments
                      where r.SegmentId == seg.ParentId
                      select new EditableSegment
                      {
                          SegmentId = r.SegmentId,
                          Name = r.Name,
                          FullName = r.FullName,
                          BusinessCategory = r.BusinessCategory,
                          ParentId = r.ParentId
                      };

            return res.FirstOrDefault();
        }

        public static IQueryable<EditableSegment> Children(int id)
        {
            if (id == 0 || id == 8)
            {
                return EditableSegmentRespository.Roots();
            }

            CPLDataContext store = new CPLDataContext();

            var res = from r in store.Segments
                      where r.ParentId == id
                      select new EditableSegment
                      {
                          SegmentId = r.SegmentId,
                          Name = r.Name,
                          FullName = r.FullName,
                          BusinessCategory = r.BusinessCategory,
                          ParentId = r.ParentId
                      };

            return res;
        }

        public static void Clean()
        { 
            CPLDataContext store = new CPLDataContext();
            foreach (var s in store.Segments)
            {
                if (s.ParentId != 0 && s.Parent == null)
                {
                    store.Segments.DeleteOnSubmit(s);
                }
            }
            store.SubmitChanges();
        }
    }
}