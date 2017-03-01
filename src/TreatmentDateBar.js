import React from 'react';
import {connect} from 'cerebral-view-react';
import moment from 'moment';
import _ from 'lodash';

import './TreatmentDateBar.css';

export default connect({
  record: 'app.record',
  treatmentCodes: 'app.treatmentCodes',
},{
  recordUpdateRequested: 'app.recordUpdateRequested',
}, function RecordInput(props) {

  const dateChanged = evt => {
    evt.preventDefault();
    props.recordUpdateRequested({date: moment(evt.target.value)});
  };

  const treatmentTextChanged = evt => {
    evt.preventDefault();
    props.recordUpdateRequested({treatment: evt.target.value});
  };

  return (
    <div className="treatmentdatebar">
      <input className='treatmentdateinput'
             value={props.record.date}
             type="date"
             onChange={dateChanged} />
      <input className='treatmentstring'
             value={props.record.treatment}
             type="text"
             onChange={treatmentTextChanged} />
    </div>
  );
});
