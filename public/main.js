
const deleteButtons = document.querySelectorAll('.delete')
const editButtons = document.querySelectorAll('.edit')




editButtons.forEach(button => {
    button.addEventListener('click', () => {
        const notes = prompt('Update your notes:', button.dataset.notes)
        const status= prompt('update the status of your application:', button.dataset.status)

        if (notes === null) return

        fetch('/updatenotes', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'


            },
            body: JSON.stringify({
                id: button.dataset.id,
                notes: notes,
                status: status


            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Update failed')
            window.location.reload()


        })
        .catch(err => console.log(err))
    })
    
})


//my delete buttom action 
deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
        fetch('/deleteapplication', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: button.dataset.id
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Delete failed')
            window.location.reload()
        })
        .catch(err => console.log(err))
    })
})

