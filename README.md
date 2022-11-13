# Data Engineering - Advanced Relational Databases

*Students: Kamran Poladov and Matthias Vernimme*

*Lab instructor: Gil Vranken*

*Database number: a23dasc507*

## Collaborative environment setup
First, we decided to create a database dump from the server and host it locally. This allowed us to run all the queries on our own laptops, 
thus, we could execute them significantly faster. 
However, there is one drawback with this approach - 
the database is not synchronised unless we share the queries with each other and execute them in the correct order. 

To solve that, we created an [environment](https://github.com/kamranpoladov/data-engineering-lab) with database migrations using JavaScript and [db-migrate](https://www.npmjs.com/package/db-migrate) library. 
This library provides out-of-the-box functionality for creating migrations with CLI. 
Each migration has three main parts: timestamp, up command and down command.
- **Timestamp** defines when migration was created. It ensures that all the migrations are run in chronological order.
- **Up command** is an SQL query that is executed when migration runs.
- **Down command** is the opposite of the up command (i.e. it reverts the migration). Some migrations are non-revertible and it is okay.

The following is a code snippet of creating new table named `title` with several columns (`id`, `primary_title`, `original_title`, etc)
```
exports.up = function (db, cb) {
  db.createTable(
    'title',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        notNull: true
      },
      primary_title: 'string',
      original_title: 'string',
      average_rating: 'decimal',
      votes: 'int'
    },
    cb
  );
};

exports.down = function (db, cb) {
  db.dropTable('title', cb);
};
```

Migrations are executed via CLI in chronological order according to their timestamps. You can execute and revert all migrations using the following commands, respectively
```
$ db-migrate up:all
$ db-migrate reset
```

Database connection is defined in `database.json` file for both development and production environments and it receives configs (such as host, port, username, password, etc)  from `.env` file.
```
{
  "dev": {
    "driver": "mysql",
    "user": { "ENV": "DEV_USER" },
    "password": { "ENV": "DEV_PASSWORD" },
    "host": { "ENV": "DEV_HOST" },
    "port": { "ENV": "DEV_PORT" },
    "database": { "ENV": "DEV_DATABASE" },
    "multipleStatements": true
  },
  "prod": {
    "driver": "mysql",
    "user": { "ENV": "PROD_USER" },
    "password": { "ENV": "PROD_PASSWORD" },
    "host": { "ENV": "PROD_HOST" },
    "port": { "ENV": "PROD_PORT" },
    "database": { "ENV": "PROD_DATABASE" },
    "multipleStatements": true
  }
}
```

## Database changes

#### Removing prefixes from id's

We removed the `tt` and `nm` prefixes from all the id's in the following tables: `titleBasics`, `titkeAkas`, `titlePrincipals`, `titleRatings`, `nameBasics` 
with the following query (only one is provided but the approach for other tables is similar)
```
UPDATE titleBasics SET tconst = (CAST(SUBSTRING(tconst, 3) AS unsigned));
```

#### Creating lookup tables

We created the following lookup tables and later on used them as foreign keys in `name_x_*` and `title_x_*` tables:

- `dict_genre` taken from `titleBasics.genre` using the following query to populate it with all distinct genres
```
  INSERT INTO dict_genre (genre) 
  SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(titleBasics.genres, ',', 1), ',', -1) genres FROM titleBasics WHERE genres IS NOT NULL;
```
- `dict_language` taken from `titleAkas.language` using the following query
```
INSERT INTO dict_language (code) SELECT DISTINCT language FROM titleAkas WHERE language IS NOT NULL;
```

- `dict_profession` taken from `nameBasics.primaryProfession` using the following query to populate it with all distinct professions
```
INSERT INTO dict_profession (profession) 
SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(nameBasics.primaryProfession, ',', 1), ',', -1) primaryProfession FROM nameBasics;
DELETE FROM dict_profession WHERE profession = '';
```

- `dict_role` and `dict_region` taken from `titlePrincipals.category` and `titleAkas.region` respectively using the queries highly similar to aforementioned ones.

#### Two primary tables containing all the names and titles

We decided to get rid of all existing tables and create our own. 

We created `title` table using `db-migrate` library API as follows. The code snippet below translates into regular `CREATE TABLE title ...` SQL query 
where `id` is an auto incremented primary key and `'string'` converts into `VARCHAR(255)`. `average_rating` and `votes` columns were later removed from
this table and added into separate `title_ratings` table.

```
exports.up = function (db, cb) {
  db.createTable(
    'title',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        notNull: true
      },
      primary_title: 'string',
      original_title: 'string',
      average_rating: 'decimal',
      votes: 'int'
    },
    cb
  );
};

exports.down = function (db, cb) {
  db.dropTable('title', cb);
};
```

Additionally, we also added `type`, `release_year`, `end_year` and `is_adult` columns into `title` table where `type` is an enum and `is_adult` is a boolean value

Since `titleBasics.is_adult` is a string, the following query was used to convert it into boolean (`TINYINT(1)`) value
```
UPDATE title, titleBasics
SET title.is_adult = CASE
  WHEN titleBasics.isAdult = "false" THEN FALSE
  ELSE TRUE
END 
WHERE title.id = titleBasics.tconst;
```

The following query was used to add `type` enum column to `title` table
```
ALTER TABLE title ADD type enum('movie', 'tvMovie', 'tvShort', 'tvMiniSeries', 'tvSpecial', 'videoGame') NOT NULL;
```


The `name` table was created using the following code snippet, highly similar to aforementioned `title` table 

```
exports.up = function (db, callback) {
  db.createTable(
    'name',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        notNull: true
      },
      name: 'string',
      birth_year: 'int',
      death_year: 'int'
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('name', callback);
};
```

The `name_x_title` table was created to store all the data what people participated in what titles. We also deleted all the irrelevant data from `titlePrincipals` using the following queries

```
CREATE TABLE name_x_title (
  id INT NOT NULL AUTO_INCREMENT,
  name_id INT NOT NULL,
  title_id INT NOT NULL,
  ordering INT NOT NULL,
  characters VARCHAR(255),
  PRIMARY KEY (id),
  FOREIGN KEY (title_id) REFERENCES title(id),
  FOREIGN KEY (name_id) REFERENCES name(id)
);

DELETE FROM titlePrincipals WHERE nconst NOT IN (SELECT id FROM name);

DELETE FROM titlePrincipals WHERE tconst NOT IN (SELECT id FROM title);

INSERT INTO name_x_title (name_id, title_id, ordering)
SELECT nconst, tconst, ordering FROM titlePrincipals;

// unwrap `characters`, credits to https://stackoverflow.com/a/56835547/8478087
UPDATE name_x_title, titlePrincipals 
SET name_x_title.characters = REPLACE(
  REPLACE(
     REPLACE(
      titlePrincipals.characters
      , '['
      , ''
    )
    , ']'
    , ''
  )
  , '"'
  , ''
)
WHERE name_x_title.name_id = titlePrincipals.nconst AND name_x_title.title_id = titlePrincipals.tconst;
```

## Stored procedure

This stored procedure gets movies with rating bigger than `average` for a given actor's id `name_id`

```
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_top_movies_by_actor`(in name_id int, in average float)
BEGIN
    SELECT title.primary_title, title.release_year, title_x_duration.duration, title_ratings.average_rating FROM title
    
    LEFT JOIN title_ratings ON title_ratings.title_id = title.id
    
    LEFT JOIN name_x_title ON name_x_title.title_id = title.id
    
    LEFT JOIN title_x_duration ON title_x_duration.title_id = title.id
    
    WHERE title_ratings.average_rating >= average AND name_x_title.name_id = name_id
    
    GROUP BY title.id;
END
```

For example, here are movies with Leonardo DiCaprio where rating is greater than or equal to 8

![image](https://user-images.githubusercontent.com/42556944/201538045-974f4d42-57f4-4151-817c-208f77974f48.png)

## View

The following view aggregates data about all the names, such as full names, titles, birth and death years, professions

```
CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `name_summary` AS
    SELECT 
        `name`.`id` AS `ID`,
        `name`.`name` AS `Full Name`,
        `name`.`birth_year` AS `Birth Year`,
        `name`.`death_year` AS `Death Year`,
        `dict_profession`.`profession` AS `Profession`,
        `title`.`id` AS `Title ID`,
        `title`.`primary_title` AS `Title Name`
    FROM
        ((((`name`
        JOIN `name_x_profession` ON ((`name_x_profession`.`name_id` = `name`.`id`)))
        JOIN `dict_profession` ON ((`name_x_profession`.`profession_id` = `dict_profession`.`id`)))
        JOIN `name_x_title` ON ((`name_x_title`.`name_id` = `name`.`id`)))
        JOIN `title` ON ((`title`.`id` = `name_x_title`.`title_id`)))
```

![image](https://user-images.githubusercontent.com/42556944/201539076-9669bdaf-4ded-4c46-b396-e17c3463a9ce.png)

