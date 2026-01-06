require("dotenv").config();
const http = require("http");
const readDb = require("./utils/readFile");
const writeDb = require("./utils/writeFile");
const { regexEmail, regexPassword } = require("./utils/validator");

const server = http.createServer((req, res) => {
  let url = req.url.toLowerCase();
  let method = req.method.toUpperCase();

  if (url.startsWith("/api")) {
    if (url == "/api/auth/register" && method == "POST") {
      let newUser = "";

      req.on("data", (chunk) => {
        newUser += chunk;
      });

      req.on("end", async () => {
        newUser = JSON.parse(newUser);
        //
        if (!regexEmail(newUser.email) || !regexPassword(newUser.password)) {
          res.writeHead(400, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({
              message:
                "Email is invalid or password must be at least 4 characters, include 1 uppercase letter and 1 number",
              status: 400,
            })
          );
        }

        //

        let users = await readDb("users.json");
        let checkUser = users.some((user) => user.email == newUser.email);
        //
        if (checkUser) {
          res.writeHead(400, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({
              message: "User already exsists with this email",
              status: 400,
            })
          );
        }
        //

        newUser = {
          id: users.length ? users.at(-1).id + 1 : 1,
          ...newUser,
          createdAt: new Date().toLocaleDateString(),
        };
        //

        users.push(newUser);
        await writeDb("users.json", users);

        res.writeHead(201, { "content-type": "application/json" });
        return res.end(
          JSON.stringify({
            message: "User succesfuly registered",
            status: 201,
          })
        );
      });
    }

    if (url == "/api/auth/login" && method == "POST") {
      let user = "";

      req.on("data", (chunk) => {
        user += chunk;
      });

      req.on("end", async () => {
        user = JSON.parse(user);
        if (!regexEmail(user.email) || !regexPassword(user.password)) {
          res.writeHead(400, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({
              message: "email or password is incorrect",
              status: 400,
            })
          );
        }

        let users = await readDb("users.json");
        let findUser = users.find((u) => u.email == user.email);

        if (!findUser) {
          res.writeHead(404, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({ message: "User not found", status: 404 })
          );
        }

        if (findUser.password !== user.password) {
          res.writeHead(404, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({ message: "User not found", status: 404 })
          );
        }

        res.writeHead(200, { "content-type": "application/json" });
        return res.end(
          JSON.stringify({
            message: "User succesfully logged in",
            status: 200,
          })
        );
      });
    }
  }
});

let PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on ${PORT}`));
