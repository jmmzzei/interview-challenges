import type { Item } from "./types";

import { useEffect, useState } from "react";

import styles from "./App.module.scss";
import api from "./api";

interface Form extends HTMLFormElement {
  text: HTMLInputElement;
}

enum Status {
  Pending = "Pending",
  Loading = "Loading",
  Resolved = "Resolved",
  Rejected = "Rejected",
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [status, setStatus] = useState<Status>(Status.Pending);

  function handleToggle(id: Item["id"]) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }

  function handleAdd(event: React.ChangeEvent<Form>) {
    event.preventDefault();
    setItems((items) => [
      ...items,
      {
        id: new Date().toString(),
        text: event.target["text"].value,
        completed: false,
      },
    ]);
    event.target["text"].value = "";
  }

  function handleRemove(id: Item["id"]) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  useEffect(() => {
    setStatus(Status.Loading);
    api
      .list()
      .then((data) => {
        setStatus(Status.Resolved);
        setItems(data);
      })
      .catch((err) => {
        setStatus(Status.Rejected);
      });
  }, []);

  return (
    <main className={styles.main}>
      <h1>Supermarket list</h1>
      <form onSubmit={handleAdd}>
        <input name="text" type="text" />
        <button>Add</button>
        <List status={status}>
          {items?.map((item) => (
            <li
              key={item.id}
              className={item.completed ? styles.completed : ""}
              onClick={() => handleToggle(item.id)}
            >
              {item.text}{" "}
              <button onClick={() => handleRemove(item.id)}>[X]</button>
            </li>
          ))}
        </List>
      </form>
    </main>
  );
}

type Props = {
  status: Status;
};

export const List: React.FC<Props> = ({ children, status }) => {
  if (status == Status.Loading) return <div>Loading...</div>;

  return <ul>{children}</ul>;
};

export default App;
