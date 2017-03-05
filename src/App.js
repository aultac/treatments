import React from 'react';
import {connect} from 'cerebral-view-react';

import TagPane from './TagPane';
import RecordInput from './RecordInput';
import TreatmentEditor from './TreatmentEditor';

import './App.css';

export default connect({
  treatmentEditorActive: 'app.treatmentEditorActive',
  window: 'window',
  trello: 'app.trello',
},{
  windowResized: 'window.resized',
  authorizationNeeded: 'app.authorizationNeeded'
}, class App extends React.Component {

  updateDimensions() {
    this.props.windowResized({ width: window.innerWidth, height: window.innerHeight});
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
    this.updateDimensions();
    if (!this.props.trello.authorized) this.props.authorizationNeeded();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  render() {
    const dir = this.props.window.orientation === 'landscape' ? 'row' : 'column';

    if (this.props.treatmentEditorActive) {
      return (
        <div className="App" style={{ flexDirection: 'column' }} >
          <TreatmentEditor />
        </div>
      );
    }
    return (
      <div className="App" style={{ flexDirection: dir }}>
        <TagPane />
        <RecordInput />
      </div>
    );
  }

});
