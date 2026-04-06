package db

import "go.mongodb.org/mongo-driver/mongo"

var userCollection *mongo.Collection

func GetUserCollection() *mongo.Collection {
	return userCollection
}