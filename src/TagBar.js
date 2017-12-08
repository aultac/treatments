import React from 'react';
import {connect} from 'cerebral-view-react';

import './TagBar.css';

export default connect({
  record: 'app.record',
  colors: 'app.colors',
     msg: 'app.msg',
},{
  recordUpdateRequested: 'app.recordUpdateRequested',
}, props => {
  const colorTextChanged = evt => {
    evt.preventDefault();
    props.recordUpdateRequested({tag: { color: evt.target.value} });
  };

  const tagNumberTextChanged = evt => {
    evt.preventDefault();
    props.recordUpdateRequested({tag: { number: +(evt.target.value)} });
  };

  const color = props.colors[props.record.tag.color];
  return (
    <div className="tagbar"
         style={{ borderColor: props.record.is_saved ? '#CCCCCC' : 'red' }}>
      <input className="colortext"
             style={{ color: color, borderColor: color }}
             value={props.record.tag.color}
             type="text"
             onChange={colorTextChanged} />
      <input className="numbertext"
             value={props.record.tag.number || ''} 
             type="text" 
             onChange={tagNumberTextChanged} />
    </div>
  );

});

