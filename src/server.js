import { app } from "app";

const PORT = process.env.PORT;
app.listen(PORT, async () => {
  console.log(`running on port ${PORT}`);
});
