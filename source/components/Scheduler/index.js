// Core
import React, { Component } from 'react';
import gsap from 'gsap';
import {
    Transition,
    CSSTransition,
    TransitionGroup
} from "react-transition-group";

// Components
import Task from '../Task';
import Spinner from '../Spinner';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST/api';
// Theme decoration
import Checkbox from '../../theme/assets/Checkbox';

export default class Scheduler extends Component {

    state = {
        task: "",
        tasksFilter: "",
    };


    _getAllCompleted = (tasks) => {
        if (tasks != undefined) {
            return tasks.every((singleTask) => {
                return singleTask.completed == true;
            });
        }
    };

    _updateTask = (e) => {
        const { value: task } = e.target;

        this.setState({ task });
    };

    _handleFormSubmit = (e) => {
        e.preventDefault();
        this._submitTask();
    };

    _submitTaskOnEnter = (e) => {
      const enterKey = e.key === "Enter";

      if (enterKey) {
          e.preventDefault();
          this._submitTask();
      }
    };

    _submitTask = (e) => {
        const { task } = this.state;

        if (!task) {
            return null;
        }

        const { _createTaskAsync } = this.props;

        _createTaskAsync(task);

        this.setState({
            task: "",
        });

    };



    _completeAllTasksAsync = async () => {

        const { tasks, _setTasksFetchingState } = this.props;


        const undoneTasks = tasks.filter((singleTask) => {
            return singleTask.completed == false;
        });

        if (!undoneTasks.length) return null;

        await undoneTasks.forEach((singleTask) => {
            singleTask.completed = true;
        });

        const updatedTasks = await api.completeAllTasks(undoneTasks);

        updatedTasks.forEach((singleTask) => {
            return singleTask.completed = true;
        });

        _setTasksFetchingState(tasks);


    };

    _updateTasksFilter = (e) => {
        const { value: tasksFilter } = e.target;

        this.setState({ tasksFilter });
    };

    _filterTask = (tasks) => {
        const { tasksFilter } = this.state;

        return tasks.filter((singleTask) => {
            return singleTask.message.indexOf(tasksFilter) != -1;
        })


    };

    _animateSingleTaskEnter = (singleTask) => {
        gsap.fromTo(
            singleTask,
            0.7,
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1 }
        )
    };

    _animateSingleTaskExit = (singleTask) => {
        gsap.fromTo(
            singleTask,
            0.7,
            { opacity: 1, scale: 1 },
            { opacity: 0, scale: 0 }
        )
    };

    render () {
        const { task, tasksFilter } = this.state;
        const { isSpinning, tasks, _removeTaskAsync, _updateTaskAsync, } = this.props;


        const checkedAll = tasks ? this._getAllCompleted(tasks) : null;
        const filteredTasks = tasks ? this._filterTask(tasks) : null;


        const tasksToAdd = !filteredTasks ? null : filteredTasks.map((taskItem, index) => (
            <Transition
                key = { taskItem.id }
                appear
                in
                timeout = { 700 }
                onEnter  ={ this._animateSingleTaskEnter }
                onExit  ={ this._animateSingleTaskExit }
            >

                <Task
                      { ...taskItem }
                      _removeTaskAsync = { _removeTaskAsync }
                      _updateTaskAsync = { _updateTaskAsync }
                />

            </Transition>
        ));



        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Spinner isSpining = { isSpinning } />
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            placeholder="Поиск"
                            type="search"
                            value = { tasksFilter }
                            onChange= { this._updateTasksFilter }

                        />
                    </header>
                    <section>
                        <form onSubmit = { this._handleFormSubmit }>
                            <input
                                type="text"
                                maxLength="50"
                                placeholder="Описaние моей новой задачи"
                                value= { task }
                                onChange = { this._updateTask }
                                onKeyDown= { this._submitTaskOnEnter }
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div>
                            <ul>
                                <div>
                                    <TransitionGroup>
                                        { tasks != undefined ? tasksToAdd : null  }
                                    </TransitionGroup>
                                </div>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked={ checkedAll }
                            color1 = "#363636"
                            color2 = "#fff"
                            onClick = { this._completeAllTasksAsync }
                        />
                        <span>Все задачи выполнены</span>
                    </footer>
                </main>
            </section>
        );
    }
}
