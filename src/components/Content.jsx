import axios from "axios";
import { useState } from "react";
import { RiHeartFill, RiHeartLine, RiMessageLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "./Content.css";

export default function Content(props) {
  const [state, setState] = useState({
    likedByUser: props.data.liked_by_user,
    likesCount: props.data.likes_count
  });
  const navigate = useNavigate()

  function like() {
    let config = {};

    if (props.tweet) {
      const data = new FormData();
      data.append("pk", props.data.id)
      config = {
        method: "put",
        url: "http://0.0.0.0",
        headers: {
          Authorization: "Token " + sessionStorage.token
        },
        data: data
      };
    }
    else {
      config = {
        method: "put",
        url: "http://0.0.0.0/comment/" + props.data.id,
        headers: {
          Authorization: "Token " + sessionStorage.token
        }
      }
    }

    axios(config).then(
      (response) => {
        if (state.likedByUser) {
          setState({ likedByUser: false, likesCount: state.likesCount - 1 })
        }
        else {
          setState({ likedByUser: true, likesCount: state.likesCount + 1 })
        }
        console.log(response);
      })
      .catch(
        (error) => {
          console.log(error);
        });
  }

  function redirect() {
    navigate("tweet", { state: props })
  }

  return (
    <div className={"content"}>
      <b className={"username"}>{props.data.author}</b>
      <div className={"body"} onClick={redirect}>{props.data.body}</div>
      <div id={"actions"}>
        <div className={"likes"} onClick={like}>
          {state.likedByUser ? <RiHeartFill size={"20px"} color={"red"} />
            : <RiHeartLine size={"20px"} color={"gray"} />}
          <div>{state.likesCount}</div>
        </div>
        <div>
          <div className={"comments"}>
            <RiMessageLine size={"20px"} color={"gray"} />
            <div>{props.data.comment_count}</div>
          </div>
        </div>
      </div>
    </div>
  );
}