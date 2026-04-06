package db

import (
	"context"
	"fmt"
	"log"
	"map/src/config"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client

func MongoInit() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	mongoURI := config.MONGO_URI

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("Mongo connection error:", err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Mongo ping error:", err)
	}

	Client = client
	fmt.Println("Connected to MongoDB")
	binCollection = Client.Database("mapdb").Collection("bins")
}

func ConnectDB() {
	MongoInit()
}
