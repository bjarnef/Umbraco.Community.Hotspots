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

    setModelValueWithSrc($scope.model.value);

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
      /*startNodeId: vm.model.config.startNodeId,
      startNodeIsVirtual: vm.model.config.startNodeIsVirtual,
      dataTypeKey: vm.model.dataTypeKey,*/
      multiPicker: false,
      /*clickPasteItem: function (item, mouseEvent) {

        if (Array.isArray(item.data)) {
          var indexIncrementor = 0;
          item.data.forEach(function (entry) {
            if (requestPasteFromClipboard(createIndex + indexIncrementor, entry, item.type)) {
              indexIncrementor++;
            }
          });
        } else {
          requestPasteFromClipboard(createIndex, item.data, item.type);
        }
        if (!(mouseEvent.ctrlKey || mouseEvent.metaKey)) {
          mediaPicker.close();
        }
      },*/
      submit: function (model) {
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
      close: function () {
        editorService.close();
      }
    }

    /*if (vm.model.config.filter) {
      mediaPicker.filter = vm.model.config.filter;
    }*/

    /*mediaPicker.clickClearClipboard = function ($event) {
      clipboardService.clearEntriesOfType(clipboardService.TYPES.Media, vm.allowedTypes || null);
    };

    mediaPicker.clipboardItems = clipboardService.retrieveEntriesOfType(clipboardService.TYPES.MEDIA, vm.allowedTypes || null);
    mediaPicker.clipboardItems.sort((a, b) => {
      return b.date - a.date
    });*/

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
      propertyEditor: {
        //changeMediaFor: changeMediaFor,
        //resetCrop: resetCrop
      },
      //enableFocalPointSetter: vm.model.config.enableLocalFocalPoint || false,
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

  /**
  * Used to assign a new model value
  * @param {any} src
  */
  function setModelValueWithSrc(src) {
    if (!$scope.model.value || !$scope.model.value.src) {
      //we are copying to not overwrite the original config
      $scope.model.value = Utilities.extend(Utilities.copy($scope.model.config), { src: src });
    }
  }

  function setDirty() {
    if ($scope.imageCropperForm) {
      $scope.imageCropperForm.modelValue.$setDirty();
    }
  }

  init();

}

angular.module("umbraco").controller("Umbraco.Community.Hotspots.PrevalueEditors.SourceImageController", SourceImageController);
