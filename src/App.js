import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";

const initialRumours = [
  {
    id: 1,
    text: "Red Sox 'Can't Be Ruled Out' For Two-Time MVP Looking To Sign Soon",
    source:
      "https://www.si.com/mlb/red-sox/news/red-sox-cant-be-ruled-out-for-two-time-mvp-looking-to-sign-soon-scott7",
    category: "Baseball",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
  },
  {
    id: 2,
    text: "Premier League club want Arsenal's Aaron Ramsdale on loan with obligation to buy",
    source:
      "https://www.dailystar.co.uk/sport/football/arsenal-aaron-ramsdale-wolves-exclusive-31525972",
    category: "Soccer",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
  },
  {
    id: 3,
    text: "Devils, Islanders make minor trade",
    source:
      "https://www.yardbarker.com/nhl/articles/devils_islanders_make_minor_trade/s1_16958_39586975",
    category: "Hockey",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
  },
];

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <span style={{ fontSize: "40px" }}>{count}</span>
      <button className="btn btn-lrg" onClick={() => setCount((c) => c + 1)}>
        +1
      </button>
    </div>
  );
}

function App() {
  const [showGossipForm, setShowGossipForm] = useState(false);
  const [rumours, setRumours] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCategory] = useState("all");

  useEffect(
    function () {
      async function getRumours() {
        setIsLoading(true);

        let query = supabase.from("rumours").select("*");

        if (currentCategory !== "all")
          query = query.eq("category", currentCategory);

        const { data: rumours, error } = await query.order("votesInteresting", {
          ascending: true,
        });
        // .limit(10000000000);

        if (!error) setRumours(rumours);
        else alert("There was a problem retrieving rumours.");

        setIsLoading(false);
      }
      getRumours();
    },
    [currentCategory]
  );

  function Loader() {
    return <p className="loader">Loading...</p>;
  }

  return (
    <>
      <Header
        showGossipForm={showGossipForm}
        setShowGossipForm={setShowGossipForm}
      />
      {showGossipForm ? (
        <NewGossipForm
          setRumours={setRumours}
          setShowGossipForm={setShowGossipForm}
        />
      ) : null}

      <main className="main">
        <SportFilter setCategory={setCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <GossipList rumours={rumours} setRumours={setRumours} />
        )}
      </main>
    </>
  );
}

function Header({ showGossipForm, setShowGossipForm }) {
  return (
    <header>
      <div className="logo">
        <img src="/sportsLogo.png" alt="Mel's Sports Rumour Mill Logo" />
        <h1>
          Mel's Sports
          <br />
          Rumour Mill
        </h1>
      </div>
      <button
        className="btn btn-lrg btn-opener"
        onClick={() => setShowGossipForm((show) => !show)}
      >
        {showGossipForm ? "Close" : "Share some Sports Gossip!"}
      </button>
    </header>
  );
}

const CATEGORIES = [
  { name: "Hockey", color: "#3b82f6" },
  { name: "Soccer", color: "#16a34a" },
  { name: "Baseball", color: "#ef4444" },
  { name: "Golf", color: "#eab308" },
  { name: "Tennis", color: "#db2777" },
  { name: "Football", color: "#14b8a6" },
  { name: "Basketball", color: "#f97316" },
  { name: "Olympics", color: "#8b5cf6" },
];

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewGossipForm({ setRumours, setShowGossipForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(text, source, category);

    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      // const newGossip = {
      //   id: Math.round(Math.random() * 10000000),
      //   text,
      //   source,
      //   category,
      //   votesInteresting: 0,
      //   // votesMindblowing: 0,
      //   votesFalse: 0,
      // };
      setIsUploading(true);
      const { data: newGossip, error } = await supabase
        .from("rumours")
        .insert([
          {
            id: Math.round(Math.random() * 10000000),
            created_at: new Date(),
            text,
            source,
            category,
            votesInteresting: 0,
            votesFalse: 0,
          },
        ])
        .select();
      setIsUploading(false);
      //console.log(newGossip);

      if (!error) setRumours((rumours) => [newGossip[0], ...rumours]);
      setText("");
      setSource("");
      setCategory("");
      setShowGossipForm(false);
    }
  }

  return (
    <form className="gossipForm" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a rumour with us..."
        value={text}
        onChange={(event) => setText(event.target.value)}
        disabled={isUploading}
      />
      <span>{200 - textLength}</span>
      <input
        type="text"
        placeholder="Rumour source..."
        value={source}
        onChange={(event) => setSource(event.target.value)}
        disabled={isUploading}
      />
      <select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose a sport:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-lrg" disabled={isUploading}>
        Post Rumour
      </button>
    </form>
  );
}

function SportFilter({ setCategory }) {
  return (
    <aside>
      <ul>
        <li>
          <button className="btn btn-all" onClick={() => setCategory("all")}>
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name}>
            <button
              className="btn sportButton"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
function GossipList({ rumours, setRumours }) {
  if (rumours.length === 0) {
    return (
      <p className="loader">
        There are no rumours from this sport right now, check back later or add
        one!
      </p>
    );
  }

  return (
    <section>
      <ul className="rumoursList">
        {rumours.map((rumour) => (
          <Rumour key={rumour.id} rumour={rumour} setRumours={setRumours} />
        ))}
      </ul>
      <p>
        There are {rumours.length} sports rumours floating around here. Add some
        more!
      </p>
    </section>
  );
}

function Rumour({ rumour, setRumours }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed =
    rumour.votesInteresting + rumour.votesFalse < rumour.votesFalse;

  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedRumour, error } = await supabase
      .from("rumours")
      .update({ [columnName]: rumour[columnName] + 1 })
      .eq("id", rumour.id)
      .select();
    setIsUpdating(false);
    console.log(updatedRumour);
    if (!error)
      setRumours((rumours) =>
        rumours.map((r) => (r.id === rumour.id ? updatedRumour[0] : r))
      );
  }

  return (
    <li className="rumourContainer">
      <p className="rumour">
        {isDisputed ? <span className="disputed">[⛔ DISPUTED!]</span> : null}
        {rumour.text}
        <a
          className="sourceLink"
          href={rumour.source}
          target="_blank"
          rel="noreferrer"
        >
          (Source)
        </a>
      </p>
      <span
        className="sportTag"
        style={{
          backgroundColor: CATEGORIES.find(
            (cat) => cat.name === rumour.category
          ).color,
        }}
      >
        {rumour.category}
      </span>
      <div className="vote_buttons">
        <button
          onClick={() => handleVote("votesInteresting")}
          disabled={isUpdating}
        >
          <span className="btn-icon">👍</span>
          <strong>{rumour.votesInteresting}</strong>
        </button>
        {/* <button>
          <span className="btn-icon">🤯</span>
          <strong>{rumour.votesMindblowing}</strong>
        </button> */}
        <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>
          <span className="btn-icon">👎</span>
          <strong>{rumour.votesFalse}</strong>
        </button>
      </div>
    </li>
  );
}

export default App;
