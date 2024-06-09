import PropTypes from 'prop-types';
import React from 'react';
import { Image } from 'react-bootstrap';
const path = require('path');
import axios from 'axios'

/**
 * Serves as the displaying badge to the right of the submission list.
 * However also serves as the main log receiver.
 * @class JudgeLog
 * @property {string}   name          The file of the log.
 * @property {Function} updateResults The function that, when called, will
 * sync the result into localStorage, and re-renders the log receiver.
 * @property {string}   verdict       The submission verdict.
 */
class JudgeLog extends React.Component {
	constructor() {
		super();
		this.lastUpdated = new Date(0);
		this.timer = null;
	}
	/**
	 * Creates a timer that loops every 5 seconds to fetch new judging results.
	 * @method createTimer
	 */
	createTimer() {
		let doFunc = () => {
			axios.post('log', {
				user: window.username,
				problem: path.basename(this.props.name, path.extname(this.props.name)),
				ext: path.extname(this.props.name)
			})
				.then(({ status, data }) => {
					if (status !== 200) return Promise.reject(new Error());
					this.handleUpdate(data);
				})
				.catch(() => { // Pass
				});
		};
		return setInterval(() => doFunc(), 5000); // every 5 seconds
	}
	/**
	 * Processes the received judge results.
	 * @method handleUpdate
	 * @param  {Object} results The received POST judge results.
	 */
	handleUpdate(results) {
		if (results === null) return;
		results.created = new Date(results.created);
		if (this.lastUpdated.getTime() >= results.created.getTime()) return;
		this.lastUpdated = results.created;
		this.props.updateResults(results.content);
	}
	// Create the timer on creation.
	componentWillMount() {
		this.timer = this.createTimer();
	}
	// On update, check whether we need to periodically fetch further updates.
	componentDidUpdate() {
		// Why not DidMount? It should get updated at least once
		if (this.props.verdict !== '' && this.props.verdict !== 'Yes') {
			clearInterval(this.timer);
			this.timer = null;
		}
		else if (this.timer === null) {
			this.timer = this.createTimer();
		}
	}
	// Clears the timer on removal of the element.
	componentWillUnmount() {
		if (this.timer !== null) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}
	render() {
		if (this.props.verdict === '')
			return <Image responsive src='/public/img/giphy.gif' height='16' width='16' />;
		else if (this.props.verdict === 'Yes')
			return <Image responsive src='/public/img/tick.png' height='16' width='16' />;
		else return <span style={{ fontSize: '80%' }}>{this.props.verdict}</span>;
	}
}
JudgeLog.propTypes = {
	name: PropTypes.string.isRequired,
	updateResults: PropTypes.func.isRequired,
	verdict: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
JudgeLog.defaultProps = {
	verdict: ''
};

module.exports = JudgeLog;
