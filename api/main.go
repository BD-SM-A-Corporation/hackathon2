package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize database
	InitDB()

	// Set up Gin router
	router := gin.Default()

	// Public routes
	router.POST("/api/v1/register", Register)
	router.POST("/api/v1/login", Login)

	// Protected routes
	authorized := router.Group("/api/v1")
	authorized.Use(AuthMiddleware())
	{
		// User routes
		authorized.GET("/user/profile", GetUserProfile)
		authorized.PUT("/user/profile", UpdateUserProfile)

		// Bed routes
		authorized.POST("/beds", CreateBed)
		authorized.GET("/beds", GetUserBeds)
		authorized.GET("/beds/:id", GetBed)
		authorized.PUT("/beds/:id", UpdateBed)
		authorized.DELETE("/beds/:id", DeleteBed)

		// Record routes
		authorized.POST("/beds/:id/records", CreateRecord)
		authorized.GET("/beds/:id/records", GetBedRecords)
		authorized.PUT("/records/:id", UpdateRecord)
		authorized.DELETE("/records/:id", DeleteRecord)

		// Plant library routes
		authorized.GET("/plants", GetPlantLibrary)
		authorized.GET("/plants/:id", GetPlantInfo)

		// Notification routes
		authorized.GET("/notifications", GetUserNotifications)
		authorized.PUT("/notifications/:id/read", MarkNotificationRead)
	}

	// Health check
	router.GET("/api/v1/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
