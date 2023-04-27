import { connect } from "@dagger.io/dagger";

connect(
  async (client) => {
    const source = client
      .container()
      .from("node:16-slim")
      .withMountedDirectory(
        "/src",
        client.host().directory(".", { exclude: ["node_modules/", "ci/"] })
      );

    const runner = source.withWorkdir("/src").withExec(["npm", "install"]);

    const out = await runner
      .withExec(["npm", "test", "--", "--watchAll=false"])
      .stderr();
    console.log(out);
  },
  { LogOutput: process.stdout }
);
