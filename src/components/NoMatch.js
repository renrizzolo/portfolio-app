import React, { Component } from 'react';
import '../styles/no-match.css';
import '../styles/monokai.css';
import prismjs from 'prismjs';

class NoMatch extends Component {
componentWillMount() {
	//check we're (probably) in the browser
		if (typeof window !== 'undefined') {
			console.log('%c404 %cis the magic number.', 'color: purple; font-size:18px;', 'color: grey; font-size:18px;');
		}
	}

render() {
		return(
		<div>
			<pre>
				<code className="language-javascript">
{`const NoMatch = (props) => (
	<h1>No match found for \"${this.props.location.pathname}\"</h1>
);`}
				</code>
			</pre>
		</div>
		);
	}
}
export default NoMatch;
