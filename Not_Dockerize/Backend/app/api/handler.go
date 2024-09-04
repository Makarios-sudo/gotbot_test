package api

import (
	"app/app/domain"
	"app/app/middleware"
	"app/app/service"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func SetupRoutes(router *gin.Engine, userService *service.UserService, foodService *service.FoodService) {

	router.POST("/users/register", func(c *gin.Context) {
		var user domain.User
		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		err := userService.CreateUser(&user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "User registered successfully",
			"user":    user,
		})
	})

	router.POST("/users/login", func(c *gin.Context) {
		var user domain.User
		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		storedUser, err := userService.FindByEmail(user.Email)
		if err != nil || storedUser == nil || storedUser.Password != user.Password {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"user_id": storedUser.ID.Hex(),
		})
		tokenString, err := token.SignedString([]byte("your_secret_key"))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"token": tokenString,
			"user":  storedUser,
		})
	})

	auth := router.Group("/")
	auth.Use(middleware.AuthMiddleware())

	auth.GET("/foods/list_food", func(c *gin.Context) {
		userID, _ := c.Get("user_id")
		userObjectID, _ := primitive.ObjectIDFromHex(userID.(string))
		foodItems, err := foodService.FindAll(userObjectID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if len(foodItems) == 0 {
			c.JSON(http.StatusAccepted, "No Food Created Yet")
			return
		}
		c.JSON(http.StatusOK, foodItems)
	})

	auth.POST("/foods/add_food", func(c *gin.Context) {
		var foodItem domain.FoodItem
		if err := c.BindJSON(&foodItem); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		userID, _ := c.Get("user_id")

		foodItem.UserID, _ = primitive.ObjectIDFromHex(userID.(string))
		err := foodService.Create(&foodItem)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Food item created successfully",
			"food":    foodItem,
		})
	})

	auth.PUT("/foods/:id/update_food", func(c *gin.Context) {
		var foodItem domain.FoodItem
		if err := c.BindJSON(&foodItem); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		id, _ := primitive.ObjectIDFromHex(c.Param("id"))
		foodItem.ID = id
		foodItem.UpdatedAt = time.Now()

		storedFoodItem, err := foodService.FindByID(id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if storedFoodItem == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Food item not found"})
			return
		}

		userID, _ := c.Get("user_id")
		userObjectID, _ := primitive.ObjectIDFromHex(userID.(string))
		if storedFoodItem.UserID != userObjectID {
			c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to update this food item"})
			return
		}

		foodItem.UserID = userObjectID

		err = foodService.Update(&foodItem)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Food item updated successfully",
			"food":    foodItem,
		})
	})

	auth.DELETE("/foods/:id/delete_food", func(c *gin.Context) {
		id, _ := primitive.ObjectIDFromHex(c.Param("id"))

		storedFoodItem, err := foodService.FindByID(id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if storedFoodItem == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Food item not found"})
			return
		}

		userID, _ := c.Get("user_id")
		userObjectID, _ := primitive.ObjectIDFromHex(userID.(string))
		if storedFoodItem.UserID != userObjectID {
			c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to delete this food item"})
			return
		}

		err = foodService.Delete(id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Food item deleted successfully"})
	})

	auth.GET("/foods/:id/get_food", func(c *gin.Context) {
		id, _ := primitive.ObjectIDFromHex(c.Param("id"))

		foodItem, err := foodService.FindByID(id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if foodItem == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Food item not found"})
			return
		}

		userID, _ := c.Get("user_id")
		userObjectID, _ := primitive.ObjectIDFromHex(userID.(string))
		if foodItem.UserID != userObjectID {
			c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to view this food item"})
			return
		}

		c.JSON(http.StatusOK, foodItem)
	})
}
