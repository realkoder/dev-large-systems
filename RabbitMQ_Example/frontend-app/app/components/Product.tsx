export const Product = () => {

  const contactBackend = () => {
    console.log("FETCH");
    fetch("http://localhost:8080").then((res) => res.json()).then(json => console.log("JSON", json));
  };

  return (
    <div className="m-4">
      <button type="button" className="border-amber-400 border-4 p-4" onClick={contactBackend}>
        IM A PRODUCT
      </button>
    </div>
  );
};
