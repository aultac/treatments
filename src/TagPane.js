import React from 'react';
import {connect} from 'cerebral-view-react';
import TagBar from './TagBar';
import Msg from './Msg';
import History from './History';
import HistorySelector from './HistorySelector';

import './TagPane.css';

export default connect({
},{
}, props => {
  return (
    <div className='tagpane'>
      <TagBar />
      <Msg />
      <HistorySelector />
      <History />
    </div>
   );
});
