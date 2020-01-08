import React from 'react';
import { connect } from 'react-redux';

import { updateModalData } from '../../actions/page';

const ModalButton = ({
  children,
  data,
  disabled = false,
  updateModalData,
  className = '',
  dom,
  style = {},
  tag = 'div'
}) => {
  const buttonClicked = e => {
    e.preventDefault();
    if (disabled === false) {
      updateModalData(data);
    }
  };

  return (
    <React.Fragment>
    {tag === 'span' ?
    <span className={className} {...dom} style={style} onClick={buttonClicked}>
    {children}
  </span> : 
   <div className={className} {...dom} style={style} onClick={buttonClicked}>
      {children}
    </div>
    }
    
   </React.Fragment>
  );
};

export default connect(
  null,
  { updateModalData }
)(ModalButton);
