using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ABTestRealTest.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateSequence(
                name: "seq_system_users");

            migrationBuilder.CreateTable(
                name: "system_users",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false, defaultValueSql: "nextval('seq_system_users'::regclass)"),
                    name = table.Column<string>(type: "character varying", nullable: false),
                    registration_date = table.Column<DateTime>(type: "date", nullable: true),
                    last_activity_date = table.Column<DateTime>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_system_users", x => x.id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "system_users");

            migrationBuilder.DropSequence(
                name: "seq_system_users");
        }
    }
}
