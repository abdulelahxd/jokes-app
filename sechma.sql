DROP TABLE IF EXISTS exam;

CREATE TABLE IF NOT EXISTS exam(
    id SERIAL PRIMARY KEY,
    type VARCHAR(255), 
    setup VARCHAR(255), 
    punchline VARCHAR(255)
);