import React from 'react';

// 개별 상품을 나타내는 Card 컴포넌트
class Card extends React.Component {
    render() {
        const priceColor = (this.props.promo)? "text-danger" : "text-dark";
        const sellPrice = (this.props.promo)?this.props.promotion:this.props.price;
        return (
            <div className="col-md-6 col-lg-4 d-flex align-items-stretch">
                <div className="card mb-3">
                    <img className="card-img-top" src={this.props.img} alt={this.props.imgalt} />
                    <div className="card-body">
                        <h4 className="card-title">{this.props.productname}</h4>
                        Price: <strong className={priceColor}>{sellPrice}</strong>
                        <p className="card-text">{this.props.desc}</p>
                        <a className="btn btn-success text-white" onClick={()=>{this.props.showBuyModal(this.props.ID,sellPrice)}}>Buy</a>
                    </div>
                </div>
            </div>
        );
    }
}

// 상품 목록 전체를 나타내는 컴포넌트
export default class CardContainer extends React.Component {
    constructor(props) {
        // 부모 컴포넌트로 props 전달
        super(props);
        // 컴포넌트의 state 객체 초기화
        this.state = {
            cards: []
        };
    }

    componentDidMount() {
        fetch(this.props.location)
            .then(res => res.json())
            .then((result) => {
                this.setState({
                    cards: result
                });
            });
    }

    render() {
        const cards = this.state.cards;
        let items = cards.map(
            card => <Card key={card.id} {...card} promo={this.props.promo} showBuyModal={this.props.showBuyModal}/>
        );
        return (
            <div>
                <div className="mt-5 row">
                    {items}
                </div>
            </div>
        );
    }
}