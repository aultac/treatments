import React from 'react';
import {connect} from 'cerebral-view-react';

import './HistorySelector.css';

export default connect({
  historySelector: 'app.historySelector',
},{
  historySelectionChangeRequested: 'app.historySelectionChangeRequested',
}, props => {
  const       dateClicked = evt => props.historySelectionChangeRequested({ active: 'individual' });
  const individualClicked = evt => props.historySelectionChangeRequested({ active: 'date'       });
  return (
    <div className="historyselector">
      <div className={'historyselectorbutton ' + (props.historySelector.active === 'individual' ? 'historyselectorbuttonactive' : '')}
           onClick={dateClicked}>
        Date
      </div>
      <div className={'historyselectorbutton ' + (props.historySelector.active === 'date' ? 'historyselectorbuttonactive' : '')}
           onClick={individualClicked}>
        Calf
      </div>
    </div>
  );

});

