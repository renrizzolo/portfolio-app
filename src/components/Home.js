import React, { Component, PropTypes } from 'react';
import { fetchState } from 'react-router-server';
import 'fetch-everywhere';
import '../styles/home.css';
import twttr from 'twitter-text';
import { CSSTransitionGroup } from 'react-transition-group'

const baseUrl = 'http://localhost:3000';

const Tweet = (props) => (

    <div className={`${props.index}-id tweet-item`}>
      <div className="tweet-item__image"><img src={props.profile}/></div>
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
          message: 'Error loading.'
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
      <div className="home component flex-container__row">
        <div className="flex-100">
          <h1 className="title">Hi, I'm <span className="stroke-single">Ren</span></h1>
        </div>
        <div className="flex-item text-box">
          <h2>here are some tweets</h2>
          <p>{message}</p>
          {tweets && tweets.map((tweet, i) =>(
            <Tweet key={i} index={i} profile={tweet.user.profile_image_url_https} tweet={twttr.autoLink(twttr.htmlEscape(tweet.text, tweet.urls))}/>
            ))}
        </div>
        <div className="flex-item flex-container__column">
          <div className="flex-item text-box">
            <h2>And an empty box</h2>
          </div>
          <div className="flex-item text-box">
            <h2>And an empty box</h2>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
