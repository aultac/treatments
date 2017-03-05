import React from 'react';
import {connect} from 'cerebral-view-react';
import _ from 'lodash';
import moment from 'moment';
import TreatmentCard from './TreatmentCard';

import './History.css';

export default connect({
  historySelector: 'app.historySelector',
  treatmentRecords: 'app.treatmentRecords',
  record: 'app.record',
},{
}, props => {
  if (props.historySelector.active === 'tag') {
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
  }

  // Show cards for current date:
  let recordsfordate = _.filter(props.treatmentRecords, r=>(r.date === props.record.date));
  recordsfordate = _.reverse(_.sortBy(recordsfordate,r=>r.dateLastActivity));

  const count = _.reduce(recordsfordate, (sum,r) => sum + r.tags.length, 0);

  return (
    <div className="history">
      <div className="historytitle">
        {props.record.date+': '+count} head total.
      </div>
      {_.map(recordsfordate, (r,i) => 
        <TreatmentCard key={'treatmentcard'+i}
                       record={r}
                       recordindex={i} />
      )}
    </div>
  );
});

