import React, { useState, useMemo } from "react";
import { differenceInCalendarDays } from "date-fns";
import { Paper, Grid, TextField, Button } from "@material-ui/core";

import { geocodeForward } from "./Mapbox";
import Map from "./Map";
import ListingList from "./ListingList";
import Filters from "./Filters";
import { scrape } from "./scrape";

const App = () => {
  const [mlsPin, setMlsPin] = useState(localStorage.getItem("mlsPin") || "");
  const handleChangeMlsPin = ({ target: { value } }) => {
    localStorage.setItem("mlsPin", value);
    setMlsPin(value);
  };

  const [listings, setListings] = useState(
    JSON.parse(localStorage.getItem("listings") || "[]")
  );
  const handleChangeListings = ({ target: { value } }) => {
    try {
      setListings(JSON.parse(value));
      localStorage.setItem("listings", value);
    } catch (e) {
      // bad data provided
    }
  };

  const [selectedListing, setSelectedListing] = useState(null);
  const handleSelectListing = (address) => {
    setSelectedListing(address);
    geocodeForward(address).then(setCoords);
  };

  const [[longitude = -71.0589, latitude = 42.3601], setCoords] = useState([]);

  const features = useMemo(
    () =>
      Array.from(
        new Set(
          listings.flatMap(({ Description }) =>
            Description.split(",").map((feature) => feature.trim())
          )
        )
      ).sort((a, b) => a.length - b.length),
    [listings]
  );

  const [filters, setFilters] = useState({
    downPayment: 300000,
    percentDown: 20,
    daysOld: 3,
    address: "",
    selectedFeatures: []
  });
  const filteredListings = useMemo(() => {
    const {
      downPayment,
      percentDown,
      daysOld,
      address,
      selectedFeatures
    } = filters;
    const addressRegExp = new RegExp(address, "i");
    return listings.filter(({ Address, Price, Received, Description }) =>
      [
        Number(Price.replace(/[\$,]+/g, "")) * (percentDown / 100) <
          downPayment,
        differenceInCalendarDays(
          Date.now(),
          new Date(`${Received.trim()}, 2020`)
        ) < daysOld,
        Address.match(addressRegExp),
        selectedFeatures.length === 0 ||
          Description.split(",")
            .map((f) => f.trim())
            .some((feature) => selectedFeatures.includes(feature))
      ].every((filter) => filter)
    );
  }, [filters, listings]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={8}>
        <Paper>
          <Map
            selectedListing={selectedListing}
            mlsPin={mlsPin}
            listings={filteredListings}
            latitude={latitude}
            longitude={longitude}
            onSelect={setSelectedListing}
          />
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper>
          <ListingList
            listings={filteredListings}
            selectedListing={selectedListing}
            onSelect={handleSelectListing}
          />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Filters
            filters={filters}
            features={features}
            matches={filteredListings.length}
            onChange={setFilters}
          />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <TextField
            label="MLS Pin"
            value={mlsPin}
            onChange={handleChangeMlsPin}
          />
          <Button
            variant="contained"
            onClick={() =>
              scrape({ mlsPin }).then((listings) =>
                handleChangeListings({ target: { value: listings } })
              )
            }
          >
            Scrape
          </Button>
          <TextField
            id="standard-multiline-flexible"
            label="State"
            multiline
            rowsMax={4}
            width="100%"
            value={JSON.stringify(listings, null, 2)}
            onChange={handleChangeListings}
            style={{ fontFamily: "Courier", width: "100%" }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default App;
