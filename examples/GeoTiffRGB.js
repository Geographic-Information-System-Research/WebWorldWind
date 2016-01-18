/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

requirejs(['../src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        var resourcesUrl = "./geotiff_data/black_sea_111.tif";
        //var resourcesUrl = "http://wo2.terrasigna.com/geotiff-format/examples/geotiff_data/black_sea_111.tif";

        var geotiffObject = new WorldWind.GeoTiffReader(resourcesUrl);

        var start = new Date().getTime();

        var geoTiffImage = geotiffObject.readAsImage(function (image) {
            var bbox = geotiffObject.metadata.geotiff.bbox;
            console.log("Bounding Box:");
            console.log(bbox);
            var surfaceGeoTiff = new WorldWind.SurfaceImage(
                new WorldWind.Sector(bbox.lowerLeft.latitude, bbox.upperLeft.latitude, bbox.upperLeft.longitude, bbox.upperRight.longitude),
                new WorldWind.ImageSource(image)
            );

            var end = new Date().getTime();
            var time = end-start;
            console.log("Execution time: " + time);

            // GeoTiff test
            var geotiffLayer = new WorldWind.RenderableLayer("GeoTiff");
            geotiffLayer.addRenderable(surfaceGeoTiff);
            wwd.addLayer(geotiffLayer);

            wwd.goTo(new WorldWind.Position(43.69, 28.54, 55000));

            // Create a layer manager for controlling layer visibility.
            var layerManger = new LayerManager(wwd);
        });
    });