import React from 'react';
import {connect} from 'cerebral-view-react';
import _ from 'lodash';

import './TreatmentCard.css';

export default connect({
},{
  highlightRecordTagRequested: 'app.highlightRecordTagRequested',
  deleteRecordTagRequested: 'app.deleteRecordTagRequested',
}, props => {
  return (
    <div className="treatmentcard">
      <div className="treatmentcardcount">{props.record.tags.length} head</div>
      -
      <div className="treatmentcardtreatment">{props.record.treatment}</div>
      <div className="treatmentcardtags">
        {_.map(props.record.tags, (t,i) => 
          <div className="treatmentcardtag">
            {t.color+t.number}
          </div>
        )}
      </div>
    </div>
  );
});

