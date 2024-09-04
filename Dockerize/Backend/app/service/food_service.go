package service

import (
	"app/app/domain"
	"app/app/repository"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type FoodService struct {
	repo *repository.FoodRepository
}

func NewFoodService(repo *repository.FoodRepository) *FoodService {
	return &FoodService{repo: repo}
}

func (s *FoodService) FindAll(userID primitive.ObjectID) ([]domain.FoodItem, error) {
	return s.repo.FindAll(userID)
}

func (s *FoodService) FindByID(id primitive.ObjectID) (*domain.FoodItem, error) {
	return s.repo.FindByID(id)
}

func (s *FoodService) Create(foodItem *domain.FoodItem) error {
	return s.repo.Create(foodItem)
}

func (s *FoodService) Update(foodItem *domain.FoodItem) error {
	return s.repo.Update(foodItem)
}

func (s *FoodService) Delete(id primitive.ObjectID) error {
	return s.repo.Delete(id)
}
