const btn = document.querySelector("button");
const baseUrl = "https://core-carparks-renderer-lots.maps.yandex.net/maps-rdr-carparks/tiles";

btn.addEventListener("click", function () {
    let latitude  = document.querySelector('[name="latitude"]').value;
    let longitude = document.querySelector('[name="longitude"]').value;

    if (latitude.length == 0 || longitude.length == 0) {
        document.querySelector(".result")
                .innerHTML = `Широта и долгота обязательны для заполнения
        `;
        return;
    }

    let projections = [{
            name: 'wgs84Mercator',
            eccentricity: 0.0818191908426
        }, {
            name: 'sphericalMercator',
            eccentricity: 0
        }],

        params = {
            z: 19,
            geoCoords: [latitude, longitude],
            projection: projections[0]
        };

    // Переведем географические координаты объекта в глобальные пиксельные координаты.
    let pixelCoords = fromGeoToPixels(
        params.geoCoords[0],
        params.geoCoords[1],
        params.projection,
        params.z
    );

    // Посчитаем номер тайла на основе пиксельных координат.
    let tileNumber = fromPixelsToTileNumber(pixelCoords[0], pixelCoords[1]);

    const data = {
        l: 'carparks',
        x: tileNumber[0],
        y: tileNumber[1],
        z: params.z,
        scale: 1,
        lang: 'ru_RU',
    };

    let url = baseUrl + '?' + (new URLSearchParams(data)).toString();

    document.querySelector(".result").innerHTML = `
        <p> <b>x</b>:${data.x}, <b>y</b>:${data.y}</p>
        <img src="${url}" alt="tail" style="border:3px solid #151515">
    `;
});


// Функция для перевода географических координат объекта
// в глобальные пиксельные координаты.
function fromGeoToPixels (lat, long, projection, z) {
    var x_p, y_p,
        pixelCoords,
        tilenumber = [],
        rho,
        pi = Math.PI,
        beta,
        phi,
        theta,
        e = projection.eccentricity;

    rho = Math.pow(2, z + 8) / 2;
    beta = lat * pi / 180;
    phi = (1 - e * Math.sin(beta)) / (1 + e * Math.sin(beta));
    theta = Math.tan(pi / 4 + beta / 2) * Math.pow(phi, e / 2);

    x_p = rho * (1 + long / 180);
    y_p = rho * (1 - Math.log(theta) / pi);

    return [x_p, y_p];
}

// Функция для расчета номера тайла на основе глобальных пиксельных координат.
function fromPixelsToTileNumber (x, y) {
    return [
        Math.floor(x / 256),
        Math.floor(y / 256)
    ];
}

