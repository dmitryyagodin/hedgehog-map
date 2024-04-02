import { z } from "zod";

const messages = {
  age: "Oletko varmaa? Siili elää keskimäärin kolmen tai neljän vuoden ikäiseksi. Maailman vanhin tieteellisesti vahvistettu eurooppalainen siili on löydetty Tanskasta kansalaistieteellisessä hankkeessa, johon osallistui satoja vapaaehtoisia. Siili eli 16 vuotta, 7 vuotta pidempään kuin edellinen ennätyksen haltija.",
  gender:
    'Sukupuoli kenttä on pakollinen. Valitse "tuntematon" jos et ole varma',
};

/**
 * Hedgehog interface shared between server and client
 */

export const hedgehogSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(1, { message: "Nimi kenttä on pakollinen." })
    .max(100, { message: "Nimi on liian pitkä." }),
  age: z
    .number({
      required_error: "Ikä kenttä on pakollinen ja annettava numerona",
      invalid_type_error: "Ikä on annettava numerona",
    })
    .min(1, { message: "Iän pitää olla vahintään 1" })
    .max(20, { message: messages.age }),
  gender: z
    .string()
    .refine(
      (value) => value === "male" || value === "female" || value === "unknown",
      { message: messages.gender }
    ),
  coordinates: z.array(z.number()).length(2),
  date: z.number().optional(),
});

export type Hedgehog = z.infer<typeof hedgehogSchema>;
