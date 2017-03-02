import React from 'react';
import {connect} from 'cerebral-view-react';
import _ from 'lodash';

import './TreatmentEditor.css';

export default connect({
  record: 'app.record',
  treatmentCodes: 'app.treatmentCodes',
  treatmentRecords: 'app.treatmentRecords',
},{
  recordUpdateRequested: 'app.recordUpdateRequested',
  hideTreatmentEditor: 'app.hideTreatmentEditor',
}, props => {
  const treatmentTextChanged = evt => {
    evt.preventDefault();
    props.recordUpdateRequested({ treatment: evt.target.value() });
  };


  const codelistFromText = text => {
    let tokens = text.match(/([A-Z]([a-z]+)?)/g); // [ 'Z', 'Za', etc]
    if (!tokens) tokens = [];
    return _.map(props.treatmentCodes, c => {
      return {
        code: c.code,
        name: c.name,
        on: !!_.find(tokens,t=>c.code===t),
      };
    });
  };
  const textFromCodelist = list => _.join(_.map(_.filter(list,c=>c.on),c=>c.code),'');
  const treatmentCodeButtonClicked = code => evt => {
    // turn on/off this code in the list
    const list = codelistFromText(props.record.treatment);
    const thiscode = _.findIndex(list,c=>c.code===code);
    if (thiscode<0) return;
    list[thiscode].on = !list[thiscode].on;
    props.recordUpdateRequested({ treatment: textFromCodelist(list) });
  };

  const treatmentEditorDoneClicked = evt => props.hideTreatmentEditor();
  const codesOn = _.keyBy(codelistFromText(props.record.treatment),c=>c.code);

  return (
    <div className='treatmentEditor'>
      
      <input className='treatmentEditorTextInput'
             type='text'
             value={props.record.treatment}
             onChange={treatmentTextChanged} />

      <div className='treatmentCodesList'>
        {_.map(props.treatmentCodes, (c,i) => 
          <div className={'treatmentCodeButton ' + (codesOn[c.code].on ? 'codeOn' : 'codeOff')}
               key={'treatmentCodeButton'+i}
               onClick={treatmentCodeButtonClicked(c.code)}>
            <div className='treatmentCodeButtonCode'>
              {c.code}
            </div>
            <div className='treatmentCodeButtonName'>
              {c.name}
            </div>
          </div>
        )}
      </div>

      <div className='recentTreatmentsList'>
      </div>

      <div className='treatmentEditorDoneButton'
           onClick={treatmentEditorDoneClicked}>
        Done
      </div>

    </div>
  );

});
