import React from 'react';
import {connect} from 'cerebral-view-react';

import TagHistory from './TagHistory';
import RecordInput from './RecordInput';

import './App.css';

export default connect({
  window: 'window',
},{
  windowResized: 'window.resized'
}, class App extends React.Component {

  updateDimensions() {
    this.props.windowResized({ width: window.innerWidth, height: window.innerHeight});
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
    this.updateDimensions();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  render() {

    const dir = this.props.window.orientation === 'landscape' ? 'row' : 'column';
    return (
      <div className="App" style={{ flexDirection: dir }}>
        <TagHistory />
        <RecordInput />
      </div>
    );
  }

});
