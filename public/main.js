

const deleteButtons = document.querySelectorAll('.delete')








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

