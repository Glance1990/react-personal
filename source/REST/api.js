import { MAIN_URL, TOKEN } from './config.js';

export const api = {

    async fetchTasks() {
        const response = await fetch(`${MAIN_URL}`, {
            method: "GET",
            headers: {
                Authorization: TOKEN,
            }
        });

        if (response.status != 200 ) {
            throw new Error("Tasks were not loaded from the server");
        }

        const { data: loadedTasksFromServer } = await response.json();

        return loadedTasksFromServer;
    },

    async createTask(task) {

        const response = await fetch(MAIN_URL, {
            method: "POST",
            headers: {
                Authorization: TOKEN,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: task }),
        });

        if (response.status !== 200) {
            throw new Error("Tasks were not created");
        }

        const { data: taskToAdd } = await response.json();

        return taskToAdd;
    },

    async updateTask(task) {

        const response = await fetch(MAIN_URL, {
            method: "PUT",
            headers: {
                Authorization: TOKEN,
                "Content-Type": "application/json",
            },
            body: JSON.stringify([{
                "id": task.id,
                "message": task.message,
                "completed": task.completed,
                "favorite": task.favorite,
            }]),
        });

        if (response.status != 200 ) {
            throw new Error("Task was not updated!");
        }

        const { data: updatedTask } = await response.json();

        return updatedTask;


    },

    async removeTask(taskID) {

        const response = await fetch(`${MAIN_URL}/${taskID}`, {
            method: "DELETE",
            headers: {
                Authorization: TOKEN,
                "Content-Type": "application/json",
            }

        });

        if (response.status != 204 ) {
            throw new Error("Task was not deleted!");
        }
        return taskID;

    },

    async completeAllTasks(tasks) {

        return Promise.all(tasks.map((singleTask) => {
            return this.updateTask(singleTask);
        })).then(values => {
            return values;
        }, error => {
            return error;
        });

        

    }

};
