import Fastify from "fastify";

const server = Fastify();

server.get("/healthcheck", async function (req, res) {
    return { status: "OK" };
});

async function main() {
    try {
        await server.listen(3000, "0.0.0.0");
        console.info("server running at port 3000");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main();
