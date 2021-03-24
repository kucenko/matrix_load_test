#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE synapse
        ENCODING 'UTF8'
        LC_COLLATE='C'
        LC_CTYPE='C'
        template=template0
        OWNER admin;
EOSQL