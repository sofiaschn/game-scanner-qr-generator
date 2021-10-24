const UglifyJS = require("uglify-js");
const fs = require("fs/promises");
const readline = require("readline");
const QRCode = require("qrcode");
const { gzip } = require("node-gzip");

const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

input.question("Insert game name: ", (name) => {
    input.question("Insert path to game file: ", async (path) => {
        const file = await fs.readFile(path, "utf8");
        const code = UglifyJS.minify(file, {
            output: { quote_style: 1 },
        }).code;
        const object = { name, code };

        const stringified = JSON.stringify(object, 0);

        const output = await gzip(stringified);

        QRCode.toFile(
            "./qrcode.png",
            [{ data: output, mode: "byte" }],
            (error) => {
                if (error) {
                    console.log("Error:", error);
                } else {
                    console.log("Saved QRCode to file qrcode.png.");
                }
                input.close();
            }
        );
    });
});
