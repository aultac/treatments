import React from 'react';
import {connect} from 'cerebral-view-react';
import FontAwesome from 'react-fontawesome';

import './HistorySelector.css';

export default connect({
  historySelector: 'app.historySelector',
},{
  historySelectionChangeRequested: 'app.historySelectionChangeRequested',
}, props => {
  const prefsClicked = evt => props.historySelectionChangeRequested({ active: 'prefs' });
  const  dateClicked = evt => props.historySelectionChangeRequested({ active: 'date' });
  const   tagClicked = evt => props.historySelectionChangeRequested({ active: 'tag' });
  const groupClicked = evt => props.historySelectionChangeRequested({ active: 'group' });
  const  deadClicked = evt => props.historySelectionChangeRequested({ active: 'dead' });

  return (
    <div className="historyselector">
      <div className={'historyselectorbutton ' + (props.historySelector.active === 'prefs' ? 'historyselectorbuttonactive' : '')}
           onClick={prefsClicked}>
        <FontAwesome name='bars' />
      </div>
      <div className={'historyselectorbutton ' + (props.historySelector.active === 'date' ? 'historyselectorbuttonactive' : '')}
           onClick={dateClicked}>
        Date
      </div>
      <div className={'historyselectorbutton ' + (props.historySelector.active === 'tag' ? 'historyselectorbuttonactive' : '')}
           onClick={tagClicked}>
        Tag
      </div>
      <div className={'historyselectorbutton ' + (props.historySelector.active === 'group' ? 'historyselectorbuttonactive' : '')}
           onClick={groupClicked}>
        Group
      </div>
      <div className={'historyselectorbutton ' + (props.historySelector.active === 'dead' ? 'historyselectorbuttonactive' : '')}
           onClick={deadClicked}>
        Dead
      </div>

    </div>
  );

});

