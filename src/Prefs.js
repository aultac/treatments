import React from 'react';
import {connect} from 'cerebral-view-react';

import './Prefs.css';

export default connect({
},{
  logoutClicked: 'app.logoutClicked',
}, props => {

  const logoutClicked = evt => {
    props.logoutClicked();
    evt.preventDefault();
  }

  return (
    <div className="prefs">
      <a className="prefslink" onClick={logoutClicked}>Change Trello Account</a>
    </div>
  );
});

