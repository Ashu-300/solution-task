package db

import "go.mongodb.org/mongo-driver/mongo"

var complaintCollection *mongo.Collection

func GetComplaintCollection() *mongo.Collection {
	return complaintCollection
}
