CREATE TYPE GENDER_ENUM AS ENUM ('male', 'female', 'unknown');

CREATE TABLE hedgehog (
	"id" serial PRIMARY KEY,
	"name" VARCHAR(100),
	"age" INTEGER,
	"gender" GENDER_ENUM,
	"coordinates" GEOMETRY(Point, 3857),
	"date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO
	hedgehog ("name", "age", "gender", "coordinates")
VALUES
	(
		'Sonic',
		3,
		'male',
		ST_SetSRID(
			ST_MakePoint(2643005.6750608203, 8743508.703183644),
			3857
		)
	);

INSERT INTO
	hedgehog ("name", "age", "gender", "coordinates")
VALUES
	(
		'Sonic2',
		50,
		'female',
		ST_SetSRID(
			ST_MakePoint(3085311.6450856356, 10906097.626616776),
			3857
		)
	);