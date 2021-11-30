import React from 'react';
import {NavLink} from 'react-router-dom';


// 로그인하지 않은 사용자에게 표시
export default class Navigation extends React.Component{

    // 이미 로그인한 사용자에게 표시할 컴포넌트 작성
    // Welcome 드롭 다운 버튼과 로그아웃 버튼 출력
    buildLoggedInMenu(){
        return (
            <div className="navbar-brand order-1 text-whithe my-auto">
                <div className="btn-group">
                    <button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" ariaexpanded="false">
                        Welcome {this.props.user.name}
                    </button>
                    <div className="dropdown-menu">
                        <a className="btn dropdown-item" role="button">Sign Out</a>
                    </div>
                </div>
            </div>
        );
    }

    render(){
        // 메뉴를 표현하는 코드
        // 로그인하지 않은 사용자에게 표시하는 Navigation 컴포넌트
        
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-success fixed-top">
                    <div className="container">
                        {/* 로그인한 사용자에게 표시할 탐색 메뉴*/} 
                        {
                            this.props.user.loggedin ? this.buildLoggedInMenu() : <button type="button" className="navbar-brand order-1 btn btn-success"  onClick={() => { this.props.showModalWindow();}}>Sign in</button>
                        }
                        <div className="navbar-collapse" id="navbarNavAltMarkup">
                            <div className="navbar-nav">
                                <NavLink className="nav-item nav-link" to="/">Home</NavLink>
                                <NavLink className="nav-item nav-link" to="/promos">Promotions</NavLink>
                                {/*주문 내역 페이지로 이동하는 링크 추가*/} 
                                {this.props.user.loggedin ? <NavLink className="nav-item nav-link" to="/myorders">My Orders</NavLink> : null}
                                <NavLink className="nav-item nav-link" to="/about">About</NavLink>

                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}