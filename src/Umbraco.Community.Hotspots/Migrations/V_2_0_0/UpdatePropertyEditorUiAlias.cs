using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Cms.Infrastructure.Persistence.Dtos;

namespace Umbraco.Community.Hotspots.Migrations.V_2_0_0
{
    internal sealed class UpdatePropertyEditorUiAlias : AsyncMigrationBase
    {
        public UpdatePropertyEditorUiAlias(IMigrationContext context) : base(context)
        {
        }

        protected override async Task MigrateAsync()
        {
            var dataTypes = await this.Database.Query<DataTypeDto>()
                .Where(x => x.EditorUiAlias == "Umbraco.Community.Hotspots").ToListAsync();

            foreach (var dataType in dataTypes)
            {
                dataType.EditorUiAlias = "Umbraco.Community.Hotspots.PropertyEditorUi.Hotspot"; // TODO: Check this alias

                await this.Database.UpdateAsync(dataType);
            }
        }
    }
}
