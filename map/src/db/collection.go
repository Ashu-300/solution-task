package db

import "go.mongodb.org/mongo-driver/mongo"

var binCollection *mongo.Collection

func GetBinCollection() *mongo.Collection {
	return binCollection
}
