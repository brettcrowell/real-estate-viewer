import React, { useEffect, useState } from "react";
import "./styles.css";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { MAPBOX_TOKEN, geocodeForward } from "./Mapbox";
import { Button } from "@material-ui/core";

const Point = ({
  listing,
  listing: { Address: address, MLS },
  selected,
  mlsPin,
  onSelect
} = {}) => {
  const [[longitude = 0, latitude = 0], setCoords] = useState([]);

  useEffect(() => void geocodeForward(address).then(setCoords), [address]);

  const mlsLink = `https://vow.mlspin.com/?cid=${mlsPin}&pass=mjnrpqtu&mls=${MLS}`;

  return (
    <React.Fragment>
      <Marker latitude={latitude} longitude={longitude}>
        <span
          role="img"
          aria-label="More Info"
          onClick={() => void onSelect(address)}
          style={{
            fontSize: "1.5em",
            textShadow: "white 1px 0 10px"
          }}
        >
          🏠
        </span>
      </Marker>
      {selected && (
        <Popup
          longitude={longitude}
          latitude={latitude}
          onClose={() => void onSelect(null)}
          closeOnClick={false}
          style={{ zIndex: 100000 }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <img
              alt="home on mls"
              src={`https://media.mlspin.com/Photo.aspx?w=256&h=200&nopadding=&mls=${MLS}&n=0&o=`}
            />
            <span
              style={{
                width: 256,
                wordWrap: "wrap",
                fontFamily: "Arial",
                fontWeight: "bold"
              }}
            >
              {address}
            </span>
            <Button target="_new" variant="contained" href={mlsLink}>
              View on MLS
            </Button>
            <Button
              target="_new"
              variant="contained"
              style={{ margin: "0.5em 0" }}
              onClick={() => navigator.clipboard.writeText(mlsLink)}
            >
              Copy MLS Link
            </Button>
            <Button
              target="new"
              variant="contained"
              href={`http://maps.google.com/?q=${address}`}
            >
              Search Google maps
            </Button>
          </div>
        </Popup>
      )}
    </React.Fragment>
  );
};

const Map = ({
  selectedListing,
  mlsPin,
  listings,
  latitude = 42.3601,
  longitude = -71.0589,
  onSelect = () => false
}) => {
  const [viewport, setViewport] = useState({
    width: "100%",
    height: 515,
    zoom: 12,
    latitude,
    longitude
  });

  useEffect(
    () =>
      void setViewport((viewport) => ({
        ...viewport,
        latitude,
        longitude,
        zoom: 15
      })),
    [latitude, longitude]
  );

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onViewportChange={setViewport}
    >
      {listings.map((listing) => (
        <Point
          key={listing.address}
          listing={listing}
          mlsPin={mlsPin}
          selected={listing.Address === selectedListing}
          onSelect={onSelect}
        />
      ))}
    </ReactMapGL>
  );
};

export default Map;
