package repository

import (
	"app/app/domain"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type FoodRepository struct {
	collection *mongo.Collection
}

func NewFoodRepository(collection *mongo.Collection) *FoodRepository {
	return &FoodRepository{collection: collection}
}

// type FoodRepository struct {
// 	collection *mongo.Collection
// }

// func NewFoodRepository(client *mongo.Client) *FoodRepository {
// 	collection := client.Database("your_database_name").Collection("foods")
// 	return &FoodRepository{
// 		collection: collection,
// 	}
// }

func (r *FoodRepository) FindAll(userID primitive.ObjectID) ([]domain.FoodItem, error) {
	var foodItems []domain.FoodItem
	filter := bson.M{"user_id": userID}
	cursor, err := r.collection.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var foodItem domain.FoodItem
		if err := cursor.Decode(&foodItem); err != nil {
			return nil, err
		}
		foodItems = append(foodItems, foodItem)
	}

	return foodItems, nil
}

func (r *FoodRepository) FindByID(id primitive.ObjectID) (*domain.FoodItem, error) {
	var foodItem domain.FoodItem
	filter := bson.M{"_id": id}
	err := r.collection.FindOne(context.Background(), filter).Decode(&foodItem)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &foodItem, nil
}

func (r *FoodRepository) Create(foodItem *domain.FoodItem) error {
	_, err := r.collection.InsertOne(context.Background(), foodItem)
	return err
}

func (r *FoodRepository) Update(foodItem *domain.FoodItem) error {
	filter := bson.M{"_id": foodItem.ID}
	update := bson.M{"$set": bson.M{
		"name":        foodItem.Name,
		"description": foodItem.Description,
		"quantity":    foodItem.Quantity,
		"price":       foodItem.Price,
		"updated_at":  foodItem.UpdatedAt,
	}}
	_, err := r.collection.UpdateOne(context.Background(), filter, update)
	return err
}

func (r *FoodRepository) Delete(id primitive.ObjectID) error {
	filter := bson.M{"_id": id}
	_, err := r.collection.DeleteOne(context.Background(), filter)
	return err
}
