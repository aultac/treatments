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
  // find all records with this tag in it:
  let recordsfortag = _.filter(props.treatmentRecords, r =>{
    return _.find(r.tags, t => 
      (t.number===props.record.tag.number && t.color===props.record.tag.color)
    );}
  );
  recordsfortag = _.reverse(_.sortBy(recordsfortag,r=>r.date));
  return (
    <div className="historytag">
      {_.map(recordsfortag, (r,i) => 
        <div className="historytagentry" key={'historyline'+i}>
          <div className="historytreatment">
            {r.treatment}
          </div>
          <div className="historyduration">
            {moment(r.date,'YYYY-MM-DD').fromNow()}
          </div>
        </div>
      )}
    </div>
  );
});

