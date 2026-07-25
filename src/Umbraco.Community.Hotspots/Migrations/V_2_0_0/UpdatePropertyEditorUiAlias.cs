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
            var dataTypes = await Database.Query<DataTypeDto>()
                .Where(x => x.EditorUiAlias == "Umbraco.Community.Hotspots").ToListAsync();

            foreach (var dataType in dataTypes)
            {
                dataType.EditorAlias = "Umbraco.Community.Hotspot";
                dataType.EditorUiAlias = "Umbraco.Community.Hotspots.PropertyEditorUi.Hotspot";

                await Database.UpdateAsync(dataType);
            }
        }
    }
}
