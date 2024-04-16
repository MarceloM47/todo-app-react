import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Toaster, toast } from 'sonner'

interface Task {
    id: string;
    title: string;
}

function Card() {
    const [title, setTitle] = useState<string>('');
    const [tasks, setTasks] = useState<Task[]>([]);

    const handleClear = () => {
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar todas las tareas?");
        if (confirmed) {
            tasks.pop()
            localStorage.removeItem('tasks')
            toast.info("Todas las tareas eliminadas")
        }
    } 

    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        setTasks(storedTasks);
    }, [handleClear])

    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState<string>('');

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (title.trim() === '') {
            toast.error("El campo título es obligatorio");
        } else {
            const newTask: Task = {
                id: uuidv4(),
                title: title
            };
            const updatedTasks = [newTask, ...tasks];
            setTasks(updatedTasks);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            toast.success('Tarea creada')
            setTitle('');
        }
    };

    const handleEdit = (id: string, initialTitle: string) => {
        setEditingTaskId(id);
        setEditTitle(initialTitle);
    };

    const handleEditConfirm = (id: string) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, title: editTitle } : task
        );
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setEditingTaskId(null);
        toast.info("Tarea actualizada")
    };

    const handleDelete = (id: string) => {
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar esta tarea?");
        if (confirmed) {
            const updatedTasks = tasks.filter(task => task.id !== id);
            setTasks(updatedTasks);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            toast.info("Tarea eliminada")
        }
    };

    return (
        <div className="card-container w-50 h-75 p-3 bg-white d-flex flex-column justify-content-center align-items-center rounded-3">
            <Toaster richColors/>
            <h1 className="mb-4">Todo App</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Terminar proyecto Frontend..."
                    maxLength={35}
                    className="form-control w-auto d-inline"
                />

                <button type="submit" className="btn btn-success mx-2">+</button>
            </form>

            <div className="mt-5 w-full d-flex flex-column overflow-y-scroll" style={{ maxHeight: "600px", overflowY: "scroll" }}>
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <div key={task.id} className="mb-1 d-flex justify-content-between align-items-center text-align-center border border-2 rounded-2 px-2">
                            {editingTaskId === task.id ? (
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    maxLength={30}
                                    autoFocus
                                />
                            ) : (
                                <span className="p-3">{task.title}</span>
                            )}
                            <div>
                                {editingTaskId === task.id ? (
                                    <button onClick={() => handleEditConfirm(task.id)} className="btn btn-primary mx-1">Confirmar</button>
                                ) : (
                                    <button onClick={() => handleEdit(task.id, task.title)} className="btn btn-primary mx-1">Editar</button>
                                )}
                                <button onClick={() => handleDelete(task.id)} className="btn btn-danger mx-1">Eliminar</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <h2>Todavía no tienes tareas</h2>
                )}
            </div>
            {tasks.length > 0 && (
                <button onClick={handleClear} className="btn btn-danger m-2">Eliminar todo</button>
            )}
        </div>
    );
}

export default Card;
