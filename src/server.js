import React from 'react';
import App from '../build/server/app';
import { renderToString, extractModules } from 'react-router-server';
import { StaticRouter } from 'react-router';
import express from 'express';
import path from 'path';
import stats from '../build/public/stats.json';
import Twitter from 'twitter';
const app = express();
require('dotenv').config();

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
const params = {screen_name: 'ren_riz'};

async function fetchAsync(){
    // fetch twitter timeline
    // wait for promise to be resolved
    // only proceed once second promise is resolved
    //https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=ren_riz&count=5
  const data = await client.get('statuses/user_timeline', params);

  return data;
    // const data = await (
    //   await fetch('https://jsonplaceholder.typicode.com/posts/1')).json();
    //   return data;
}

app.use(express.static(path.join(__dirname, '..', 'build', 'public')));

//const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';
const baseUrl = 'localhost:3000';
app.get('/api/latest-tweets', (req, res) => {
        fetchAsync()
        .then(data => {
          res.json(data);                                    
          //console.log(data);
        }
      )
      .catch(error =>  {  
        console.log(error); 
        res.status(500).send();
      });


});

app.get('/*', function (req, res) {
  if (req.url) {
    const context = {};
    const server = (
      <StaticRouter
        location={req.url}
        context={context}
      >
        <App/>
      </StaticRouter>
    );

    renderToString(server)
      .then(({ html, state, modules }) => {
        if (context.url) {
          console.log(context.url);

          res.writeHead(302, {
            Location: context.url
          })
          res.end()
        } else {
          const extracted = extractModules(modules, stats);

          res.render(
            path.join(__dirname, '..', 'index.ejs'),
            {
              html,
              state,
              files: [].concat.apply([], extracted.map(module => module.files)),
              modules: extracted
            }
          );
        }
      })
      .catch(err => console.error(err));
  }
});

app.listen(3000, function () {
  console.log('listening on 3000');
});
