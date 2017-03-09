import React from 'react';
import {connect} from 'cerebral-view-react';
import _ from 'lodash';
import moment from 'moment';

export default connect({
  historySelector: 'app.historySelector',
  treatmentRecords: 'app.records.treatments',
  record: 'app.record',
},{
}, props => {
  return (
    <div className="historygroup">
    </div>
  );
});

