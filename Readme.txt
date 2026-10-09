psql "postgresql://postgres:postgres@localhost:5433/Ponto_Sequelize" -f seed.sql

psql "DATABASE_URL" -f seed.sql

    Login
GET http://localhost:3000/login?email=admin@loja.com&senha=admin123
