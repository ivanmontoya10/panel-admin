import React from "react";

const TableModal = ({ columns, data, renderRow }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} onClick={column.onClick ? column.onClick : undefined}>
                {column.name} {column.indicator && column.indicator}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>{renderRow(row, index)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableModal;
