import { useState, useEffect } from 'react'
import contactServices from './services/contacts'
import './app.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [status, setStatus] = useState('')

  const filteredPersons = persons?.filter(person => person.name.trim().toLowerCase().includes(filter.trim().toLowerCase()))
  const lastId = persons[persons.length - 1]?.id

  const form = document.querySelector('form')

  const handleSubmit = (e) => {
    e.preventDefault()
    const existingPerson = persons.filter(person => person.name.toLowerCase() === newName.toLowerCase())
    if (existingPerson.length > 0) {
      if (existingPerson[0].number !== newNumber) {
        if (confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {
          contactServices
            .update(existingPerson[0].id, { ...existingPerson[0], number: newNumber })
            .then(updated => persons.map(person => person.id === updated.id ? updated : person))
            .then(result => setPersons(result))
            .then(() => {
              setNewName('')
              setNewNumber('')
              form.reset()
              setMessage("contact updated")
            }
            )

          return
        }
        return
      } else {
        window.alert(`${newName} is already added to the phonebook`)
        form.reset()
        return
      }
    }

    const newID = parseInt(lastId) + 1
    contactServices
      .create({ name: newName, number: newNumber, id: newID.toString() })
      .then(newperson => setPersons(persons.concat(newperson)))
      .then(() => {
        setNewName('')
        setNewNumber('')
        form.reset()
        setMessage("new contact added")
      })
  }

  const handleDelete = (id) => {
    const name = persons.filter(person => person.id === id)[0].name

    if (confirm(`confirm delete contact: ${name}`)) {
      contactServices
        .remove(id)
        .then(removed => persons.filter(person => person.id !== removed.id))
        .then(result => setPersons(result))
        .catch(error => setMessage(`${name} has been already deleted`))

      contactServices.getAll().then(all => setPersons(all))
    }
  }

  const setMessage = (message) => {
    setStatus(message)
    setTimeout(() => {
      setStatus('')
    }, 3000);
  }

  useEffect(() => {
    contactServices.getAll().then(all => setPersons(all))
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <StatusMessage message={status} />
      <Search setFilter={setFilter} />
      <AddNewContact setNewName={setNewName} setNewNumber={setNewNumber} handleSubmit={handleSubmit} />
      <DisplayContacts filteredPersons={filteredPersons} onClick={handleDelete} />
    </div>
  )
}

const Search = (props) => {
  return (
    <div>
      filter shown with: <input onChange={(e) => props.setFilter(e.target.value)} />
    </div>
  )
}

const AddNewContact = (props) => {
  return (
    <>
      <h2>Add a new</h2>
      <form>
        <div>
          name: <input onChange={(e) => { props.setNewName(e.target.value) }} />
        </div>
        <div>
          number: <input onChange={(e) => { props.setNewNumber(e.target.value) }} />
        </div>
        <div>
          <button type="submit" onClick={props.handleSubmit}>add</button>
        </div>
      </form>
    </>
  )
}

const DisplayContacts = (props) => {
  return (
    <>
      <h2>Numbers</h2>
      {props.filteredPersons.map(person => <div key={person.id}>{person.name} {person.number} <button onClick={() => props.onClick(person.id)}>Delete</button></div>)}
    </>
  )
}

const StatusMessage = (props) => {
  if (props.message) {
    return (
      <>
        <div className='status'>{props.message ? props.message : null}</div>
      </>
    )
  }
}


export default App