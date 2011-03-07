using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using DOSB.Models.EditableModels;
using DOSB.Models;

namespace DOSB.Models.EditableRespositories
{
    public class EditablePressureTestLogRespository
    {
        public static IList<EditablePressureTestLog> All()
        {
            IList<EditablePressureTestLog> result =
                (IList<EditablePressureTestLog>)HttpContext.Current.Session["PressureLogs"];
            if (result == null)
            {
                HttpContext.Current.Session["PressureLogs"] = result =
                    (from pressureTest in new CActivityDataContext().PressureTestLogs
                     select new EditablePressureTestLog
                     {
                         PerssureTestId = pressureTest.PressureTestId,
                         PartNumber = pressureTest.PartNumber,
                         SerialNumber = pressureTest.SerialNumber,
                         Comment = pressureTest.Comment,
                         AssemblyType = pressureTest.AssemblyType,
                         StartAt = pressureTest.StartAt,
                         FinishAt = pressureTest.FinishAt,
                         TestBy = pressureTest.TestBy,
                         ApprovedBy = pressureTest.ApprovedBy,
                         Defect = pressureTest.Defect,
                     }).ToList();
            }
            return result;
        }
        public static EditablePressureTestLog One(Func<EditablePressureTestLog, bool> predicate)
        {
            return All().Where(predicate).FirstOrDefault();
        }
        public static void Insert(EditablePressureTestLog pressureTest)
        {
            pressureTest.PerssureTestId = All().OrderByDescending(p => p.PerssureTestId).First().PerssureTestId + 1;
            All().Insert(0, pressureTest);
        }
        public static void Update(EditablePressureTestLog pressureTest)
        {
            DOSBEntities storeDB = new DOSBEntities();
            PressureTest target = storeDB.PressureTest.First(e => e.PressureTestId == pressureTest.PerssureTestId);
            if (target != null)
            {
                target.PressureTestId = pressureTest.PerssureTestId;
                target.PartNumber = pressureTest.PartNumber;
                target.SerialNumber = pressureTest.SerialNumber;
                target.Comment = pressureTest.Comment;
                target.AssemblyType = pressureTest.AssemblyType;
                target.StartAt = pressureTest.StartAt;
                target.FinishAt = pressureTest.FinishAt;
                target.TestBy = pressureTest.TestBy;
                target.ApprovedBy = pressureTest.ApprovedBy;
                target.Defect = pressureTest.Defect;
            }

            storeDB.SaveChanges();
        }
        public static void Delete(EditablePressureTestLog pressureTest)
        {
            EditablePressureTestLog target = One(p => p.PerssureTestId == pressureTest.PerssureTestId);
            if (target != null)
            {
                All().Remove(target);
            }
        }
    }
}