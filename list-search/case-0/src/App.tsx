import type { Product } from "./types";

import { useEffect, useState } from "react";

import api from "./api";

enum Status {
  Pending = "pending",
  Loading = "loading",
  Resolved = "resolved",
  Rejected = "rejected",
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>("");
  const [status, setStatus] = useState<Status>(Status.Pending);

  useEffect(() => {
    setStatus(Status.Loading);
    api
      .search(query)
      .then((data) => {
        setStatus(Status.Resolved);
        setProducts(data);
      })
      .catch((err) => setStatus(Status.Rejected));
  }, [query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  if (status == Status.Loading) return <div>Loading</div>;
  if (status == Status.Rejected) return null;

  return (
    <main>
      <h1>Tienda digitaloncy</h1>
      <input name="text" placeholder="tv" type="text" onChange={handleChange} />
      <ul>
        {products.map((product) => (
          <li key={product.id} className={product.price <= 100 ? "sale" : ""}>
            <h4>{product.title}</h4>
            <p>{product.description}</p>
            <span>$ {product.price}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
