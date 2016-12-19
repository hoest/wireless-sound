import 'babel-polyfill';
import { polyfill } from 'es6-promise';
polyfill();

import React from 'react';
import ReactDOM from 'react-dom';
import OrderForm from './orderForm.jsx';
import './index.css';

// add order-form button
document.querySelectorAll('.bestel-knop').forEach(div => {
  ReactDOM.render(<OrderForm />, div);
});
