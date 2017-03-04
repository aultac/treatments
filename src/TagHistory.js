import React from 'react';
import {connect} from 'cerebral-view-react';
import TagBar from './TagBar';
import Msg from './Msg';
import HistorySelector from './HistorySelector';

import './TagHistory.css';

export default connect({
},{
}, props => {
  return (
    <div className='taghistory'>
      <TagBar />
      <Msg />
      {/*<HistorySelector />*/}
    </div>
   );
});
