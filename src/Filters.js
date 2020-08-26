import React from "react";
import { TextField, Badge } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Home as HomeIcon } from "@material-ui/icons";

const Filters = ({
  filters: { downPayment, daysOld, percentDown, address, selectedFeatures },
  features,
  matches,
  onChange
}) => {
  const getHandleChange = (label) => ({ target: { value } }) =>
    void onChange((filters) => ({ ...filters, [label]: value }));
  return (
    <React.Fragment>
      <Badge
        badgeContent={matches}
        color="primary"
        style={{ marginRight: "1em" }}
      >
        <HomeIcon />
      </Badge>
      <TextField
        label="Down payment"
        value={downPayment}
        onChange={getHandleChange("downPayment")}
      />
      <TextField
        label="Percent down"
        value={percentDown}
        onChange={getHandleChange("percentDown")}
      />
      <TextField
        label="Days old"
        value={daysOld}
        onChange={getHandleChange("daysOld")}
      />

      <Autocomplete
        multiple
        options={features}
        getOptionLabel={(feature) => feature}
        defaultValue={[]}
        style={{ display: "inline" }}
        value={selectedFeatures}
        onChange={(e, value) => {
          getHandleChange("selectedFeatures")({ target: { value } });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Features"
            placeholder="Add another"
            style={{ width: 200 }}
          />
        )}
      />
      <TextField
        label="Address"
        value={address}
        onChange={getHandleChange("address")}
      />
    </React.Fragment>
  );
};

export default Filters;
