import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState({
    title: "",
    developer: "",
    year: "",
    poster: "",
  });
  const [selectedGame, setSelectedGame] = useState(null);
  const [updateGame, setUpdateGame] = useState({
    title: "",
    developer: "",
    year: "",
    poster: "",
  });

  useEffect(() => {
    fetch("http://localhost:3000/games")
      .then((response) => response.json())
      .then((data) => {
        setGames(data);
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
      });
  }, [games]);

  const handleAddGame = () => {
    fetch("http://localhost:3000/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newGame),
    })
      .then((response) => response.json())
      .then((data) => {
        setGames([...games, data]);
        setNewGame({ title: "", developer: "", year: "", poster: "" });
      })
      .catch((error) => {
        console.error("Error al agregar el juego:", error);
      });
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredGames = games.filter(
    (game) =>
      game &&
      game.title &&
      game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteGame = (id) => {
    fetch(`http://localhost:3000/games/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setGames(games.filter((game) => game.id !== id));
      })
      .catch((error) => {
        console.error("Error al eliminar el juego:", error);
      });
  };

  const handleUpdateGame = (id) => {
    const updatedGame = games.find((game) => game.id === id);
    if (updatedGame) {
      setUpdateGame({ ...updatedGame });
      setSelectedGame(id);
    }
  };

  const handleSaveUpdate = () => {
    fetch(`http://localhost:3000/games/${selectedGame}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateGame),
    })
      .then(() => {
        const updatedGames = games.map((game) =>
          game.id === selectedGame ? updateGame : game
        );
        setGames(updatedGames);
        setUpdateGame({ title: "", developer: "", year: "", poster: "" });
        setSelectedGame(null);
      })
      .catch((error) => {
        console.error("Error al actualizar el juego:", error);
      });
  };

  const handleCancelUpdate = () => {
    setUpdateGame({ title: "", developer: "", year: "", poster: "" });
    setSelectedGame(null);
  };

  return (
    <div>
      <div className="searchBar">
        <label className="input-container">
          <p>Buscar por título:</p>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>
      <div className="gameCard">
        <h2>Agregar Juego</h2>
        <form className="input-container">
          <label>
            Título:
            <input
              type="text"
              value={newGame.title}
              onChange={(e) =>
                setNewGame({ ...newGame, title: e.target.value })
              }
            />
          </label>
          <label>
            Desarrollador:
            <input
              type="text"
              value={newGame.developer}
              onChange={(e) =>
                setNewGame({ ...newGame, developer: e.target.value })
              }
            />
          </label>
          <label>
            Year:
            <input
              type="int"
              value={newGame.year}
              onChange={(e) => setNewGame({ ...newGame, year: e.target.value })}
            />
          </label>
          <label>
            Poster URL:
            <input
              type="url"
              value={newGame.poster}
              onChange={(e) =>
                setNewGame({ ...newGame, poster: e.target.value })
              }
            />
          </label>
          <button
            className="agregarButton"
            type="button"
            onClick={handleAddGame}
          >
            Agregar Juego
          </button>
        </form>
      </div>
      <ul>
        {filteredGames.map((game) => (
          <li key={game.id}>
            {selectedGame === game.id ? (
              <>
                <div className="edit-form">
                  <label>
                    Título:
                    <input
                      type="text"
                      value={updateGame.title}
                      onChange={(e) =>
                        setUpdateGame({ ...updateGame, title: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Desarrollador:
                    <input
                      type="text"
                      value={updateGame.developer}
                      onChange={(e) =>
                        setUpdateGame({
                          ...updateGame,
                          developer: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    Year:
                    <input
                      type="int"
                      value={updateGame.year}
                      onChange={(e) =>
                        setUpdateGame({ ...updateGame, year: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Poster URL:
                    <input
                      type="url"
                      value={updateGame.poster}
                      onChange={(e) =>
                        setUpdateGame({ ...updateGame, poster: e.target.value })
                      }
                    />
                  </label>
                  <div className="buttonContainer">
                    <button type="button" onClick={handleSaveUpdate}>
                      Guardar
                    </button>
                    <button type="button" onClick={handleCancelUpdate}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="gameCard">
                  <div className="contenedorImagen">
                    <img src={game.poster} alt={`${game.title} Poster`} />
                  </div>
                  <div>
                    <p>{game.title}</p>
                    <p>{game.developer}</p>
                    <p>{game.year}</p>
                  </div>
                  <div className="buttonContainer">
                    <button onClick={() => handleDeleteGame(game.id)}>
                      Eliminar
                    </button>
                    <button onClick={() => handleUpdateGame(game.id)}>
                      Actualizar
                    </button>
                  </div>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
