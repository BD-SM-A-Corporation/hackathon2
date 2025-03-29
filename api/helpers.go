package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	log.Printf("Hashing password (length: %d)", len(password))
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		return "", err
	}
	log.Printf("Password hashed successfully")
	return string(bytes), nil
}

func CheckPassword(password, hash string) bool {
	log.Printf("Checking password (length: %d) against hash (length: %d)", len(password), len(hash))
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err != nil {
		log.Printf("Password verification failed: %v", err)
		return false
	}

	log.Printf("Password verification successful")
	return true
}

func GenerateToken(userID uint) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func GetUserFromContext(c *gin.Context) (*User, error) {
	userID, exists := c.Get("user_id")
	if !exists {
		return nil, fmt.Errorf("user not found in context")
	}

	var user User
	if err := DB.First(&user, userID).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func CalculateDaysUntilHarvest(bed *Bed) int {
	now := time.Now()
	days := int(bed.ExpectedHarvest.Sub(now).Hours() / 24)
	return days
}

func CreateNotification(userID uint, bedID uint, notificationType string, message string, dueDate time.Time) error {
	notification := Notification{
		UserID:  userID,
		BedID:   bedID,
		Type:    notificationType,
		Message: message,
		DueDate: dueDate,
		IsRead:  false,
	}

	return DB.Create(&notification).Error
}
