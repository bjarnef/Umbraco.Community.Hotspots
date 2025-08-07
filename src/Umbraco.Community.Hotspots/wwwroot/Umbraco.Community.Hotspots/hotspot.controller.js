function HotspotController($scope, entityResource) {

  const vm = this;

  vm.clear = clear;
  vm.focalPointChanged = focalPointChanged;
  vm.imageLoaded = imageLoaded;

  vm.defaultPosition = {
    left: 0.5,
    top: 0.5
  };

  //setup the default config
  const config = {
    source: null,
    hideHotspot: false
  };

  // map the user config
  Utilities.extend(config, $scope.model.config);

  // map back to the model
  $scope.model.config = config;

  function init() {

    setModelValueWithSrc($scope.model.config.source);

    retrieveMedia();
  }

  function retrieveMedia() {

    if ($scope.model.config.source && $scope.model.config.source.type === 'staticAsset') {
      $scope.imageSrc = $scope.model.config.source.src.replace(/^~/, "");;

      return;
    }

    const id = $scope.model.config.source?.mediaKey || null;

    if (id == null) {
      return;
    }

    entityResource.getById(id, "Media").then(media => {
      $scope.media = media;
      $scope.imageSrc = media.metaData.MediaPath;
    });
  }

  function clear() {
    focalPointChanged(null, null);
  }

  /**
  * Used to assign a new model value
  * @param {any} source
  */
  function setModelValueWithSrc(source) {
    if (!$scope.model.value || !$scope.model.value.src) {
      //we are copying to not overwrite the original config
      $scope.model.value = Utilities.extend(Utilities.copy($scope.model.config), { src: source?.src, mediaId: source?.mediaKey });
    }

    delete $scope.model.value.source;
  }

  /**
  * Called when the umbImageGravity component updates the focal point value
  * @param {any} left
  * @param {any} top
  */
  function focalPointChanged(left, top) {
    console.log("focalPointChanged", left, top);
    if (left === null && top === null) {
      $scope.model.value.focalPoint = null;
    }
    else {
      //update the model focalpoint value
      $scope.model.value.focalPoint = {
        left: left,
        top: top
      };
    }

    //set form to dirty to track changes
    setDirty();
  }

  function imageLoaded(isCroppable, hasDimensions) {
    $scope.isCroppable = isCroppable;
    $scope.hasDimensions = hasDimensions;
  }

  function setDirty() {
    if ($scope.hotspotForm) {
      $scope.hotspotForm.modelValue.$setDirty();
    }
  }

  init();

}

angular.module("umbraco").controller("Umbraco.Community.Hotspots.PropertyEditors.HotspotController", HotspotController);
