import React from 'react';
import CardContainer from './ProductCards';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Nav from './Navigation';
import { SignInModalWindow, BuyModalWindow } from './modalwindows';
import About from './About';
import Orders from './orders';
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
    // 새로 추가한 메서드를 사용하려면 App 컴포넌트의 생성자에서 바인드해야 한다.
    this.handleSignedIn = this.handleSignedIn.bind(this);
    this.handleSignedOut = this.handleSignedOut.bind(this);
    this.showSignInModalWindow = this.showSignInModalWindow.bind(this);
    this.toggleSignInModalWindow = this.toggleSignInModalWindow.bind(this);
    this.showBuyModalWindow = this.showBuyModalWindow.bind(this);
    this.toggleBuyModalWindow = this.toggleBuyModalWindow.bind(this);
    
  }

  handleSignedIn(user) {
    console.log("Sign in happening...");
    const state = this.state;
    const newState = Object.assign({},state,{user:user,showSignInModal:false});
    this.setState(newState);
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

  //location='user.json'
  /*
  컴포넌트에 전달할 속성이 있을 경우 render를 사용
  속성이 없다면 component를 사용
  */
  render() {
    return (
      <div>
        <Router>
          <div>
            <Nav user={this.state.user} handleSignedOut={this.handleSignedOut} showModalWindow={this.showSignInModalWindow}/>
            <div className='container pt-4 mt-4'>
              <Route exact path="/" render={() => <CardContainer location='/products' showBuyModal={this.showBuyModalWindow}/>} />
              <Route path="/promos" render={() => <CardContainer location='/promos' promo={true} showBuyModal={this.showBuyModalWindow}/>} />
              {this.state.user.loggedin ? <Route path="/myorders" render={()=><Orders location={'/user/'+this.state.user.ID+'/orders'}/>}/> : null}
              <Route path="/about" component={About} />
            </div>
            {/* 각 모달 윈도우가 자신의 출력 여부를 알아야 하기 때문에 state.showSignInModal과 state.showBuyModal 플래그도 함께 넘긴다. */}
            <SignInModalWindow handleSignedIn={this.handleSignedIn} showModal={this.state.showSignInModal} toggle={this.toggleSignInModalWindow} />
            <BuyModalWindow showModal={this.state.showBuyModal} toggle={this.toggleBuyModalWindow} user={this.state.user.ID} productid={this.state.productid} price={this.state.price}/>
          </div>
        </Router>
      </div>
    );
  }
}

// 모든 컴포넌트의 진입점이기 때문에 아래 코드 추가
export default App;
