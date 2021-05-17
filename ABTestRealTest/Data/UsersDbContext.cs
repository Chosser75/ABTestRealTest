using ABTestRealTest.Data.Models;
using Microsoft.EntityFrameworkCore;
namespace ABTestRealTest.Data
{
    public partial class UsersDbContext : DbContext
    {
		public DbSet<SystemUser> SystemUsers { get; set; }

		public UsersDbContext(DbContextOptions<UsersDbContext> options)
:		base(options)
		{

		}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "Russian_Russia.1251");

            modelBuilder.Entity<SystemUser>(entity =>
            {
                entity.ToTable("system_users");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("nextval('seq_system_users'::regclass)");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnType("character varying")
                    .HasColumnName("name");

                entity.Property(e => e.RegistrationDate)
                    .HasColumnType("date")
                    .HasColumnName("registration_date");

                entity.Property(e => e.LastActivityDate)
                    .HasColumnType("date")
                    .HasColumnName("last_activity_date");
            });

            modelBuilder.HasSequence("seq_system_users");

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);

    }
}
