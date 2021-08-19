//Card component to display a particular reminder

import React, { Fragment } from "react";
import { ListGroupItem, Badge } from "reactstrap";
/* Props:
  rem : reminder object with details
*/

export default function Reminder({ rem }) {
  return (
    <a href={`/booking/${rem.invoiceId}`}>
      <ListGroupItem
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: 0,
        }}
      >
        <div
          style={{
            display: "flex",
          }}
        >
          <div>
            <img
              className="rounded pr-1"
              src={
                rem.rentedItems[0].itemPhoto
                  ? rem.rentedItems[0].itemPhoto.data
                  : ""
              }
              style={{
                height: "50px",
              }}
              alt="trailer"
            />
          </div>
          <div className="ml-2">
            <span className="text-primary">{rem.rentedItems[0].itemName}</span>
            <p style={{ fontSize: "0.8rem" }}>{rem.licenseeName}</p>
          </div>
        </div>
        <div
          style={{
            textAlign: "center",
          }}
        >
          <Fragment>
            <Badge color="warning" onClick={(e) => e.preventDefault()}>
              {rem.reminderType.toUpperCase()}
            </Badge>
            <div
              className="text-warning"
              style={{
                fontSize: "0.5rem",
              }}
            >
              {rem.reminderText}
            </div>
          </Fragment>
        </div>
      </ListGroupItem>
    </a>
  );
}
