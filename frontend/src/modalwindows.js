import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import CreditCardInformation from './CreditCards';

// 로그인 폼 컴포넌트
class SingInForm extends React.Component {
    constructor(props) {
        super(props);
        // 사용자가 데이터를 입력하면 호출되는 함수
        this.handleChange = this.handleChange.bind(this);
        // 폼을 제출하면 호출되는 함수
        this.handleSubmit = this.handleSubmit.bind(this);
        // 로그인 실패시 errormessage 필드에 메시지를 저장한다.        
        this.state = {
            errormessage: ''
        }
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(JSON.stringify(this.state));
    }


    render() {
        // 에러 메시지
        let message = null;
        // state에 에러 메시지가 있다면 출력
        if (this.state.errormessage.length !== 0) {
            message = <h5 className="mb-4 text-danger">{this.state.errormessage}</h5>;

        }
        return (
            <div>
                {message}
                <form onSubmit={this.handleSubmit}>
                    <h5 className="mb-4">Basic Info</h5>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input name="email" type="email" className="form-control" id="email"  onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="pass">Password:</label>
                        <input name="password" type="password" className="form-control" id="pass" onChange={this.handleChange} />
                    </div>
                    <div className="form-row text-center">
                        <div className="col-12 mt-2">
                            <button type="submit" className="btn btn-success btn-large">Sign In</button>
                        </div>
                        <div className="col-12 mt-2">
                            <button type="submit" className="btn btn-link text-info" onClick={() => this.props.handleNewUser()}> New User? Register</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

}

// 가입 폼 컴포넌트
class RegistrationForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        // 로그인 실패시 errormessage 필드에 메시지를 저장한다.
        this.state = {
            errormessage: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        event.preventDefault();
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state);
    }

    render() {
        let message = null;
        if (this.state.errormessage.length !== 0) {
            message = <h5 className="mb-4 text-danger">{this.state.errormessage}</h5>;

        }
        return (
            <div>
                {message}
                <form onSubmit={this.handleSubmit}>
                    <h5 className="mb-4">Registration</h5>
                    <div className="form-group">
                        <label htmlFor="username">User Name:</label>
                        <input id="username" name='username' className="form-control" placeholder='Jongmin Han' type='text'  onChange={this.handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" name='email' className="form-control" id="email"  onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="pass">Password:</label>
                        <input type="password" name='pass1' className="form-control" id="pass1"  onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="pass">Confirm password:</label>
                        <input type="password" name='pass2' className="form-control" id="pass2"  onChange={this.handleChange} />
                    </div>
                    <div className="form-row text-center">
                        <div className="col-12 mt-2">
                            <button type="submit" className="btn btn-success btn-large">Register</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

// 로그인 폼을 포함하는 부모 모달 윈도우
export class SignInModalWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showRegistrationForm: false
        };
        this.handleNewUser = this.handleNewUser.bind(this);
    }

    handleNewUser() {
        this.setState({
            showRegistrationForm: true
        });
    }



    render() {
        // state 객체의 값에 따라 SignInForm이나 RegistrationForm 컴포넌트를 모달 윈도우에 추가한다.
        let modalBody = <SingInForm handleNewUser={this.handleNewUser} />
        if (this.state.showRegistrationForm === true) {
            modalBody = <RegistrationForm />
        }
        return (
            <Modal id="register" tabIndex="-1" role="dialog" isOpen={this.props.showModal} toggle={this.props.toggle}>
            <div role="document">
                <ModalHeader toggle={this.props.toggle} className="bg-success text-white">
                    Sign in
                    {/*<button className="close">
                        <span aria-hidden="true">&times;</span>
                     </button>*/}
                </ModalHeader>
                <ModalBody>
                    {modalBody}
                </ModalBody>
            </div>
        </Modal>
        );
    }
}

export function BuyModalWindow(props) {
    return (
        <Modal id="buy" tabIndex="-1" role="dialog" isOpen={props.showModal} toggle={props.toggle}>
        <div role="document">
                <ModalHeader toggle={props.toggle} className="bg-success text-white">
                    Buy Item
                </ModalHeader>
                {/* 신용카드 결제 폼 */}
                <ModalBody>
                    <CreditCardInformation user={props.user} seperator={false} show={true} productid={props.productid} price={props.price} operation="Charge" toggle={props.toggle} />
                </ModalBody>
            </div>
        </Modal>
    );
} 