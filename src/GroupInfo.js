import React from 'react';
import {connect} from 'cerebral-view-react';
import _ from 'lodash';
import numeral from 'numeral';

import './GroupInfo.css';

export default connect({
},{
}, props => {

  if (!props.group) props.group = { 
    name: 'Unknown', 
    dead: { 
      stats: {
        count: 0,
        fraction: 0,
      }
    }
  }
      

  return (
    <div className='groupinfo'>
      <div className='groupinfoname'>
        {props.group.name}
      </div>
      { 
        (props.group.dead ? 
          <div className='groupinfodead'>
            { props.group.dead.stats.count }
            ({ numeral(props.group.dead.stats.fraction).format('0.00%') })
          </div>
        : '')
      }
    </div>
  );

});

