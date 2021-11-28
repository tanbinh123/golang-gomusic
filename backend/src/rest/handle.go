package rest

// 패키지 선언하고 외부 패키지 임포트
import (
	"gomusic/backend/src/dblayer"
	"gomusic/backend/src/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// 코드 확장성을 높이고자 핸들러의 모든 메서드를 포함하는 인터페이스를 만든다.
type HandlerInterface interface {
	GetProduct(c *gin.Context)
	GetProms(c *gin.Context)
	AddUser(c *gin.Context)
	SignIn(c *gin.Context)
	SignOut(c *gin.Context)
	GetOrders(c *gin.Context)
	Charge(c *gin.Context)
}

// 모든 메서드가 있는 Handler 구조체 정의
// Handler 타입은 데이터를 읽거나 수정하기 때문에 데이터베이스 레이어 인터페이스에 접근할 수 있어야한다.
type Handler struct {
	db dblayer.DBLayer
}

// 좋은 설계 원칙에 따라 Handler 생성자를 만든다
// 데이터베이스 레이어 타입의 초기화를 위해 이 생성자의 구현을 앞으로 계속 추가한다
func NewHandler() (*Handler, error) {
	// Handler 객체에 대한 포인터 생성
	return new(Handler), nil
}

// 상품 목록 조회
// *gin.Context 타입 인자를 전달받는 GetProducts 메서드를 정의
func (h *Handler) GetProducts(c *gin.Context) {

	// DB 인터페이스가 nil이 아닌 값으로 초기화 됐는지 확인.
	// 이 객체를 통해 상품 목록을 조회

	if h.db == nil {
		return
	}
	products, err := h.db.GetAllProducts()

	// 에러가 발생한다면 HTTP 상태 코드를 포함한 JSON 데이터 반환
	if err != nil {
		/*
			첫 번째 인자는 HTTP 상태코드, 두 번째는 응답의 바디
		*/
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	// 에러가 발생하지 않았다면 데이터베이스에서 읽은 상품 반환, 데이터 모델에 JSON구조체 태그로 정의한 필드는 JSON 형식에 맞춰 변환
	c.JSON(http.StatusOK, products)
}

// 프로모션 목록 조회
// *gin.Context 타입 인자를 전달받는 GetPromos 메서드를 정의
func (h *Handler) GetPromos(c *gin.Context) {

	// DB 인터페이스가 nil이 아닌 값으로 초기화 됐는지 확인.
	// 이 객체를 통해 상품 목록을 조회

	if h.db == nil {
		return
	}
	promos, err := h.db.GetPromos()

	// 에러가 발생한다면 HTTP 상태 코드를 포함한 JSON 데이터 반환
	if err != nil {
		/*
			첫 번째 인자는 HTTP 상태코드, 두 번째는 응답의 바디
		*/
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	// 에러가 발생하지 않았다면 데이터베이스에서 읽은 상품 반환, 데이터 모델에 JSON구조체 태그로 정의한 필드는 JSON 형식에 맞춰 변환
	c.JSON(http.StatusOK, promos)
}

// 사용자 로그인과 신규 가입
func (h *Handler) SignIn(c *gin.Context) {
	if h.db == nil {
		return
	}
	var customer models.Customer

	// HTTP 요청 바디에서 JSON 문서를 추출하고 객체로 디코딩한다.
	// 아래의 경우 이 객체는 고객 데이터 모델을 나타내는 *models.Customer 타입이다
	err := c.ShouldBindJSON(&customer)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// JSON 문서를 데이터 모델로 디코딩하고 SignInUser 데이터베이스 레이어 메서드를 호출하고 데이터베이스에 로그인 상태를 저장하거나 신규 사용자를 추가
	customer, err = h.db.SignInUser(customer.Email, customer.Pass)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, customer)
}

func (h *Handler) AddUser(c *gin.Context) {
	if h.db == nil {
		return
	}
	var customer models.Customer

	// HTTP 요청 바디에서 JSON 문서를 추출하고 객체로 디코딩한다.
	// 아래의 경우 이 객체는 고객 데이터 모델을 나타내는 *models.Customer 타입이다
	err := c.ShouldBindJSON(&customer)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// JSON 문서를 데이터 모델로 디코딩하고 AddUser 데이터베이스 레이어 메서드를 호출하고 데이터베이스에 로그인 상태를 저장하거나 신규 사용자를 추가
	customer, err = h.db.AddUser(customer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, customer)
}

func (h *Handler) SignOut(c *gin.Context) {
	if h.db == nil {
		return
	}

	// URL에서 로그아웃하는 사용자의 ID를 추출한다. *gin.Context 타입의 Param() 메서드를 사용한다.
	p := c.Param("id")
	// p는 문자형. 저수형으로 변환
	id, err := strconv.Atoi(p)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// SignOutUserById 데이터베이스 레이어 메서드를 호출하고 데이터베이스에 해당 사용자를 로그아웃 상태로 설정한다.
	err = h.db.SignOutUserById(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
}

// 사용자의 주문 내역 조회
func (h *Handler) GetOrders(c *gin.Context) {
	if h.db == nil {
		return
	}

	// URL에서 로그아웃하는 사용자의 ID를 추출한다. *gin.Context 타입의 Param() 메서드를 사용한다.
	// id 매개변수 추출
	p := c.Param("id")
	// p는 문자형. 저수형으로 변환
	id, err := strconv.Atoi(p)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// GetCustomerOrdersByID 데이터베이스 레이어 메서드를 호출하고 주문 내역 조회
	orders, err := h.db.GetCustomerOrdersByID(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, orders)
}

// 신용카드 결제 요청
func (h *Handler) Charge(c *Handler) {
	if h.db == nil {
		return
	}
}
