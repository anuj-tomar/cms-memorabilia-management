import React from 'react';
import { Spinner } from 'reactstrap';

const Loader = ({ message }) => {
  return (
    <div className="loaderCustom">
      <div className="Fc">
        <Spinner style={{ zIndex: 9999 }} />
      </div>
    </div>
  );
};

export default Loader;
