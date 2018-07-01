// Core
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

// Instruments
import { api } from '../../REST/api';
import sortTasksByDate from '../../instruments/index';
import { sortTasksByGroup } from '../../instruments/index';

//Components
import Scheduler from '../../components/Scheduler/'


@hot(module)
export default class App extends Component {

    state = {
        tasks: [],
        isSpinning: false,
    };

    componentDidMount() {

        this._fetchTaskAsync();

    }


    _setTaskFetchingState = (state) => {
        this.setState({
            isSpinning: state,
        })
    };

    _setTasksFetchingState = (state) => {
        this.setState({
            tasks: state,
        })
    };

    _fetchTaskAsync = async () => {
        try {
            this._setTaskFetchingState(true);

            const tasks = sortTasksByGroup( await api.fetchTasks() );



            this.setState({ tasks,
                            isSpinning: false,
                            });
        } catch ({ message}) {
            console.error(message);
        } finally {
            this._setTaskFetchingState(false);
        }
    };

    _createTaskAsync = async (task) => {
        try {
            this._setTaskFetchingState(true);

            const taskToAdd = await api.createTask(task);

            this.setState((prevState) => ({
                tasks: [taskToAdd, ...prevState.tasks],
            }));
        } catch ({ message }) {
            console.error(message);
        } finally {
            this._setTaskFetchingState(false);
        }
    };

    _updateTaskAsync = async (task) => {

        try {
            this._setTaskFetchingState(true);

            const taskToUpdate = await api.updateTask(task);

            this.setState(({ tasks }) => ({
                tasks: tasks.map((item) => task.id === item.id ? task : item),
            }));


            this.setState({tasks: sortTasksByGroup(this.state.tasks)});

            this._setTaskFetchingState(false);
        } catch ({message}) {
            console.error(message);
        } finally {
            this._setTaskFetchingState(false);
        }
    };

    _removeTaskAsync = async (taskId) => {
        try {
            this._setTaskFetchingState(true);

            const taskToToRemove = await api.removeTask(taskId);

            const restOfTask = this.state.tasks.filter(task => task.id != taskToToRemove);

            this.setState(({tasks}) =>({
                tasks: tasks.filter((task) => task.id != taskId),
            }));

            this._setTaskFetchingState(false);
        } catch ({ message }) {
            console.error(message);
        } finally {
            this._setTaskFetchingState(false);
        }
    };

    render () {
        const { isSpinning, tasks, checked } = this.state;

        return (
            <Scheduler
                _createTaskAsync = { this._createTaskAsync }
                _removeTaskAsync = { this._removeTaskAsync }
                _updateTaskAsync = { this._updateTaskAsync }
                _setTasksFetchingState = { this._setTasksFetchingState }
                isSpinning = { isSpinning }
                tasks = { tasks }
                checked = { checked }
            />
        );
    }
}
