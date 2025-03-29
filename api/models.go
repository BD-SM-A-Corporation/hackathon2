package main

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email    string `gorm:"uniqueIndex;not null" json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
	Beds     []Bed  `json:"beds,omitempty"`
}

type Bed struct {
	gorm.Model
	UserID          uint      `json:"user_id"`
	User            User      `json:"user,omitempty"`
	Name            string    `json:"name"`
	PlantType       string    `json:"plant_type"`
	SowingDate      time.Time `json:"sowing_date"`
	SubstrateType   string    `json:"substrate_type"`
	ExpectedHarvest time.Time `json:"expected_harvest"`
	Status          string    `json:"status"` // active, harvested, failed
	Records         []Record  `json:"records,omitempty"`
}

type Record struct {
	gorm.Model
	BedID        uint      `json:"bed_id"`
	Bed          Bed       `json:"bed,omitempty"`
	Date         time.Time `json:"date"`
	Height       float64   `json:"height"`
	Humidity     float64   `json:"humidity"`
	Notes        string    `json:"notes"`
	PhotoURL     string    `json:"photo_url"`
	VisualStatus string    `json:"visual_status"`
}

type PlantLibrary struct {
	gorm.Model
	Name            string  `json:"name"`
	Description     string  `json:"description"`
	GrowingTime     int     `json:"growing_time"` // in days
	OptimalTemp     float64 `json:"optimal_temp"`
	OptimalHumidity float64 `json:"optimal_humidity"`
	LightNeeds      string  `json:"light_needs"`
	Tips            string  `json:"tips"`
}

type Notification struct {
	gorm.Model
	UserID  uint      `json:"user_id"`
	User    User      `json:"user,omitempty"`
	BedID   uint      `json:"bed_id"`
	Bed     Bed       `json:"bed,omitempty"`
	Type    string    `json:"type"` // watering, checkup, harvest
	Message string    `json:"message"`
	DueDate time.Time `json:"due_date"`
	IsRead  bool      `json:"is_read"`
}
