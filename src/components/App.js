import React, { Component } from 'react';
import { Module } from 'react-router-server';
import { Switch, Route, Redirect, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import NoMatch from './NoMatch';
import '../styles/app.css';
import { CSSTransitionGroup } from 'react-transition-group'

const TransitionRoute = ({ path: path, module: importedModule, ...rest }) => (
  <Route {...rest} render={matchProps => (
     <Module key={path} module={importedModule}>
                      {module => module ? 
                      <CSSTransitionGroup
                          transitionName="fadeInOut"
                          transitionLeave={false}
                          transitionEnter={false}
                          transitionAppear={true}
                          transitionAppearTimeout={1200}
                        >
                        <module.default {...matchProps}/>
                      </CSSTransitionGroup> 

                      : <h1>Loading...</h1>
                    }
    </Module>

  )}/>
)


//decorator to pass the router props to the Switch
@withRouter
export default class App extends Component {
  render() {
    return (
      <div className="flex-container">
        <nav>
          <ul>
            <li className={this.props.location.pathname === "/" ? 'active' : null}><Link to="/">Home</Link></li>
            <li className={this.props.location.pathname === "/about" ? 'active' : null}><Link to="/about">About</Link></li>
            <li className={this.props.location.pathname === "/work" ? 'active' : null}><Link to="/work">Work</Link></li>
            <li className={this.props.location.pathname === "/contact" ? 'active' : null}><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>

        <div className="content">
          <div className="container">
           <CSSTransitionGroup
              transitionName="fadeInOut"
              transitionEnterTimeout={1200}
              transitionLeaveTimeout={600}
              transitionAppear={true}
              transitionAppearTimeout={1200}
            >
              <Switch       
                key={this.props.location.pathname}
                location={this.props.location}
              >
                <TransitionRoute exact path="/" module={() => System.import('./Home')}/>
                <TransitionRoute exact path="/about" module={() => System.import('./About')}/>
                <TransitionRoute exact path="/work" module={() => System.import('./Work')}/>

            
                <Route component={NoMatch}/>
              </Switch>
            </CSSTransitionGroup>
          </div>
        </div>
      </div>
    )
  }
}