package repository

import (
	"app/app/domain"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserRepository struct {
	collection *mongo.Collection
}

func NewUserRepository(collection *mongo.Collection) *UserRepository {
	return &UserRepository{collection: collection}
}

// type UserRepository struct {
// 	collection *mongo.Collection
// }

// func NewUserRepository(client *mongo.Client) *UserRepository {
// 	collection := client.Database("your_database_name").Collection("users")
// 	return &UserRepository{
// 		collection: collection,
// 	}
// }

func (r *UserRepository) FindByEmail(email string) (*domain.User, error) {
	var user domain.User
	filter := bson.M{"email": email}
	err := r.collection.FindOne(context.Background(), filter).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) CreateUser(user *domain.User) error {
	_, err := r.collection.InsertOne(context.Background(), user)
	return err
}
