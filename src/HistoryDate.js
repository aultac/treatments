import React from 'react';
import {connect} from 'cerebral-view-react';
import _ from 'lodash';
import moment from 'moment';
import TreatmentCard from './TreatmentCard';

export default connect({
  historySelector: 'app.historySelector',
  treatmentRecords: 'app.records.treatments',
  record: 'app.record',
},{
}, props => {
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

