import React from  'react';
import {connect} from 'cerebral-view-react';

import './Msg.css';

export default connect({
  msg: 'app.msg',
},{
}, props => {
  return (
    <div className={'msg msg' + props.msg.type}>
      {props.msg.text}
    </div>
   );
});
