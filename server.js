/* add express and the port stuuff */



const express = require('express')
const app = express()



const PORT = process.env.PORT || 3030


//locate my files 
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true}))
app.use(express.json())

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.send('Aplication tracking is running')

})

app.listen(PORT, () => {
    console.log(` server is running on port ${PORT}`)
})