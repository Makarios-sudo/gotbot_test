package main

import (
	"app/app/api"
	"app/app/repository"
	"app/app/service"
	"context"
	"fmt"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	db := client.Database("kota_shop_database")
	userCollection := db.Collection("users")
	foodCollection := db.Collection("foods")

	userRepo := repository.NewUserRepository(userCollection)
	foodRepo := repository.NewFoodRepository(foodCollection)

	userService := service.NewUserService(userRepo)
	foodService := service.NewFoodService(foodRepo)

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173/"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	api.SetupRoutes(router, userService, foodService)

	fmt.Println("Server running on port 8080")
	router.Run(":8080")
}
