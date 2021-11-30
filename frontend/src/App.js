// 지금까지 정의한 모든 컴포넌트 임포트
import React from 'react';
import CardContainer from './ProductCards';
import Nav from './Navigation';
import { SignInModalWindow, BuyModalWindow } from './modalwindows';
import About from './About';
import Orders from './orders';
// react-router-dom 패키지에서 필요한 컴포넌트 임포트
import { BrowserRouter as Router, Route} from "react-router-dom";



class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {
        loggedin: false,
        name: ""
      }
    };
  }

  handleSignedIn(user) {
    this.setState({
      user: user
    });
  }

  componentDidMount() {
    fetch('user.json')
      .then(res => res.json())
      .then((result) => {
        console.log('Fetch...');
        this.setState({
          user: result
        });
      });
  }

  render() {
    return (
      <div>
        <Router>
          <div>
            <Nav user={this.state.user} />
            <div className='container pt-4 mt-4'>
              <Route exact path="/" render={() => <CardContainer location='cards.json' />} />
              <Route path="/promos" render={() => <CardContainer location='promos.json' promo={true}/>} />
              {this.state.user.loggedin ? <Route path="/myorders" render={()=><Orders location='user.json'/>}/> : null}
              <Route path="/about" component={About} />
            </div>
            <SignInModalWindow />
            <BuyModalWindow />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;