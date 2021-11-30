package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

type Product struct {
	gorm.Model
	Image       string  `json:"img"`
	ImageAlt    string  `json:"imgalt"`
	Price       float64 `json:"price"`
	Promotion   float64 `json:"promotion"`
	ProductName string  `json:"productname"`
	Description string  `json:"desc"`
}

func (Product) Tablename() string {
	return "products"
}

type Customer struct {
	gorm.Model
	FirstName string `gorm:"column:firstname" json:"firstname"`
	LastName  string `gorm:"column:lastname" json:"lastname"`
	Email     string `gorm:"column:email" json:"email"`
	Pass      string `json:"password"`
	CCToken   string `gorm:"column:cctoken" json:"cctoken"`
	LoggedIn  bool   `gorm:"column:loggedin" json:"loggedin"`
}

func (Customer) Tablename() string {
	return "customers"
}

type Order struct {
	gorm.Model
	Product
	Customer
	CustomerID   int       `json:"customer_id"`
	ProductID    int       `json:"product_id"`
	Price        float64   `json:"sell_price"`
	PurchaseDate time.Time `json:"purchase_date"`
}

func (Order) TableName() string {
	return "orders"
}
