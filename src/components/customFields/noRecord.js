import React from 'react';
import { Spinner } from 'reactstrap';

const NoRecord = ({ message }) => {
  return (
    <div className='color-white text-center mt30'>{message || 'No Record Found'}</div>
  );
};

export default NoRecord;
