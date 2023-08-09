using System;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using System.Collections.Generic;

namespace Backend.Models
{
    public class UserProfile
    {
        public int UserID { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? HomeCity { get; set; }
    }

    public class UserProfileContext : DbContext
    {
        public UserProfileContext(DbContextOptions<UserProfileContext> options)
            : base(options)
        {
        }

        public DbSet<UserProfile> UserProfiles { get; set; }
    }

    public class UserProfileDto
    {
        public int UserID { get; set; }
        public string? FirebaseToken { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? HomeCity { get; set; }
    }

    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<UserProfile, UserProfileDto>();
        }
    }
}
