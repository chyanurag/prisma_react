import { useEffect, useState } from 'react'
import axios from 'axios'

interface Todo {
    id: number,
    title: string,
    done: boolean
}

function TodoInput({ onAdd } : { onAdd: any }){
    const [todo, setTodo] = useState('');
    const [done, setDone] = useState(false);
    return (
        <div>
            <input type="text" placeholder="Enter todo title" value={todo} onChange={e => setTodo(e.target.value)}/><br/>
            Mark Done <input type="checkbox" checked={done} onChange={e => setDone(e.target.value ? true : false)}/><br/>
            <button onClick={() => {
                onAdd(todo, done)
                setTodo('')
                setDone(false)
            }}>Add Todo</button>
        </div>
    )
}

function Todo({ todo, onDelete }: { todo : Todo, onDelete: any }){
    return (
        <div>
            <h1>{todo.title}<span></span></h1>
            <button onClick={() => onDelete(todo.id)}>Delete</button>
        </div>
    )
}


function TodoList({ todos, onDelete } : { todos: Todo[], onDelete: any }){
    return(
        <div>
            {todos.map(todo => <Todo onDelete={onDelete} key={todo.id} todo={todo}/>)}
        </div>
    )
}

function App() {
    const [todos, setTodos] = useState<Todo[]>([]);

    const fetchAndSetTodos = async () => {
        try{
            const data  = await axios.get('http://localhost:5000/list')
            const todos: Todo[] = data['data']['todos']
            setTodos(todos)
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchAndSetTodos()
    }, [])
    
    const handleAdd = (title: string, done: boolean) => {
        axios.post('http://localhost:5000/add', {
            title,
            done
        })
        .then(() => fetchAndSetTodos())
        .catch(err => console.log(err))
    }

    const handleDelete = (todoId: number) => {
        axios.post('http://localhost:5000/delete', {
            id: todoId
        })
        fetchAndSetTodos()
    }


    return (
            <>
                <TodoInput onAdd={handleAdd} />
                <TodoList todos={todos} onDelete={handleDelete}/>
            </>
           )
}

export default App
