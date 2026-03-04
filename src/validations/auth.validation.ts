import { z} from "zod";

  const signupSchema = z.object({
    email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email format"),

    password:z
    .string()
    .min(8)
    .max(72)
    .regex(/[A-Z]/ , "Password must contain at least one uppercase letter")
    .regex(/[a-z]/ , "Password must contain at least one lowercase letter")
    .regex(/[0-9]/ , "Password must contain at least one number")
     .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")

});

const loginSchema = z.object({
     email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid credentials"),

   password: z.string().min(1, "Invalid credentials"),

})

export default  {signupSchema,loginSchema}