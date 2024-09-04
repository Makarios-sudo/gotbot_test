package service

import (
	"app/app/domain"
	"app/app/repository"
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) FindByEmail(email string) (*domain.User, error) {
	return s.repo.FindByEmail(email)
}

func (s *UserService) CreateUser(user *domain.User) error {
	return s.repo.CreateUser(user)
}
