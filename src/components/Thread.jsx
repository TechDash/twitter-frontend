import axios from 'axios';
import React, { useState } from 'react';
import { RiHeartLine, RiHeartFill, RiMessageLine } from 'react-icons/ri';
import { useLocation } from 'react-router-dom';
import "./Thread.css";
import Content from './Content.jsx';
import { compare, contentAge } from '../Utils';

export default function Thread() {
  const location = useLocation();
  const tweet = location.state.data;
  const [commentCount, setCommentCount] = useState(tweet.comment_count);
  const [state, setState] = useState({ firstTime: true, comments: [] });
   function getData() {
    const config = {
      method: "get",
      url: "http://0.0.0.0/comment/" + tweet.id,
      headers: {
        Authorization: "Token " + sessionStorage.token
      }
    };

    axios(config)
      .then((response) => {
        const comments = response.data.sort(compare)
        comments.forEach(contentAge)
        setState({ firstTime: false, comments: comments })
      })
      .catch(error => console.log(error));
   }
  if (state.firstTime) {
    getData();
  }

  const tx = document.getElementsByTagName("textarea");
  for (let i = 0; i < tx.length; i++) {
    tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
    tx[i].addEventListener("input", OnInput, false);
  }

  function OnInput() {
    this.style.height = 0;
    this.style.height = (this.scrollHeight) + "px";
  }

  function reply() {
    const reply = document.getElementById("newComment").value;
    if (reply.length > 0) {
      const config = {
        method: "post",
        url: "http://0.0.0.0/comment/" + tweet.id,
        data: {body: reply},
        headers: { Authorization: "Token " + sessionStorage.token }
      }

      axios(config).then((response) => {
        document.getElementById("newComment").value = "";
        getData();
        setCommentCount(commentCount + 1)
      })
        .catch(error => console.log(error));
    }
    else {
      alert("Comment can't be empty")
    }
  }

  return (
    <div className={"wrapper"}>
      <div id={"selectedTweet"}>
        <b className={"username"}>{tweet.author}</b>
        <div className={"body"}>{tweet.body}</div>
        <div className={"actions"}>
          <div className={"actionsContent"}>
            {tweet.liked_by_user ? <RiHeartFill size={"20px"} color={"red"} /> :
              <RiHeartLine size={"20px"} color={"gray"} />}
            <div>{tweet.likes_count}</div>
          </div>
          <div className={"actionsContent"}>
            <RiMessageLine size={"20px"} color={"gray"} />
            <div>{commentCount}</div>
          </div>
        </div>
        <div className={"createComment"}>
          <textarea id={"newComment"} type="text" placeholder={"Tweet your reply"} defaultValue={""} />
          <button id={"replyButton"} type={"button"}  onClick={reply}>
            Reply
          </button>
        </div>
        <div>
          {state.comments.map((comment, i) => (<Content data={comment} key={i} />))}
        </div>
      </div>
    </div>
  );
}