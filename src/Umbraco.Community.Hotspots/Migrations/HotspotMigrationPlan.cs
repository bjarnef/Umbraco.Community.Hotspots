using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Community.Hotspots.Migrations.V_2_0_0;

namespace Umbraco.Community.Hotspots.Migrations
{
    internal class HotspotMigrationPlan : MigrationPlan
    {
        public HotspotMigrationPlan()
            : base("Umbraco.Community.Hotspots")
        {
            RunMigrations();
        }

        /// <inheritdoc />
        public override string InitialState => string.Empty;

        private void RunMigrations()
        {
            From(this.InitialState)
                .To<UpdatePropertyEditorUiAlias>("2.0.0");
        }
    }
}
