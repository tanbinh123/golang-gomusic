// 지금까지 정의한 모든 컴포넌트 임포트
import React from 'react';
import CardContainer from './ProductCards';
import Nav from './Navigation';
import { SignInModalWindow, BuyModalWindow } from './modalwindows';
import About from './About';
import Orders from './orders';
// react-router-dom 패키지에서 필요한 컴포넌트 임포트
import { BrowserRouter as Router, Route} from "react-router-dom";
import cookie from 'js-cookie';




class App extends React.Component {

  constructor(props) {
    super(props);
    const user = cookie.getJSON("user") || {loggedin:false};
    this.state = {
      user: user,
      showSignInModal: false,
      showBuyModal: false
    };
    this.handleSignedIn = this.handleSignedIn.bind(this);
    this.handleSignedOut = this.handleSignedOut.bind(this);
    this.showSignInModalWindow = this.showSignInModalWindow.bind(this);
    this.showBuyModalWindow = this.showBuyModalWindow.bind(this);
    this.toggleSignInModalWindow = this.toggleSignInModalWindow.bind(this);
    this.toggleBuyModalWindow = this.toggleBuyModalWindow.bind(this);
  }

  handleSignedIn(user) {
    this.setState({
      user: user
    });
  }

  // 사용자가 로그아웃 했을 경우 쿠키에 해당 정보를 반영하여 사용자가 없음을 나타낸다
  handleSignedOut(){
    console.log("Call app signed out...");
    const state = this.state;
    const newState = Object.assign({},state,{user:{loggedin:false}});
    this.setState(newState);
    cookie.set("user",{loggedin:false});
  }

  // 구매와 로그인 모달 윈도우를 표시하는 Show 메서드
  showSignInModalWindow(){
    const state = this.state;
    const newState = Object.assign({},state,{showSignInModal:true});
    this.setState(newState);
  }

  showBuyModalWindow(id,price){
    const state = this.state;
    const newState = Object.assign({},state,{showBuyModal:true,productid:id,price:price});
    this.setState(newState);
  }

  // 로그인과 구매 모달 윈도우의 toggle 메서드는 모달 윈도우의 출력 상태를 전환한다. 
  // 따라서 모달 윈도우의 출력 여부를 나타내는 state 객체의 불리언 필드 값을 반전시키면 된다.

  toggleSignInModalWindow() {
    const state = this.state;
    const newState = Object.assign({},state,{showSignInModal:!state.showSignInModal});
    this.setState(newState);
  }

  toggleBuyModalWindow(){
    const state = this.state;
    const newState = Object.assign({},state,{showBuyModal:!state.showBuyModal});
    this.setState(newState); 
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