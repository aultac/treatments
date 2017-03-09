import React from 'react';
import {connect} from 'cerebral-view-react';
import _ from 'lodash';

import './Keypad.css';

export default connect({
  window: 'window',
},{
}, class Keypad extends React.Component {

  keypressed(evt) {
    if (evt.keyCode === 8) {
      this.props.onBackspace(); // backspace
      evt.preventDefault();
    }
    const number = evt.keyCode - 48; // 0 is key 48
    if (number >= 0 && number <=9) {
      this.props.onNumber(number);
      evt.preventDefault();
    }
  }
  componentDidMount() {
    document.addEventListener('keypress', this.keypressed.bind(this));
  }
  componentWillUnmount() {
    document.removeEventListener('keypress', this.keypressed.bind(this));
  }

  numberClicked(n) {
    return (evt) => {
      evt.preventDefault();
      this.props.onNumber(n);
    }
  }

  clearClicked(evt) {
    evt.preventDefault();
    this.props.onClear();
  }

  backspaceClicked(evt) {
    evt.preventDefault();
    this.props.onBackspace();
  }

  renderCalcRow(arr) {
    return (
      <div className="keypadrow"> 
        {
          arr.map(info => 
              <div className="keypadbutton"
                   key={'calcwrap'+(_.isObject(info) ? info.val : info)}
                   onClick={_.isObject(info) ? info.clicked : this.numberClicked(info).bind(this) }>
                {_.isObject(info) ? info.val : info}
              </div>
          )
        }
      </div>
    );
  }

  render() {
    return (
      <div className="keypad">
        {this.renderCalcRow([1,2,3])}
        {this.renderCalcRow([4,5,6])}
        {this.renderCalcRow([7,8,9])}
        { 
          this.renderCalcRow([
            { val: 'C', clicked: this.clearClicked.bind(this) },
            0,
            { val: '<--', clicked: this.backspaceClicked.bind(this) },
          ])
        }
      </div>
    );
  }
});


