import React from 'react';
import {connect} from 'cerebral-view-react';
import _ from 'lodash';

import './TreatmentDateBar.css';

export default connect({
  record: 'app.record',
  treatmentCodes: 'app.treatmentCodes',
},{
  recordUpdateRequested: 'app.recordUpdateRequested',
  showTreatmentEditor: 'app.showTreatmentEditor',
}, function RecordInput(props) {

  const dateChanged = evt => {
    evt.preventDefault();
    props.recordUpdateRequested({date: evt.target.value});
  };

  const treatmentTextClicked = evt => {
    evt.preventDefault();
    props.showTreatmentEditor();
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
             onClick={treatmentTextClicked}
             onChange={treatmentTextClicked}/>
    </div>
  );
});
