import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import axios from 'axios';

console.log('Test Environment Variable... ' + process.env.REACT_APP_MONGO_USERNAME)

axios.get(`/api/version`)
	.then((resp) => {
		console.log(resp.data)
	})
	.catch(error => {
	    console.log(error);
	});

axios.get(`/api/contacts`)
	.then((resp) => {
		console.log(resp.data)
	})
	.catch(error => {
	    console.log(error);
	});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();