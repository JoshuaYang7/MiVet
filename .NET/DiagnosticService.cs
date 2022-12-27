using Newtonsoft.Json;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Diagnostics;
using Sabio.Models.Domain.File;
using Sabio.Models.Domain.HorseProfiles;
using Sabio.Models.Domain.Locations;
using Sabio.Models.Domain.Practices;
using Sabio.Models.Domain.Schedules;
using Sabio.Models.Domain.Services;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests.Diagnostics;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics.Tracing;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Text.Json.Nodes;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class DiagnosticService : IDiagnosticService
    {
        IDataProvider _data = null;
        private static IPracticeService _practiceService = null;
        private static IUserService _userService = null;
 

        public DiagnosticService(IDataProvider data, IPracticeService practiceService, IUserService userService)
        {
            _data = data;
            _practiceService = practiceService;
            _userService = userService;
           
        }

        public int AddV2(DiagnosticAddRequest model, int userId)
        {
            int id = 0;
            DataTable myParamValue = null;
            if(model.MedsSupplementsVitamins != null)
            {
                myParamValue = MapMedicationsToTable(model.MedsSupplementsVitamins);
            }

            string procName = "[dbo].[Diagnostics_InsertV3]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@CreatedBy", userId);
                col.AddWithValue("@medsSupplementsVitamins", myParamValue);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }

      

        public void Update(DiagnosticUpdateRequest model, int userId)
        {
            DataTable myParamValue = MapMedicationsToTable(model.MedsSupplementsVitamins);
            string procName = "[dbo].[Diagnostics_UpdateV2]";

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);
                    col.AddWithValue("@Id", model.Id);
                    col.AddWithValue("@UserId", userId);
                    col.AddWithValue("@MedsSupplementsVitamins", myParamValue);
                },
                returnParameters: null);
        }

        public BaseDiagnostic GetById(int id)
        {
            string procName = "[dbo].[Diagnostics_Select_ByIdV2]";

            BaseDiagnostic diagnostic = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                diagnostic = MapSingleDiagnosticV2(reader, ref startingIndex);
            });
            return diagnostic;
        }

        public Paged<BaseDiagnostic> SearchPaginationByHorseId(int PageIndex, int PageSize, int query)
        {
            Paged<BaseDiagnostic> pagedList = null;
            List<BaseDiagnostic> list = null;
            int totalCount = 0;

            string procName = "[dbo].[Diagnostics_Select_ByHorseProfileId]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", PageIndex);
                paramCollection.AddWithValue("@PageSize", PageSize);
                paramCollection.AddWithValue("@HorseProfileId", query);

            }, singleRecordMapper: delegate (IDataReader reader, short set)

            {
                int startingIndex = 0;

                BaseDiagnostic diagnostic = MapSingleDiagnosticV2(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<BaseDiagnostic>();
                }
                list.Add(diagnostic);
            });

            if (list != null)
            {
                pagedList = new Paged<BaseDiagnostic>(list, PageIndex, PageSize, query);
            }
            return pagedList;
        }

        

        public List<Diagnostic> GetByPracticeId(int id)
        {
            string procName = "[dbo].[Diagnostics_Select_ByPracticeId]";

            List<Diagnostic> list = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PracticeId", id);


            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int index = 0;
                Diagnostic diagnostic = MapSingleDiagnostic(reader, ref index);

                if (list == null)
                {
                    list = new List<Diagnostic>();
                }
                list.Add(diagnostic);

            });
            return list;
        }

        private static Diagnostic MapSingleDiagnostic(IDataReader reader, ref int startingIndex)
        {
            Diagnostic diag = new Diagnostic();
            diag.HorseProfile = new BaseHorseProfile();

            diag.Id = reader.GetSafeInt32(startingIndex++);
            diag.CurrentDiet = reader.GetSafeString(startingIndex++);
            diag.HealthDescription = reader.GetString(startingIndex++);
            diag.MedsSupplementsVitamins = reader.GetString(startingIndex++);

            diag.HorseProfile.Id = reader.GetSafeInt32(startingIndex++);
            diag.HorseProfile.Name = reader.GetSafeString(startingIndex++);
            diag.HorseProfile.PrimaryImageUrl = reader.GetSafeString(startingIndex++);

            diag.Practice = _practiceService.MapSinglePractice(reader, ref startingIndex);
            diag.Weight = reader.GetSafeInt32(startingIndex++);
            diag.Temp = reader.GetSafeDecimal(startingIndex++);
            diag.IsEating = reader.GetSafeBool(startingIndex++);
            diag.IsStanding = reader.GetSafeBool(startingIndex++);
            diag.IsSwelling = reader.GetSafeBool(startingIndex++);
            diag.IsInfection = reader.GetSafeBool(startingIndex++);
            diag.IsArchived = reader.GetSafeBool(startingIndex++);

            diag.CreatedBy = _userService.MapSingleUserV2(reader, ref startingIndex);
            diag.ModifiedBy = _userService.MapSingleUserV2(reader, ref startingIndex);

            diag.DateCreated = reader.GetSafeDateTime(startingIndex++);
            diag.DateModified = reader.GetSafeDateTime(startingIndex++);

            return diag;
        }

        private static BaseDiagnostic MapSingleDiagnosticV2(IDataReader reader, ref int i)
        {
            BaseDiagnostic diag = new BaseDiagnostic();

            diag.Id = reader.GetSafeInt32(i++);
            diag.CurrentDiet = reader.GetSafeString(i++);
            diag.HealthDescription = reader.GetSafeString(i++);
            diag.MedsSupplementsVitamins = reader.DeserializeObject<List<MedsSupplementsVitamins>>(i++);
            diag.HorseProfile = new BaseHorseProfile();
            diag.HorseProfile.Id = reader.GetSafeInt32(i++);
            diag.HorseProfile.Name = reader.GetSafeString(i++);
            diag.HorseProfile.PrimaryImageUrl = reader.GetSafeString(i++);
            diag.PracticeId = reader.GetSafeInt32(i++);
            diag.Weight = reader.GetSafeInt32(i++);
            diag.Temp = reader.GetSafeDecimal(i++);
            diag.IsEating = reader.GetSafeBool(i++);
            diag.IsStanding = reader.GetSafeBool(i++);
            diag.IsSwelling = reader.GetSafeBool(i++);
            diag.IsInfection = reader.GetSafeBool(i++);
            diag.IsArchived = reader.GetSafeBool(i++);

            diag.CreatedBy = _userService.MapSingleUserV2(reader, ref i);
            diag.ModifiedBy = _userService.MapSingleUserV2(reader, ref i);

            diag.DateCreated = reader.GetSafeDateTime(i++);
            diag.DateModified = reader.GetSafeDateTime(i++);

            return diag;
        }

        private static void AddCommonParams(DiagnosticAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@CurrentDiet", model.CurrentDiet);
            col.AddWithValue("@HealthDescription", model.HealthDescription);
            col.AddWithValue("@HorseProfileId", model.HorseProfileId);
            col.AddWithValue("@PracticeId", model.PracticeId);
            col.AddWithValue("@Weight", model.Weight);
            col.AddWithValue("@Temp", model.Temp);
            col.AddWithValue("@IsEating", model.IsEating);
            col.AddWithValue("@IsStanding", model.IsStanding);
            col.AddWithValue("@IsSwelling", model.IsSwelling);
            col.AddWithValue("@IsInfection", model.IsInfection);
            col.AddWithValue("@IsArchived", model.IsArchived);
        }

        public void UpdateIsArchived(int id, int userId, bool isArchived)
        {
            string procName = "[dbo].[Diagnostics_Update_IsArchived]";

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                    col.AddWithValue("@ModifiedBy", userId);
                    col.AddWithValue("@IsArchived", isArchived);
                },
                returnParameters: null);
        }

        private DataTable MapMedicationsToTable(List<string> medsToMap)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("Data", typeof(string));

            if (medsToMap !=null)
            {
                foreach (string singleMed in medsToMap)
                {
                    DataRow dr = dt.NewRow();
                    int startingIndex = 0;
                    dr.SetField(startingIndex++, singleMed);
                    dt.Rows.Add(dr);
                }
            }
            return dt;
        }
    }
}

