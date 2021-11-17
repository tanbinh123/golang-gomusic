package rest

import (
	"github.com/gin-gonic/gin"
)

func RunAPI(address string) error {
	r := gin.Default()

	// 상품 목록
	// 1. 백엔드는 GET 요청에 상품 목록으로 응답
	r.GET("/products", func(c *gin.Context) {
		// 클라이언트에게 상품 목록 반환
	})

	// 프로모션 목록
	// 2. 백엔드는 GET 요청에 프로모션 목록으로 응답
	r.GET("/promos", func(c *gin.Context) {
		// 클라이언트에게 프로모션 목록 반환
	})

	// 사용자 로그인 POST 요청
	// 3. 프론트엔드는 POST 메서드를 통해 로그인 또는 사용자 추가를 요청
	r.POST("/users/signin", func(c *gin.Context) {
		// 사용자 로그인
	})

	// 사용자 추가 POST 요청
	r.POST("/users", func(c *gin.Context) {
		// 사용자 추가
	})

	// 4. 프론트엔드는 POST 메서드를 통해 로그아웃을 요청
	// 사용자 로그아웃 POST 요청
	/*
		아래 경로는 사용자 ID를 포함한다. ID는 사용자마다 고유한 값이기 때문에 와일드카드를 사용한다. ':id'는 변수 id를 의미한다.
	*/
	r.POST("/user/:id/signout", func(c *gin.Context) {
		// 해당 ID 사용자 로그아웃
	})

	// 5. 백엔드는 GET 요청을 통해 특정 사용자의 구매 목록을 제공
	// 구매 목록
	r.GET("/user/:id/orders", func(c *gin.Context) {
		// 해당 ID의 사용자의 주문 내역 조회
	})

	// 6. 프론트엔드는 POST 메서드를 통해 백엔드로 신용카드 토큰 정보를 보내고 결제를 요청한다
	// 결제 POST 요청
	r.POST("/user/charge", func(c *gin.Context) {
		// 신용카드 결제 처리
	})

	return r.Run()
}
