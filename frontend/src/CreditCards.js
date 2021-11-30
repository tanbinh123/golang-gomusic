import React from 'react';
import { injectStripe, StripeProvider, Elements, CardElement } from 'react-stripe-elements';

const INITIALSTATE = "INITIAL", SUCCESSSTATE = "COMPLETE", FAILEDSTATE = "FAILED";

class CreditCardForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            value: '',
            status: INITIALSTATE
        };
    }

    renderCreditCardInformation() {
        const style = {
            base: {
                'fontSize': '20px',
                'color': '#495057',
                'fontFamily': 'apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif'
            }
        };
        const usersavedcard = <div>
            <div className="form-row text-center">
                <button type="button" className="btn  btn-outline-success text-center mx-auto">Use saved card?</button>
            </div>
            <hr />
        </div>

        const remembercardcheck = <div className="form-row form-check text-center">
            <input className="form-check-input" type="checkbox" value="" id="remembercardcheck" />
            <label className="form-check-label" htmlFor="remembercardcheck">
                Remember Card?
            </label>
        </div>;
        // 뷰 반환
        return (
            <div>
                {usersavedcard}
                <h5 className="mb-4">Payment Info</h5>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-row">
                        <div className="col-lg-12 form-group">
                            <label htmlFor="cc-name">Name On Card:</label>
                            <input id="cc-name" name='cc-name' className="form-control" placeholder='Name on Card' onChange={this.handleInputChange} type='text' />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-lg-12 form-group">
                            <label htmlFor="card">Card Information:</label>
                            <CardElement id="card" className="form-control" style={style} />
                        </div>
                    </div>
                    {remembercardcheck}
                    <hr className="mb-4" />
                    <button type="submit" className="btn btn-success btn-large" >{this.props.operation}</button>
                </form>
            </div>
        );
    }

    renderSuccess() {
        return (
            <div>
                <h5 className="mb-4 text-success">Request Successfull....</h5>
                <button type="submit" className="btn btn-success btn-large" data-dismiss="modal">Ok</button>
            </div>
        );
    }

    renderFailure() {
        return (
            <div>
                <h5 className="mb-4 text-danger"> Credit card information invalid, try again or exit</h5>
                {this.renderCreditCardInformation()}
            </div>
        );
    }

    async handleSubmit(event) {
        
        event.preventDefault();
        console.log("Handle submit called, with name: " + this.state.value);
        // Strip API를 통해 발급
        let { token } = await this.props.stripe.createToken({ name: this.state.value });
        if (token == null) {
            console.log("invalid token");
            this.setState({ status: FAILEDSTATE });
            return;
        }

        let response = await fetch("/charge", {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify({
                token: token.id,
                operation: this.props.operation,
            })
        });
        console.log(response.ok);
        if (response.ok) {
            console.log("Purchase Complete!");
            this.setState({ status: SUCCESSSTATE });
        }
    }


    handleInputChange(event) {
        this.setState({
            value: event.target.value
        })
    }

    render() {

        let body = null;
        switch (this.state.status) {
            case SUCCESSSTATE:
                body = this.renderSuccess();
                break;
            case FAILEDSTATE:
                body = this.renderFailure();
                break;
            default:
                body = this.renderCreditCardInformation();
        }

        return (
            <div>
                {body}
            </div>
        );
    }
}
export default function CreditCardInformation(props) {
    if(!props.show) {
        return <div/>;
    }
    // 스트라이프 API를 사용해 CreditCardForm를 추가하면 createToken() 메서드를 호출할 수 있다.
    const CCFormWithStripe = injectStripe(CreditCardForm);
    return (
        <div>
            {/*stripe provider*/}
            <StripeProvider apiKey="pk_test_51JqdjpHqNVgKzGGZFZuBvitqdRPC5iN3nwYvdinqY2n5QcfozKRxCYT3sVQVRh26opBOFXz0IvbahgPC6IL7rqWh00ADHiTRK6">
                <Elements>
                    <CCFormWithStripe operation={props.operation} />
                </Elements>
            </StripeProvider>
        </div>
    );
}

