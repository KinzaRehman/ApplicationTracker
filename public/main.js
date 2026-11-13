const deleteButtons = document.querySelectorAll('.delete')

function setEditing(row, editing) {
    row.querySelectorAll('.row-display').forEach(element => { element.hidden = editing })
    row.querySelectorAll('.row-editor').forEach(element => { element.hidden = !editing })
    row.querySelector('.edit-error').hidden = true
}

document.querySelectorAll('.application-row').forEach(row => {
    const status = row.querySelector('.edit-status')
    const notes = row.querySelector('.edit-notes')
    const link = row.querySelector('.edit-link')
    let original
    function startEditing() {
        original = { status: status.value, notes: notes.value, jobLink: link.value }
        setEditing(row, true)
        status.focus()
    }
    row.querySelector('.edit').addEventListener('click', () => startEditing())
    row.querySelector('.cancel-edit').addEventListener('click', () => {
        status.value = original.status
        notes.value = original.notes
        link.value = original.jobLink
        setEditing(row, false)
        row.querySelector('.edit').focus()
    })
    row.querySelector('.save-edit').addEventListener('click', async () => {
        const controls = row.querySelectorAll('.row-editor')
        const error = row.querySelector('.edit-error')
        error.hidden = true
        controls.forEach(control => { control.disabled = true })
        try {
            const response = await fetch('/updatenotes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: row.querySelector('.save-edit').dataset.id,
                    status: status.value,
                    notes: notes.value,
                    jobLink: link.value
                })
            })
            if (!response.ok) throw new Error(response.status === 400
                ? 'Check the status and website address (for example, adobe.com).'
                : 'Could not save changes. Please try again.')
            window.location.reload()
        } catch (err) {
            error.textContent = err.message || 'Could not save changes. Please try again.'
            error.hidden = false
        } finally {
            controls.forEach(control => { control.disabled = false })
        }
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


const filterCards = document.querySelectorAll('[data-filter]')
const applicationRows = document.querySelectorAll('.application-row')
filterCards.forEach(card => {
    card.addEventListener('click', () => {
        const status = card.dataset.filter
        let visibleCount = 0
        applicationRows.forEach(row => {
            row.hidden = status !== 'all' && row.dataset.status !== status
            if (!row.hidden) visibleCount++
        })
        filterCards.forEach(button => button.setAttribute('aria-pressed', String(button === card)))
        document.querySelector('#no-filter-results').hidden = status === 'all' || visibleCount > 0
        const label = card.querySelector('.kpi-label').textContent
        document.querySelector('#filter-summary').textContent = status === 'all'
            ? `Showing all ${visibleCount} applications.`
            : `Showing ${visibleCount} applications: ${label.toLowerCase()}. Select Total applications to show all.`
    })
})
