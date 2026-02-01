package db

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
	"github.com/phogtr/divine-tips/config"
)

type Database struct {
	db *sql.DB
}

func NewPostgresDB() (*Database, error) {
	conn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		config.Env.DbHost,
		config.Env.DbPort,
		config.Env.DbUser,
		config.Env.DbPassword,
		config.Env.DbName,
		config.Env.DbSSL,
	)

	dbConn, err := sql.Open("postgres", conn)
	if err != nil {
		return nil, fmt.Errorf("error open database: %w", err)
	}

	err = dbConn.Ping()
	if err != nil {
		return nil, fmt.Errorf("error ping database: %w", err)
	}

	return &Database{db: dbConn}, nil
}

func (d *Database) GetDB() *sql.DB {
	return d.db
}

func (d *Database) Close() error {
	return d.db.Close()
}

// func (d *Database) Version() {
// 	rows, err := d.db.Query("SELECT version()")
// 	if err != nil {
// 		panic(err)
// 	}

// 	for rows.Next() {
// 		var result string
// 		err = rows.Scan(&result)
// 		if err != nil {
// 			panic(err)
// 		}
// 		log.Printf("Version: %s\n", result)
// 	}
// }
