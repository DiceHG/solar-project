import z from "zod";

const clientSchema = z.object({
  clientType: z.enum(["individual", "company"]),
  name: z.string(),
  docNumber: z.string(),
  email: z.email(),
  phoneNumber: z.string(),
  dateOfBirth: z.iso.date().optional(),
});

try {
  clientSchema.parse({
    clientType: "individual",
    name: "John Doe",
    docNumber: "123456789",
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    dateOfBirth: "1990-01-01",
  });
  console.log("success");
} catch (error) {
  console.error(error.issues.map((e) => e.message));
}

try {
  clientSchema.parse({
    clientType: "individual1",
    name: "John Doe",
    docNumber: "123456789",
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    dateOfBirth: "1990-01-01",
  });
  console.log("success");
} catch (error) {
  console.error(error.issues.map((e) => e.message));
}

try {
  clientSchema.parse({
    clientType: "individual1",
    name: "John Doe",
    docNumber: "123456789",
    email: "john.doe",
    phoneNumber: "123-456-7890",
    dateOfBirth: "1990-01-01",
  });
  console.log("success");
} catch (error) {
  console.error(error.issues.map((e) => e.message));
}

try {
  clientSchema.parse({
    clientType: "individual",
    name: "",
    docNumber: "123456789",
    email: "john.doe",
    phoneNumber: "123-456-7890",
    dateOfBirth: "1990-01-01",
  });
  console.log("success");
} catch (error) {
  console.error(error.issues.map((e) => e.message));
}

try {
  clientSchema.parse({
    clientType: "individual",
    name: "John Doe",
    docNumber: "123456789",
    email: "john.doe@test.com",
    phoneNumber: "123-456-7890",
  });
  console.log("success");
} catch (error) {
  console.error(error.issues.map((e) => e.message));
}
