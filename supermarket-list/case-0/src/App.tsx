import type { Item } from "./types";

import { useRef, useEffect, useState } from "react";

import styles from "./App.module.scss";
import api from "./api";

//it also could be done with an autoFocus
function App() {
  const [items, setItems] = useState<Item[] | null>(null);

  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
    api.list().then(setItems);
  }, []);

  const handleDelete = (id) => {
    setItems((items) => items?.filter((item) => item.id != id));
  };

  return (
    <main className={styles.main}>
      <h1>Supermarket list</h1>
      <form>
        <input ref={ref} name="text" type="text" />
        <button>Add</button>
      </form>
      <ul>
        {items?.map((item) => (
          <li key={item.id} className={item.completed ? styles.completed : ""}>
            {item.text}{" "}
            <button onClick={() => handleDelete(item.id)}>[X]</button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
