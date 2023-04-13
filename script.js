//MAPA
var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.transform([2.1589900, 41.3887900], 'EPSG:4326', 'EPSG:3857'),
        zoom: 12
    })
});


//POPUP
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});
map.addOverlay(overlay);

closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};

//EXERCICI 4
var xhr = new XMLHttpRequest();
xhr.addEventListener("readystatechange", function() {
    if (this.readyState === this.DONE) {
        console.log(JSON.parse(this.responseText));
        var respuesta = JSON.parse(this.responseText)
        respuesta.forEach(element => {
            console.log(element.Latitud)
            console.log(element.Longitud)
            console.log(element.Ambit)
            console.log(element.Nom_Barri)

            //MARCADOR
            var layer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [
                        new ol.Feature({
                            geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(element.Longitud), parseFloat(element.Latitud)]))
                        })
                    ]
                })
            });
            map.addLayer(layer);

            //MOSTRAR POPUP CON INFORMACION
            map.on('singleclick', function(event) {
                if (map.hasFeatureAtPixel(event.pixel) === true) {
                    var coordinate = event.coordinate;
                    content.innerHTML = `<b>Ambit: ${element.Ambit}</b><br/><b>Barri: ${element.Nom_Barri}</b>`;
                    overlay.setPosition(coordinate);
                } else {
                    overlay.setPosition(undefined);
                    closer.blur();
                }
            });
        });
    }
});
xhr.open("GET", "https://dades.eicub.net/api/1/ateneus?Any=2017");
xhr.send(null);