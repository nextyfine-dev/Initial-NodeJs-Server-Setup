export const authSchema = {
  userName: { type: "string", empty: false, min: 3, max: 18 },
  password: { type: "string", empty: false, min: 8, max: 20 },
};
