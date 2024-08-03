import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:44300/api/todo', 
});
console.log("API Base URL: ", process.env.REACT_APP_API_BASE_URL);
export interface ToDoItem {
    partitionKey: string;
    rowKey: string;
    taskName:string;
    description: string;
    status: string;
    createdDate: string;
    modifiedDate: string;
    eTag: string;
    timestamp: string;
}

export const getToDoItems = async (): Promise<ToDoItem[]> => {
  const response = await api.get('/GetToDoItems');
  return response.data;
};

export const addToDoItem = async (item: ToDoItem): Promise<ToDoItem> => {
  const response = await api.post('/PostToDoItem', item);
  return response.data;
};

export const updateToDoItem = async (partitionKey: string, rowKey: string, item: ToDoItem): Promise<ToDoItem> => {
  const response = await api.put(`/PutToDoItem/${partitionKey}/${rowKey}`, item);
  return response.data;
};

export const deleteToDoItem = async (partitionKey: string, rowKey: string): Promise<void> => {
  await api.delete(`/DeleteToDoItem/${partitionKey}/${rowKey}`);
};