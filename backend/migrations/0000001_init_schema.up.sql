CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE urls (
    id SERIAL PRIMARY KEY,
    original_url TEXT NOT NULL,
    short_code TEXT UNIQUE NOT NULL,
    clicks INT DEFAULT 0,
    user_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX unique_user_url
ON urls(user_id, original_url);