function SourceImageController($scope, entityResource, editorService, localizationService) {

  const vm = this;

  vm.image = null;
  vm.clear = clear;
  vm.select = select;

  vm.addMedia = addMedia;
  vm.editMedia = editMedia;
  vm.removeMedia = removeMedia;

  //setup the default config
  const config = {
    mediaKey: null,
    type: "media"
  };

  // map the user config
  Utilities.extend(config, $scope.model.config);

  // map back to the model
  $scope.model.config = config;

  function init() {

    if ($scope.model.value && $scope.model.value.src) {
      const src = $scope.model.value.src;
      const ext = src.substring(src.lastIndexOf('.') + 1);
      vm.image = {
        source: src.substring(1),
        extension: ext,
        name: src.substring(src.lastIndexOf('/') + 1),
      };
    }

    retrieveMedia();
  }

  function retrieveMedia() {

    const id = $scope.model.config.mediaKey || null;

    if (id == null) {
      return;
    }

    entityResource.getById(id, "Media").then(media => {
      $scope.media = media;
      $scope.imageSrc = media.metaData.MediaPath;
    });
  }

  function addMedia(createIndex, $event) {

    const mediaPicker = {
      multiPicker: false,
      onlyImages: true,
      disableFolderSelect: true,
      submit: (model) => {
        editorService.close();

        var indexIncrementor = 0;
        model.selection.forEach((entry) => {
          var mediaEntry = {};
          mediaEntry.key = String.CreateGuid();
          mediaEntry.mediaKey = entry.key;
          //updateMediaEntryData(mediaEntry);
          //$scope.model.value.splice(createIndex + indexIncrementor, 0, mediaEntry);
          $scope.model.value.mediaKey = mediaEntry.mediaKey;
          $scope.model.value.src = null;
          indexIncrementor++;
        });

        setDirty();
      },
      close: () => {
        editorService.close();
      }
    };

    editorService.mediaPicker(mediaPicker);
  }

  function editMedia(mediaEntry, options, $event) {

    if ($event)
      $event.stopPropagation();

    options = options || {};

    var documentInfo = getDocumentNameAndIcon();

    // make a clone to avoid editing model directly.
    var mediaEntryClone = Utilities.copy(mediaEntry);

    const mediaEditorModel = {
      $parentScope: $scope, // pass in a $parentScope, this maintains the scope inheritance in infinite editing
      $parentForm: vm.propertyForm, // pass in a $parentForm, this maintains the FormController hierarchy with the infinite editing view (if it contains a form)
      createFlow: options.createFlow === true,
      documentName: documentInfo.name,
      mediaEntry: mediaEntryClone,
      view: "views/common/infiniteeditors/mediaentryeditor/mediaentryeditor.html",
      size: "large",
      submit: (model) => {
        vm.model.value[vm.model.value.indexOf(mediaEntry)] = mediaEntryClone;
        editorService.close();
      },
      close: () => {
        editorService.close();
      }
    };

    editorService.open(mediaEditorModel);
  }

  function removeMedia(mediaEntry, $event) {

    if ($event)
      $event.stopPropagation();

    $scope.model.value.mediaKey = null;

    setDirty();
  }

  function clear($event) {
    $event.stopPropagation();
    $scope.model.value.src = null;
    vm.image = null;
  }

  function select() {
    localizationService.localize("general_add").then(localizedTitle => {

      const allowedFileExtensions = ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'];

      const staticImagePicker = {
        title: localizedTitle,
        isDialog: true,
        filter: i => {
          let ext = i.name.substr((i.name.lastIndexOf('.') + 1));
          return allowedFileExtensions.includes(ext) === false;
        },
        filterCssClass: "not-allowed",
        select: file => {
          const id = decodeURIComponent(file.id.replace(/\+/g, " "));
          //block.thumbnail = "~/" + id.replace("wwwroot/", "");
          const url = "~/" + id.replace("wwwroot/", "");

          vm.image = {
            source: url.substring(1),
            extension: url.substring((url.lastIndexOf('.') + 1)),
            name: file.name,
          };

          $scope.model.value.mediaKey = null;
          $scope.model.value.src = url;

          editorService.close();
        },
        close: () => editorService.close()
      };

      editorService.staticFilePicker(staticImagePicker);
    });
  }

  function setDirty() {
    if ($scope.hotspotForm) {
      $scope.hotspotForm.modelValue.$setDirty();
    }
  }

  init();

}

angular.module("umbraco").controller("Umbraco.Community.Hotspots.PrevalueEditors.SourceImageController", SourceImageController);
