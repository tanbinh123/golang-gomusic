package rest

import (
	"github.com/gin-gonic/gin"
)

func RunAPI(address string) error {
	h, err := NewHandler()
	if err != nil {
		return err
	}
	return RunAPIWithHandler(address, h)
}

func RunAPIWithHandler(address string, h HandlerInterface) error {

	// Gin 엔진
	r := gin.Default()

	// 핸들러 생성
	// h, _ := NewHandler()

	// 1. 백엔드는 GET 요청에 상품 목록으로 응답
	// 상품 목록
	// 클라이언트에게 상품 목록 반환
	r.GET("/products", h.GetProducts)

	// 2. 백엔드는 GET 요청에 프로모션 목록으로 응답
	// 프로모션 목록
	// 클라이언트에게 프로모션 목록 반환
	r.GET("/promos", h.GetPromos)

	/***  /user/와 /users로 시작하는 라우팅은 리팩토링할 수 있다.
	// 3. 프론트엔드는 POST 메서드를 통해 로그인 또는 사용자 추가를 요청
	// 사용자 로그인 POST 요청
	// 사용자 로그인
	r.POST("/users/signin", h.SignIn)

	// 사용자 추가 POST 요청
	// 사용자 추가
	r.POST("/users", h.AddUser)

	// 4. 프론트엔드는 POST 메서드를 통해 로그아웃을 요청
	// 사용자 로그아웃 POST 요청
	/*
		아래 경로는 사용자 ID를 포함한다. ID는 사용자마다 고유한 값이기 때문에 와일드카드를 사용한다. ':id'는 변수 id를 의미한다.

	// 해당 ID 사용자 로그아웃
	r.POST("/user/:id/signout", h.SignOut)

	// 5. 백엔드는 GET 요청을 통해 특정 사용자의 구매 목록을 제공
	// 구매 목록
	// 해당 ID의 사용자의 주문 내역 조회
	r.GET("/user/:id/orders", h.GetOrders)

	// 6. 프론트엔드는 POST 메서드를 통해 백엔드로 신용카드 토큰 정보를 보내고 결제를 요청한다
	// 결제 POST 요청
	// 신용카드 결제 처리
	r.POST("/user/charge", h.Charge)

	***/

	// 그룹라우팅, URL의 일부를 공유하는 HTTP 라우팅은 같은 코드 블록으로 묶을 수 있다.
	userGroup := r.Group("/user")
	{
		userGroup.POST("/:id/signout", h.SignOut)
		userGroup.GET("/:id/orders", h.GetOrders)
	}
	usersGroup := r.Group("/users")
	{
		usersGroup.POST("/charge", h.Charge)
		usersGroup.POST("/signin", h.SignIn)
		usersGroup.POST("", h.AddUser)
	}

	// 서버시작
	// RESTful API 서버가 HTTP 클라이언트 요청을 기다리도록 반드시 API핸들러와 라우팅 정의 뒤에 호출
