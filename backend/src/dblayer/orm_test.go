package dblayer

import (
	"testing"
)

func BenchmarkHashPassword(b *testing.B) {

	// 1. hashpassword() 함수를 벤치마킹하는 코드 작성
	// 해싱할 문자 초기화
	text := "A string to be Hashed"
	for i := 0; i < b.N; i++ {
		hashPassword(&text)
	}
}
