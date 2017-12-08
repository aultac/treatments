import React from 'react';
import {connect} from 'cerebral-view-react';
import TagBar from './TagBar';
import Msg from './Msg';
import History from './History';
import HistorySelector from './HistorySelector';

import './TagPane.css';

export default connect({
  window: 'window',
},{
}, props => {
  return (
    <div className='tagpane' style={{ height: props.window.orientation === 'landscape' ? '100vh' : '100vw' }}>
      <TagBar />
      <Msg />
      <HistorySelector />
      <History />
    </div>
   );
});
