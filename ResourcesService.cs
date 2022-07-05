using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Resources;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class ResourcesService : IResourcesService
    {
        IDataProvider _data = null;
        public ResourcesService(IDataProvider data)
        {
            _data = data;
        }
        public int Create(ResourcesAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Resources_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);

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
        public Paged<Resources> Paginated(int pageIndex, int pageSize)
        {
            Paged<Resources> pagedResult = null;

            List<Resources> list = null;

            Resources mappedResources = null;

            int totalCount = 0;

            string procName = "[dbo].[Resources_SelectAll]";

            _data.ExecuteCmd(
                procName, inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {

                    int startingIndex = 0;
                    mappedResources = MapSingleResource(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }


                    if (list == null)
                    {
                        list = new List<Resources>();
                    }

                    list.Add(mappedResources);
                }

            );
            if (list != null)
            {
                pagedResult = new Paged<Resources>(list, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }
        public void Update(ResourcesUpdateRequest model)
        {
            string procName = "[dbo].[Resources_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@Id", model.Id);
            },
            returnParameters: null);
        }
        public void Delete(int id)
        {
            string procName = "[dbo].[Resources_Delete_ById]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            },
            returnParameters: null);

        }
        public Resources GetById(int id)
        {
            Resources user = null;

            string procName = "[dbo].[Resources_Select_ById]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                user = MapSingleResource(reader, ref startingIndex);
            }
            );

            return user;
        }
        private static void AddCommonParams(ResourcesAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@Headline", model.Headline);
            col.AddWithValue("@Description", model.Description);
            col.AddWithValue("@Logo", model.Logo);
            col.AddWithValue("@LocationId", model.LocationId);
            col.AddWithValue("@ContactName", model.ContactName);
            col.AddWithValue("@ContactEmail", model.ContactEmail);
            col.AddWithValue("@Phone", model.Phone);
            col.AddWithValue("@SiteUrl", model.SiteUrl);
            col.AddWithValue("@CreatedBy", model.CreatedBy);
        }
        private static Resources MapSingleResource(IDataReader reader, ref int startingIndex)
        {
            Resources aResource = new Resources();

            aResource.Id = reader.GetSafeInt32(startingIndex++);
            aResource.Name = reader.GetSafeString(startingIndex++);
            aResource.Headline = reader.GetSafeString(startingIndex++);
            aResource.Description = reader.GetSafeString(startingIndex++);
            aResource.Logo = reader.GetSafeString(startingIndex++);
            aResource.LocationId = reader.GetSafeInt32(startingIndex++);
            aResource.LineOne = reader.GetSafeString(startingIndex++);
            aResource.LineTwo = reader.GetSafeString(startingIndex++);
            aResource.City = reader.GetSafeString(startingIndex++);
            aResource.State = reader.GetSafeString(startingIndex++);
            aResource.ZipCode = reader.GetSafeString(startingIndex++);
            aResource.Latitude = reader.GetSafeDouble(startingIndex++);
            aResource.Longitude = reader.GetSafeDouble(startingIndex++);
            aResource.ContactName = reader.GetSafeString(startingIndex++);
            aResource.ContactEmail = reader.GetSafeString(startingIndex++);
            aResource.Phone = reader.GetSafeString(startingIndex++);
            aResource.SiteUrl = reader.GetSafeString(startingIndex++);
            aResource.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aResource.DateModified = reader.GetSafeDateTime(startingIndex++);
            aResource.CreatedBy = reader.GetSafeInt32(startingIndex++);

            return aResource;
        }
    }
}
