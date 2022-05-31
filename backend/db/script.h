psql -f install.sql -U postgres
PGPASSWORD=ilya psql -d doc -f database.sql -U ilya
PGPASSWORD=ilya psql -d doc -f values.sql -U ilya