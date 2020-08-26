const scrapeListings = (document) =>
  [
    ...document.querySelectorAll(
      "body > center:nth-child(1) > table > tbody > tr:nth-child(4) > td:nth-child(5) > table:nth-child(4) tbody tr"
    )
  ]
    .map((row) =>
      [...row.querySelectorAll("td")].map((el) => [
        el.innerText,
        el.querySelector("a") ? el.querySelector("a").href : null
      ])
    )
    .map((row, r, [headers]) =>
      headers
        .map(([header]) => header)
        .reduce(
          (acc, header, h) =>
            header
              ? {
                  ...acc,
                  ...(row[h][1] && {
                    MLS: new URL(row[h][1]).searchParams.get("mls")
                  }),
                  [header]: row[h][0]
                }
              : acc,
          {}
        )
    )
    .slice(1);

export const scrape = ({ mlsPin }) =>
  new Promise((res) => {
    const iframe = document.createElement("iframe");
    iframe.onload = () => {
      const listings = scrapeListings(iframe.contentWindow.document.body);
      document.body.removeChild(iframe)
      res(listings);
    };
    iframe.src = `https://vow.mlspin.com/?cid=${mlsPin}&pass=mjnrpqtu`;
    document.body.appendChild(iframe);
  });
