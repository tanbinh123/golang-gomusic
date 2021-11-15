package dblayer

import (
	"../models"
)

type DBLayer interface {
	GettAllProducts() ([]models.Product, error)
}
