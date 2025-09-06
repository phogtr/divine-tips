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
	conn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		config.Env.DbHost,
		config.Env.DbPort,
		config.Env.DbUser,
		config.Env.DbPassword,
		config.Env.DbName,
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

func (d *Database) Close() error {
	return d.db.Close()
}
