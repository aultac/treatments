import React from 'react';
import {connect} from 'cerebral-view-react';

import './HistorySelector.css';

export default connect({
  historySelector: 'app.historySelector',
},{
  historySelectionChangeRequested: 'app.historySelectionChangeRequested',
}, props => {
  const dateClicked = evt => props.historySelectionChangeRequested({ active: 'date' });
  const  tagClicked = evt => props.historySelectionChangeRequested({ active: 'tag' });

  return (
    <div className="historyselector">
      <div className={'historyselectorbutton ' + (props.historySelector.active === 'date' ? 'historyselectorbuttonactive' : '')}
           onClick={dateClicked}>
        Date
      </div>
      <div className={'historyselectorbutton ' + (props.historySelector.active === 'tag' ? 'historyselectorbuttonactive' : '')}
           onClick={tagClicked}>
        Tag
      </div>
    </div>
  );

});

