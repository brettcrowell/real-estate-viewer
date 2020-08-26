import MapboxClient from "mapbox";

export const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYmNyb3dlbGw4OSIsImEiOiJja2U5Y2gxYWQwcTBmMnJrMGRraGV5N2FoIn0.NnAXoVEXpFE8Zxm5W8vQ1A";

export const mapbox = new MapboxClient(MAPBOX_TOKEN);

export const geocodeForward = (address) => {
  const cached = localStorage.getItem(address);
  return cached
    ? Promise.resolve(cached.split(",").map(parseFloat))
    : mapbox.geocodeForward(address).then(
        ({
          entity: {
            features: [
              {
                geometry: { coordinates }
              }
            ]
          }
        }) => {
          localStorage.setItem(address, coordinates);
          return coordinates;
        }
      );
};
