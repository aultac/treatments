import React from 'react';
import {connect} from 'cerebral-view-react';
import _ from 'lodash';

import HistoryDate  from './HistoryDate';
import HistoryTag   from './HistoryTag';
import HistoryGroup from './HistoryGroup';
import HistoryDead  from './HistoryDead';

import './History.css';

export default connect({
  historySelector: 'app.historySelector',
  treatmentRecords: 'app.records.treatments',
  record: 'app.record',
},{
}, props => {
  let ret = (<div className='history'>Unknown History Type</div>);
  switch(props.historySelector.active) {
    case  'date': ret = <HistoryDate />;  break;
    case   'tag': ret = <HistoryTag />;   break;
    case 'group': ret = <HistoryGroup />; break;
    case  'dead': ret = <HistoryDead />;  break;
    default:
  }
  return ret;
});

