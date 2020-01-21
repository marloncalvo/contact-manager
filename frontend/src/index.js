import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import axios from 'axios';

const get_test_uri = `/api/version`
axios.get(get_test_uri)
	.then((resp) => {
		console.log(resp.data)
	})
	.catch(error => {
	    if (!error.status) {
	        console.log("Network error...");
	    }
	    console.log(error);
	});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();