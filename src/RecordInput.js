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
  cardsValid: 'app.trello.lists.treatments.cardsValid',
},{
  recordUpdateRequested: 'app.recordUpdateRequested',
  recordSaveClicked: 'app.recordSaveClicked',
}, function RecordInput(props) {

  const numberClicked = num => {
    const prefix = '' + (props.record.tag.number || ''); // convert to string
    props.recordUpdateRequested({tag: { number: prefix+num} });
  };

  const clearClicked = () => {
    props.recordUpdateRequested({ tag: { number: '', color: '' } });
  };

  const backspaceClicked = () => {
    let str = ''+props.record.tag.number;
    if (str.length > 0) str = str.slice(0,-1);
    props.recordUpdateRequested({ tag: { number: +(str) } });
  };

  const recordSaveClicked = evt => {
    if (props.canSave) {
      evt.preventDefault();
      props.recordSaveClicked();
    }
  };

  const canSave = props.cardsValid && props.record.tag && props.record.tag.number && props.record.tag.color;
  return (
    <div className="recordinput">

      <Colorbar />

      <TreatmentDateBar />

      <Keypad onNumber={numberClicked}
              onClear={clearClicked}
              onBackspace={backspaceClicked} />

      <div className={'savebutton ' + (canSave ? 'savebuttonenabled':'savebuttondisabled')}
           onClick={recordSaveClicked}>
        SAVE TREATMENT
      </div>

    </div>
  );
});
