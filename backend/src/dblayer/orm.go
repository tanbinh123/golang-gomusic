package dblayer

import (
	"gomusic/backend/src/models"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
)

type DBORM struct {
	*gorm.DB
}

func NewORM(dbname, con string) (*DBORM, error) {
	db, err := gorm.Open(dbname, con)
	return &DBORM{
		DB: db,
	}, err
}

// GORM Find 메서드 - select
func (db *DBORM) GetAllProducts() (products []models.Product, err error) {
	return products, db.Find(&products).Error
}

func (db *DBORM) GetPromos() (products []models.Product, err error) {
	return products, db.Where("promotion IS NOT NULL").Find(&products).Error
}

func (db *DBORM) GetCustomerByName(firstname string, lastname string) (customer models.Customer, err error) {
	return customer, db.Where(&models.Customer{FirstName: firstname, LastName: lastname}).Find(&customer).Error
}

// GORM First 메서드 - select, 첫 번째 결과만 반환하는 First 메서드 사용
func (db *DBORM) GetCustomerByID(id int) (customer models.Customer, err error) {
	return customer, db.First(&customer, id).Error
}

func (db *DBORM) GetProduct(id int) (product models.Product, error error) {
	return product, db.First(&product, id).Error
}

func (db *DBORM) AddUser(customer models.Customer) (models.Customer, error) {
	hashPassword(&customer.Pass)
	customer.LoggedIn = true
	return customer, db.Create(&customer).Error
}

func (db *DBORM) SignInUser(email, pass string) (customer models.Customer, err error) {
	if !checkPassword(pass) {
		return customer, error.New("Invalid password")
	}

	// 사용자 행을 나타내는 *gorm.DB 타입
	result := db.Table("Customers").Where(&models.Customer{Email: email})

	// loggedin 필드 업데이트
	err = result.Update("loggedin", 1).Error
	if err != nil {
		return customer, err
	}

	// 사용자 행 반환
	return customer, result.Find(&customer).Error
}

func (db *DBORM) SignOutUserById(id int) error {
	// ID에 해당하는 사용자 구조체 생성
	customer := models.Customer{
		Model: gorm.Model{
			ID: uint(id),
		},
	}
	// 사용자의 상태를 로그아웃 상태로 업데이트 한다.
	return db.Table("Customers").Where(&customer).Update("loggedin", 0).Error
}

func (db *DBORM) GetCustomerOrdersByID(id int) (orders []models.Order, err error) {
	return orders, db.Table("orders").Select("*").Joins("join customers on customers.id = customer_id").Joins("join products on products.id = product_id").Where("customer_id=?", id).Scan(&orders).Error //db.Find(&orders, models.Order{CustomerID: id}).Error

}
