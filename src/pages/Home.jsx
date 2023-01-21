import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tweet from "../components/Tweet";
import "./Home.css"

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    if (sessionStorage.token === undefined) {
      navigate("/login")
    }
  }, [navigate]
  )
  const [state, setState] = useState({firstTime: true, tweets: []});

  const config = {
    method: "get",
    url: "http://0.0.0.0/",
    headers: { "Authorization": "Token " + sessionStorage.token }
  };

  if (state.firstTime) {
    axios(config)
      .then((response) => {
        setState({firstTime: false, tweets: response.data})
      })
      .catch(error => console.log(error));
  }

  return (
    <main>
      <div>
        {state.tweets.map((tweet, index) => (<Tweet key={index} tweet={tweet} />))}
      </div>
    </main>
  );
}