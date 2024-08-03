import React, { useState, useEffect, ChangeEvent } from 'react';
import { getToDoItems, addToDoItem, updateToDoItem, deleteToDoItem, ToDoItem } from './services/api';
import './App.css';
import { error } from 'console';

function App() {
  const [items, setItems] = useState<ToDoItem[]>([]);
  const [newItem, setNewItem] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const fetchItems = async () => {
    try {
      const data = await getToDoItems();
      setItems(data);
    } catch (error) {
      console.error('Error fetching to-do items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async () => {
    if (newItem.trim() === '' || description.trim() === '') return;

    const item: ToDoItem = {
      partitionKey: 'ToDoItems',
      rowKey: Date.now().toString(),
      taskName:newItem,
      description: description,
      status: 'active',
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
      eTag: '',
      timestamp: new Date().toISOString(),
    };

    await addToDoItem(item);
    setNewItem('');
    setDescription('');
    fetchItems();
  };

  const handleToggleStatus = async (item: ToDoItem) => {
    const updatedItem: ToDoItem = {
      ...item,
      status: item.status === 'active' ? 'completed' : 'active',
      modifiedDate: new Date().toISOString(),
    };

    await updateToDoItem(item.partitionKey, item.rowKey, updatedItem);
    fetchItems();
  };

  const handleDeleteItem = async (partitionKey: string, rowKey: string) => {
    const item = items.find((i) => i.partitionKey === partitionKey && i.rowKey === rowKey);
    if (item?.status !== 'completed') {
      alert('You can only delete checked tasks.');
      return;
    }
    await deleteToDoItem(partitionKey, rowKey);
    fetchItems();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewItem(e.target.value);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  return (
    <div className="App">
      <h1>ToDo List</h1>
      <form>
        <input
          type="text"
          value={newItem}
          onChange={handleChange}
          placeholder="Task Name"
        />
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Description"
        />
        <button type="button" onClick={handleAddItem}>Add Task</button>
      </form>
      <div className="task-list">
        {items.map((item) => (
          <div key={item.rowKey} className={`task-item ${item.status === 'completed' ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={item.status === 'completed'}
              onChange={() => handleToggleStatus(item)}
            />
            <h4>{item.taskName}</h4>
            <p>
              {item.description}
            </p>
            <button onClick={() => handleDeleteItem(item.partitionKey, item.rowKey)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
