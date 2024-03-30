import { getPool } from "@server/db";
import { logger } from "@server/logging";
import { Hedgehog, hedgehogSchema } from "@shared/hedgehog";
import { sql } from "slonik";

export async function getAllHedgehogs() {
  try {
    const query = sql.type(hedgehogSchema)`
    SELECT
      id, 
      name, 
      age,
      gender, 
      json_build_array(
        ST_X(coordinates::geometry),
        ST_Y(coordinates::geometry)
      ) as coordinates,
      date
    FROM
      hedgehog;   
    `;

    return await getPool().any(query);
  } catch (error) {
    logger.error(error);
  }
}

/**
 * Fetch a hedgehog by ID
 */
export async function getHedgehogById(id: number) {
  if (!id) throw new Error("ID is required");
  try {
    const query = sql.type(hedgehogSchema)`
      SELECT
        id, 
        name, 
        age,
        gender, 
        json_build_array(
          ST_X(coordinates::geometry),
          ST_Y(coordinates::geometry)
        ) as coordinates,
        date
      FROM 
        hedgehog
      WHERE
        id = ${id};
    `;

    const hedgehog: Hedgehog | null = await getPool().maybeOne(query);
    if (!hedgehog) {
      throw new Error("Hedgehog not found");
    }
    return hedgehog;
  } catch (error) {
    logger.error(error);
  }
}

/**
 * Add a new hedgehog to the database
 */
export async function insertHedgehog({
  name,
  age,
  gender,
  coordinates,
}: Hedgehog) {
  try {
    const query = sql.type(hedgehogSchema)`
      INSERT INTO
        hedgehog (name, age, gender, coordinates)
      VALUES (
          ${name},
          ${age},
          ${gender},
          ST_SetSRID(ST_MakePoint(${coordinates[0]}, ${coordinates[1]}), 3857)
      )
      RETURNING id;
    `;

    const { id } = await getPool().one(query);

    if (!id) {
      throw new Error("Failed to return an insert ID");
    }
    return id;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

/**
 * Delete a hedgehog by ID
 */
export async function deleteHedgehogById(id: number) {
  if (!id) throw new Error("ID is required");
  try {
    const query = sql.type(hedgehogSchema)`
      DELETE FROM hedgehog
      WHERE id = ${id}
    `;

    const result = await getPool().query(query);
    return result.rowCount > 0;
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to delete hedgehog");
  }
}
