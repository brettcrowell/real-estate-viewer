import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { ListItem, ListItemText, Chip, List } from "@material-ui/core";

const Listing = ({
  listing: { Address: address, Description: description, ...traits },
  selected,
  onClick
}) => {
  const [viewed, setViewed] = useState(!!localStorage.getItem(traits.MLS));

  useEffect(() => {
    if (selected) {
      localStorage.setItem(traits.MLS, true);
      setViewed(true);
    }
  }, [selected, traits.MLS]);

  return (
    <ListItem style={{ ...(selected && { backgroundColor: "#eee" }) }}>
      <ListItemText
        primary={address}
        secondary={[
          ...Object.values(traits),
          ...description.split(","),
          ...(viewed ? ["👀"] : [])
        ].map((data) => (
          <Chip label={data} size="small" />
        ))}
        onClick={onClick}
      />
    </ListItem>
  );
};

const ListingList = ({ listings, selectedListing, onSelect }) => {
  const listRef = useRef(null);

  useLayoutEffect(() => {
    const listItem =
      listRef.current.children[
        listings.indexOf(
          listings.find(({ Address }) => selectedListing === Address)
        )
      ];
    listItem && listRef.current.scrollTo(0, listItem.offsetTop);
  }, [listings, selectedListing]);

  return (
    <List style={{ height: 500, overflow: "scroll" }} ref={listRef}>
      {listings.map((listing) => (
        <Listing
          listing={listing}
          selected={listing.Address === selectedListing}
          onClick={() => void onSelect(listing.Address)}
        />
      ))}
    </List>
  );
};

export default ListingList;
