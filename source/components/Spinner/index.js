// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';

export default class Spinner extends Component {
    render () {
        const { isSpining } = this.props;
        return isSpining ? <div className = { Styles.spinner } /> : null;
    }
}
