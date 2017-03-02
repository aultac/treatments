import React from 'react';
import {connect} from 'cerebral-view-react';
import _ from 'lodash';
import Keypad from './Keypad.js';
import Colorbar from './Colorbar.js';
import TreatmentDateBar from './TreatmentDateBar.js';

import './RecordInput.css';

export default connect({
  record: 'app.record',
  colors: 'app.colors',
  treatmentCodes: 'app.treatmentCodes',
  records: 'app.records',
  window: 'window',
  canSave: 'app.trello.treatmentcardsValid',
},{
  recordUpdateRequested: 'app.recordUpdateRequested',
  recordSaveClicked: 'app.recordSaveClicked',
}, function RecordInput(props) {

  const numberClicked = num => {
    // wipe out the previous entry if it's already been saved.
    const prefix = (props.record.is_saved ? '' : props.record.tag.number);
    props.recordUpdateRequested({tag: { number: prefix+''+num} });
  };

  const clearClicked = () => {
    props.recordUpdateRequested({ tag: { number: '' } });
  };

  const backspaceClicked = () => {
    let str = props.record.tag.number;
    if (str.length > 0) str = str.slice(0,-1);
    props.recordUpdateRequested({ tag: { number: str } });
  };

  const recordSaveClicked = evt => {
    if (props.canSave) {
      evt.preventDefault();
      props.recordSaveClicked();
    }
  };

  return (
    <div className="recordinput">

      <Colorbar />

      <TreatmentDateBar />

      <Keypad onNumber={numberClicked}
              onClear={clearClicked}
              onBackspace={backspaceClicked} />

      <div className={'savebutton ' + (props.canSave ? 'savebuttonenabled':'savebuttondisabled')}
           onClick={recordSaveClicked}>
        SAVE TREATMENT
      </div>

    </div>
  );
});
