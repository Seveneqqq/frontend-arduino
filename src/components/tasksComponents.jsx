import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import SessionTimedOut from './sessionTimedOut';

const TasksComponent = () => {
    const [tasks, setTasks] = useState([]);
    const [visible, setVisible] = useState(false);
    const [newTask, setNewTask] = useState({ topic: '', content: '' });
    const [isLoading, setIsLoading] = useState(false);
    const toast = useRef(null);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [sessionExpired, setSessionExpired] = useState(false);


    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const home_id = sessionStorage.getItem('selected-home-id');
            const response = await fetch(`http://localhost:4000/api/tasks/${home_id}`, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                }
            });

            if (response.status === 401 || response.status === 403) {
                setSessionExpired(true); 
                return;
            }

            const data = await response.json();
            const sortedTasks = data.sort((a, b) => {
                if (a.isCompleted === b.isCompleted) {
                    return b.id - a.id;
                }
                return a.isCompleted ? 1 : -1;
            });
            setTasks(sortedTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load tasks'
            });
        }
    };

    const handleAddTask = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:4000/api/tasks/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                },
                body: JSON.stringify({
                    home_id: sessionStorage.getItem('selected-home-id'),
                    user_id: sessionStorage.getItem('UserId'),
                    topic: newTask.topic,
                    content: newTask.content
                })
            });

            if (response.status === 401 || response.status === 403) {
                setSessionExpired(true); 
                return;
            }

            const data = await response.json();
            if (data.success) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Task added successfully'
                });
                setVisible(false);
                setNewTask({ topic: '', content: '' });
                await fetchTasks();
            }
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to add task'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompleteTask = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/tasks/${taskId}/complete`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                }
            });

            if (response.status === 401 || response.status === 403) {
                setSessionExpired(true); 
                return;
            }

            if (response.ok) {
                await fetchTasks();
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Task completed'
                });
            }
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to complete task'
            });
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                },
                body: JSON.stringify({
                    user_id: sessionStorage.getItem('UserId')
                })
            });

            if (response.status === 401 || response.status === 403) {
                setSessionExpired(true); 
                return;
            }

            if (response.ok) {
                await fetchTasks();
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Task deleted'
                });
            }
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete task'
            });
        }
    };

    const nextTask = () => {
        if (currentTaskIndex < tasks.length - 1) {
            setCurrentTaskIndex(prev => prev + 1);
        }
    };

    const previousTask = () => {
        if (currentTaskIndex > 0) {
            setCurrentTaskIndex(prev => prev - 1);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <Toast ref={toast} />
            <SessionTimedOut 
                visible={sessionExpired} 
                setVisible={setSessionExpired}
            />
            
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Tasks</h2>
                <Button 
                    label="New"
                    icon="pi pi-plus"
                    onClick={() => setVisible(true)}
                />
            </div>

            <div className="flex-1 relative flex items-center border-t border-gray-700">
                {tasks.length > 0 ? (
                    <>
                        <Button 
                            icon="pi pi-chevron-left"
                            className="!absolute left-0 z-10 !w-12 !h-12 !rounded-full bg-blue-500"
                            onClick={previousTask}
                            disabled={currentTaskIndex === 0}
                        />

                        <div className="w-full px-16">
                            {tasks[currentTaskIndex] && (
                                <div className=" rounded-xl p-4 w-full">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg">{tasks[currentTaskIndex].topic}</h3>
                                        <p className="text-sm text-gray-400">{tasks[currentTaskIndex].user_email}</p>
                                    </div>
                                    <p className="text-gray-300 mb-3">{tasks[currentTaskIndex].content}</p>
                                    <div className="flex justify-end">
                                        {!tasks[currentTaskIndex].isCompleted ? (
                                            <Button
                                                label="Complete"
                                                icon="pi pi-check"
                                                className="bg-green-500"
                                                onClick={() => handleCompleteTask(tasks[currentTaskIndex].id)}
                                            />
                                        ) : (
                                            <Button
                                                label="Delete"
                                                icon="pi pi-trash"
                                                className="bg-red-500"
                                                onClick={() => handleDeleteTask(tasks[currentTaskIndex].id)}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button 
                            icon="pi pi-chevron-right"
                            className="!absolute right-0 z-10 !w-12 !h-12 !rounded-full bg-blue-500"
                            onClick={nextTask}
                            disabled={currentTaskIndex === tasks.length - 1}
                        />
                    </>
                ):(
                    <p className="flex items-center justify-center w-full text-2xl text-gray-400">No tasks found</p>
                )}
            </div>

            <Dialog
                header="Add New Task"
                visible={visible}
                style={{ width: '90%', maxWidth: '500px' }}
                maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
                modal
                onHide={() => setVisible(false)}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="topic">Topic</label>
                        <InputText
                            id="topic"
                            value={newTask.topic}
                            onChange={(e) => setNewTask(prev => ({ ...prev, topic: e.target.value }))}
                            className="w-full"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="content">Content</label>
                        <InputTextarea
                            id="content"
                            value={newTask.content}
                            onChange={(e) => setNewTask(prev => ({ ...prev, content: e.target.value }))}
                            rows={5}
                            className="w-full"
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button 
                            label="Cancel" 
                            icon="pi pi-times"
                            onClick={() => setVisible(false)}
                            className="p-button-text"
                        />
                        <Button 
                            label="Add Task" 
                            icon="pi pi-check"
                            onClick={handleAddTask}
                            loading={isLoading}
                            disabled={!newTask.topic || !newTask.content}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default TasksComponent;