using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using ASPNETCOREFORM.Models;

namespace ASPNETCOREFORM.Migrations
{
    [DbContext(typeof(InventoryContext))]
    [Migration("20170308171952_InitialMigration")]
    partial class InitialMigration
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.0-rtm-22752");

            modelBuilder.Entity("ASPNETCOREFORM.Models.Test", b =>
                {
                    b.Property<int>("TestId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ItemName");

                    b.Property<string>("Quantity");

                    b.HasKey("TestId");

                    b.ToTable("Inventories");
                });
        }
    }
}
