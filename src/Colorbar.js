import React from 'react';
import {connect} from 'cerebral-view-react';
import _ from 'lodash';

import './Colorbar.css';

export default connect({
  record: 'app.record',
  colors: 'app.colors',
},{
  recordUpdateRequested: 'app.recordUpdateRequested',
}, function RecordInput(props) {

  const colorButtonClicked = color => evt => {
    evt.preventDefault();
    props.recordUpdateRequested({tag: { color: color } });
  };

  return (
    <div className="colorbar">
      {_.keys(props.colors).map((c,k) => 
          <div key={'color'+c} 
               className="colorbutton"
               onClick={colorButtonClicked(c)} 
               style={{backgroundColor: props.colors[c] }}>
          </div>
       )}
       <div key={'colorNOTAG'}
            className="colorbutton"
            onClick={colorButtonClicked('NOTAG')}
            style={{backgroundColor: '#CCCCCC'}}>
        X
      </div>
    </div>
  );

});

