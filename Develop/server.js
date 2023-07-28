const express = require('express');
const PORT = 3001;
const app = express();
const path = require("path");
const fs = require("fs");
const uniqid = require("uniqid");
app.use(express.static("public"))
app.use(express.json())
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname,"/public/notes.html"))
})
app.get('/api/notes', (req,res) =>{ //api routes deal with data
    fs.readFile("./db/db.json","utf-8",(error,data)=>{
        res.send(data)
    })
})
app.post('/api/notes', (req,res) =>{
    fs.readFile("./db/db.json","utf-8",(error,data)=>{ //raw json data
        const notes = JSON.parse(data) //parses data
        const newNote = {
            ...req.body,
            id: uniqid()
        }
        notes.push(newNote)
        fs.writeFile("./db/db.json",JSON.stringify(notes),(error) =>{
            res.json(newNote)
        }) //stringify 
    })
})
app.delete('/api/notes/:id', (req,res) =>{
    fs.readFile("./db/db.json","utf-8",(error,data)=>{ //raw json data
        const notes = JSON.parse(data) //parses data
        const filterNotes = notes.filter(note => note.id !== req.params.id)
        fs.writeFile("./db/db.json",JSON.stringify(filterNotes),(error) =>{
            res.json("note deleted")
        }) //stringify 
    })
})

app.get('*',(req,res) =>{
    res.sendFile(path.join(__dirname,"/public/index.html"))
}) //this must be last
app.listen(PORT, ()=>{
    console.log("server started")
})