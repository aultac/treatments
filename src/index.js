import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'pure-css';
import './index.css';

import {Container} from 'cerebral-view-react'
import controller from './controller'

import './index.js'

ReactDOM.render(
  <Container controller={controller}>
    <App />
  </Container>,
  document.getElementById('root')
);
