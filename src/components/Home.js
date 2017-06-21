import React, { Component, PropTypes } from 'react';
import { fetchState } from 'react-router-server';
import 'fetch-everywhere';
import '../styles/home.css';
import twttr from 'twitter-text';

const baseUrl = 'http://localhost:3000';

const Tweet = (props) => (

  
  <div className="tweet-item">
    <p dangerouslySetInnerHTML={{__html: props.tweet}}></p>
  </div>
);

@fetchState(
  state => ({
    isLoaded: state.tweets,
    message: state.message,
    tweets: state.tweets,
  }),
  actions => ({ done: actions.done })
)
class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      message: ''
    }
    this.fetchAsync = this.fetchAsync.bind(this);
  }

  componentWillMount() {
    if (!this.props.isLoaded) {

      this.fetchAsync()
      .then(data => {this.props.done({
          tweets: data,
          message: 'we\'re loaded.'
        })
        }
      )
      .catch(error => {this.props.done({
          message: 'we broke it.'
        });
      console.log(error);
    })

    }
  }
  async fetchAsync() {
    // fetch twitter timeline
    // wait for promise to be resolved
    // only proceed once second promise is resolved
    const tweets = await (
      await fetch(`${baseUrl}/api/latest-tweets`)).json();

    return tweets;
  }

  render() {
    const { message, tweets } = this.props;
    return (
      <div className="home component">
        <div className="text-box">
          {message}
          <h1 className="title">Hi, I'm<br/><span>Ren.</span></h1>
          <h2>here are some tweets</h2>
          {tweets && tweets.map((tweet, i) =>(
          
            <Tweet key={i} tweet={twttr.autoLink(twttr.htmlEscape(tweet.text, tweet.urls))}/>
            ))}
        </div>
      </div>
    );
  }
}

export default Home;
