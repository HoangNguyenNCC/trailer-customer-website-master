import React from "react";

//Basic UI component to show trailer details and features in a tabulated manner

/* Props:
  Trailer : object containing trailer details
  */

const TrailerInfoTable = ({ trailer }) => {
  return (
    <table className="table">
      <tbody>
        <tr>
          <td>Size</td>
          <td>{trailer.size}</td>
        </tr>
        <tr>
          <td>Insurance</td>
          <td>
            {trailer.insured ? (
              <i className="ni ni-check-bold text-primary" />
            ) : (
              <i className="ni ni-fat-remove text-warning" />
            )}
            {/* <i className="ni ni-check-bold text-primary" /> */}
          </td>
        </tr>
        <tr>
          <td>Serviced</td>
          <td>
            {trailer.serviced ? (
              <i className="ni ni-check-bold text-primary" />
            ) : (
              <i className="ni ni-fat-remove text-warning" />
            )}
            {/* <i className="ni ni-check-bold text-primary" /> */}
          </td>
        </tr>
        <tr>
          <td>Age</td>
          <td>{trailer.age}</td>
        </tr>
        <tr>
          <td>Capacity</td>
          <td>{trailer.tare}</td>
        </tr>
        <tr>
          <td>Tare</td>
          <td>{trailer.capacity}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TrailerInfoTable;
