package rest

import (
	"encoding/json"
	"errors"
	"gomusic/backend/src/dblayer"
	"gomusic/backend/src/models"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestHandler_GetProducts(t *testing.T) {
	// 테스트 모드를 활성화해 로깅 방지
	gin.SetMode(gin.TestMode)
	mockdbLayer := dblayer.NewMockDBLayerWithData()
	h := NewHandlerWithDB(mockdbLayer)
	const productsURL string = "/products"

	// 에러 메시지를 나타내는 구체
	type errMSG struct {
		Error string `json:"error"`
	}
	tests := []struct {
		name             string
		inErr            error
		outStatusCode    int
		expectedRespBody interface{}
	}{
		{
			"getproductsnoerrors",
			nil,
			http.StatusOK,
			mockdbLayer.GetMockProductData(),
		},
		{
			"getproductswitherror",
			errors.New("get products error"),
			http.StatusInternalServerError,
			errMSG{Error: "get products error"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// 서브테스트 실행

			// 1. 모의 객체에 에러를 설정
			mockdbLayer.SetError(tt.inErr)
			// 2. 테스트 요청 생성
			req := httptest.NewRequest(http.MethodGet, productsURL, nil)
			// 3. http response recorder 생성
			w := httptest.NewRecorder()

			// 4. Gin 프레임워크 엔진의 인스턴스 생성
			// response recorder를 사용해 gin 엔진 객체를 생성한다. 콘텍스트 인스턴스는 사용하지 않는다.
			// 이 메서드는 http.ResponseWriter 인터페이스 타입을 인자로 전달 받는다.
			// httpest.ResponseRecorder는 http.ResponseWriter 인터페이스를 구현하기 때문에 인자로 사용할 수 있다.
			_, engine := gin.CreateTestContext(w)

			// get 요청
			// 5. GetProducts()를 productsURL에 매핑
			engine.GET(productsURL, h.GetProducts)

			// 6. Gin 엔진이 HTTP 요청을 처리하도록 설정하고 HTTP 응답은 ResponseRecorder 타입으로 생성
			engine.ServeHTTP(w, req)

			// 7. 결과 검증
			response := w.Result()

			// 8. 에러 메시지 출력, 테스트 케이스 실패
			if response.StatusCode != tt.outStatusCode {
				t.Errorf("Received Status code %d does not match expected status code %d", response.StatusCode, tt.outStatusCode)
			}

			// http 응답 형식을 미리 알 수 없기 때문에 interface{} 타입을 사용
			var respBody interface{}

			// 9. 에러가 발생한 시나리오와 성공적으로 상품 목록을 반환하는 시나리오 작성
			// 에러가 발생한 경우 응답을 errms 타입으로 변환
			if tt.inErr != nil {
				var errmsg errMSG
				json.NewDecoder(response.Body).Decode(&errmsg)
				// 에러 메시지를 respBody에 저장
				respBody = errmsg
			} else {
				// 에러가 없을 경우 응답을 product 타입의 슬라이스로 변환
				products := []models.Product{}
				json.NewDecoder(response.Body).Decode(&products)
				// 디코딩한 상품 목록을 respBody에 저장
				respBody = products
			}
			// 10. HTTP 응답 내용을 비교
			if !reflect.DeepEqual(respBody, tt.expectedRespBody) {
				t.Logf("%+v , %+v", respBody, tt.expectedRespBody)
				t.Errorf("Received HTTP response body %+v does not match expected HTTP response Body %+v", respBody, tt.expectedRespBody)
			}
		})
	}
}
