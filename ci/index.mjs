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

    const test = runner.withExec(["npm", "test", "--", "--watchAll=false"]);

    const buildDir = test
      .withExec(["npm", "run", "build"])
      .directory("./build");

    await buildDir.export("./build");

    const e = await buildDir.entries();

    console.log(`build dir contents:\n ${e}`);
  },
  { LogOutput: process.stdout }
);
