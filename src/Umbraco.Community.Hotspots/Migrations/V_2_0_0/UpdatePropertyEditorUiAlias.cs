using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Cms.Infrastructure.Persistence.Dtos;

namespace Umbraco.Community.Hotspots.Migrations.V_2_0_0
{
    internal sealed class UpdatePropertyEditorUiAlias(IMigrationContext context) : AsyncMigrationBase(context)
    {
        protected override async Task MigrateAsync()
        {
            var dataTypes = await Database.Query<DataTypeDto>()
                .Where(x => x.EditorUiAlias == "Umbraco.Community.Hotspot").ToListAsync();

            foreach (var dataType in dataTypes)
            {
                dataType.EditorUiAlias = "Umbraco.Community.Hotspots.PropertyEditorUi.Hotspot";

                await Database.UpdateAsync(dataType);
            }
        }
    }
}
