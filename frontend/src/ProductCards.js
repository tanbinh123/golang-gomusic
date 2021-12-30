import React from 'react';

// 개별 상품을 나타내는 Card 컴포넌트
class Card extends React.Component {
    render() {
        // Price 색을 지정할 수 있는 priceColor 변수 추가. 이 변수는 props의 promo 필드를 참고. promo 값이 true이면 빨간색,  false이면 검은색
        const priceColor = (this.props.promo)? "text-danger" : "text-dark";
        const sellPrice = (this.props.promo)?this.props.promotion:this.props.price
        return (
            <div className="col-md-6 col-lg-4 d-flex align-items-stretch">
                <div className="card mb-3">
                    <img className="card-img-top" src={this.props.img} alt={this.props.imgalt} />
                    <div className="card-body">
                        <h4 className="card-title">{this.props.productname}</h4>
                        Price: <strong className={priceColor}>{sellPrice}</strong>
                        <p className="card-text">{this.props.desc}</p>
                        {/* 
                        btn-success 클래스를 사용해 Buy 버튼을 초록색으로 변경 
                        Buy 버튼을 클릭하면 ShowBuyModal()를 호출하고 모달 윈도우를 출력
                        */}
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

    // 외부 소스에서 전달 받은 데이터로 초기화하는 로직은 아래에 넣는게 좋다.
    // 데이터를 읽고 state 객체에 저장
    componentDidMount() {
        // fetch() 메서드를 호출한 후 this.props.location에 저장된 값이 나타내는 파일에서 데이터를 읽는다.
        // 메인 상품 페이지면 location → cards.json, 프로모션 페이지 → promos.json
        // 읽은 데이터는 CardContainer 컴포넌트의 state객체에 저장한다.
        fetch(this.props.location)
            .then(res => res.json())
            .then((result) => {
                this.setState({
                    cards: result
                });
            });
    }

    render() {
        // 컴포넌트 state 객체에 저장된 상품 카드 정보를 Card 컴포넌트의 속성으로 전달한다
        const cards = this.state.cards;
        let items = cards.map(
            card => <Card  key={card.ID} {...card} promo={this.props.promo} showBuyModal={this.props.showBuyModal} />
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
