const { PrismaClient } = require('@prisma/client')
const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
const prisma = new PrismaClient()

app.post('/add', async (req, res) => {
    const { title, done } = req.body;
    try{
        const newTodo = await prisma.todo.create({
            data: {
                title: title,
                done: done
            }
        })
        res.json({
            ...newTodo
        })
    } catch (err) {
        console.error(err)
        res.status(501).json({
            message: 'Couldn\'t create todo'
        })
    }
})

app.post('/delete', async (req, res) => {
    const { id } = req.body;
    try{
        await prisma.todo.delete({
            where: {
                id: id
            }
        })
    } catch {
        res.status(501).json({
            message: "couldn't delete todo"
        })
    }
})

app.post('/update', (req, res) => {
    const { todoId, done } = req.body;
    console.log(done);
    prisma.todo.update({
        where: {
            id: todoId
        },
        data: {
            done: done
        }
    })
})

app.get('/list', async (req, res) => {
    try{
        const todos = await prisma.todo.findMany({})
        console.log(todos)
        res.json({
            todos
        })
    } catch {
        res.status(501).json({
            message: 'Something went wrong!'
        })
    }
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on ${port}`)
})
