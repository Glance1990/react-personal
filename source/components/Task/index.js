// Core
import React, { PureComponent } from 'react';

// Instruments
import Styles from './styles.m.css';

// Theme decoration
import Checkbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';

export default class Task extends PureComponent {
    constructor(props) {
        super(props);
    }

    taskInput = React.createRef();

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    state = {
        isTaskEditing: true,
        newMessage: this.props.message,
    };

    _updateNewTaskMessage = () => {

        this.setState({ newMessage: this.taskInput.current.value })
    };

    _removeTask = () => {
        const { id, _removeTaskAsync } = this.props;

        _removeTaskAsync(id);
    };

    _updateTask = () => {
        const { id,
            completed,
            favorite,
            _updateTaskAsync } = this.props;
        const message = this.state.newMessage;

        _updateTaskAsync({id, message, completed, favorite});
        console.log("one");
        this._setTaskEditingState(true);

    };

    _toggleTaskCompletedState = () => {
        const { id, message, completed, favorite, _updateTaskAsync } = this.props;

        _updateTaskAsync({id, message, completed: !completed, favorite });
    };


    _toggleTaskFavoriteState = () => {
        const { id, message, completed, favorite, _updateTaskAsync } = this.props;

        _updateTaskAsync({id, message, completed, favorite: !favorite});
    };

    _updateTaskMessageOnClick = () => {

        if ( this.state.isTaskEditing ) {
            this._setTaskEditingState(false);
        } else {
            this._setTaskEditingState(true);
        }

        this.taskInput.current.focus();

    };

    _setTaskEditingState = (state) => {

        this.setState((prevState) => {
            return { isTaskEditing: !prevState.isTaskEditing };
        });

     };

    _updateTaskMessageOnKeyDown = (e) => {
        const escKey = e.key === "Escape";
        const enterKey = e.key === "Enter";

        if (escKey) {
            this.setState((prevState) => {
                return { isTaskEditing: !prevState.isTaskEditing };
            });
        }

        if (enterKey) {
            this._updateTask();
        }
    };


    render () {
        const { completed, favorite } = this.props;
        const { isTaskEditing } = this.state;
        const classes = `${Styles.task} ${completed ? Styles.completed : null}`;

        return <li className = { classes }>
            <div className = { Styles.content }>
                <Checkbox
                    className = { Styles.toggleTaskCompletedState }
                    checked = { completed }
                    color1 = "#3B8EF3"
                    color2 = "#FFF"
                    onClick = { this._toggleTaskCompletedState }
                />
                <input
                    maxLength="50"
                    type="text"
                    autoFocus={true}
                    value={ this.state.newMessage }
                    onChange = { this._updateNewTaskMessage }
                    disabled={isTaskEditing}
                    ref={ this.taskInput }
                    onKeyDown= { this._updateTaskMessageOnKeyDown }
                />
            </div>
            <div className = { Styles.actions }>
                <Star checked = { favorite }
                      className = { Styles.toggleTaskFavoriteState }
                      color1 = "#3B8EF3"
                      onClick = { this._toggleTaskFavoriteState } />
                <Edit className = { Styles.updateTaskMessageOnClick }
                      color1 = "#3B8EF3"
                      onClick = { this._updateTaskMessageOnClick } />
                <Remove className = { Styles.removeTask }
                        color1 = "#3B8EF3"
                        onClick = { this._removeTask } />
            </div>
        </li>;
    }
}
