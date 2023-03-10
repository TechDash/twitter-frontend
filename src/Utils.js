import axios from "axios";

export default function getData(setState, url, type) {
  const config = {
    method: "get",
    url: url,
    headers: {
      Authorization: "Token " + sessionStorage.token
    }
  };

  axios(config)
    .then((response) => {
      if (Array.isArray(response.data) && response.data.length > 0) {
        if (type === "thread") {
          response.data[1].forEach(contentAge);
          setState({ firstTime: false, data: response.data[1], parent: response.data[0] });
        }
        else if (type === "search" || type === "profile") {
          setState({ firstTime: false, data: response.data });
        }
        else {
          response.data.forEach(contentAge);
          setState({ firstTime: false, data: response.data });
        }
      }
    })
    .catch(error => console.log(error));
}

export function contentAge(content) {
  const postedDate = new Date(content.meta.posted_date);
  const now = Date.now();
  const diffTime = Math.abs(postedDate - now);
  const diffMinutes = Math.ceil(diffTime / 60000);
  const diffHours = Math.ceil(diffTime / 3600000);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.ceil(diffDays / 30);

  if (diffMinutes <= 1) {
    content["age"] = "1 minute ago";
  }
  else if (diffMinutes < 60) {
    content["age"] = diffMinutes + " minutes ago";
  }
  else if (diffHours < 24) {
    content["age"] = diffHours + "hours ago";
  }
  else if (diffDays === 1) {
    content["age"] = "yesterday";
  }
  else if (diffDays < 30) {
    content["age"] = diffDays + "days ago";
  }
  else if (diffMonths >= 1) {
    content["age"] = diffMonths + "months ago";
  }
}

export function fetchData(url, setState, tweets) {
  const config = {
    url: url,
    method: "get",
    headers: { "Authorization": "Token " + sessionStorage.token },
  };

  axios(config)
    .then((response) => {
      if (tweets) {
        response.data.tweets.forEach(contentAge);
      }
      else {
        response.data.likes.forEach(contentAge);
      }
      sessionStorage.otherUser = response.data.profile.user;
      sessionStorage.fullName = response.data.profile.full_name;
      setState({
        firstTime: false,
        profile: response.data.profile,
        content: tweets ? response.data.tweets : response.data.likes
      });
    });
}