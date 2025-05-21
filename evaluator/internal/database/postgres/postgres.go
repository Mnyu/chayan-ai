package postgres

import (
	"database/sql"
	"log/slog"

	_ "github.com/lib/pq"
)

func NewDBHandle(connStr string) (*sql.DB, error) {
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}
	err = db.Ping()
	if err != nil {
		return nil, err
	}
	return db, nil
}

func CloseDBHandle(db *sql.DB) {
	if err := db.Close(); err != nil {
		slog.Error("Unable to close database handle : " + err.Error())
		return
	}
	slog.Info("Database handle closed successfully")
}

func CloseStatement(stmt *sql.Stmt) {
	err := stmt.Close()
	if err != nil {
		slog.Error("error closing statement", slog.String("error", err.Error()))
	}
}

func CloseRows(rows *sql.Rows) {
	err := rows.Close()
	if err != nil {
		slog.Error("error closing rows", slog.String("error", err.Error()))
	}
}
