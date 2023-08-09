using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;
using System;
using Backend.Models;
using Google.Apis.Auth.OAuth2;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public UserProfileController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        [Authorize]

        public async Task<JsonResult> Get()
        {
            
            string query = @"SELECT UserID, UserName, Email, HomeCity FROM dbo.UserProfile";

            DataTable table = new DataTable();

            string sqlDataSource = _configuration.GetConnectionString("UserAppCon");

            SqlDataReader myReader;
            Console.WriteLine(_configuration.GetConnectionString("UserAppCon"));

            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open(); // open connection

                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);

                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult(table);
        }

        [HttpPost]
        [Authorize]

        public JsonResult Post(UserProfile user)
        {
            string query = @"INSERT INTO dbo.UserProfile (UserName, Email, HomeCity)
                             VALUES (@UserName, @Email, @HomeCity)";

            DataTable table = new DataTable();

            string sqlDataSource = _configuration.GetConnectionString("UserAppCon");

            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();

                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@UserName", user.UserName);
                    myCommand.Parameters.AddWithValue("@Email", user.Email);
                    myCommand.Parameters.AddWithValue("@HomeCity", user.HomeCity);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);

                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult("Added Successfully!");
        }

        [HttpPut]
        [Authorize]

        public JsonResult Put(UserProfile user)
        {
            string query = @"UPDATE dbo.UserProfile
                             SET UserName = @UserName, Email = @Email, HomeCity = @HomeCity
                             WHERE UserID = @UserID";

            DataTable table = new DataTable();

            string sqlDataSource = _configuration.GetConnectionString("UserAppCon");

            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();

                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@UserID", user.UserID);
                    myCommand.Parameters.AddWithValue("@UserName", user.UserName);
                    myCommand.Parameters.AddWithValue("@Email", user.Email);
                    myCommand.Parameters.AddWithValue("@HomeCity", user.HomeCity);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);

                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult("Updated Successfully!");
        }

        [HttpDelete("{UserID}")]
        [Authorize]
        public JsonResult Delete(int UserID)
        {
            string query = @"DELETE FROM dbo.UserProfile WHERE UserID = @UserID";

            DataTable table = new DataTable();

            string sqlDataSource = _configuration.GetConnectionString("UserAppCon");

            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();

                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@UserID", UserID);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);

                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult("Deleted Successfully!");
        }
    }
}
